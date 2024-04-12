
// 3 hour - range //}
        // Function to create hour cards
        function createHourCards(data) {
            console.log("hey");
            const hourRangeSection = document.getElementById('hourRangeSection');

            // Add a card for each hour in the range
            for (let j = 0; j < data.length; j++) {
                const hourCard = document.createElement('div');
                hourCard.classList.add('hour-card');

                const time = data[j].time;
                const temp = data[j].temp;
                const condition = data[j].condition;

                const cardTime = document.createElement('p');
                const cardTemp = document.createElement('p');
                const cardCondition = document.createElement('p');

                cardTime.textContent = time;
                cardTemp.textContent = `${temp}°C`;
                cardCondition.textContent = condition;

                hourCard.appendChild(cardTime);
                hourCard.appendChild(cardTemp);
                hourCard.appendChild(cardCondition);

                hourRangeSection.appendChild(hourCard);
            }
        }

        // Fetch the data from the provided JSON
        const data = [
            {
              "time": "2023-03-14 12:00:00",
              "temp": 10.5,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 15:00:00",
              "temp": 11.2,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 18:00:00",
              "temp": 12.1,
              "condition": "Rain"
            },
            {
              "time": "2023-03-14 12:00:00",
              "temp": 10.5,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 15:00:00",
              "temp": 11.2,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 18:00:00",
              "temp": 12.1,
              "condition": "Rain"
            },
            {
              "time": "2023-03-14 12:00:00",
              "temp": 10.5,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 15:00:00",
              "temp": 11.2,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 18:00:00",
              "temp": 12.1,
              "condition": "Rain"
            },
            {
              "time": "2023-03-14 12:00:00",
              "temp": 10.5,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 15:00:00",
              "temp": 11.2,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 18:00:00",
              "temp": 12.1,
              "condition": "Rain"
            },
            {
              "time": "2023-03-14 12:00:00",
              "temp": 10.5,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 15:00:00",
              "temp": 11.2,
              "condition": "Clouds"
            },
            {
              "time": "2023-03-14 18:00:00",
              "temp": 12.1,
              "condition": "Rain"
            }
          ]

        // Call the function with the data
        createHourCards(data);
        

