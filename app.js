'use strict';
/*jslint browser:true */
/*global alert*/
/*jslint node: true */

// window.onload = function() {
//     alert( "welcome" );
// };

var exclude = "exclude=minutely,hourly,daily,alerts,flags";
var icons = {
    "clear-day": "http://openweathermap.org/img/w/01d.png",
    "clear-night": "http://openweathermap.org/img/w/01n.png",
    "rain": "http://openweathermap.org/img/w/09d.png",
    "snow": "http://openweathermap.org/img/w/13d.png",
    "sleet": "http://openweathermap.org/img/w/13n.png",
    "wind": "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/32-s.png",
    "fog": "http://openweathermap.org/img/w/50d.png",
    "cloudy": "http://openweathermap.org/img/w/03d.png",
    "partly-cloudy-day": "http://openweathermap.org/img/w/02d.png",
    "partly-cloudy-night": "http://openweathermap.org/img/w/02n.png"
};
var temperature = 0;
var backgrounds = {
    "clear-day": "http://i.imgur.com/CtEGisS.jpg",
    "clear-night": "http://i.imgur.com/lhMmaFv.jpg",
    "rain": "http://i.imgur.com/Irezd5K.jpg",
    "snow": "http://i.imgur.com/vHFRgIg.jpg",
    "sleet": "http://i.imgur.com/hJbzFVV.jpg",
    "wind": "http://i.imgur.com/7Cl3Hdq.jpg",
    "fog": "http://i.imgur.com/BwuxNZO.jpg",
    "cloudy": "http://i.imgur.com/uXpl2ZF.jpg",
    "partly-cloudy-day": "http://i.imgur.com/fbkpqsQ.jpg",
    "partly-cloudy-night": "http://i.imgur.com/00Uj0rs.jpg"
};
var descriptions = {
    "clear-day": "It is a clear day",
    "clear-night": "It is a clear night",
    "rain": "It is raining",
    "snow": "It is snowing",
    "sleet": "It is sleeting",
    "wind": "It is windy",
    "fog": "It is foggy",
    "cloudy": "It is cloudy",
    "partly-cloudy-day": "It is a partly cloudy day",
    "partly-cloudy-night": "It is a partly cloudy night"
};

function callWeatherApi(url) {
    var success = function (data) {
        temperature = data.currently.temperature;
        $("#icon").attr("src", icons[data.currently.icon]);
        $("#temperature").text(temperature);
        $("#timezone").text(data.timezone);
        $("#description").text(descriptions[data.currently.icon]);
        $("body").css("background-image", "url("+backgrounds[data.currently.icon])+")";
    };
    var error = function () {
        alert("error");
    };

    $.ajax({
        url: url,
        cache: false,
        dataType: "jsonp",
        type: "GET",
        success: success,
        error: error
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser");
    }
}

function successCallback(position) {
    var coords = position.coords.latitude + "," + position.coords.longitude;
    callWeatherApi("https://api.darksky.net/forecast/018bc18be3c49f1fc86117b8e0fef0d5/" + coords + "?units=si&" + exclude);
}

function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Location permission was denied");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location data not available");
            break;
        case error.TIMEOUT:
            alert("Location request timeout");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unspecified location error occurred");
            break;
        default:
            alert("Who knows what happened...");
            break;
    }

    $.getJSON("https://ipinfo.io/json", function (data) {
        callWeatherApi("https://api.darksky.net/forecast/018bc18be3c49f1fc86117b8e0fef0d5/" + data.loc + "?units=si&" + exclude);
    });
}

$(document).ready(function () {
    getLocation();

    $("#celsius").click(function () {
        $("#temperature").text(temperature);
        $("#celsius").addClass("disabled").removeClass("enabled");
        $("#fahrenheit").addClass("enabled").removeClass("disabled");
    });

    $("#fahrenheit").click(function () {
        $("#temperature").text(Number((1.8 * temperature + 32).toFixed(2)));
        $("#fahrenheit").addClass("disabled").removeClass("enabled");
        $("#celsius").addClass("enabled").removeClass("disabled");
    });

});
