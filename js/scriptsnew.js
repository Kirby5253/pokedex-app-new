var pokemonRepository = (function() {
	var pokemonArray = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	var $pokemonList = $('.pokemon-list');
	var $modalContainer = $('#modal-container');

	function add(pokemon) {
		pokemonArray.push(pokemon);
	}

	function getAll() {
		return pokemonArray;
	}

	function addListItem(pokemon) {
		var $listItem = $('<li></li>');
		$pokemonList.append($listItem);

		var $button = $('<button class="pokemon-name pokemonSelectorButton">' + pokemon.name + '</button>');
		$listItem.append($button);

		$button.click(function() {
			showDetails(pokemon);
		});
	}

	function loadList() {
		return $.ajax(apiUrl, {
			dataType: 'json',
			success: function(responseJSON) {
				responseJSON.results.forEach(function(item) {
					var pokemon = {
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
			}
		}).fail(function(e) {
			console.error(e);
		});
	}

	function loadDetails(pokemon) {
		var url = pokemon.detailsUrl;
		return $.ajax(url, {
			dataType: 'json'
		})
			.then(function(responseJSON) {
				return responseJSON;
			})
			.then(function(details) {
				pokemon.imageUrl = details.sprites.front_default;
				pokemon.height = details.height;
				pokemon.weight = details.weight;
			})
			.catch(function(e) {
				console.error(e);
			});
	}

	function showDetails(pokemon) {
		pokemonRepository
			.loadDetails(pokemon)
			.then(function() {
				return pokemon;
			})
			.then(function(pokemon) {
				showModal(pokemon);
			})
			.catch(function(e) {
				console.error(e);
			});
	}

	function showModal(pokemon) {
		$modalContainer.html('');

		var $modalBox = $('<div class="modal-box"></div>');
		$modalContainer.append($modalBox);

		var $modal = $('<div class="modal"></div>');
		$modalBox.append($modal);

		var $modalName = $('<h1 class="pokemon-name">' + pokemon.name + '</h1>');
		$('.modal').append($modalName);

		var $modalPicture = $('<img class="pokemon-picture"/>');
		$modalPicture.attr('src', pokemon.imageUrl);

		var $modalHeight = $('<p>Height: ' + pokemon.height / 10 + ' meters</p>');

		var $modalWeight = $('<p>Weight: ' + (0.22 * pokemon.weight).toFixed(2) + ' pounds</p>');

		// Closes modal with close button
		var $closeButtonElement = $('<button class="modal-close">&times;</button>');
		$($closeButtonElement).click(function() {
			hideModal();
		});

		$modal.append($closeButtonElement);
		$modal.append($modalName);
		$modal.append($modalPicture);
		$modal.append($modalHeight);
		$modal.append($modalWeight);

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
	$modalContainer.on('click', (e) => {
		// Since this is also triggered when clicking INSIDE the modal container,
		// We only want to close if the user clicks directly on the overlay
		var target = e.target;
		if (target === $modalContainer) {
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
