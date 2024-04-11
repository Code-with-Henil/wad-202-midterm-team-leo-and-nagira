const WEATHER_API_KEY = '7580fc23fe1e90bf9284522f40ed7c07';
const FavoriteList = [];

init();

function init(){
    document.getElementById('star').addEventListener("click", handleLikeButton, false);
    document.getElementById('favorite-cities').addEventListener("change", handleChangeCity, false);
    document.getElementById('search').addEventListener("input", (e) => { const city = e.target.value; weatherData(city) });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition);
    } else {
        handlePosition({ coords: { latitude: 49.2578181, longitude: -123.2064763 } });
    }
}

function handlePosition(position) {
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
}

async function weatherData(city) {
    markStar(false);
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${WEATHER_API_KEY}`;

    try {
        const res = await fetch(url);
        if(!res.ok) {
            console.log("Response Error");
            return;
        }

        const data = await res.json();
        const cityName = document.getElementById('city-name');
        cityName.innerText = city;
        displayWeather(data)
    }
    catch(error) {
        console.error("Fetch Error:", error);
    }
}

function displayWeather(data) {
    const CELSIUS_TEMP = '°C'
    const PERCENT = '%'
    const PRESSURE = 'ATM'
    const cityNameElem = document.getElementById('city-name');
    const cityTempElem = document.getElementById('city-temp');
    const weatherCard = document.querySelector('.weather-card')

    const cityTemp = data.main.temp;
    const condition = data.weather[0].main;
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const cityTempObj = document.getElementById('city-temp');
    cityTempObj.innerText = `${cityTemp} ${CELSIUS_TEMP}`
    
    const details = `
    <div class="weather-details">
        <p>${condition}</p>
        <img src="${iconUrl}" alt="${condition}" />
    </div>
    `

    cityNameElem.textContent = data.name;
    cityTempElem.textContent = `${cityTemp} ${CELSIUS_TEMP}`
    weatherCard.innerHTML = details;

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
        weatherCard.appendChild(pElement);
    }
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

