import { Line } from 'react-chartjs-2';
import AppService from '../service/app-service';
import { useState } from 'react';

function GraphAndInfo({ data, type, devices, unit }) {

    const [info, setInfo] = useState({
        "min": "--",
        "max": "--",
        "average": "--"
    })

    const [startTime, setStartTime] = useState(null)
    const [endTime, setendTime] = useState(null)
    return (
        <div className="data-div">
            <div className="graph-bg">

                <Line data={data} />
            </div>
            <div className="info">
                {/* <h3>{type} Info</h3> */}
                <div className="row">
                    <label htmlFor={type + 'Start'}>Start Time: </label>
                    <input type="datetime-local" name={type + 'Start'} id={type + 'Start'} onChange={(e) => { setStartTime(e.target.value); }} />
                </div>
                <div className="row">
                    <label htmlFor={type + 'End'}>End Time: </label>
                    <input type="datetime-local" name={type + 'End'} id={type + 'End'} onChange={(e) => { setendTime(e.target.value); }} />
                </div>
                <div className="average">Average: {info.min}  {unit}</div>
                <div className="max">Max: {info.max} {unit}</div>
                <div className="min">Min: {info.min} {unit}</div>
                <button
                    className="btn-get-info"
                    onClick={() => {
                        if (startTime != null && endTime != null) {
                            AppService.getInfo(devices[0], type, startTime.replace("T", " "), endTime.replace("T", " ")).then(response => {
                                console.log(response);
                                setInfo({
                                    "min": Math.round(response.data.minimum * 100) / 100,
                                    "max": Math.round(response.data.maximum * 100) / 100,
                                    "average": Math.round(response.data.average * 100) / 100
                                })
                            }).catch(error => {
                                console.log(error);
                            })
                        } else {
                            alert("Please select Start Time and End Time")
                        }
                    }}>
                    Get Info
                </button>
            </div>
        </div>
    );
}

export default GraphAndInfo;