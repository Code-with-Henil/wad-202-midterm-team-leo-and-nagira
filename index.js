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


    try
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
// 3 hour - range //}

const WEATHER_API_KEY = '7580fc23fe1e90bf9284522f40ed7c07';
const hourRangeSection = document.querySelector('.hour-range');
    fetch(url)
        .then(response => response.json())
        .then(data => {
        
            const rangeCard = document.createElement('div');
            rangeCard.classList.add('range-card');

            const startTime = data.list[0].dt_txt;
            const rangeHeader = document.createElement('h7');
            rangeHeader.classList.add('range-header');
            rangeHeader.textContent = startTime;
            rangeCard.appendChild(rangeHeader);

            // Add a card for each hour in the range
            for (let j = 0; j < 3; j++) {
                const hourCard = document.createElement('div');
                hourCard.classList.add('hour-card');

                const time = data.list[j].dt_txt;
                const temp = data.list[j].main.temp;
                const condition = data.list[j].weather[0].main;

                const cardTime = document.createElement('p');
                const cardTemp = document.createElement('p');
                const cardCondition = document.createElement('p');


                cardTime.textContent = time;
                cardTemp.textContent = `${temp}°C`;
                cardCondition.textContent = condition;

                hourCard.appendChild(cardTime);
                hourCard.appendChild(cardTemp);
                hourCard.appendChild(cardCondition);

                rangeCard.appendChild(hourCard);
            }

            hourRangeSection.appendChild(rangeCard);
        })
        .catch(error => console.error(error));
