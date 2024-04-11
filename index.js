const textInput = document.getElementById('search');
const cityNameElem = document.getElementById('city-name');
const cityTempElem = document.getElementById('city-temp');
const weatherCard = document.querySelector('.weather-card')

textInput.addEventListener("input", (e) => {
    const city = e.target.value;
    weatherData(city)
});

async function weatherData(city) {
    const apiKey = 'e976593d6b7656dacbb71907dd812af8'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;


    try {
        const res = await fetch(url);
        if(!res.ok) {
            console.log("Response Error");
            return;
        }

        const data = await res.json();
        displayWeather(data)
    }
    catch(error) {
        console.error("Fetch Error:", error);
    }
}

function displayWeather(data) {

    const cityTemp = Math.round(data.main.temp - 273.15)
    const condition = data.weather[0].main;
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    
    const details = `
    <div class="weather-details">
        <p>${condition}</p>
        <img src="${iconUrl}" alt="${condition}" />
    </div>
    `
    

    cityNameElem.textContent = data.name;
    cityTempElem.textContent = `${cityTemp} °C`
    weatherCard.innerHTML = details;

}
const WEATHER_API_KEY = '7580fc23fe1e90bf9284522f40ed7c07';
const CELSIUS_TEMP = '°C'
const PERCENT = '%'
const PRESSURE = 'ATM'

const FavoriteList = [];

init();

function init(){
    document.getElementById('star').addEventListener("click", handleLikeButton, false);
    document.getElementById('favorite-cities').addEventListener("change", handleChangeCity, false);
    //fillSearchData();
}

function handleChangeCity(){
    let favoriteSelect = document.getElementById('favorite-cities');
    const cityName = document.getElementById('city-name');
    cityName.innerText = favoriteSelect.value;
    markStar(true);
}

function markStar(status){
    let imgObj = document.getElementById('star').children[0];
    if(status)
        imgObj.src = "StarMarked.svg";
    else
        imgObj.src = "StarEmpty.svg";
}

function removeCity(cityName){
    let favoriteSelect = document.getElementById('favorite-cities');
    FavoriteList.splice(FavoriteList.indexOf(cityName),1);
    Array.from(favoriteSelect.children).find((x) => x.innerText === cityName).remove();
    favoriteSelect.selectedIndex = 0;
    markStar(false);
}

function addCity(cityName){
    let favoriteSelect = document.getElementById('favorite-cities');
    if(FavoriteList.indexOf(cityName) == -1){
        FavoriteList.push(cityName);
        let favoriteOption = document.createElement('option');
        favoriteOption.value = cityName;
        favoriteOption.innerText = cityName;
        favoriteSelect.appendChild(favoriteOption);
    }
    favoriteSelect.value = cityName;
    markStar(true);
}

function handleLikeButton(){
    const cityName = document.getElementById('city-name').innerText;
    if(FavoriteList.indexOf(cityName) == -1)
        addCity(cityName);
    else
        removeCity(cityName);
}

function searchCurrentWeatherByLatLon(lat, lon){
    return fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`)
    .then( async (response)=>{
        return await response.json();
    });
}

async function fillSearchData(){
    const currentWeather = document.getElementById('currentWeather');
    let data = await searchCurrentWeatherByLatLon(49.2029498,-122.9176569);
    console.log(data);
    const cityName = document.getElementById('city-name');
    const cityTemp = document.getElementById('city-temp');
    cityTemp.innerText = `${data.main.temp} ${CELSIUS_TEMP}`
    let statList = {
        feels_like: CELSIUS_TEMP,
        humidity:  PERCENT,
        pressure:  PRESSURE,
        temp_max:  CELSIUS_TEMP,
        temp_min:  CELSIUS_TEMP
    };
    for(let stat in statList){
        console.log(stat);
        const pElement = document.createElement('p');
        const bElement = document.createElement('b');
        bElement.innerText = stat.replace('_',' ') + ' :';
        pElement.innerText = `${data.main[stat]} ${statList[stat]}`;
        pElement.insertBefore(bElement, pElement.firstChild);
        currentWeather.appendChild(pElement);
    }
}
