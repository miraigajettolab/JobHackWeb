import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, PanelHeaderButton, platform, IOS, FormLayout, Input, Textarea, Button, Group, Header, CardGrid, Card, RichCell} from '@vkontakte/vkui';
import './Questions.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
const osname = platform();

function Questions(props){
    console.log(props.expArray)
    return <Panel id={props.id}>
		<PanelHeader
            separator={true}
			left={<PanelHeaderButton onClick={props.go} data-to="primaryForm">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
		Вопросы
		</PanelHeader>

	</Panel>
};

Questions.propTypes = {
	id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired
};

export default Questions;

