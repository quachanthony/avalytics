import {useState, useEffect} from "react"
import './componentStyles.css'

export default function Cards({topPerformers, category, title}){
    //props is an array of objects and i want to do something different with each object... 
   
    const [cardState, setCardState] = useState(topPerformers)

    useEffect(() => {
        setCardState(topPerformers)
    })
    const leader = cardState[0]
    
    return (
        <div class="cards">
            <h2>{title}</h2>
            <img src={leader.photo}></img>
            <h2>{leader.fullName} - {leader[category]} </h2>
            {cardState.slice(1,cardState.length).map(player => {
               return (<h4>{player.fullName} - {player[category]}</h4>
            )})}
        </div>
    );
}