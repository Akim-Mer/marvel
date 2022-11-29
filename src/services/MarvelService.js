class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=3b3132d0a728b9feaaaf88d92a5c2ec1'; 
	_baseOffset = 210;
	getResource = async (url) => {
		let res = await fetch(url);
		if(!res.ok) {
			throw new Error(`Error fetch ${url}`);
		}

		return await res.json();
	}

	

	//Получение всех персонажей с API с лимитом 9
	getAllCharacters = async(offset = this._baseOffset) => { 
		const response = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
		return response.data.results.map(this._transformCharacter);

	}

	//Полчучение одного персонажа
	getCharacter = async (id) => { 
		const response = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
		return this._transformCharacter(response.data.results[0]);
	}

	//Трансформация приходящийх данных с сервера
	_transformCharacter = (char) => {
		function fullDescr (char) {
			if(char.description === '') {
				return "See the full description on the character's page!"
			}
		}

		return {
			id: char.id,
			name: char.name,
			description: fullDescr(char),
			thumbnail:char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage:char.urls[0].url,//urls это [] c 2 объектами
			wiki: char.urls[1].url,
			comics: char.comics.items,
		}
	}

}

export default MarvelService;