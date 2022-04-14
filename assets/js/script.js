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


// search button functionality 
var userCitySearch = function() {
    citySearchString = cityInputEl[0].value;
    if(citySearchString) {
        callCityAPI(citySearchString);
        searchHistory.push(citySearchString);
// localStorage.setItem('citySearchHistory', 
//  JSON.stringify(searchHistory));
        populateHistory();
        cityInputEl[0].value = "";
    }
    else {
        alert("Please enter a city.")
    }
}

