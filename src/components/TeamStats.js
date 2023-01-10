import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Table from './Table'
import './componentStyles.css'

export default function TeamStats(){
    const columns = useMemo(
        () => [
        {
            Header: "Team Stats",
    columns: [
        {
            Header: "PP%",
            accessor: "powerPlayPercentage",
        },
        {
            Header: "PK%",
            accessor: "penaltyKillPercentage",
        },
        {
            Header: "Goals/Game",
            accessor: "goalsPerGame",
        },
        {
            Header: "GA/Game",
            accessor: "goalsAgainstPerGame",
        },
        {
            Header: "FO%",
            accessor: "faceOffWinPercentage",
        },
        {
            Header: "Shots/Game",
            accessor: "shotsPerGame",
        },
        {
            Header: "Shots Allowed/Game",
            accessor: "shotsAllowed",
        },
        ],
    },
        ],
    []
);

    const [teamData, fetchData] = useState([])

    useEffect(()=> {
        const getData = async () => {
            await axios.get('https://statsapi.web.nhl.com/api/v1/teams/21/stats')
            .then(res => {
                console.log('making API call')
                fetchData(res.data.stats[0].splits[0].stat)
            })
        }
        getData()
    }, []) //prevents this from firing after the first render

    const statObject = useMemo(() => teamData, [teamData]);
    
    return (
        <div id="team-stats">
            <div>
                <h1>{statObject.wins} - {statObject.losses} - {statObject.ot} </h1> 
                <h1> {statObject.pts} Points</h1>
            </div>
            
            <div id="team-stats-table">
             <Table columns={columns} data={[statObject]} ></Table>
            </div>
        </div>
        
      );
}

