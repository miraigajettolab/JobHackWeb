from resume_parser import parser

from flask import Flask, json, request, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
def hello_world():
    return 'Hello, World!'


def process_waiter(data):

    for experience in data:
        position, scopes = parser.get_postition_scopes(experience['position'])
        exp = parser.get_experience(experience['startMonth'],
                                    experience['finishMonth'])
        menu_knowledge = parser.get_menu_knowledge(experience['description'])
        vip_clients = parser.get_vip_clients(experience['description'])
        is_cashier = parser.is_cashier(experience['description'])
        cashier_type = parser.get_cashiers(experience['description'])
        is_catering = parser.is_catering(experience['description'])
        soft_skills = parser.get_skills(experience['description'])
        company = experience['company']
        break

    response = jsonify({'data': [["Моя позиция в организации:", position],
                        ['Мои второстепенные должности:', ', '.join(scopes)],
                        ['Опыт работы:', str(exp) + ' лет'],
                        ['Работал в:', company],
                        ['Знания меню:', 'имеются' if menu_knowledge else ''],
                        ['Опыт работы с VIP клиентами:', 'есть' if vip_clients else ''],
                        ['Работал с кассой:', 'да' if is_cashier else'нет'],
                        ['Системы для работы с кассой:', ', '.join(cashier_type) if cashier_type else ''],
                        ['Услуги кейтеринга:', 'оказывал' if is_catering else ''],
                        ['Мои личные качества:', ', '.join(soft_skills)]]})
    response.status_code = 200

    return response


def process_driver(data):

    for experience in data:
        position, scopes = parser.get_postition_scopes(experience['position'])
        exp = parser.get_experience(experience['startMonth'],
                                    experience['finishMonth'])

        category = parser.get_category(experience['description'])
        auto_height = parser.get_auto_height(experience['description'])
        in_out = parser.get_in_out(experience['description'])
        auto_weight = parser.get_auto_weight(experience['description'])
        shtabeler = parser.get_shtabeler(['description'])

        company = experience['company']
        break

    response = jsonify({'data': [["Моя позиция в организации:", position],
                        ['Мои второстепенные должности:', ', '.join(scopes)],
                        ['Опыт работы:', str(exp) + ' лет'],
                        ['Работал в:', company],
                        ['Вожу автомобили категорий:', ', '.join(category)],
                        ['Автомобили в метрах не выше:', auto_height],
                        ['Оказываю услуги погрузки/выгрузки:', 'да' if in_out else ''],
                        ['Максимальная гружоность (тонны):', auto_weight],
                        ['Умею пользоваться штабелером:', 'да' if shtabeler else '']]})
    response.status_code = 200
    return response


def process_cook(data):

    for experience in data:
        position, scopes = parser.get_postition_scopes(experience['position'])
        exp = parser.get_experience(experience['startMonth'],
                                    experience['finishMonth'])

        manufacture = parser.get_manufacture(experience['description'])
        cuisuins = parser.get_cuisuin(experience['description'])
        max_cap = parser.get_max_clients(experience['description'])
        menu = parser.get_if_menu_created(experience['description'])
        banquet = parser.get_if_banquet_holded(experience['description'])
        inventory = parser.get_if_inventory_holded(experience['description'])

        company = experience['company']
        break

    response = jsonify({'data': [["Моя позиция в организации:", position],
                        ['Мои второстепенные должности:', ', '.join(scopes)],
                        ['Опыт работы:', str(exp) + ' лет'],
                        ['Работал в:', company],
                        ['Умею готовить кухни:', ', '.join(cuisuins)],
                        ['Максимальная посадка, которую я обслуживал:', ', '.join(max_cap)],
                        ['У меня был опыт создания меню:', 'да' if max_cap else ''],
                        ['Был опыт работы для банкетов:', 'да' if banquet else ''],
                        ['Умею производить инвенторизацию:', 'да' if inventory else '']]})
    response.status_code = 200
    return response


def process_undetected(data):

    for experience in data:
        position, scopes = parser.get_postition_scopes(experience['position'])
        exp = parser.get_experience(experience['startMonth'],
                                experience['finishMonth'])

        company = experience['company']
        break

    response = jsonify({'data': [["Моя позиция в организации:", position],
                        ['Мои второстепенные должности:', ', '.join(scopes)],
                        ['Опыт работы:', str(exp) + ' лет'],
                        ['Работал в:', company],
                        ['Моя специальность:', ''],
                        ['Мои личные качества:', ''],
                        ['Программы с которыми я работал:', '']]})
    response.status_code = 200
    return response


def process_data(data):
    if 'position' in data:
        resume_class = parser.get_position(data['position'])
    else:
        resume_class = parser.get_position(data[0]['position'])

    resume_class = parser.classes[resume_class]
    resume_class = parser.class_to_title[resume_class]

    if resume_class == 'Сфера обслуживания':
        return process_waiter(data)
    elif resume_class == 'Экспедитор':
        return process_driver(data)
    elif resume_class == 'Повар':
        return process_cook(data)
    elif resume_class == 'unknown':
        return process_undetected(data)

def get_no_experience():

    response = jsonify({'data': [["Моя позиция в организации:", ''],
                        ['Мои второстепенные должности:', ''],
                        ['Опыт работы:', ''],
                        ['Работал в:', ''],
                        ['Моя специальность:', ''],
                        ['Мои личные качества:', ''],
                        ['Программы с которыми я работал:', '']]})
    response.status_code = 200
    return response


@app.route('/proceed_data', methods=['POST'])
@cross_origin()
def proceed_data():
    data = json.loads(request.data.decode())['data']
    response = process_data(data)
    return response


@app.route('/no_experience', methods=['POST'])
@cross_origin()
def no_experience():
    response = get_no_experience()
    return response
