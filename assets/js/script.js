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
                    ${city}&limit=1&appid=a0b786fdc717dfea3eb829a24bf465f2`;
    fetch(cityAPISearch)
    .then(response => response.json())
    .then(function(data) {
        cityLat = data[0].lat;
        cityLong = data[0].long;
        callWeatherAPI(cityLat,cityLong);
    })
};


// function to get the searched city's weather conditions based on the LAT and LONG gathered from the geocoding api
var callWeatherAPI = function(cityLat, cityLong){
    var currentWeatherAPICall = `https://api.openweathermap.org/data/2.5/onecall?
                                lat=${cityLat}&
                                lon=${cityLong}&
                                units=${'imperial'}&
                                exclude=${'alerts,hourly,minutely'}&
                                appid=${'a0b786fdc717dfea3eb829a24bf465f2'}`;
    fetch(currentWeatherAPICall)
    .then(response => response.json())
    .then(function(data){
        let currentWeather = {
            'temp': data.current.temp,
            'wind': data.current.wind_speed,
            'humidity': data.current.humidity,
            uvi: data.current.uvi
        };
    console.log(currentWeather)

    var dtCurrent = data.current.dt;
    dtForecast = data.daily;
    var millsecondsCurrent = dtCurrent * 1000;
    var dateObjectCurrent = new Date(millsecondsCurrent);
    dateFormatCurrent = dateObjectCurrent.toLocaleDateString('en-US');
    renderCurrentWeatherContent(currentWeather, data);

    for (var i=1; i<6; i++) {
        var millsecondsForecast = dtForecast[i].dt * 1000;
        var dateObjectForecast = new Date(millsecondsForecast);
        currentDate = dateObjectForecast.toLocaleDateString('en-US');
        dateFormatForecast.push(currentDate);
    }
    renderForecastContent(data, dateFormatForecast);

    });
}

// render the current weather conditions to content












// SEARCH button click functionality
searchButtonEl.on('click', userCitySearch);