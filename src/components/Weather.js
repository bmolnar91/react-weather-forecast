import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ChosenDayContext } from "../context/ChosenDayContext";
import DailyForecast from "./DailyForecast";
import HourlyForecast from "./HourlyForecast";
import AddFavorite from "./favorites/AddFavorites";
import { convertMpsToKph } from "../util/converters";
import Observations from "./observation/Observations";

const Weather = ({ currentWeather }) => {
  const hourOfDay = 15;

  const [dailyForecasts, setDailyForecasts] = useState([]);

  const [hourlyForecasts, setHourlyForecasts] = useState([]);

  const chosenDay = useContext(ChosenDayContext)[0];

  useEffect(() => {
    const url = `${process.env.REACT_APP_WEATHER_FORECAST_URL}/${currentWeather.city}`;

    function isChosenDay(data) {
      return new Date(data.date).getDay() === chosenDay;
    }

    // TODO: sort out hard-coded values
    function getWeatherForHour(data) {
      return new Date(data.date).getHours() === hourOfDay;
    }

    axios
      .get(url)
      .then((res) => {
        setHourlyForecasts(res.data.filter(isChosenDay));
        setDailyForecasts(res.data.filter(getWeatherForHour));
      })
      .catch((err) => console.log(err));
  }, [chosenDay, currentWeather.city]);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gridTemplateRows: "1fr 2fr",
    gridTemplateAreas: `
    'box1 box2'
    'box3 box3'`,
    height: "auto",
    padding: "60px",
    paddingTop: "20px",
  };

  const box1Style = {
    gridArea: "box1",
    lineHeight: "1.5rem",
    fontSize: "1.15rem",
    padding: "15px 15px 25px 15px",
    border: "2px solid lightgray",
    borderRight: "0",
  };

  const box2Style = {
    gridArea: "box2",
    display: "flex",
    padding: "20px",
    textAlign: "center",
    justifyContent: "space-around",
    border: "2px solid lightgray",
    borderLeft: "0",
  };

  const box3Style = {
    gridArea: "box3",
    display: "flex",
    padding: "20px",
    textAlign: "center",
    justifyContent: "space-evenly",
  };

  const currentWeatherGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "0.5fr 0.5fr",
    gridTemplateAreas: `
      'currentbox1 .'
      'currentbox2 currentbox3'`,
    justifyItems: "center",
    alignItems: "center",
  };

  const infoStyle = {
    fontSize: "0.8rem",
  };

  const infoSpanStyle = {
    fontWeight: "700",
    fontSize: "0.9rem",
  };

  return (
    <div className="weather-box">
      <h2 style={{ marginLeft: "60px", display: "flex" }}>
        {currentWeather.city}
        <AddFavorite currentWeather={currentWeather} />
      </h2>
      <div className="grid-container" style={gridStyle}>
        <div className="box1" style={box1Style}>
          <div className="current-weather" style={currentWeatherGridStyle}>
            <h2 style={{ gridArea: "currentbox1" }}>Now</h2>
            <div
              style={{
                gridArea: "currentbox2",
                lineHeight: "0",
                alignSelf: "start",
              }}
            >
              <img
                src={`http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                alt="weather"
                style={{ width: "auto" }}
              />
              <h3 style={{ textAlign: "center" }}>
                {Math.round(currentWeather.temp)}°
              </h3>
            </div>
            <div
              style={{
                gridArea: "currentbox3",
                justifySelf: "start",
                lineHeight: "2rem",
              }}
            >
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              >
                {currentWeather.description}
              </p>
              <p style={infoStyle}>
                Humidity{" "}
                <span style={infoSpanStyle}>{currentWeather.humidity}%</span>
              </p>
              <p style={infoStyle}>
                Wind{" "}
                <span style={infoSpanStyle}>
                  {String(convertMpsToKph(currentWeather.wind))} km/h
                </span>
              </p>
              <p style={infoStyle}>
                Pressure{" "}
                <span style={infoSpanStyle}>{currentWeather.pressure} kPa</span>
              </p>
            </div>
          </div>
        </div>
        <div className="box2" style={box2Style}>
          <DailyForecast forecasts={dailyForecasts} />
        </div>
        <div className="box3" style={box3Style}>
          {dailyForecasts.length === 5 && (
            <React.Fragment>
              <HourlyForecast forecasts={hourlyForecasts} />
            </React.Fragment>
          )}
        </div>
      </div>
      <Observations city={currentWeather.city}></Observations>
    </div>
  );
};

export default Weather;
