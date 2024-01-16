const googleAPI_KEY = process.env.googleAPI_KEY;
const openweatherAPI_KEY = process.env.openweatherAPI_KEY;



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

    // Function to open and close a modal
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

    // Add event listeners to open and close the modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);

      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });

    // Add event listeners to close the modal when clicked outside or on specific elements
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

    // Function to get the weather data from OpenWeather API
    function getWeatherData(latitude, longitude) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openweatherAPI_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // Process the weather data and perform necessary actions
          console.log(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        createWeatherCard();
    }

    // Get user's current location using Google Places API
    function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Use the latitude and longitude to make a request to the Google Places API
            // and retrieve the user's current location information
            
            // Example code to make a request to the Google Places API
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&key=${googleAPI_KEY}`;
            
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                // Process the response data and extract the user's current location information
                console.log(data);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          },
          (error) => {
            console.error('Error getting current location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
      getWeatherData(latitude, longitude);
    }

    document.addEventListener('DOMContentLoaded', () => {
      const userLocationButton = document.querySelector('.user-location');
      userLocationButton.addEventListener('click', getCurrentLocation);
    });

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
      //const googleAPI_KEY = process.env.googleAPI_KEY;
      //const openweatherAPI_KEY = process.env.openweatherAPI_KEY;

      // Variables to store user's current location and restaurant information
      let latitude = null;
      let longitude = null;
      let restaurantData = null;

      // Function to get the user's current location using Google Places API
      function getCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              latitude = position.coords.latitude;
              longitude = position.coords.longitude;

              // Use the latitude and longitude to make a request to the Google Places API
              const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&key=${googleAPI_KEY}`;

              fetch(url)
                .then((response) => response.json())
                .then((data) => {
                  // Process the response data and extract the user's current location information
                  const restaurant = findRestaurant(data.results);
                  displayRestaurant(restaurant);
                  getWeatherData(latitude, longitude);
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            },
            (error) => {
              console.error('Error getting current location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      }

      // Function to find a restaurant that meets the selected criteria and is within 15 miles from the user's current location
      function findRestaurant(restaurants) {
        // Filter the restaurants based on the selected checkboxes
        const selectedCuisines = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map((checkbox) => checkbox.value);
        const filteredRestaurants = restaurants.filter((restaurant) => selectedCuisines.includes(restaurant.cuisine));

        // Find a restaurant within 15 miles from the user's current location
        const restaurant = filteredRestaurants.find((restaurant) => {
          const distance = calculateDistance(latitude, longitude, restaurant.latitude, restaurant.longitude);
          return distance <= 15;
        });

        return restaurant;
      }

      // Function to calculate the distance between two coordinates using the Haversine formula
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance * 0.621371; // Convert distance to miles
      }

      // Function to convert degrees to radians
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

      // Function to display the restaurant information
      function displayRestaurant(restaurant) {
        const restName = document.querySelector('#restName');
        const restAddress = document.querySelector('#restAddress');
        const websiteLink = document.querySelector('.websiteLink');

        if (restaurant) {
          restName.textContent = restaurant.name;
          restAddress.textContent = restaurant.address;
          websiteLink.href = restaurant.website;
          websiteLink.textContent = 'Visit Website';
        } else {
          restName.textContent = 'No restaurant found';
          restAddress.textContent = '';
          websiteLink.href = '';
          websiteLink.textContent = '';
        }
      }

      // Function to get the weather data from OpenWeather API
      function getWeatherData(latitude, longitude) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openweatherAPI_KEY}`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            // Process the weather data and perform necessary actions
            createWeatherCard(data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      // Function to create the weather card
      function createWeatherCard(weatherData) {
        var tempFahrenheit = Math.floor((weatherData.main.temp - 273.15) * 9/5 + 32);
        var windSpeed = Math.floor(weatherData.wind.speed);

        // Create the weather card HTML
        const weatherCard = `<article class="tile is-child box has-background-danger weather-card">
                              <p class="title has-text-warning has-text-centered">Weather</p>
                              <p class="subtitle has-text-warning has-text-centered">(YYYY-MM-DD)</p>
                              <p>(${weatherData.dt_txt.split(" ")[0]})</p>
                              <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather icon">
                              <div class="content has-text-warning has-text-centered">
                                <p>Temp: ${tempFahrenheit}°F</p>
                                <div class="content has-text-warning has-text-centered">
                                  <p>Wind: ${windSpeed} MPH</p>
                                  <div class="content has-text-warning has-text-centered">
                                    <p>Humidity: ${weatherData.main.humidity}%</p>
                                    <div class="content has-text-warning has-text-centered">
                                      <p>Feels Like: ${Math.floor((weatherData.main.feels_like - 273.15) * 9/5 + 32)}°F</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>`;

        // Display the weather card
        const weatherTileInfo = document.querySelector('.weather-card');
        weatherTileInfo.innerHTML = weatherCard;
      }

      // Event listener for the "Use Current Location" button
      document.addEventListener('DOMContentLoaded', () => {
        const userLocationButton = document.querySelector('.user-location');
        userLocationButton.addEventListener('click', getCurrentLocation);
      });

      // Event listener for the "Yass" button
      document.addEventListener('click', (event) => {
        if (event.target.classList.contains('yass')) {
          // Load the chosenrestaurantpage.html
          window.location.href = 'chosenrestaurantpage.html';
        }
      });
    }
  });

  // Event listener for the "Pass" button
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('pass')) {
      // Find another restaurant that meets the selected criteria and is within 15 miles from the user's current location
      const restaurant = findRestaurant(restaurantData.results);
      displayRestaurant(restaurant);
    }
  });
