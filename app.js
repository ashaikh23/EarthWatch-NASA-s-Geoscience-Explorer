document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'Nd0mhcLJRT0j0odfuLZPL0af48EBiMHlRlPgGcKa';
    const neoWsBaseUrl = 'https://api.nasa.gov/neo/rest/v1';
    const epicBaseUrl = 'https://api.nasa.gov/EPIC/api';

    const apodContainer = document.getElementById('apod-container');
    const neowsContainer = document.getElementById('neows-container');
    const neowsInfo = document.getElementById('neows-info');
    const neowsCount = document.getElementById('neows-count');
    const neowsClosest = document.getElementById('neows-closest');
    const neowsTableBody = document.querySelector('#neows-table tbody'); // Get the table body

    // Function to fetch NeoWs data
    function fetchNeoWsData(startDate, endDate) {
        fetch(`${neoWsBaseUrl}/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                // Update the DOM with NeoWs data
                neowsInfo.innerHTML = ''; // Clear previous content

                const neoCount = data.element_count;
                const closestNeo = data.near_earth_objects[startDate][0]; // Assuming the first NEO is the closest

                neowsCount.textContent = `Total Near Earth Objects: ${neoCount}`;
                neowsClosest.textContent = `Closest Object: ${closestNeo.name}`;

                // Populate the NEOs table
                neowsTableBody.innerHTML = ''; // Clear previous content
                data.near_earth_objects[startDate].forEach((neo) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${neo.name}</td>
                        <td>${neo.estimated_diameter.meters.estimated_diameter_max}</td>
                        <td>${neo.close_approach_data[0].close_approach_date}</td>
                    `;
                    neowsTableBody.appendChild(row);
                });

                // Display NeoWs container
                neowsContainer.style.display = 'block';
            })
            .catch((error) => console.error(error));
    }

    // Function to handle the search button click
    function handleSearch() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        fetchNeoWsData(startDate, endDate);
    }

    // Function to fetch and display APOD data
    function fetchAPOD() {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                // Update the DOM with the APOD data
                const image = document.createElement('img');
                image.src = data.url;
                image.alt = data.title;
                const title = document.createElement('h2');
                title.textContent = data.title;
                const explanation = document.createElement('p');
                explanation.textContent = data.explanation;

                apodContainer.innerHTML = ''; // Clear previous content
                apodContainer.appendChild(image);
                apodContainer.appendChild(title);
                apodContainer.appendChild(explanation);
            })
            .catch((error) => console.error(error));
    }

    fetchAPOD();

    // Call the function to fetch and display NeoWs data with default dates
    const currentDate = new Date();
    const sevenDaysLater = new Date(currentDate);
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const defaultStartDate = currentDate.toISOString().split('T')[0];
    const defaultEndDate = sevenDaysLater.toISOString().split('T')[0];
    fetchNeoWsData(defaultStartDate, defaultEndDate);

    // Add event listener for the search button
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', handleSearch);

    // Call the function to fetch and display EPIC data
    // fetchEPICData();

});
