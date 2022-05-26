import React from "react";
import 'animate.css';

function print(op){
    console.log(op)
}

class startButton extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return(this.props.status ?
            <div className="card-container middle">
                <div className="spravka-text">Гадание таро - это приложение, в котором гадания делает голосовой помощник.</div>
                <div className="spravka-text">Для того, чтобы начать гадание, нужно нажать на кнопку "Погадай мне" или сказать ассистенту "погадай мне/сделай расклад".</div>
                <div className="spravka-text">После этого разложится ряд карт таро с описанием. Чтобы прослушать его через ассистента надо сказать "объясни значение".</div>
                {/* <div className="big-text" style={{animation: 'fadeIn', 'animation-duration': '4s'}}>Нажмите в любом месте или скажите "Погадай мне", чтобы получить ваш персональный расклад</div> */}
            </div>
            :
            <div className="card-container middle">
                <div className="blankSpace">T</div>
                <div className="blankSpace">T</div>
                <div className="blankSpace">T</div>
                {/* <div className="big-text" style={{animation: 'fadeIn', 'animation-duration': '4s'}}>Нажмите в любом месте или скажите "Погадай мне", чтобы получить ваш персональный расклад</div> */}
            </div>
          );
    }
  };

  export default startButton;