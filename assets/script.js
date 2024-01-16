// ${process.env.googleAPI_KEY} to get the google API KEY
// ${process.env.openweatherAPI_KEY} to get the Openweather API KEY
// -----------------------------------------------------------------

// Copied from Josh's Weather Dashboard and modified to attempt to meet the requirements of this assignment
var weatherTileInfo = document.querySelector(".weather-card");
var createWeatherCard = (index, weatherItem) => {
  var tempFahrenheit = Math.floor(
    ((weatherItem.main.temp - 273.15) * 9) / 5 + 32
  ); // Convert temperature from Kelvin to Fahrenheit and remove decimal digits
  var windSpeed = Math.floor(weatherItem.wind.speed); // Drop the integers after the decimal in the wind speed
  if (index === 0) {
    // Big weather card
    // Small weather cards
    return `<article class="tile is-child box has-background-danger weather-card">
                    <p class="title has-text-warning has-text-centered">Weather</p>
                    <p class="subtitle has-text-warning has-text-centered">(YYYY-MM-DD)</p>
                    <p>(${weatherItem.dt_txt.split(" ")[0]})</p>
                    <img src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }@2x.png" alt="weather icon">
                    <div class="content has-text-warning has-text-centered">
                    <p>Temp: ${tempFahrenheit}°F</p>
                    <div class="content has-text-warning has-text-centered">
                    <p>Wind: ${windSpeed} MPH</p>
                    <div class="content has-text-warning has-text-centered">
                    <p>Humidity: ${weatherItem.main.humidity}%</p>
                    <div class="content has-text-warning has-text-centered">
                    <p>Feels Like: ${Math.floor(
                      ((weatherItem.main.feels_like - 273.15) * 9) / 5 + 32
                    )}°F</p>
                </article>`;
  }
};

// Function to get the weather data from OpenWeather API

// Function to get users current location data
// Get user's current location using Google Places API

// Closes the modal when you click a button, click outside of it, or hit escape.
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      closeAllModals();
    }
  });
});
// PSEUDOCODE

// console.log(location.href);
//     PSEUDOCODE
// GET PLACES DATA FROM API
//  GENERATE RANDOM RESTAURANT
// Get a handle on the local restaurants data passed back from the maps API
// Store the first 20ish restaurants in an array.
// for (rest = 0, rest <=20, rest++) {
// restaurant
// }
// restArray = [r1, r2, r3, r4, r5, etc]
// let randomRestIndex = Math.floor(Math.random() * restArray.length)
// let randomRest = restArray[randomRestIndex]

// STORE CHECKBOX INFO FUNCTION:
let delivery = false;
let driveThru = false;
let takeout = false;
let dineIn = false;
let deliveryEl = document.getElementById("delivery");
let driveThruEl = document.getElementById("driveThru");
let takeoutEl = document.getElementById("takeout");
let dineInEl = document.getElementById("dineIn");

var locationButton = document.querySelector(".locationBtn");
var API_KEY = "24436c094ae63125e618e94d2ac2df4c";
var getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      var { latitude, longitude } = position.coords;
      var REVERSE_GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

      // Retrieves city name from coordinates using reverse geocoding API.
      fetch(REVERSE_GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
          var { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("Error fetching location!");
        });
    },
    (error) => {
      // Alert user if location access is denied
      if (error.code === error.PERMISSION_DENIED)
        alert(
          "Please allow location access if you want more accurate weather information! Please refresh the page using 'F5' and try again"
        );
    }
  );
};
locationButton.addEventListener("click", getUserCoordinates);
