import React from "react";
import axios from 'axios';
import Card from "./pages/card.jsx"
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
    console.log('constructor');

    this.state = {
      info: [],
      isButton: true,
      cardIds: []
    };

    this.tick = this.tick.bind(this);
    this.getCards = this.getCards.bind(this)

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
    // console.log('getStateForAssistant: state:', state)
    // return state;
  }
  
  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action, this.state.isButton);
    if (action) {
      switch (action.type) {
        case 'add_note':
          return this.makeRasclad();

        case 'done_note':
          return this.done_note(action);

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

  tick() {
    this.setState({
        isButton: false 
      })
  }

  componentDidMount() {
    axios.get(`http://localhost:3002/info`)
      .then(res => {
        const info = res.data;
        this.setState({ info });
      })
  }

  getCards(count) {
    const maxIndex = this.state.info.length;
    const cardIds = [];

    while (cardIds.length < count) {
      const newCardId = Math.floor((Math.random() * maxIndex));
      if (!cardIds.includes(newCardId)) {
        cardIds.push(newCardId);
        console.log(newCardId, cardIds);
      }
    }

    this.setState({cardIds});
  }

  makeRasclad() {
    this.getCards(3);
    this.tick();
  }

  renderCards() {
    return (
      this.state.cardIds.map(
        cardId => <Card key={`card-${cardId}`} cardId={cardId}/>
      )
    );
  }

  render() {
    return (!this.state.isButton ?
      <div className="container">
        <div className="header" onClick={() => console.log(this.state.cardIds)}>
            <div>Tarot</div>
        </div>
        <div className="middle">
            {this.renderCards()}
        </div>
      </div>
      :
      <div className="container" onClick={() => this.makeRasclad()}>
        <div className="header">
            <div>Tarot</div>
        </div>
        <div className="middle first-page">
          <StartButton/>
        </div>
      </div>
    );
  }
}

export default App;
