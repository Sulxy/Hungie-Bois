var googleAPI_KEY = "AIzaSyB7lvXekjOPfNWfvpV7yq_2YZhWcf9WROM";
var openweatherAPI_KEY = "ccf8e872f741b16e805da56b3ea2b6cd";
var modal = document.querySelector('.modal');
var weatherTileInfo = document.querySelector(".weather-card");
// -----------------------------------------------------------------

// Modal Functionality
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
    var modal = $trigger.dataset.target;
    var $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    var $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a click event to close the modal when clicked outside its boundaries
  document.addEventListener('click', (event) => {
    var $modal = event.target.closest('.modal');
    if (!$modal) {
      closeModal();
    }
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      closeAllModals();
    }
  });

  // Add a click event to run the getUserLocation function close the modal when the .user-location button is clicked
  var locationButton = document.querySelector('.user-location');
  if (locationButton) {
    locationButton.addEventListener('click', () => {
      getUserLocation(), closeModal();
    });
  }

  // Add a click event on the .parametersBtn button to reopen the modal
  var parametersBtn = document.querySelector('#paramBtn');
  var modal = document.querySelector('.modal');
  parametersBtn.addEventListener('click', () => {
    modal.classList.add('is-active');
  });

  // var's for the below eventListeners
  var deliveryCheckbox = document.querySelector('#delivery');
  var driveThruCheckbox = document.querySelector('#driveThru');
  var takeoutCheckbox = document.querySelector('#takeout');
  var dineInCheckbox = document.querySelector('#dineIn');

  // Stores if the user wants delivery in local storage, and removes if unchecked.
  deliveryCheckbox.addEventListener('change', () => {
    if (deliveryCheckbox.checked) {
      localStorage.setItem('delivery', 'Delivery');
    } else {
      localStorage.removeItem('delivery');
    }
  });

  // Stores if the user wants driveThru in local storage, and removes if unchecked.
  driveThruCheckbox.addEventListener('change', () => {
    if (driveThruCheckbox.checked) {
      localStorage.setItem('driveThru', 'Drive-Through');
    } else {
      localStorage.removeItem('driveThru');
    }
  });

  // Stores if the user wants takeout in local storage, and removes if unchecked.
  takeoutCheckbox.addEventListener('change', () => {
    if (takeoutCheckbox.checked) {
      localStorage.setItem('takeout', 'Takeout');
    } else {
      localStorage.removeItem('takeout');
    }
  });

  // Stores if the user wants dineIn in local storage, and removes if unchecked.
  dineInCheckbox.addEventListener('change', () => {
    if (dineInCheckbox.checked) {
      localStorage.setItem('dineIn', 'Dine-in');
    } else {
      localStorage.removeItem('dineIn');
    }
  });

});



// Copied from Josh's Weather Dashboard and modified to attempt to meet the requirements of this assignment
var weatherTileInfo = document.querySelector(".weather-card");
var createWeatherCard = (index, weatherItem) => {
    var tempFahrenheit = Math.floor((weatherItem.main.temp - 273.15) * 9/5 + 32); // Convert temperature from Kelvin to Fahrenheit and remove decimal digits
    var windSpeed = Math.floor(weatherItem.wind.speed); // Drop the integers after the decimal in the wind speed
    if(index === 0) {
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



 
// TODO: Get users current location using OpenWeather and display weather for that location in the Weather Tile. 
// TODO: Apply that current location to the Google Places API to get restaurants in the area wiuhtin a 15 mile radius using the local storage 
// information as a template for search criteria
// TODO: Display those restaurants in the Restaurants Tile.
// TODO: When a restaurant is Passed, move the restaurants name to the Passed tile.
// TODO: When a restaurant is Yassed, load the chosenrestaurants.html page and display the restaurant name, address, and website. 






// Get user's current location using OpenWeather API
function getUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openweatherAPI_KEY}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const weatherIcon = data.weather[0].icon;
        const temperature = Math.floor((data.main.temp - 273.15) * 9/5 + 32);
        const windSpeed = Math.floor(data.wind.speed);
        const humidity = data.main.humidity;
        const feelsLike = Math.floor((data.main.feels_like - 273.15) * 9/5 + 32);

        // Use the obtained data as needed
        console.log("Weather Icon:", weatherIcon);
        console.log("Temperature:", temperature);
        console.log("Wind Speed:", windSpeed);
        console.log("Humidity:", humidity);
        console.log("Feels Like:", feelsLike);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
}











