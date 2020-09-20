import React from 'react';
import connect from '@vkontakte/vkui-connect';
import './App.css';
import { View, ModalRoot, ModalPage, ModalPageHeader, PanelHeaderButton, FormLayout, Textarea, Button, Input, platform,  ANDROID, ScreenSpinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Cancel from '@vkontakte/icons/dist/24/cancel';
import Home from './panels/Home';
import PrimaryForm from './panels/PrimaryForm'
import Questions from './panels/Questions'
import Done from './panels/Done'

const MODAL_PAGE_FILTERS = 'filters';
const osname = platform();
localStorage.setItem("id", "0")

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			popout: null,
			activePanel: 'home',
			fetchedUser: null,
			activeModal: null,
			modalHistory: [],
			expArray: [],
			position: "",
			company: "",
			description: "",
			startMonth: "",
			finishMonth: "",
			modifyId: -1,
			questions: []
		};

		this.changeHandler = this.changeHandler.bind(this)
		this.changeHandlerQuestions = this.changeHandlerQuestions.bind(this)
		this.PostIt = this.PostIt.bind(this)
		this.loadCsv = this.loadCsv.bind(this)
		this.popout = this.popout.bind(this)
		this.modalBack = () => {
			this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
		  };
	}

	PostIt(ruchka) {
			  fetch(ruchka, {
				method: 'POST',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({"data" : this.state.expArray})
			  }).then(response => response.json()).then(data => this.setState({"questions":data.data}))

			this.setState({
				activePanel: 'questions'
			});
	}
	
	loadCsv(csv){
		for(let i = 0; i < csv.data.length; i++){
			this.addExp({
				"position": csv.data[i][1],
				"company": csv.data[i][2],
				"description": csv.data[i][3],
				"startMonth": csv.data[i][4],
				"finishMonth": csv.data[i][5]
			})
		}
		this.setState({
			activePanel: 'primaryForm'
		});
	}

	changeHandler(event) {
		const name = event.target.name
		const value = event.target.value
		const type = event.target.type
		const checked = event.target.checked
		type === "checkbox" ? this.setState({[name]:checked}) : this.setState({[name]:value})
	}

	changeHandlerQuestions(event) {
		const name = event.target.name
		const value = event.target.value
		let questionsOld = this.state.questions
		questionsOld[name][1] = value;
		this.setState({questionsOld})
	}

	addExp = (obj) => {
		let expArrayOld = this.state.expArray;
		let parsedId = parseInt(localStorage.getItem("id"));
		let expArray = 	[...expArrayOld, {
            "id": parsedId, 
            "position": obj.position,
            "company": obj.company,
            "description": obj.description,
            "startMonth": obj.startMonth,
			"finishMonth": obj.finishMonth
		}]
		localStorage.setItem("id", parsedId+1)
		
		this.setState({
			expArray
		});

		this.setState({
			position: "",
			company: "",
			description: "",
			startMonth: "",
			finishMonth: ""
		});

		this.modalBack()
    }

    removeExp = id => {
		let expArrayOld = this.state.expArray;
		let expArray = expArrayOld.filter(item => item.id !== id)
		this.setState({
			expArray
		});
	}
	
	modifyExp = id => {
		this.state.expArray.map(item => {
			if (item.id === id){
				this.setState({
				modifyId: item.id,
				position: item.position,
				company: item.company,
				description: item.description,
				startMonth: item.startMonth,
				finishMonth: item.finishMonth
				})
			}
		});

		this.setActiveModal(MODAL_PAGE_FILTERS)
	}
	
	commitModifyExp = id => {
		let expArray = [this.state.expArray.length]
		let currentItem

		for(let i = 0; i < this.state.expArray.length; i++){
			currentItem = this.state.expArray[i];
			if(currentItem.id === id){
				expArray[i] = {
					"id":id,
					"position":this.state.position,
					"company":this.state.company,
					"description":this.state.description,
					"startMonth":this.state.startMonth,
					"finishMonth":this.state.finishMonth
				}
			}
			else {
				expArray[i] = this.state.expArray[i];
			}
		}

		this.setState({
			expArray
		});

		this.setState({
			modifyId:-1,
			position: "",
			company: "",
			description: "",
			startMonth: "",
			finishMonth: ""
		});

		this.modalBack()
	}

	setActiveModal(activeModal) {
		activeModal = activeModal || null;
		let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];
	
		if (activeModal === null) {
		  modalHistory = [];
		} else if (modalHistory.indexOf(activeModal) !== -1) {
		  modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
		} else {
		  modalHistory.push(activeModal);
		}
	
		this.setState({
		  activeModal,
		  modalHistory
		});
	  };

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

	popout (turnOn) {
		if(turnOn){
			if(this.state.popout === null){
				this.setState({ popout: <ScreenSpinner /> });
			}
		}
		else{
			if(this.state.popout !== null){
				this.setState({ popout: null });
			}
		}
	  }

	render() {

		const modal = (
			 <ModalRoot
			 className="ModalForm"
			  activeModal={this.state.activeModal}
			  onClose={this.modalBack}
			>
			  <ModalPage
				id={MODAL_PAGE_FILTERS}
				settlingHeight={100}
				dynamicContentHeight={true}
				onClose={this.modalBack}
				header={
				  <ModalPageHeader
					left={osname === ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Cancel /></PanelHeaderButton>}
					right={<PanelHeaderButton onClick={this.modalBack}>{'Отмена'}</PanelHeaderButton>}
				  >
					Добавить опыт
				  </ModalPageHeader>
				}
			  >
         <FormLayout>
			<Input 
				className = "inputElement"
				top="Название позиции в организации" 
				onChange = {this.changeHandler}
				name = "position"
				value = {this.state.position}
				placeholder="Например официант" />
				
			<Input 
				className = "inputElement"
				top={"Название организации"}
				onChange = {this.changeHandler}
				name = "company"
				value = {this.state.company}
				placeholder={"Я работал в  . . ."} />
			<Textarea
				className = "inputElement" 
				top="Описание работы" 
				onChange = {this.changeHandler}
				name = "description"
				value = {this.state.description}
				placeholder="В мои обязанности входило  . . ."/>
			<Input 
				className = "inputElement"
				top={"Начало работы"}
				type="month"
				onChange = {this.changeHandler}
				name = "startMonth"
				value = {this.state.startMonth} />
			<Input 
				className = "inputElement"
				top={"Конец работы"}
				type="month"
				onChange = {this.changeHandler}
				name = "finishMonth"
				value = {this.state.finishMonth}/>
				<Button size="xl" onClick={e => {this.state.modifyId === -1 ? this.addExp(
					{
						"position": this.state.position,
						"company": this.state.company,
						"description": this.state.description,
						"startMonth": this.state.startMonth,
						"finishMonth": this.state.finishMonth	
					}):this.commitModifyExp(this.state.modifyId)
				}}
				disabled={!(
					this.state.position.length > 0 &&
					this.state.company.length > 0 &&
					this.state.description.length > 0 &&
					this.state.startMonth.length > 0 &&
					this.state.finishMonth.length > 0 &&
					this.state.startMonth <= this.state.finishMonth
				)}
				>Сохранить</Button>
		</FormLayout>
			  </ModalPage>
			</ModalRoot>
		);

		return (
			<View popout={this.state.popout} activePanel={this.state.activePanel} modal={modal}>
				<Home id="home" go={this.go} load={this.loadCsv} popout={this.popout}/>
				<PrimaryForm id="primaryForm" go={this.go} modal={() => this.setActiveModal(MODAL_PAGE_FILTERS)} expArray={this.state.expArray} removeExp={this.removeExp} modifyExp={this.modifyExp} postIt={this.PostIt}/>
				<Questions id="questions" go={this.go} changeHandler={this.changeHandlerQuestions} questions={this.state.questions} popout={this.popout}/>
				<Done id="done" go={this.go} />
			</View>
		);
	}
}

export default App;
