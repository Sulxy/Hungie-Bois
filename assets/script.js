// Global Variables
var googleAPI_KEY = "AIzaSyB7lvXekjOPfNWfvpV7yq_2YZhWcf9WROM"; // Google API Key
var openweatherAPI_KEY = "ccf8e872f741b16e805da56b3ea2b6cd"; // OpenWeather API Key
var modal = document.querySelector(".modal"); // Modal element
var weatherTileInfo = document.querySelector(".weather-card"); // Weather tile element
var typeEls = document.getElementsByName("restaurant_type"); // Restaurant type checkboxes
var latitude; // User's latitude
var longitude; // User's longitude
var passedList = []; // List of passed restaurants
var restaurants; // Array of nearby restaurants
var randomRestaurant; // Randomly selected restaurant
var mainDiv = document.getElementById("mainDiv"); // Main div element
var restaurantDiv = document.getElementById("restaurantDiv"); // Restaurant div element
var restaurantName = document.getElementById("restName"); // Restaurant name element
var restaurantAddress = document.getElementById("restAddress"); // Restaurant address element
var linkAnchor = document.getElementById("websiteLink"); // Website link element
var map; // Google Maps object
var service; // Google Maps service
var infowindow; // Google Maps info window

// -----------------------------------------------------------------

// get user Input on checkboxes.
function getRadioInput() {
  for (i = 0; i < typeEls.length; i++) {
    if (typeEls[i].checked) {
      localStorage.setItem("checkedType", typeEls[i].value);
    }
  }
}

// Modal Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal

  function openModal($el) {
    $el.class.add("is-active");
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
      // Add getCheckboxInput function here to grab checkbox input when button is clicked.
      closeModal($target);
    });
  });

  // Add a click event to close the modal when clicked outside its boundaries
  document.addEventListener("click", (event) => {
    var $modal = event.target.closest(".modal");
    if (!$modal) {
      closeModal();
    }
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      closeAllModals();
    }
  });

  // Add a click event to run the getUserLocation function, and close the modal when the .user-location button is clicked
  var locationButton = document.querySelector(".user-location");
  if (locationButton) {
    locationButton.addEventListener("click", () => {
      getUserLocation();
      closeModal();
    });
  }

  // Add a click event on the .parametersBtn button to reopen the modal
  var parametersBtn = document.querySelector("#paramBtn");
  var modal = document.querySelector(".modal");
  parametersBtn.addEventListener("click", () => {
    modal.classList.add("is-active");
    mainDiv.classList.remove("is-hidden");
    restaurantDiv.classList.add("is-hidden");
  });
});

// Copied from Josh's Weather Dashboard and modified to meet the requirements of this assignment
function getUserLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getRadioInput();
    // Call map function after latitude and longitude are retrieved
    initMap();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openweatherAPI_KEY}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const weatherIcon = data.weather[0].icon;
        const weatherDescription = data.weather[0].description
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const temperature = Math.floor(
          ((data.main.temp - 273.15) * 9) / 5 + 32
        );
        const windSpeed = Math.floor(data.wind.speed);
        const humidity = data.main.humidity;
        const feelsLike = Math.floor(
          ((data.main.feels_like - 273.15) * 9) / 5 + 32
        );

        // Display weather information in the weather tile
        const weatherTile = document.querySelector(".weather");
        weatherTile.innerHTML = `
          <div class="tile is-parent is-vertical has-text-centered weather">
          <article class="tile is-child box has-background-danger weather-card">
          <p class="title has-text-warning has-text-centered"><u>Weather</u></p>
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
      });
  });
}

// Function to generate a random restaurant
function generateRandomRestaurant() {
  var randomIndex = Math.floor(Math.random() * restaurants.length);
  randomRestaurant = restaurants[randomIndex];
  document.getElementById("random-restaurant").textContent =
    randomRestaurant.name + "?";
}

// Function to display the selected restaurant
function yassFunction() {
  restaurantName.textContent = randomRestaurant.name + "!!!";
  restaurantAddress.textContent = randomRestaurant.vicinity;
  mainDiv.classList.add("is-hidden");
  restaurantDiv.classList.remove("is-hidden");
}

// Event listener for the "Yass" button
var yassBtn = document.getElementById("yass");
yassBtn.addEventListener("click", yassFunction);

// Function to create a marker on the map
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
}

// Map function to find nearby restaurants
function initMap() {
  var userLocation = new google.maps.LatLng(latitude, longitude);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 14,
  });

  var request = {
    location: userLocation,
    radius: "10000",
    keyword: localStorage.getItem("checkedType"),
    type: ["restaurant"],
  };

  var service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      restaurants = results;
      // call random Restaurant function AFTER restaurants array is defined.
      generateRandomRestaurant();
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
}
var pass = document.querySelector("#pass");

pass.addEventListener("click", passFunction);
function passFunction() {
  var noPick = document.querySelector("#noChoice");
  var tags = document.createElement("p");
  tags.textContent = randomRestaurant.name;
  noPick.appendChild(tags);
  generateRandomRestaurant();
  tags.classList.add("has-text-warning");
  tags.classList.add("subtitle");
  tags.classList.add("has-text-centered");
}
