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