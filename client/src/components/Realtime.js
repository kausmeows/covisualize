import React, { useState } from 'react';
import DropdownCountry from './DropdownCountry'
import DropdownTime from './DropdownTime'
import RealtimeGraph from './RealtimeGraph'
import axios from 'axios'

const Realtime = () => {
    let [covidDates, setCovidDates] = useState([])
    let [covidCases, setCovidCases] = useState([])
    let [covidDeaths, setCovidDeaths] = useState([])
    let [currentCountry, setCurrentCountry] = useState("")
    let [currentTimeline, setCurrentTimeline] = useState("365")
    let Data = {};
    let DeathData = {};
    const setOutput = (c,d) => {
        async function set (c,d) {
            let res = await axios.get(`https://disease.sh/v3/covid-19/historical/${c}?lastdays=${d}`)
            let output = res.data.timeline.cases;
            let deathOutput = res.data.timeline.deaths;
            Data = output;
            DeathData = deathOutput;
            setCurrentCountry(c);
            updaterFunction();
        }
        set(c,d);
    }
    const setTimeline = (d) => {
        setCurrentTimeline(d);
        setOutput(currentCountry, d);
    }
    const setCountry = (c) => {
        setCurrentCountry(c);
        setOutput(c, currentTimeline);

    }
    const updaterFunction = () => {
        setCovidDates(Object.keys(Data));
        setCovidCases(Object.values(Data));
        setCovidDeaths(Object.values(DeathData));
    }

    return (
        <div className='Realtime' >
            <h2>Real-Time Cases and Deaths For Coronavirus</h2>
            <DropdownCountry name='Country' datafetch={setOutput} val={currentCountry} update={setCountry} />
            <DropdownTime name='Timeline' datafetch={setOutput} val={currentTimeline} update={setTimeline} />
            <div>
                <RealtimeGraph labels={covidDates} dataval={covidCases} deathval={covidDeaths} />
            </div>
        </div>
    );
}

export default Realtime;