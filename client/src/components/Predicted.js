import React, { useState } from 'react';
import DropdownCountry from './DropdownCountry'
import PredictedGraph from './PredictedGraph'
import axios from 'axios'

const Realtime = () => {
    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    let [covidDates, setCovidDates] = useState([])
    let [covidCases, setCovidCases] = useState([])
    let [covidDeaths, setCovidDeaths] = useState([])
    let [predictedCovidCases, setpredictedCovidCases] = useState([])
    let [predictedCovidDeaths, setpredictedCovidDeaths] = useState([])
    let [currentCountry, setCurrentCountry] = useState("")
    let Data = {};
    let p = [];
    let d =[];
    let DeathData = {};
    let PredictedCasesData = {};
    let PredictedDeathData = {};
    const setOutput = (c) => {
        async function set (c) {
            const res = await axios.get(`https://disease.sh/v3/covid-19/historical/${c}?lastdays=365`)
            const predictedresJSON = await axios.get("https://aam05onrm7.execute-api.us-east-1.amazonaws.com/default/covLamb?table_name=Final_Cases")
            const predicteddeathresJSON = await axios.get("https://aam05onrm7.execute-api.us-east-1.amazonaws.com/default/covLamb?table_name=Final_Deaths")
            const predictedres = JSON.parse(predictedresJSON.data.body);
            const predicteddeathres = JSON.parse(predicteddeathresJSON.data.body);
            const output = res.data.timeline.cases;
            const deathOutput = res.data.timeline.deaths;
            PredictedCasesData = predictedres.Items;
            PredictedDeathData = predicteddeathres.Items;
            PredictedCasesData.sort(custom_sort)
            PredictedDeathData.sort(custom_sort)
            PredictedCasesData.forEach(element => {
                if (element.country === c) {
                let input = {"x": element.date, "y": element.forecast };
                p.push(input)
                }
            });
            PredictedDeathData.forEach(element => {
                if (element.country === c) {
                let input = {"x": element.date, "y": element.forecast };
                d.push(input)
                }
            });
            Data = output;
            DeathData = deathOutput;
            setCurrentCountry(c);
            updaterFunction();
        }
        set(c);
    }
    const updaterFunction = () => {
        setCovidDates(Object.keys(Data));
        setCovidCases(Object.values(Data));
        setCovidDeaths(Object.values(DeathData));
        setpredictedCovidCases(p);
        setpredictedCovidDeaths(d);
    }

    return (
        <div className='Realtime' >
            <br/>
            <br/>
            <br/>
            <h2>Predicted Cases and Deaths For Coronavirus</h2>
            <DropdownCountry name='Country' datafetch={setOutput} val={currentCountry} update={setOutput} />
            <div>
                <PredictedGraph labels={covidDates} dataval={covidCases} deathval={covidDeaths} 
                predictedcasesval={predictedCovidCases} predicteddeathval={predictedCovidDeaths} />
            </div>
        </div>
    );
}

export default Realtime;