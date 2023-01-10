import {useState, useEffect, useMemo} from "react"
import axios from "axios"
import {useTable} from "react-table"
import Table from "./Table"
import Cards  from "./Cards";
import './componentStyles.css'

export default function Roster(){
        const skaterColumns = useMemo(
        () => [
        {
            Header: "2022-2023 Colorado Avalanche - Skaters",
            
            columns: [
            {
                Header: "No.",
                accessor: "primaryNumber",
            },
            {
                Header: "position",
                accessor: "primaryPosition.code",
            },
            {
                Header: "Player",
                accessor: "fullName",
            },
            {
                Header: "Age",
                accessor: "currentAge",
            },
            {
                Header: "A",
                accessor: "assists",
            },
            {
                Header: "G",
                accessor: "goals",
            },
            {
                Header: "Pts",
                accessor: "points",
            },
            {
                Header: "GP",
                accessor: "games",
            },
            {
                Header: "TOI",
                accessor: "timeOnIcePerGame",
            },
            {
                Header: "S%",
                accessor: "shotPct",
            },
            {
                Header: "PIM",
                accessor: "pim",
            },
            {
                Header: "+/-",
                accessor: "plusMinus",
            },
            {
                Header: "GWG",
                accessor: "gameWinningGoals",
            },
            {
                Header: "Hits",
                accessor: "hits",
            },
            {
                Header: "Blocks",
                accessor: "blocked",
            },
            ],
        },
            ],
        []
    );
    const goalieColumns = useMemo(
        () => [
        {
            Header: "Goaltenders",
            
            columns: [
            {
                Header: "",
                accessor: "photo",
                Cell: (props) => <img src={props.photo}/>
            },
            {
                Header: "No.",
                accessor: "primaryNumber",
            },
            {
                Header: "position",
                accessor: "primaryPosition.code",
            },
            {
                Header: "Player",
                accessor: "fullName",
            },
            {
                Header: "Age",
                accessor: "currentAge",
            },
            {
                Header: "Pts",
                accessor: "points",
            },
            {
                Header: "GP",
                accessor: "games",
            },
            {
                Header: "Starts",
                accessor: "gamesStarted",
            },
            {
                Header: "Wins",
                accessor: "wins",
            },
            {
                Header: "GAA",
                accessor: "goalAgainstAverage",
            },
            {
                Header: "SV%",
                accessor: "savePercentage",
            },
            {
                Header: "Shutouts",
                accessor: "shutouts",
            },
            ],
        },
            ],
        []
    );
    //React hook that stores the state in the first variable and the function that will change that state in the second one
    const [rosterStats, fetchData] = useState([])

    useEffect(() => { //on render do whatever is in here
        const getData = async () => {
            console.log('calling Roster API')
            await axios.get('https://statsapi.web.nhl.com/api/v1/teams/21/roster')
            .then(res => 
                // return res.json() //get the response and return it in json format
                Object.values(res.data.roster).map((player) => player.person.id)
            )
            .then(data => { // data contains all the player ids 
                //first promise all is to get the information for the player ie. name, position and number
                const players = Promise.all(data.map(id => axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}/`)))
                //second promise all is to get all the stats for that players id
                const playerStats = Promise.all(data.map(id => axios.get(`https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=20222023`)))
                Promise.all([players, playerStats]).then(function(values) { //Promise.all is iterable so we can pass both sets of promises into this array
                    fetchData(values) //this is the function we use to set the value of the state in the original hook
                    //returns two arrays in rosterStats
                })
                
            })
        }
        getData()
    },[]) //this prevents it from rendering past the first time

    const memoizedRosterStats = useMemo(() => rosterStats, [rosterStats]);
    // console.log(memoizedRosterStats)
    let skaters = []
    let goalies = []

    try {
        for (let i = 0; i < memoizedRosterStats[0].length; i++) {
            let infoHalf = memoizedRosterStats[0][i].data.people[0]
            infoHalf.photo = `http://nhl.bamcontent.com/images/headshots/current/168x168/${infoHalf.id}.jpg`
            let statHalf = memoizedRosterStats[1][i].data.stats[0].splits[0].stat
            if(infoHalf.primaryPosition.code == 'G'){
                goalies.push(Object.assign(infoHalf, statHalf))
            }
            else{
                skaters.push(Object.assign(infoHalf, statHalf))
            } 
        }
        // console.log(skaters)
    } catch (error) {
        console.log(error)
    }
    

    var findTopPerformers = (dataArr) => {
        let pointsLeader = dataArr.sort((p1, p2) => (p1.points < p2.points) ? 1 : (p1.points > p2.points) ? -1 : 0).slice(0, 5)
        let goalsLeader = dataArr.sort((p1, p2) => (p1.goals < p2.goals) ? 1 : (p1.goals > p2.goals) ? -1 : 0).slice(0, 5)
        let assistsLeader = dataArr.sort((p1, p2) => (p1.assists < p2.assists) ? 1 : (p1.assists > p2.assists) ? -1 : 0).slice(0, 5)
        let toiLeader = dataArr.sort((p1, p2) => (p1.timeOnIcePerGame < p2.timeOnIcePerGame) ? 1 : (p1.timeOnIcePerGame > p2.timeOnIcePerGame) ? -1 : 0).slice(0, 5)
        return {ptsLead: pointsLeader, goalLead: goalsLeader, assistLead: assistsLeader, toiLead: toiLeader}
    }

    let topPerformers = findTopPerformers(skaters)

    return(
        <div>
            <div id="top-performers">
                <div class="card-container">
                    <Cards topPerformers={topPerformers.ptsLead} category="points" title="Points"></Cards>
                </div>
                <div>
                    <Cards topPerformers={topPerformers.goalLead} category="goals" title="Goals"></Cards>
                </div>
                <div>
                    <Cards topPerformers={topPerformers.assistLead} category="assists" title="Assists"></Cards>
                </div>
                <div>
                    <Cards topPerformers={topPerformers.toiLead} category="timeOnIcePerGame" title="Time on Ice"></Cards>
                </div>
            </div>
            <div id="skater-stats">
                <Table columns={skaterColumns} data={skaters} > </Table>
            </div>
            <div id="goalie-stats">
                <Table columns={goalieColumns} data={goalies } > </Table>
            </div>
        </div>
        
        
    )
}