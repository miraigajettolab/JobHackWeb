import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, PanelHeaderButton, platform, IOS, FormLayout, Input, Textarea, Button, Group, Header, CardGrid, Card, RichCell} from '@vkontakte/vkui';
import './PrimaryForm.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28EditOutline from '@vkontakte/icons/dist/28/edit_outline';
import Icon28CancelOutline from '@vkontakte/icons/dist/28/cancel_outline';
const osname = platform();

function PrimaryForm(props){
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState(""); 
    const [description, setDescription] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [finishMonth, setFinishMonth] = useState("");
    const [expArray, setExpArray] = useState([])

    const addExp = () => {
        setExpArray([...expArray, {
            "id": expArray.length, 
            "position": position,
            "company": company,
            "description": description,
            "startMonth": startMonth,
            "finishMonth": finishMonth
        }])
        setPosition("");
        setCompany("");
        setDescription("");
        setStartMonth("");
        setFinishMonth("");
    }

    console.log(expArray);

    return <Panel id={props.id}>
		<PanelHeader
            separator={false}
			left={<PanelHeaderButton onClick={props.go} data-to="fundraiserType">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
		Опыт
		</PanelHeader>

        <Group separator="hide" header={<Header mode="secondary">Опыт</Header>}>
        <CardGrid>

        {
        expArray.map((item) => (
        <Card size="l">
            <RichCell
                disabled
                multiline
                text={<div className="companyText">{item.company}</div>}
                caption={item.startMonth + "   " + item.finishMonth}
                after= {<div className="cardButtons">
                    <Icon28CancelOutline className="Icon28Cancel"/>
                    <Icon28EditOutline className="Icon28Edit"/>
                </div>}
                bottom={item.description}
            >
            <div className="companyText">{item.position}</div>
            </RichCell>
        </Card>))
        }
        </CardGrid>
        </Group>

        <FormLayout>

            <Input 
                top="Название позиции в организации" 
                onChange = {e => setPosition(e.target.value)}
                value = {position}
                placeholder="Например официант" />
            <Input 
                top={"Название организации"}
                onChange = {e => setCompany(e.target.value)}
                value = {company}
                placeholder={"Я работал в  . . ."} />
            <Textarea 
                top="Описание работы" 
                onChange = {e => setDescription(e.target.value)}
                value = {description}
                placeholder="В мои обязанности входило  . . ."/>
            <Input 
                top={"Начало работы"}
                type="month"
                onChange = {e => setStartMonth(e.target.value)}
                value = {startMonth} />
            <Input 
                top={"Конец работы"}
                type="month"
                onChange = {e => setFinishMonth(e.target.value)}
                value = {finishMonth}/>
                <Button size="xl" onClick={addExp}>Добавить</Button>
          </FormLayout>
	</Panel>
};

PrimaryForm.propTypes = {
	id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    targeted: PropTypes.bool.isRequired
};

export default PrimaryForm;

