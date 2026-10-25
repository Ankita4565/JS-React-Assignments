
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

const cityName = document.getElementById("city-name");
const currentCondition = document.getElementById("current-condition");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

const forecastContainer = document.getElementById("forecast-container");
const unitToggle = document.getElementById("unit-toggle");

let currentUnit = "C";
let latestWeather = null;


function getWeatherCondition(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "Rainy";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "Snowy";
  }
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown conditions";
}


function setLoading(isLoading) {
  loading.hidden = !isLoading;
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "Searching..." : "Search";
}

async function getWeather(city) {
  errorMessage.textContent = "";
  forecastContainer.innerHTML = "";
  setLoading(true);

  try {
    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Unable to search for this city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please enter a valid city name.");
    }

    const place = geoData.results[0];
    const latitude = place.latitude;
    const longitude = place.longitude;

    
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto&temperature_unit=${currentUnit === "C" ? "celsius" : "fahrenheit"}&wind_speed_unit=kmh`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather. Please try again.");
    }

    const weatherData = await weatherResponse.json();

    
    latestWeather = {
      place,
      weatherData
    };

    localStorage.setItem("lastCity", city);

   
    displayWeather();

  } catch (error) {
    errorMessage.textContent =
      error.message === "Failed to fetch"
        ? "Network error. Please check your internet connection."
        : error.message;

  } finally {
    setLoading(false);
  }
}

// Display current weather and forecast
function displayWeather() {
  if (!latestWeather) return;

  const { place, weatherData } = latestWeather;
  const current = weatherData.current;
  const daily = weatherData.daily;

  const unit = currentUnit === "C" ? "°C" : "°F";

  cityName.textContent =
    `${place.name}, ${place.admin1 || place.country || ""}`;

  currentCondition.textContent =
    getWeatherCondition(current.weather_code);

  temperature.textContent =
    `${Math.round(current.temperature_2m)}${unit}`;

  humidity.textContent =
    `Humidity: ${current.relative_humidity_2m}%`;

  windSpeed.textContent =
    `Wind speed: ${current.wind_speed_10m} km/h`;

  // Render the three forecast cards
  forecastContainer.innerHTML = "";

  daily.time.forEach((date, index) => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    const dateElement = document.createElement("h3");
    dateElement.textContent = new Date(
      `${date}T12:00:00`
    ).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });

    const conditionElement = document.createElement("p");
    conditionElement.textContent =
      getWeatherCondition(daily.weather_code[index]);

    const maxElement = document.createElement("p");
    maxElement.textContent =
      `Max: ${Math.round(daily.temperature_2m_max[index])}${unit}`;

    const minElement = document.createElement("p");
    minElement.textContent =
      `Min: ${Math.round(daily.temperature_2m_min[index])}${unit}`;

    card.append(
      dateElement,
      conditionElement,
      maxElement,
      minElement
    );

    forecastContainer.appendChild(card);
  });
}


searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    errorMessage.textContent = "Please enter a city name.";
    return;
  }

  getWeather(city);
});


unitToggle.addEventListener("click", function () {
  currentUnit = currentUnit === "C" ? "F" : "C";

  unitToggle.textContent =
    currentUnit === "C" ? "Switch to °F" : "Switch to °C";

  if (latestWeather) {
    
    getWeather(latestWeather.place.name);
  }
});


window.addEventListener("DOMContentLoaded", function () {
  const savedCity = localStorage.getItem("lastCity");

  if (savedCity) {
    cityInput.value = savedCity;
    getWeather(savedCity);
  }
});
