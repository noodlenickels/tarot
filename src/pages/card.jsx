import React from "react";

const styles = {
    picture: {
        display: 'block',
        animation: 'fadeIn',
        'animationDuration': '3s'
    },
    txt: {
        textAlign: 'center',
        padding: '15px 0',
        fontWeight: '350'
    }
}

export default function Card({cardId}) {
    return(
        <div className="card-container" onClick={() => console.log(cardId)}>
            <img alt={`card${cardId}`} src={`/images/card${cardId}.jpg`} style={styles.picture}/>
            {/*<div style={styles.txt}>{info.description}</div>*/}
        </div>
    )
}
