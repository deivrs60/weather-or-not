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
        // callCityAPI(citySearchString);
        searchHistory.push(citySearchString);
         localStorage.setItem('citySearchHistory', JSON.stringify(searchHistory));
        populateHistory();
        cityInputEl[0].value = "";
    }
    else {
        alert("Please enter a city.")
    }
}



// SEARCH button click functionality
searchButtonEl.on('click', userCitySearch)