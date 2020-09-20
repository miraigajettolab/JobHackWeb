import React from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, Div, Banner, File} from '@vkontakte/vkui';
import './Home.css';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import Icon28DocumentOutline from '@vkontakte/icons/dist/28/document_outline';
import {readString} from 'react-papaparse'


function Home (props){
	return <Panel id={props.id}>
		<PanelHeader>
			Поиск вакансий
		</PanelHeader>
		<Div className="TextGroup">
		<File 
                className="coverFile"  
                before=
                    {<Icon28DocumentOutline 
                        fill="#3F8AE0" 
                        className="Icon28DocumentOutline"
                    />} 
                controlSize="xl" 
				mode="outline"
				accept=".csv"
                onChange={e => {
                    const file = e.target.files[0]
                    const reader = new FileReader();
					reader.readAsText(file);
					reader.onloadstart = () => {
						props.popout(true)
					};
                    reader.onloadend = () => {
						props.popout(false)
                        props.load(readString(reader.result))
                    };
                    }}
                >
                Загрузить резюме
            </File>
            <Banner
                before={<Icon28ListAddOutline fill="#3F8AE0" className="Icon28ListAddOutline"/>}
                header="Создать резюме"
              	subheader="Рассказать об опыте и ответить на вопросы"
                asideMode="expand"
                onClick={props.go} data-to="primaryForm"
            />
        </Div>
	</Panel>
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	load: PropTypes.func.isRequired,
	popout: PropTypes.func.isRequired
};

export default Home;
