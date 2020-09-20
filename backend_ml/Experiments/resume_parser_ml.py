from collections import defaultdict
from datetime import datetime
import pymorphy2
import re
from string import punctuation

import numpy as np


morph = pymorphy2.MorphAnalyzer()

class Parser:
    def __init__(self):
        self.classes = defaultdict(lambda: float('inf'))
        self.class_to_title = defaultdict(lambda: 'unknown')

        self.classes_dict = {
           'повар': 0, 'шеф': 0,
           'официант': 1, 'официантка': 1,
           'бармен': 1, 'метрдотель': 1,
           'кладовщик': 2,
           'менеджер': 1, 'начальник': 1, 'администратор': 1, 'заведующий': 1, 'заведующая': 1,
           'водитель': 2,
           'грузчик': 2}

        self.class_to_title_dict = {
            1: 'Сфера обслуживания',
            2: 'Экспедитор',
            0: 'Повар'}

        for k, v in self.classes_dict.items():
            self.classes[k] = v

        for k, v in self.class_to_title_dict.items():
            self.class_to_title[k] = v

        self.chars_to_delete = punctuation + "©\xa0\xad\t\n\r\x0b\x0c«»‘’£"
        self.trans_table = str.maketrans('', '', self.chars_to_delete)
        self.trans_table[ord('-')] = ' '


    def filter_text(self, text):
        text = text.replace('\\n', '').translate(self.trans_table)
        return re.sub(' +', ' ', text).lower()

    def position_preprocessing(self, text):
        result = []
        
        text = text.replace('.', ' ')
        texts = re.split('[,|\|/]', text.lower())
        
        for text in texts:
            text = text.replace(';', ' ')
            text = text.replace('-', ' ')
            text = text.replace('/', ' ')
            text = re.sub(' +', ' ', text)

            text = text.replace(' зам ', ' заместитель ')
            text = text.replace(' зав ', ' заведующий ')
            text = text.replace(' стар ', ' старший ')
            text = text.replace(' ст ', ' старший ')
            text = text.replace(' глав ', ' главный ')
            text = text.replace(' ген ', ' генеральный ')
            text = text.replace(' пом ', ' помощник ')
            text = text.replace(' нач ', ' начальник ')
            text = text.replace(' вод ', ' водитель ')
            text = text.replace(' мл ', ' младший ')
            text = text.replace(' дир ', ' директор ')
            text = re.sub(' +', ' ', text).strip()
            
            result.append(self.filter_text(text))
        
        return result

    def get_postition_scopes(self, text):
        positions = (' '.join(self.position_preprocessing(text))).split()
        index = np.argmin([self.classes[pos] for pos in positions])

        return positions[index], positions[:index] + positions[index+1:]

    def get_position(self, text):
        return self.get_postition_scopes(text)[0]

    def get_experience(self, start, end):
        start = datetime.strptime(start, '%Y-%m')
        end = datetime.strptime(end, '%Y-%m')

        return int((end - start).total_seconds() // (60*60*24*365))

    def get_menu_knowledge(self, description):
        regexp = re.compile(r'меню')
        return bool(re.search(regexp, description.lower()))

    def get_vip_clients(self, description):
        regexp = re.compile(r'vip|вип')
        return bool(re.search(regexp, description.lower()))

    def is_cashier(self, description):
        regexp = re.compile(r'tillypad|r-kiper|micros|r-keeper|pos|касса')
        return bool(re.search(regexp, description.lower()))

    def get_cashiers(self, description):
        regexp = re.compile(r'tillypad|r-kiper|micros|r-keeper|pos|касса')
        return re.findall(regexp, description.lower())

    def is_catering(self, description):
        regexp = re.compile(r'кейтеринг|catering')
        return bool(re.search(regexp, description.lower()))

    def get_skills(self, description):
        regexp = re.compile(r'коммуникабельность|приветливость|встреча гостей')
        return re.findall(regexp, description.lower()) +\
               ['решение конфликтных ситуаций'] * ('конфликт' in description.lower())

    def get_category(self, description):
        regexp = re.compile(r'A|B|C|D')
        return re.findall(regexp, description.lower())

    def get_auto_height(self, description):
        regexp = re.compile(r'м|m')

        for m in re.finditer(regexp, description):
            digit_regexp = re.compile(r"^\d+$")
            return re.findall(digit_regexp, description[m.start(0)-10:m.end(0)+10])

        return []

    def get_auto_weight(self, description):
        regexp = re.compile(r'тон|тонн')

        for m in re.finditer(regexp, description):
            digit_regexp = re.compile(r"^\d+$")
            return re.findall(digit_regexp, description[m.start(0)-10:m.end(0)+10])

        return []

    def get_in_out(self, description):
        return ['погрузка']*('погрузка' in description) + ['выгрузка'] * ('выгрузка' in description)

    def get_shtabeler(self, description):
        return 'штабелер' in description

    def get_manufacture(self, description):
        regexp = re.compile(r'холодн[а-я]|горяч[а-я]')
        return re.findall(regexp, description.lower())

    def get_cuisuin(self, description):
        regexp = re.compile(r'французск[а-я]+|европейск[а-я]+|корейск[а-я]+|итальянск[а-я]+|русск[а-я]+')
        parsed = re.findall(regexp, description.lower())
        inflected = []
        for el in parsed:
            normal = morph.parse(el)[0].normal_form
            inflected.append(morph.parse(normal)[0].inflect({'femn'}).word)
        return inflected

    def get_max_clients(self, description):
        regexp = re.compile(r'\d+ человек|\d+ персон|\d+ посадочных')
        parsed = re.findall(regexp, description.lower())
        
        if len(parsed) > 0:
            parsed = parsed[0]
            number_regexp = re.compile(r'\d+')
            return re.findall(number_regexp, parsed)[0]

    def get_if_menu_created(self, description):
        regexp = re.compile(
            r'[создани{а-я}+|разработк{а-я}+|обновлени{а-я}+].*меню')
        return bool(re.findall(regexp, description.lower()))

    def get_if_banquet_holded(self, description):
        regexp = re.compile(r'банкет')
        return bool(re.findall(regexp, description.lower()))

    def get_if_inventory_holded(self, description):
        regexp = re.compile(r'инвентаризаци')
        return bool(re.findall(regexp, description.lower()))

parser = Parser()
