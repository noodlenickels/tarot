import React from "react";

export default function Card({cardId, info, spravka, status}) {
    return(!status ?
        <div className="card-container" onClick={() => console.log(cardId)}>
            <img className="picture" alt={`card${cardId}`} src={`/images/card${cardId}.jpg`}/>
            <div className="cardText">«{info}»</div>
            {/*<div style={styles.txt}>{info.description}</div>*/}
        </div>
        :
        <div className="card-container" onClick={() => console.log(cardId)}>
            <div className="spravka-text">{spravka}</div>
            {/*<div style={styles.txt}>{info.description}</div>*/}
        </div>
    )
}
