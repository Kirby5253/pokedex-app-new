// IIFE
var pokemonRepository = (function() {
	// Create initial empty array for Pokedex app
	var pokemonArray = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	var modalContainer = document.querySelector('#modal-container');

	// Create function to add new pokemon
	function add(pokemon) {
		return pokemonArray.push(pokemon);
	}

	// Create function to list current pokemon
	function getAll() {
		return pokemonArray;
	}

	function addListItem(pokemon) {
		var indexList = document.querySelector('.pokemon-list');

		// Create an li element for each pokemon
		var listItem = document.createElement('li');

		// Create a button for each pokemon
		var button = document.createElement('button');

		// Adds pokemon names to buttons
		button.innerText = pokemon.name;

		//Add class to the button element
		button.classList.add('pokemonSelectorButton');
		button.classList.add('pokemon-name');

		// Appends button to the list item
		listItem.appendChild(button);

		// Appends the list item to the list
		indexList.appendChild(listItem);

		// Adds event to show details in console of each button
		button.addEventListener('click', function(event) {
			showDetails(pokemon);
		});
	}

	// Function to load pokemon list from API
	function loadList() {
		return fetch(apiUrl)
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				json.results.forEach(function(item) {
					var pokemon = {
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
			})
			.catch(function(e) {
				console.error(e);
			});
	}

	function loadDetails(pokemon) {
		var url = pokemon.detailsUrl;
		return fetch(url)
			.then(function(response) {
				return response.json(); //This returns a promise
			})
			.then(function(details) {
				// Now we add the details to the item
				pokemon.imageUrl = details.sprites.front_default;
				pokemon.height = details.height;
				pokemon.weight = details.weight;
			})
			.catch(function(e) {
				console.error(e);
			});
	}

	// Add functionality to button click
	function showModal(pokemon) {
		modalContainer.innerHTML = '';

		var modal = document.createElement('div');
		modal.classList.add('modal');

		var modalName = document.createElement('h1');
		modalName.classList.add('pokemon-name');
		modalName.innerText = pokemon.name;

		var modalPicture = document.createElement('img');
		modalPicture.src = pokemon.imageUrl;
		modalPicture.classList.add = 'pokemon-picture';

		var modalHeight = document.createElement('p');
		var height = pokemon.height;
		modalHeight.innerText = 'Height: ' + height / 10 + ' meters';

		var modalWeight = document.createElement('p');
		modalWeight.innerText = 'Weight: ' + (0.22 * pokemon.weight).toFixed(2) + ' pounds';

		// Closes modal with close button
		var closeButtonElement = document.createElement('button');
		closeButtonElement.classList.add('modal-close');
		closeButtonElement.innerText = 'Close';
		closeButtonElement.addEventListener('click', hideModal);

		modal.appendChild(closeButtonElement);
		modal.appendChild(modalName);
		modal.appendChild(modalPicture);
		modal.appendChild(modalHeight);
		modal.appendChild(modalWeight);
		modalContainer.appendChild(modal);

		modalContainer.classList.add('is-visible');
	}

	function hideModal() {
		modalContainer.classList.remove('is-visible');
	}

	//Allows modal to be closed on escape key
	window.addEventListener('keydown', (e) => {
		var modalContainer = document.querySelector('#modal-container');
		if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
			hideModal();
		}
	});

	//Allows modal to be closed on clicking div
	modalContainer.addEventListener('click', (e) => {
		// Since this is also triggered when clicking INSIDE the modal
		// We only want to close if the user clicks directly on the overlay
		var target = e.target;
		if (target === modalContainer) {
			hideModal();
		}
	});

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		showModal: showModal,
		loadList: loadList,
		loadDetails: loadDetails,
		hideModal: hideModal
	};
})();

// Creates list of pokemon with their name on button
pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});

function showDetails(pokemon) {
	pokemonRepository.loadDetails(pokemon).then(function() {
		pokemonRepository.showModal(pokemon);
	});
}

pokemonRepository.getAll();
