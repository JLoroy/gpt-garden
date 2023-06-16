// DOM References
const timeDisplay = document.getElementById('time-display');
const fundsDisplay = document.getElementById('funds-display');
const gardenContainer = document.getElementById('garden-container');
const vegetableListContainer = document.getElementById('vegetable-list-container');

// Game Variables
let funds = 10;
let time = new Date(2023, 2, 21, 6, 0, 0, 0); // Starting time: 21st of March at 6AM
let tiles = Array(25).fill(null);
let won = false;

let selectedVegetable = null;
let selectedVegElement = null;

// Data for the vegetables
const vegetables = [
    {name: 'Potato', cost: 1, revenue: 7, growthTime: 475},
    {name: 'Tomato', cost: 2, revenue: 14, growthTime: 950},
    {name: 'Onion', cost: 4, revenue: 28, growthTime: 1900},
    {name: 'Carrot', cost: 8, revenue: 56, growthTime: 3800},
    {name: 'Corn', cost: 16, revenue: 112, growthTime: 7600},
    {name: 'Broccoli', cost: 32, revenue: 224, growthTime: 15200},
    {name: 'Artichoke', cost: 64, revenue: 448, growthTime: 30400},
    {name: 'Pineapple', cost: 128, revenue: 896, growthTime: 60800}
  ];
  const daylightTimes = [
    {month: 'January', sunrise: 7.33, sunset: 16.83},
    {month: 'February', sunrise: 6.83, sunset: 17.5},
    {month: 'March', sunrise: 6.17, sunset: 18.17},
    {month: 'April', sunrise: 6.33, sunset: 19.5},
    {month: 'May', sunrise: 5.67, sunset: 20},
    {month: 'June', sunrise: 5.5, sunset: 20.5},
    {month: 'July', sunrise: 5.67, sunset: 20.5},
    {month: 'August', sunrise: 6, sunset: 19.83},
    {month: 'September', sunrise: 6.5, sunset: 19},
    {month: 'October', sunrise: 7, sunset: 18.17},
    {month: 'November', sunrise: 6.5, sunset: 16.83},
    {month: 'December', sunrise: 7.17, sunset: 16.5},
];
  
function selectVegetable(vegetable, vegElement) {
    if (funds >= vegetable.cost) {
      if (selectedVegElement) {
        selectedVegElement.classList.remove('selected');
      }
      selectedVegetable = vegetable;
      selectedVegElement = vegElement;
      selectedVegElement.classList.add('selected');
    } else {
      alert('Not enough funds to buy this seed!');
    }
}

// Handle clicking on a garden tile
function handleClickOnTile(index) {
    if (tiles[index] === null && selectedVegetable !== null) {
      // Plant the selected vegetable
      plantSeed(index, selectedVegetable);
    } else if (tiles[index] !== null && tiles[index].remainingTime <= 0) {
      // Harvest the grown vegetable
      harvestVegetable(index);
    }
}
  
  // Plant a seed in a garden tile
function plantSeed(index, vegetable) {
    if (funds >= vegetable.cost) {
        tiles[index] = {
        vegetable: vegetable,
        remainingTime: vegetable.growthTime,
        };
        funds -= vegetable.cost;
        updateFundsDisplay();
    } else {
        alert('Not enough funds to buy this seed!');
    }
}
  
  // Harvest a grown vegetable from a garden tile
function harvestVegetable(index) {
    funds += tiles[index].vegetable.revenue;
    tiles[index] = null;
    updateFundsDisplay();
    let gardenTile = gardenContainer.children[index];
    gardenTile.textContent = '';
    gardenTile.classList.remove('ready-to-harvest');
    
    gardenTile.style.backgroundImage = ``;
}

// Initialize the game
function initializeGame() {

  renderVegetableList();

  // Initialize garden tiles
  for(let i = 0; i < 25; i++) {
    let tile = document.createElement('div');
    tile.classList.add('garden-tile');
    tile.addEventListener('click', () => handleClickOnTile(i));
    gardenContainer.appendChild(tile);
  }

  // Update displays
  updateTimeDisplay();
  updateFundsDisplay();

  // Start the game loop
  setInterval(gameLoop, 100);
}

function renderVegetableList() {
    vegetableListContainer.innerHTML = '';
    vegetables.forEach(veg => {
        const vegElement = document.createElement('div');
        vegElement.classList.add('vegetable');

        const vegName = document.createElement('p');
        vegName.textContent = veg.name;
        //vegElement.appendChild(vegName);

        const vegImage = document.createElement('img');
        vegImage.src = `${veg.name.toLowerCase()}.png`;
        vegImage.alt = veg.name;
        vegElement.appendChild(vegImage);

        vegElement.addEventListener('click', () => selectVegetable(veg, vegElement));
        vegetableListContainer.appendChild(vegElement);
    });
}

  

  
  

// Game Loop (runs every 0.1 seconds)
function gameLoop() {
  // Update game time
  time.setMinutes(time.getMinutes() + 24); // Add 24 minutes to the time
  updateTimeDisplay();
  // Check if it's day or night
  const currentHour = time.getHours() + time.getMinutes()/60;
  const {sunrise, sunset} = daylightTimes[time.getMonth()];
  const isDay = currentHour >= sunrise && currentHour < sunset;
  document.body.className = isDay ? 'day-mode' : 'night-mode';

  // Update vegetables
  tiles.forEach((tile, index) => {
    if (tile && tile.remainingTime > 0) {
      if (isDay) { // Decrease remaining time only during daylight hours
        tile.remainingTime -= 24;
        if (tile.remainingTime <= 0) {
          tile.remainingTime = 0
          // Vegetable is ready to harvest
          let gardenTile = gardenContainer.children[index];
          gardenTile.classList.add('ready-to-harvest');
        }
      }
      // Update tile display
      let gardenTile = gardenContainer.children[index];
      gardenTile.textContent = tile.remainingTime + ' min';
      gardenTile.style.backgroundImage = `url('${tile.vegetable.name.toLowerCase()}.png')`;
    }
  });

  // Check if game is won
  if (funds >= 1000 && won == false) {
    alert('Congratulations! You have won the game on '+timeDisplay.textContent);
    won = true;
  }
}


// Update the time display
function updateTimeDisplay() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;  // Convert 24-hour format to 12-hour format and ensure 0 is shown as 12
    const formattedMinutes = minutes.toString().padStart(2, '0');
    timeDisplay.textContent = `${time.getDate()} ${monthNames[time.getMonth()]}, ${formattedHour}:${formattedMinutes}${ampm}`;
  }

// Update the funds display
function updateFundsDisplay() {
  fundsDisplay.textContent = funds;
}

// Call the initialization function when the page loads
window.onload = initializeGame;
