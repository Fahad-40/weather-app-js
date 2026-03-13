
let cityInput = document.querySelector(".cityInput");
let searchBtn = document.querySelector(".searchBtn");
let notFoundSection = document.querySelector(".notFound");
let searchCitySection = document.querySelector(".searchCity");
let weatherInfoSection = document.querySelector(".weatherInfo");

//getting values
let contryName = document.querySelector(".contryName");
let currentDateText = document.querySelector(".current-date-text");
let tempTxt = document.querySelector(".temp-txt");
let conditionTxt = document.querySelector(".condition-txt");
let humidityValue = document.querySelector(".humidity-value-text");
let WindSpeed = document.querySelector(".WindSpeed");
let feelsLikeTxt = document.querySelector(".feelsLike-txt")
//geeting img
let weatherSummaryImg = document.querySelector(".weather-summary-img");

//FOR FORCAST ITEMS
let forecastItemContainer = document.querySelector(".forecast-item-container");


// SEARCHING ON ICON
searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        console.log(cityInput.value);
        cityInput.value = "";
    }
});

// SEARCHING ON PRESSIMNG ENTER
cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && cityInput.value.trim() != "") {
        console.log(cityInput.value);
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
    }
})

// FETCH DATA FROM API (GETTING RESPONSE)
async function fetchWeatherData(endPoint, cityName) {
    let apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${cityName}&appid=${apiKey}&units=metric`

    let apiResponse = await fetch(apiURL);
    return apiResponse.json();
}

//cheching ID for weather ICON
function getWeatherIcon(id) {
    if (id <= 232) return "thunderstorm.svg";
    if (id <= 321) return "drizzle.svg";
    if (id <= 531) return "rain.svg";
    if (id <= 622) return "snow.svg";
    if (id <= 781) return "atmosphere.svg";
    if (id <= 800) return "clear.svg";
    else return "clouds.svg"
}

//making function for current date
function getCurrentDate() {
    let currentDate = new Date();
    let options = {
        weekday: "short",
        day: "2-digit",
        month: "short"
    }
    return currentDate.toLocaleDateString("en-US", options)
}

//UPDATING INFO  CURRENT DAY
async function updateWeatherInfo(city) {
    let weatherData = await fetchWeatherData("weather", city);
    console.log(weatherData);

    // NOT FOUND PAGE DISPLAY
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    //updating values in html 
    contryName.innerText = weatherData.name;
    tempTxt.innerText = Math.round(weatherData.main.temp) + "°C";
    humidityValue.innerText = weatherData.main.humidity + "%";
    conditionTxt.innerText = weatherData.weather[0].main; //in main object there is cloudy , rainy etc
    WindSpeed.innerText = weatherData.wind.speed + " m/s"; //in main object there is cloudy , rainy etc
    feelsLikeTxt.innerHTML = "Feels Like "+ Math.round(weatherData.main.feels_like) + `<span> &deg;</span>`;
    let id = weatherData.weather[0].id; //getting value for icon

    //updating image
    weatherSummaryImg.src = `Asstes/weather/${getWeatherIcon(id)}`;

    //updating date
    currentDateText.innerText = getCurrentDate();

    //updating forecast info (extra days)
    await UpdateforecastInfo(city);

    // FOUND PAGE DISPLAY
    showDisplaySection(weatherInfoSection);

    
}
//UPDATING INFO OTHER FOUR DAYS
async function UpdateforecastInfo(cityInput) {
    let forecastData = await fetchWeatherData("forecast", cityInput);
    console.log(forecastData);

    let timeTaken = "12:00:00"
    let todayDate = new Date().toISOString().split("T")[0]
forecastItemContainer.innerHTML = ""
    forecastData.list.forEach(forecastData => {
        if (forecastData.dt_txt.includes(timeTaken) && !forecastData.dt_txt.includes(todayDate)) {
            UpdateforecastItems(forecastData);
        }
    })


    console.log(todayDate);
}
function UpdateforecastItems(forecastData) {
    console.log('forecastData: ', forecastData);
    let {
        dt_txt: date,
        weather: [{ id }],
        main: { temp },
    } = forecastData;

    //date
    let dateTaken = new Date(date);

let dateOption = {
    day : "2-digit",
    month : "short"
}
let dateResult = dateTaken.toLocaleDateString("en-US" , dateOption);
    let forecastItem = `
                <div class="forecastItem">
                        <h5 class="forecast-item-date regularText">${dateResult}</h5>
                        <img src="Asstes/weather/${getWeatherIcon(id)}" class="forecast-item-image alt="" srcset="">
                        <h5 class=" forecast-item-temp">${Math.round(temp)} <span>&#8451;</span></h5>
                    </div>
    `

    forecastItemContainer.insertAdjacentHTML("beforeend", forecastItem);

}

// CONTROLLING DISPLAY SECTIONS
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = "none");

    section.style.display = "block";

}

