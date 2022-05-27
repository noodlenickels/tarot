import React from "react";
import axios from 'axios';
import Card from "./pages/card.jsx"
import result from "./init.json"
import StartButton from "./pages/startButton.jsx"
import 'animate.css';

import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import "./App.css";

const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

export class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      info: result.info,
      isButton: true,
      textSpravka: 'Справка',
      isInfo: false,
      cardIds: [],
      desc: [],
      prognoz: 'Сегодня карты говорят вам: ',
      spravka: false,
      spravkaText: ['Гадание таро - это приложение, в котором гадания делает голосовой помощник.',
       'Для того, чтобы начать гадание, нужно нажать на кнопку «Погадай мне» или сказать ассистенту «погадай мне/сделай расклад».', 
       'После этого разложится ряд карт таро с описанием. Чтобы прослушать его через ассистента надо сказать «объясни значение».']
    };

    this.tick = this.tick.bind(this);
    this.getCards = this.getCards.bind(this);
    this.doSmth = this.doSmth.bind(this);

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on("data", (event/*: any*/) => {
      console.log(`assistant.on(data)`, event);
      const {action} = event;
      this.dispatchAssistantAction(action);
    });

    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    return this.state;
  }
  
  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action, this.state.isButton);
    if (action) {
      switch (action.type) {
        case 'make_rasclad':
          return this.makeRasclad();

        case 'give_description':
          return 'отлично';
          // this.makeRascladSecondTime()

        case 'call_rules':
          return this.changeSpravka();

        case 'come_back':
          return this.doExit();

        default:
          throw new Error();
      }
    }
  }

  done_note (action) {
    console.log('done_note', action);
    this.setState({
      notes: this.state.notes.map((note) =>
        (note.id === action.id)
        ? { ...note, completed: !note.completed }
        : note
      ),
    })
  }

  tick(state) {
    this.setState({
        isButton: !state 
      })
  }

  showSpravka(state){
    this.setState({
      spravka: !state 
    })
  }

  changeSpravka(){
    const cas = this.state.spravka;
    this.showSpravka(cas);
    if (this.state.textSpravka == 'Справка')
    {
      this.setState({
        textSpravka: 'Вернуться обратно' 
      });
    }
    else this.setState({textSpravka: 'Справка'})
  }
  componentDidMount() {
    this.setState({ info: result.info });
    this.getCards(3);
    this.doSmth();
  }

  doExit(){
    this.setState({prognoz: 'Сегодня карты говорят вам: '})
    this.getCards(3);
    console.log(this.state.desc)
    this.state.desc = []
    this.doSmth();
    console.log(this.state.desc)
    const cas = this.state.isButton;
    this.tick(cas);
  }

  getCards(count) {
    const maxIndex = this.state.info.length;
    const cardIds = [];

    while (cardIds.length < count) {
      const newCardId = Math.floor((Math.random() * maxIndex));
      if (!cardIds.includes(newCardId)) {
        cardIds.push(newCardId);
      }
    }
    this.state.cardIds = cardIds;
  }

  makeRasclad() {
    const cas = this.state.isButton;
    this.tick(cas);
  }

  makeRascladSecondTime() {
    this.state.isInfo = true;
    this.tick(false);
  }

  renderCards() {
    return (
      this.state.cardIds.map(
        cardId => <Card key={`card-${cardId}`} cardId={cardId} status={this.state.spravka} info={this.state.desc[this.state.cardIds.indexOf(cardId)]} spravka={this.state.spravkaText[this.state.cardIds.indexOf(cardId)]}/>
      )
    );
  }
  doSmth(){
    for (let i = 0; i < 3; i++){
      this.state.desc.push(this.state.info[this.state.cardIds[i]].description)
    }
    // this.state.info.map(
    //   info => this.state.desc.push(info.description)
    // );
    this.state.desc.map(
      desc => this.state.prognoz += `${desc} `
    );
  }
  render() {
    const data = this.state.desc;
    return (!this.state.isButton ?
      <div className="back">
        <div className="header">
              <div className="naming">Гадание Таро</div>
              <div className="buttons buttons-new">
                <div className={this.state.spravka ? 'no': 'writing'} onClick={() => this.doExit()}>В начало</div>
                <div className="writing" onClick={() => this.changeSpravka()}>{this.state.textSpravka}</div>
              </div>
          </div>
        <div className="container">
          <div className="middle first-page">
              {this.renderCards()}
          </div>
        </div>
      </div>
      :
      <div className="back">
        <div className="header">
              <div className="naming">Гадание Таро</div>
              <div className="buttons">
                <div className={this.state.spravka ? 'no': 'writing extra-button'} onClick={() => this.makeRasclad()}>Погадай мне!</div>
                <div className="writing" onClick={() => this.changeSpravka()}>{this.state.textSpravka}</div>
                <div className="writing no">В начало</div>
              </div>
          </div>
        <div className="container">
          <div className="middle first-page">
            <StartButton status={this.state.spravka} />
          </div>
        </div>
      </div>
    );
  }
}
export default App;