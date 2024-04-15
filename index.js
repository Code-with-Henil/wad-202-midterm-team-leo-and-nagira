const WEATHER_API_KEY = '7580fc23fe1e90bf9284522f40ed7c07';
const MAPS_API_KEY = 'AIzaSyBRkS6cEpnprcg3umZ4cjahxJ62aO5-Dd4';
let Current_Place_Id;

init();

function init(){
    document.getElementById('star').addEventListener("click", handleLikeButton);
    document.getElementById('favorite-cities').addEventListener("change", handleChangeCity);
    document.getElementById('search').addEventListener("input", handleAutocomplete);
    document.getElementById('search').addEventListener("change", handleSearch);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition);
    } else {
        handlePosition({ coords: { latitude: 49.2578181, longitude: -123.2064763 } });
    }
    localStorage.clear();
}

function handleAutocomplete(e){
    const city = e.target.value; 
    if(city.length > 3){
        googleAutoComplete(city);
    }
}

function handleSearch(){
    let searchObj = document.getElementById('search');
    const cityName = document.getElementById('city-name');
    cityName.innerText = searchObj.value;
    markStar(localStorage.getItem(searchObj.value) != undefined);
        
    let citiesList = Array.from(document.getElementById('cities-list').children);
    var optionObj = citiesList.find((x)=> x.value == searchObj.value);
    if(optionObj == null){
        if(citiesList.length == 0)
            setTimeout(()=>{
            manageSearch(Array.from(document.getElementById('cities-list').children)[0].id);
            },500);
        else
            manageSearch(citiesList[0].id);
    } else
        manageSearch(optionObj.id);
}

async function manageSearch(place_id, lat, lon){
    Current_Place_Id = place_id;
    let detailData = place_id == null ? null : await getPlaceGoogleDetails(place_id);
    let latitude = place_id ? detailData.result.geometry.location.lat : lat;
    let longitude = place_id ? detailData.result.geometry.location.lng : lon;
    let weatherData = await getAPIweatherData(latitude, longitude);
    let daysForecastData = await getAPIdaysForecase(latitude, longitude);
    console.log(detailData);
    console.log(weatherData);
    displayWeather(detailData, weatherData);
    displayDailyForecast(daysForecastData);
}

function handlePosition(position) {
    manageSearch(null, position.coords.latitude, position.coords.longitude);
}

async function getPlaceGoogleDetails(placeId){
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${MAPS_API_KEY}`;

    try {
        const res = await fetch(url);
        if(!res.ok) {
            console.log("Response Error");
            return;
        }

        return await res.json();
    }
    catch(error) {
        console.error("Fetch Error:", error);
    }
}

async function loadGoogleImage(referenceId){
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${referenceId}&key=${MAPS_API_KEY}`;
    try {
        const res = await fetch(url);
        if(!res.ok) {
            console.log("Response Error");
            return;
        }

        const data = await res.blob();
        console.log(data);
        let imageUrl = URL.createObjectURL(data);
        document.getElementById("").src = imageUrl;
    }
    catch(error) {
        console.error("loadGoogleImage Error:", error);
    }
}

async function googleAutoComplete(input){
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?fields=name&input=${input}&language=en&types=%28cities%29&key=${MAPS_API_KEY}`;

    try {
        const res = await fetch(url);
        if(!res.ok) {
            console.log("Response Error");
            return;
        }

        const data = await res.json();

        let datalistObj = document.getElementById('cities-list');
        datalistObj.childNodes = new Array();
        for(let pred of data.predictions){
            let option = document.createElement('option');
            option.innerText = pred.description;
            option.value = pred.description;
            option.id = pred.place_id;
            datalistObj.appendChild(option);
        }

    }
    catch(error) {
        console.error("googleAutoComplete Error:", error);
    }
}

async function getAPIweatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;

    try {
        const res = await fetch(url);
        if(!res.ok) {
            console.log("Response Error");
            return;
        }

        return await res.json();
    }
    catch(error) {
        console.error("Fetch Error:", error);
    }
}

function displayWeather(detailData, weatherData) {
    const CELSIUS_TEMP = '°C'
    const PERCENT = '%'
    const PRESSURE = 'ATM'
    const cityNameElem = document.getElementById('city-name');
    const cityTempElem = document.getElementById('city-temp');
    const weatherCard = document.querySelector('.weather-card')

    const cityTemp = weatherData.main.temp;
    const condition = weatherData.weather[0].main;
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const cityTempObj = document.getElementById('city-temp');
    cityTempObj.innerText = `${cityTemp} ${CELSIUS_TEMP}`
    
    const details = `
    <div class="weather-details">
        <p>${condition}</p>
        <img src="${iconUrl}" alt="${condition}" />
    </div>
    `

    if(cityNameElem.textContent == '')
        cityNameElem.textContent = weatherData.name;
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
        const pElement = document.createElement('p');
        const bElement = document.createElement('b');
        bElement.innerText = stat.replace('_',' ') + ' :';
        pElement.innerText = `${weatherData.main[stat]} ${statList[stat]}`;
        pElement.insertBefore(bElement, pElement.firstChild);
        weatherCard.appendChild(pElement);
    }
}


function handleChangeCity(){
    let favoriteSelect = document.getElementById('favorite-cities');
    const cityName = document.getElementById('city-name');
    cityName.innerText = favoriteSelect.value;
    let cityObj = localStorage.getItem(favoriteSelect.value);
    markStar(true);
    manageSearch(cityObj);
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
    localStorage.removeItem(cityName);
    Array.from(favoriteSelect.children).find((x) => x.innerText === cityName).remove();
    favoriteSelect.selectedIndex = 0;
    markStar(false);
}

function addCity(cityName){
    let favoriteSelect = document.getElementById('favorite-cities');
    if(localStorage.getItem(cityName) == undefined){
        localStorage.setItem(cityName, Current_Place_Id);
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
    if(localStorage.getItem(cityName) == undefined)
        addCity(cityName);
    else
        removeCity(cityName);
}

async function getAPIdaysForecase(lat, lon) {
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.log("Response Error");
            return;
        }
        
        return await res.json();
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}


function displayDailyForecast(weatherDaysData) {
    const CELSIUS_TEMP = '°C'

    const forecastElem = document.getElementById('daily-forecast');
    forecastElem.innerHTML = ''; 

    const today = new Date();
    const todayIndex = today.getDay();

    for (let i = 0; i < 5; i++) {
        const day = weatherDaysData.list[i];
        if (day && day.weather && day.weather.length > 0 && day.main) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayOfWeek = date.toLocaleDateString('en-Us', {weekday: 'long'});
            const weatherIcon = day.weather[0].icon;
            const weekIcon = `http://openweathermap.org/img/w/${weatherIcon}.png`;
            const description = day.weather[0].description;
            const maxTemp = day.main.temp_max;
            const minTemp = day.main.temp_min;

            const dayElem = document.createElement(`div`);
            dayElem.classList.add('day-card');

            dayElem.innerHTML = `
               <p class="day-of-week">${dayOfWeek}</p>
               <img src="${weekIcon}" alt="${description}">
               <p> ${description}</p>
               <p>Max: ${maxTemp} ${CELSIUS_TEMP} / Min: ${minTemp} ${CELSIUS_TEMP}</p>
            `;

            forecastElem.appendChild(dayElem);
        }
    }
}