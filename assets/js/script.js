// VARIABLE DECLARATION 
var forecastWeather;
var cityLat;
var cityLong;
var cityAPISearch = [];
var citySearchString;
var searchHistory =[];
var dateFormatCurrent;
var dateFormatForecast = [];
var dtForeCast;


const searchButtonEl = $('#search');
const cityInputEl = $('#city-search');

// retrieve localStorage
var retrieveHistory = function() {
    storedHistory = JSON.parse(localStorage.getItem('citySearchHistory'));
    if(storedHistory) {
        searchHistory = storedHistory;
    }
}
retrieveHistory();

// search button functionality 
var userCitySearch = function() {
    citySearchString = cityInputEl[0].value;
    if(citySearchString) {
         callCityAPI(citySearchString);
        searchHistory.push(citySearchString);
         localStorage.setItem('citySearchHistory', JSON.stringify(searchHistory));
     //   populateHistory();
        cityInputEl[0].value = "";
    }
    else {
        alert("Please enter a city.")
    }
}

// function to gather city longitude and latitude to use in the openweather api
var callCityAPI = function(city) {
    cityAPISearch = `https://api.openweathermap.org/geo/1.0/direct?q=
                    ${city}&limit=1&appid=94e32ddc97880c45b19a69dfc85aec8d`;
    fetch(cityAPISearch)
    .then(response => response.json())
    .then(function(data) {
        cityLat = data[0].lat;
        cityLong = data[0].long;
        JSON.stringify(cityLat, cityLong);
        console.log(cityLat, cityLong);
      //  callWeatherAPI(cityLat,cityLong);
    })
};













// SEARCH button click functionality
searchButtonEl.on('click', userCitySearch)