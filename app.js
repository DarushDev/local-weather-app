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
    "clear-day": "https://pixabay.com/get/eb34b60e2fe90021d85a5840981318c3fe76e6dc1fb517499cf8c6/background-21717_1280.jpg",
    "clear-night": "https://pixabay.com/get/e034b9082ff31c22d2524518a33219c8b66ae3d110b715479cf0c17c/stars-918777_1280.jpg",
    "rain": "https://pixabay.com/get/eb37b10c2ef0013ed1584d05fb0938c9bd22ffd41db8174593f9c17ea2/rain-2203640_1280.jpg",
    "snow": "https://pixabay.com/get/eb35b7072afd093ed1584d05fb0938c9bd22ffd41db8174593f9c378a3/wintry-2068298_1280.jpg",
    "sleet": "https://pixabay.com/get/e83db5072bf0073ed1584d05fb0938c9bd22ffd41db8174593f9c37ca7/snow-1848346_1280.png",
    "wind": "https://pixabay.com/get/e83cb10920f7043ed1584d05fb0938c9bd22ffd41db8174593f9c071a5/reed-1906835_1280.jpg",
    "fog": "https://pixabay.com/get/ec31b60c2ef71c22d2524518a33219c8b66ae3d110b715479cf2c97e/forest-547363_1280.jpg",
    "cloudy": "https://pixabay.com/get/eb34b8082efc043ed1584d05fb0938c9bd22ffd41db8174593f8c879af/weather-2197685_1280.jpg",
    "partly-cloudy-day": "https://pixabay.com/get/e833b7092efc073ed1584d05fb0938c9bd22ffd41db8174593f9c27da1/sky-1666686_1280.jpg",
    "partly-cloudy-night": "https://pixabay.com/get/e83db7062ff1023ed1584d05fb0938c9bd22ffd41db8174593f9c270a3/cloudy-1869753_1280.jpg"
};

function callWeatherApi(url) {
    var success = function (data) {
        temperature = data.currently.temperature;
        $("#icon").attr("src", icons[data.currently.icon]);
        $("#temperature").text(temperature);
        $("#timezone").text(data.timezone);
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
