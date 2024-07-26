import './App.css';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
// import socketIOClient from 'socket.io-client';
import 'chart.js/auto';

import AppService from './service/app-service';
import GraphAndInfo from './components/GraphAndInfo';

// const ENDPOINT = "http://13.235.42.249/";
const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  let timestamps = [];
  const [info, setInfo] = useState({
    "Temperature": {
      startTime: "",
      max: "--",
      min: "--",
      average: "--",

    },
    "Humidity": {
      startTime: "",
      max: "--",
      min: "--",
      average: "--",

    },
    "Wind": {
      startTime: "",
      max: "--",
      min: "--",
      average: "--",

    },
    "Pressure": {
      startTime: "",
      max: "--",
      min: "--",
      average: "--",

    }
  })

  const [devices, setDevices] = useState({
    "Temperature": [],
    "Humidity": [],
    "Wind": [],
    "Pressure": []
  })

  const [temperature, setTemperature] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature',
        data: [],
        borderColor: '#df733f',
        fill: false,

      }
    ]
  });
  const [humidity, setHumidity] = useState({
    labels: [],
    datasets: [
      {
        label: 'Humidity',
        data: [],
        borderColor: '#2c4da9',
        fill: false,
      }
    ]
  });
  const [wind, setWind] = useState({
    labels: [],
    datasets: [
      {
        label: 'Wind',
        data: [],
        borderColor: '#a4b6c3',
        fill: false,
      }
    ]
  });
  const [pressure, setPressure] = useState({
    labels: [],
    datasets: [
      {
        label: 'Pressure',
        data: [],
        borderColor: '#69e7b2',
        fill: false,
      }
    ]
  });

  useEffect(() => {
    const socket = io(ENDPOINT)
    // // Handle incoming messages
    // socket.on('new_number', (data) => {
    //   // setNumber(data.number);
    //   console.log(data);
    // });

    // // Clean up the socket connection when the component unmounts
    // return () => {
    //   socket.off('new_number');
    // };

    socket.on('connect', (res) => {
      console.log('Connected to server');
      AppService.fetchAllDevices().then(response => {
        // const data = response.data;
        setDevices(response.data)
      }).catch(error => {
        console.log(error);
      })
    });

    socket.on('data', (newData) => {
      const jsonData = JSON.parse(newData)
      // console.log(JSON.parse(newData));
      timestamps = [...timestamps, jsonData.timestamp]
      // setInfo((prevData) => {
      //   return {
      //     "Temperature": {
      //       ...prevData,
      //       deviceID: jsonData.Temperature[0].deviceID
      //     },
      //     "Humidity": {
      //       ...prevData,
      //       deviceID: jsonData.Humidity[0].deviceID
      //     },
      //     "Wind": {
      //       ...prevData,
      //       deviceID: jsonData.Wind[0].deviceID
      //     },
      //     "Pressure": {
      //       ...prevData,
      //       deviceID: jsonData.Pressure[0].deviceID
      //     }
      //   }
      // })
      setTemperature((prevData) => {
        const temp = [...prevData.datasets[0].data, jsonData.Temperature[0].value]

        return {
          labels: timestamps.slice(-20),
          datasets: [
            {
              ...prevData.datasets[0],
              data: temp.slice(-20)
            }
          ]
        }
      })
      setHumidity((prevData) => {
        const temp = [...prevData.datasets[0].data, jsonData.Humidity[0].value]

        return {
          labels: timestamps.slice(-20),
          datasets: [
            {
              ...prevData.datasets[0],
              data: temp.slice(-20)
            }
          ]
        }
      })
      setWind((prevData) => {
        const temp = [...prevData.datasets[0].data, jsonData.Wind[0].value]

        return {
          labels: timestamps.slice(-20),
          datasets: [
            {
              ...prevData.datasets[0],
              data: temp.slice(-20)
            }
          ]
        }
      })
      setPressure((prevData) => {
        const temp = [...prevData.datasets[0].data, jsonData.Pressure[0].value]

        return {
          labels: timestamps.slice(-20),
          datasets: [
            {
              ...prevData.datasets[0],
              data: temp.slice(-20)
            }
          ]
        }
      })
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => socket.disconnect();
  }, []);

  const btn = (title, cn) => {
    return (
      <button
        className={cn}
        onClick={() => {
          if (title === "Start Socket") {
            AppService.startServer().then(response => {
              console.log(response);
            }).catch(error => {
              console.log(error);
            })
          } else {
            AppService.endServer().then(response => {
              console.log(response);
            }).catch(error => {
              console.log(error);
            })
          }
        }}>
        {title}
      </button>
    )
  }

  return (
    <div className="App">
      <h1>Real-time Data</h1>
      <div style={{ color: "red"}}>*After running the backend you must click the button "Start Socket" to see the live data. The socket broadcast will end after 100 data generation.</div>
      <div className="btn-div top">
        {btn("Start Socket", "btn-start")}
        {btn("End Socket", "btn-end")}
      </div>
      <div className="graph-div">
        <div className="section">
          <h2>Temperature</h2>
          <GraphAndInfo data={temperature} type="Temperature" info={info["Temperature"]} devices={devices["Temperature"]} unit="°C" />
        </div>

        <div className="section">
          <h2>Humidity</h2>
          <GraphAndInfo data={humidity} type="Humidity" info={info["Humidity"]} devices={devices["Humidity"]} unit="%" />
        </div>

        <div className="section">
          <h2>Wind</h2>
          <GraphAndInfo data={wind} type="Wind" info={info["Wind"]} devices={devices["Wind"]} unit="km/h" />
        </div>

        <div className="section">
          <h2>Pressure</h2>
          <GraphAndInfo data={pressure} type="Pressure" info={info["Pressure"]} devices={devices["Pressure"]} unit="hPa" />
        </div>
      </div>

    </div>
  );
}

export default App;

