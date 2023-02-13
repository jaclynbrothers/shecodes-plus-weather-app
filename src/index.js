// Display current day of the week and time
function formatDay(timestamp) {
  //calculate the date
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[date.getDay()];
  return `${day}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row center-section">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {

    forecastHTML =
      forecastHTML +
      `
  <div class="col">
    <h3 class="forecast-font weather-forecast-date font-spacing">${formatDay(
      forecastDay.dt
    )}</h3>
    <img
      class="icon small-icon"
      src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
      alt="weather icon"
    />
    <h3 class="forecast-font weather-forecast-description">${forecastDay.weather[0].description}</h3>
    <h3 class="forecast-font weather-forecast-temperature">
      Temperature:
      <span class="weather-forecast-temperature-max">${
        Math.round(forecastDay.temp.max)
      }°</span>
      <span class="weather-forecast-temperature-min">${
        Math.round(forecastDay.temp.min)
      }°</span>
    </h3>
  </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatTime(timestamp) {
  //calculate the date
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function getForecast(coordinates) {
  let apiKey = "bd5b4461863eddaa6ced0a0a67989e0a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Replaces "City" with typed city name
// Also shows current temperature, humidity, wind, description, day, time, & icon
function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  celsiusTemp = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  let currentDay = document.querySelector("#current-day");
  let currentTime = document.querySelector("#current-time");
  currentDay.innerHTML = formatDay(response.data.dt * 1000);
  currentTime.innerHTML = formatTime(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

// Search Default City "New York"
function searchCity(city) {
  let apiKey = "b40b135798f82a05aed08769f9275f50";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

// Shows Default City "New York"
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

// Search Location
function searchLocation(position) {
  let apiKey = "b40b135798f82a05aed08769f9275f50";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

// Current Location
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

// Bonus Feature Temperature Conversion
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

searchCity("New York");
