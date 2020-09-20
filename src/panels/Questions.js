import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, PanelHeaderButton, platform, IOS, FormLayout, Input, Button, Group} from '@vkontakte/vkui';
import './Questions.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osname = platform();

function Questions(props){
    return <Panel id={props.id}>
		<PanelHeader
            separator={true}
			left={<PanelHeaderButton onClick={props.go} data-to="primaryForm">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
		Вопросы
		</PanelHeader>
        <Group>
        <FormLayout>
        {
        props.questions.map((item,i) => (
            <Input 
            className = "inputElement"
            top={item[0]}
            onChange = {props.changeHandler}
            name = {i}
            key = {i}
            value = {item[1]} />))
        }
        <Button className="applyButton" size="xl" onClick={console.log}>Отправить</Button>
        </FormLayout>
        </Group>

	</Panel>
};

Questions.propTypes = {
	id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    changeHandler: PropTypes.func.isRequired
};

export default Questions;

