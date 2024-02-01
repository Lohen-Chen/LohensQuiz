document.addEventListener('DOMContentLoaded', () => {
  fetch('https://lohensquizapi.lohenchen.repl.co/getall')
    .then(response => response.json())
    .then(data => {
      data.sort((a, b) => a.time - b.time); //sorts lowest to highest
      displayTopTimes(data.slice(0, 10));
    }) //boiler plate fetch api code
    .catch(error => console.error('Error fetching data:', error));

  function displayTopTimes(topTimes) {
    const topTimesList = document.getElementById('topTimesList');

    topTimes.forEach((record, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${record.time} seconds - ${record.username}`;
      topTimesList.appendChild(listItem);
    });
  }
});

//loads upon dom finished loading
