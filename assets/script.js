// let googleAPI_KEY = "AIzaSyB7lvXekjOPfNWfvpV7yq_2YZhWcf9WROM";
// let openweatherAPI_KEY = "ccf8e872f741b16e805da56b3ea2b6cd";
// -----------------------------------------------------------------



// Copied from Josh's Weather Dashboard and modified to attempt to meet the requirements of this assignment
var weatherTileInfo = document.querySelector(".weather-card");
var createWeatherCard = (index, weatherItem) => {
    var tempFahrenheit = Math.floor((weatherItem.main.temp - 273.15) * 9/5 + 32); // Convert temperature from Kelvin to Fahrenheit and remove decimal digits
    var windSpeed = Math.floor(weatherItem.wind.speed); // Drop the integers after the decimal in the wind speed
    if(index === 0) { // Big weather card
         // Small weather cards
        return `<article class="tile is-child box has-background-danger weather-card">
                    <p class="title has-text-warning has-text-centered">Weather</p>
                    <p class="subtitle has-text-warning has-text-centered">(YYYY-MM-DD)</p>
                    <p>(${weatherItem.dt_txt.split(" ")[0]})</p>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather icon">
                    <div class="content has-text-warning has-text-centered">
                    <p>Temp: ${tempFahrenheit}°F</p>
                    <div class="content has-text-warning has-text-centered">
                    <p>Wind: ${windSpeed} MPH</p>
                    <div class="content has-text-warning has-text-centered">
                    <p>Humidity: ${weatherItem.main.humidity}%</p>
                    <div class="content has-text-warning has-text-centered">
                    <p>Feels Like: ${Math.floor((weatherItem.main.feels_like - 273.15) * 9/5 + 32)}°F</p>
                </article>`;
    }
}





// Function to get the weather data from OpenWeather API





// Get user's current location using Google Places API
function getUserLocation() {
  // Retrieve the latitude and longitude from the OpenWeather API
  const latitude = /* Retrieve latitude from OpenWeather API response */;
  const longitude = /* Retrieve longitude from OpenWeather API response */;

  // Make a request to the Google Places API
  const googlePlacesAPIKey = "AIzaSyB7lvXekjOPfNWfvpV7yq_2YZhWcf9WROM"; /* Your Google Places API key */;
  const radius = 15; 
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${googlePlacesAPIKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Parse the response and extract the relevant information about the restaurants
      const restaurants = data.results.map(result => ({
        name: result.name,
        address: result.vicinity,
        website: result.website,
        }));

      // Display the information about the restaurants to the user
      console.log(restaurants);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call the function to get the user's current location and find restaurants
getUserLocation();





// Closes the modal when you click a button, click outside of it, or hit escape.
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        closeAllModals();
      }
    });
  });
