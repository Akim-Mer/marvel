import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


class CharList extends Component {
	state = {
		charList: [],
		loading: true,
        error: false,
		newItemLoading : false,
		offset : 210,
		charEnded : false
	}

	marvelService = new MarvelService();

	componentDidMount() {
        this.onRequest(); // потсавляется offset=210
    }

	
	//onRequest отвечает за запрос на сервер 
	onRequest = (offset) => {
        this.onLoadingMore ();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

	onLoadingMore = () => { // onCharListLoading - в видео
		this.setState({
            newItemLoading: true
        })
	}

	onCharListLoaded = (newCharList) => { //Дозагрузка доп. персонажей
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}
        this.setState(({offset,charList}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}) )
    }

	

	onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

	renderItems(arr) { //arr = charList: []
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            //Генерация списка героев
            return (
                <li 
                    className="char__item"
                    key={item.id}
					onClick = {() => this.props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
	render(){
		const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
		const listHero = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? listHero  : null;

		return (
			<div className="char__list">
				{errorMessage}
                {spinner}
                {content}
				<button  className="button button__main button__long" 
					disabled = {newItemLoading}
					style= {{'display': charEnded ? 'none': 'block'}}
					onClick = {() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func
}

export default CharList;