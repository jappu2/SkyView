import React, { useState, useEffect } from 'react';
import search from '../images/search.svg';
import location from '../images/location.svg';
import thermo from '../images/thermo.svg';
import leftArrow from '../images/left-arrow.svg';
import rightArrow from '../images/right-arrow.svg';

function Homepage(props) { 
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(
    { "coord": { "lon": 7.4474, "lat": 46.9481 }, "weather": [ { "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" } ], "base": "stations", "main": { "temp": 2.07, "feels_like": 2.07, "temp_min": -2.58, "temp_max": 6.48, "pressure": 1031, "humidity": 79 }, "visibility": 10000, "wind": { "speed": 0.89, "deg": 73, "gust": 1.34 }, "clouds": { "all": 0 }, "dt": 1707028453, "sys": { "type": 1, "id": 6937, "country": "CH", "sunrise": 1707029529, "sunset": 1707064556 }, "timezone": 3600, "id": 2661552, "name": "Bern", "cod": 200 }
  );
  const [forecast, setForecast] = useState([
    { 'temp': 11, 'weather': 'clear'},
    { 'temp': 14, 'weather': 'rainy'},
    { 'temp': 18, 'weather': 'clowdy'},
    { 'temp': 11, 'weather': 'clear'},
    { 'temp': 16, 'weather': 'clear'},
    { 'temp': 15, 'weather': 'rainy'},
  ]);
  const [cityTime, setCityTime] = useState(null); // Declare cityTime state
  const apiKey = '5c92651420b4335b277eb2c72a7ed792'; 

  const handleChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  

  useEffect(() => {
    if (weatherData) {
      const timezoneOffsetSeconds = weatherData.timezone; // Time zone offset for the city in seconds
      const currentUTC = new Date(Date.now()); // Get current UTC time
      const offsetMilliseconds = timezoneOffsetSeconds * 1000; // Convert seconds to milliseconds
      const cityTime = new Date(currentUTC.getTime() + offsetMilliseconds);
      setCityTime(cityTime.toLocaleString('en-GB', { timeZone: 'UTC' })); // Format city time and set cityTime state
      props.setShowNav(e => !e)
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDayIndex = cityTime.getDay();
        // Rearrange the days of the week starting from the current day
      const daysStartingFromToday = [
        ...daysOfWeek.slice(currentDayIndex), // Slice from current day to end of the week
        ...daysOfWeek.slice(0, currentDayIndex) // Slice from beginning of the week to current day
      ];
      setForecast(prev => prev.map(obj => {
        return {
          ...obj, 'day': daysStartingFromToday[forecast.indexOf(obj) + 1]
        };
      }))
    }
  }, [weatherData]);
  

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleChange}
        />
        <button type="submit"><img src={search} height= '25px'/></button>
      </form>

      {weatherData && (
        <>
        <div className="main">
          <div className="yesterday">
          </div>
          <img src={leftArrow}/>
          <div className="weather-details">
            <div className="location">
              <span>{city}</span>
              <img src={location} width="30px"/>
            </div>
            <div className="temperature">
              <img src={thermo} width='14px'/>
              <div>
              {weatherData.main.temp}°C   <div>{weatherData.weather[0].description}</div>

              </div>
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].main}/>
              </div>
            {cityTime && ( 
              <div className="datetime">{cityTime.toLocaleString()}</div>
            )}
            <div className="other-status">
              <div> <div>Humidity </div>  <div>{weatherData.main.humidity}%</div> </div>
              <div> <div>Visibility </div>  <div>{weatherData.visibility / 1000} km</div> </div>
              <div> <div>Air Pressure </div>  <div>{weatherData.main.pressure} hPa</div> </div>
              <div> <div>Wind </div>  <div>{weatherData.wind.speed} mph</div> </div>
            </div>
          </div>
          <img src={rightArrow} />

          <div className="tomorrow">
            
          </div>
        </div>
        <div className="forecast">
        {
          forecast.map(
            e => <div className='forecast-element'>
              <div className='second-background'></div>
            <div>{e.day}</div>
            <div>{e.weather}</div>
            <div>{e.temp}°C</div>
        </div>
          )
        }
      </div>
      </>

      )}
      
    </div>
    
  );
}

export default Homepage;
