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
        props.expArray.map((item) => (
        <Card size="l">
            <RichCell
                disabled
                multiline
                text={<div className="companyText">{item.company}</div>}
                caption={item.startMonth + "   " + item.finishMonth}
                after= {<div className="cardButtons">
                    <Icon28CancelOutline className="Icon28Cancel" onClick = {() => {props.removeExp(item.id)}}/>
                    <Icon28EditOutline className="Icon28Edit"/>
                </div>}
                bottom={item.description}
            >
            <div className="companyText">{item.position}</div>
            </RichCell>
        </Card>))
        }
        </CardGrid>
        <Button className="modalButton" size="xl" onClick={props.modal}>Добавить</Button>
        </Group>

	</Panel>
};

PrimaryForm.propTypes = {
	id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    modal: PropTypes.func.isRequired,
    expArray: PropTypes.array.isRequired,
    removeExp: PropTypes.func.isRequired
};

export default PrimaryForm;

