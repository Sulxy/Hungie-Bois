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



// Copied from Josh's Weather Dashboard and modified to meet the requirements of this assignment
function getUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openweatherAPI_KEY}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const weatherIcon = data.weather[0].icon;
        const weatherDescription = data.weather[0].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const temperature = Math.floor((data.main.temp - 273.15) * 9/5 + 32);
        const windSpeed = Math.floor(data.wind.speed);
        const humidity = data.main.humidity;
        const feelsLike = Math.floor((data.main.feels_like - 273.15) * 9/5 + 32);

        // Display weather information in the weather tile
        const weatherTile = document.querySelector('.weather');
        weatherTile.innerHTML = `
          <div class="tile is-parent is-vertical has-text-centered weather">
          <article class="tile is-child box has-background-danger weather-card">
          <p class="title has-text-warning has-text-centered">Weather</p>
          <figure class="image is-128x128 is-inline-block"><img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="weather icon" id="weatherIcon"></figure>
          <p class="content has-text-warning has-text-centered">${weatherDescription}</p>
          <p class="content has-text-warning has-text-centered">Date: ${currentDate}</p>
          <p class="content has-text-warning has-text-centered">Temp: ${temperature}°F</p>
          <p class="content has-text-warning has-text-centered">Wind: ${windSpeed} MPH</p>
          <p class="content has-text-warning has-text-centered">Humidity: ${humidity}%</p>
          <p class="content has-text-warning has-text-centered">Feels Like: ${feelsLike}°F</p>
        `;
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  });
}



// TODO: Display weather for that location in the Weather Tile. 
// TODO: Apply that current location to the Google Places API to get restaurants in the area wiuhtin a 15 mile radius using the local storage 
// information as a template for search criteria
// TODO: Display those restaurants in the Restaurants Tile.
// TODO: When a restaurant is Passed, move the restaurants name to the Passed tile.
// TODO: When a restaurant is Yassed, load the chosenrestaurants.html page and display the restaurant name, address, and website. 







