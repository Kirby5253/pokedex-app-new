var pokemonRepository = (function() {
	var pokemonArray = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	var $pokemonList = $('.pokemon-list');
	var $modalContainer = $('#modalContainer');

	function add(pokemon) {
		pokemonArray.push(pokemon);
	}

	function getAll() {
		return pokemonArray;
	}

	function addListItem(pokemon) {
		var $listItem = $('<li></li>');
		$pokemonList.append($listItem);

		var $button = $('<button class="pokemon-name pokemonSelectorButton">' + pokemon.name + '</button>')
		$listItem.append($button);

		$button.click(function() {
			showDetails(pokemon);
			console.log(showDetails(pokemon));
		});
	}

	function loadList() {
		return $.ajax(apiUrl, { dataType: 'json' })
			.then(function(responseJSON) {
				responseJSON.results.forEach(function(item) {
					var pokemon = {
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
			})
			.fail(function(e) {
				console.error(e);
			});
	}

	function loadDetails(pokemon) {
		var url = pokemon.detailsUrl;
		$.ajax(apiUrl, { dataType: 'json' })
			.then(function(details) {
				// Now we add the details to the item
				pokemon.imageUrl = details.sprites.front_default;
				pokemon.height = details.height;
				pokemon.weight = details.weight;
			})
			.fail(function(e) {
				console.error(e);
			});
	}

	function showDetails(pokemon) {
		pokemonRepository.loadDetails(pokemon).then(function() {
			console.log(pokemon);
			return pokemon;
		}).then(function(pokemon){
			showModal(pokemon);
		});
	}

	function showModal(pokemon) {
		$modalContainer.html('');

		var $modal = $('<div class="modal"></div>');

		var $modalName = $('<h1 class="pokemon-name">' + pokemon.name + '</h1>');

		var $modalPicture = $('<img class="pokemon-picture>');
		$modalPicture.src = pokemon.imageUrl;

		var $modalHeight = $('<p>Height: ' + pokemon.height / 10 + ' meters</p>');

		var $modalWeight = $('<p>Weight: ' + (0.22 * pokemon.weight).toFixed(2) + ' pounds</p>');

		// Closes modal with close button
		var $closeButtonElement = '<button class="modal-close">Close</button>';
		$closeButtonElement.on('click', function() {
			hideModal;
		});

		$modal.append($closeButtonElement);
		$modal.append($modalName);
		$modal.append($modalPicture);
		$modal.append($modalHeight);
		$modal.append($modalWeight);
		$modalContainer.append($modal);

		$modalContainer.addClass('is-visible');
	}

	function hideModal() {
		$modalContainer.removeClass('is-visible');
	}

	//Allows modal to be closed on escape key
	$(window).keydown(function(e) {
		if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
			hideModal();
		}
	});

	//Allows modal to be closed on clicking div
	$modalContainer.click(function(e) {
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

pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});


