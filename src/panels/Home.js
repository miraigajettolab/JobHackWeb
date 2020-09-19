import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Panel, PanelHeader, PanelHeaderButton, platform, IOS, Div, Banner, File} from '@vkontakte/vkui';
import './Home.css';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ListAddOutline from '@vkontakte/icons/dist/28/list_add_outline';
import Icon28DocumentOutline from '@vkontakte/icons/dist/28/document_outline';
const osname = platform();

function Home (props){
	const [doc, setDoc] = useState(null);
	
	return <Panel id={props.id}>
		<PanelHeader
			left={<PanelHeaderButton onClick={props.go} data-to="home">
				{osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
			</PanelHeaderButton>}
		>
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
                onChange={e => {
                    const file = e.target.files[0]
                    //Type check if(file.type.substring(0,5)==="image")
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        setDoc(reader.result)
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
                onClick={props.go} data-to="kiara"
            />
        </Div>
	</Panel>
};

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Home;
