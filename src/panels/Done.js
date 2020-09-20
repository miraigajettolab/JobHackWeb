import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, PanelHeaderButton, platform, Group, Cell, CardGrid, Card, IOS} from '@vkontakte/vkui';
import './Done.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon56CheckCircleOutline from '@vkontakte/icons/dist/56/check_circle_outline';

const osname = platform();

function Done (props){
	return <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="questions">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			Спасибо
		</PanelHeader>
        <Group separator="hide" className="TextGroup">
        <CardGrid>
          <Card size="l" mode="shadow">
            <Cell 
            style={{ height: 150 }}
            before = {
                <Icon56CheckCircleOutline 
                    fill="#4bb34b" 
                    width={70} 
                    height={70} 
                    className="Icon56CheckCircleOutline"/>}
            description = {<div className="descriptionText">С вами обязательно <br></br> свяжутся</div>}
            >
            <div className="titleText">Загружено</div></Cell>
          </Card>
        </CardGrid>
      </Group>
	</Panel>
};

Done.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired
};

export default Done;
