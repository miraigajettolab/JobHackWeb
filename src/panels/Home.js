import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Button, Group, Div, PanelHeader } from '@vkontakte/vkui';

const Home = ({ id, go }) => (
	<Panel id={id}>
		<PanelHeader>Example</PanelHeader>
		<Group title="Navigation Example">
			<Div>
				<Button size="xl" level="2" onClick={go} data-to="kiara">
					Show me the Kiara, please
				</Button>
			</Div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired
};

export default Home;
