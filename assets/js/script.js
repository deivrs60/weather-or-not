// VARIABLE DECLARATION 
var forecastWeather;
var cityLat;
var cityLong;
var cityAPISearch = [];
var citySearchString;
var searchHistory =[];
var dateFormatCurrent;
var dateFormatForecast = [];
var dtForecast;


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
         populateHistory();
        cityInputEl[0].value = "";
    }
    else {
        alert("Please enter a city.")
    }
}


// function to get the searched city's weather conditions based on the LAT and LONG gathered from the geocoding api
var callWeatherAPI = function(cityLat, cityLong){
    var currentWeatherAPICall = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=${'imperial'}&exclude=${'alerts,hourly,minutely'}&appid=${'a0b786fdc717dfea3eb829a24bf465f2'}`;
    fetch(currentWeatherAPICall)
    .then(response => response.json())
    .then(function(data){
        let currentWeather = {
            temp: data.current.temp,
            wind: data.current.wind_speed,
            humidity: data.current.humidity,
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

// function to gather city longitude and latitude to use in the openweather api
var callCityAPI = function(city) {
    cityAPISearch = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=a0b786fdc717dfea3eb829a24bf465f2`;
    fetch(cityAPISearch)
    .then(response => response.json())
    .then(function(data) {
        cityLat = data[0].lat;
        cityLong = data[0].lon;
        callWeatherAPI(cityLat, cityLong);
    })
};



// render the current weather conditions to content!
var renderCurrentWeatherContent = function(currentWeather, data) {
    $('#current-weather-container').empty();
    
    // render current weather conditions in city searched
    const h2El = $('<h2>');
    const divEl = $('<div>');
    const pEl1 = $('<p>');
    const pEl2 = $('<p>');
    const pEl3 = $('<p>');
    const pEl4 = $('<p>');

    divEl.addClass("current-weather mt-2 border border-dark p-2");

    h2El
        .addClass("fw-bold current-location")
        .text(citySearchString + ' ' + dateFormatCurrent)
     //   .append(`<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2px.png" width="75" height="75" />`);
        divEl.append(h2El);

    pEl1
        .addClass("fw-bold")
        .text('Temp:' + `${currentWeather.temp}`+ '\u00B0F')
        divEl.append(pEl2);

    pEl3
        .addClass('fw-bold')
        .text('UVI:' + `${currentWeather.uvi}`)

    if(currentWeather.uvi <=2) {
        pEl4.addClass('uvi-good');
    }
    else if(currentWeather.uvi <=5) {
        pEl4.addClass('text-warning')
    }
    else {
        pEl4.addCLass('text-danger')
    }

    divEl.append(pEl4);
    $('#current-weather-container').prepend(divEl);
}


// function to render forecast content onto the page
var renderForecastContent = function(data, forecastDates) {
    const divForecastEl = $('<div>');
    const divForecastBlocksEl = $('<div>');
    const h3El = $('<h3>');



// start loop as 1/1st value in daily array
for(var i =1; i < 6; i++) {
    const h4El = $('<h4>');
    const divForecastDayEl = $('<div>');
    const pEl1 = $('<p>');
    const pEl2 = $('<p>');
    const pEl3 = $('<p>');
    
    let imageString;

    h4El.text(forecastDates[i-1]);

    imageString = `<img src="https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" width="75" height="75" />`

    pEl1.text('Temp: ' + `${data.daily[i].temp.day}` + '\u00B0F')

    pEl2.text('Wind: ' + `${data.daily[i].wind_speed}` + 'MPH')

    pEl3.text('Humidity: ' + `${data.daily[i].humidity}` + '%')

    divForecastDayEl 
        .addClass('p-2 forecast-day')
        .append(h4El, imageString, pEl1, pEl2, pEl3)

    divForecastBlocksEl 
        .addClass('d-sm-flex flex-sm-column d-md-flex flex-md-row justify-content-md-between forecast-blocks')
        .append(divForecastDayEl)

    h3El 
        .addClass('fw-bold')
        .text('5-Day Forecast:')

    divForecastEl
        .addClass('mt-3 forecast')
        .append(h3El, divForecastBlocksEl)
    
    $('#current-weather-container').append(divForecastEl);
}
}

// function to populate search history under search bar
var populateHistory = function() {
    var searchHistoryEl = $('.search-history');
    searchHistoryEl.empty();
    for(var i=0; i< searchHistory.length; i++) {
        var city = searchHistory[i];
        const buttonEl = $('<button>')
        .addClass('bg-secondary text-white rounded mt-1 mb-3 w-100 history-btn')
        .text(city)
        .attr('id', i);
        
        searchHistoryEl.append(buttonEl);

    }
    $('.history-btn').on('click', historyButtonClicked)
}
populateHistory();


var historyButtonClicked = 
    function(event) {
        const id = event.target.id 
        var city = $('.history-btn')[id].textContent
        citySearchString = city;
        callCityAPI(city);
    }


// SEARCH button click functionality
searchButtonEl.on('click', userCitySearch);
// search HISTORY button click functionality 
$('.history-btn').on('click', historyButtonClicked)