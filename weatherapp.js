//object for storing functions we need for API
let weather = {
    "apiKey" : "628e9bf804c25adeced833cc08ab064e",
    getWeather : function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey
            ).then((response) => response.json()).then((data) => this.showWeather(data));
    },
    //showing the weather on the page
    showWeather : function(data) {
        //extract city name 
        const { name } = data;
        //extract icon and description, weather is an array
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        //display the values on the page
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        //remove false information from being displayed before the page loads
        document.querySelector(".weather").classList.remove("loading");
        //make the background image be based on the search term
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name +  "')";
    },
    //gets the information from the search bar and gets the weather from that
    search: function() {
        this.getWeather(document.querySelector(".search-bar").value);
    }

};

//object with different functions to get the user's location
let geoLocation = {
    reverse : function(latitude, longitude) {
    var api_key = '9b9f26f31d314ceaafa2d5da727d1273';

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    
    if (request.status === 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      if (data.results[0].components.hasOwnProperty('town') === true)
      {
        weather.getWeather(data.results[0].components.town);
      }
      else if (data.results[0].components.hasOwnProperty('city') === true)
      {
          weather.getWeather(data.results[0].components.city);
      }


    } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error
                           
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
    },
    //gets the user's location
    getLocation : function() {
        function success(data) {
            geoLocation.reverse(data.coords.latitude, data.coords.longitude);
        }

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error); 
        }
        else {
            console.log('entered3');
            //start user at default location
            weather.getWeather("Moscow");
        }
    }
}
//make the search bar work
document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

//make enter key work when in search bar
document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

geoLocation.getLocation();
