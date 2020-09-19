import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import PrimaryForm from './panels/PrimaryForm'
import Kiara from './panels/Kiara';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'primaryForm',
			fetchedUser: null,
		};
	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				default:
					console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};

	render() {
		return (
			<View activePanel={this.state.activePanel}>
				<Home id="home" go={this.go} />
				<PrimaryForm id="primaryForm" go={this.go} />
				<Kiara id="kiara" go={this.go} />
			</View>
		);
	}
}

export default App;
