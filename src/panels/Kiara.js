import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, PanelHeaderButton, platform, IOS} from '@vkontakte/vkui';
import './Kiara.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

const Kiara = props => (
	<Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
			小鳥遊キアラ
		</PanelHeader>
		<img className="Kiara" src={"https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1000,w_500,f_auto,q_auto/1369026/207430_877763.jpg"} alt="Kiara The Brib"/>
	</Panel>
);

Kiara.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Kiara;
