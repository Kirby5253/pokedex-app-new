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
		var $listItem = $('<li class="list-group-item"></li>');
		$pokemonList.append($listItem);

		var $button = $(
			'<button class="btn btn-light pokemon-name pokemonSelectorButton" data-toggle="modal" data-target="#modal-container">' +
				pokemon.name +
				'</button>'
		);
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
		var $modalBody = $('.modal-body');

		//Add pokemon's name to the title of modal
		$('#pokemon-name').text(pokemon.name);

		//Add pokemon's height and weight with breaks between for style
		$modalBody.html(
			'Height:' +
				pokemon.height / 10 +
				' meters' +
				'<br/><br/>' +
				'Weight: ' +
				(0.22 * pokemon.weight).toFixed(2) +
				' pounds'
		);

		//Add pokemon's picture to the body
		var $modalPicture = $('<img class="pokemon-picture"/>');
		$modalPicture.attr('src', pokemon.imageUrl);
		$modalBody.append($modalPicture);
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		showModal: showModal,
		loadList: loadList,
		loadDetails: loadDetails
	};
})();

pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
