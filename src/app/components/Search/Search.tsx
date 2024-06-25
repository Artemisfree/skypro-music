import React from 'react'
import styles from './Search.module.css'


const Search: React.FC = () => {
	return (
		<div className={styles.centerblock__search}>
			<svg className={styles.search__svg}>
				<use xlinkHref='img/icon/sprite.svg#icon-search'></use>
			</svg>
			<input
				className={styles.search__text}
				type='search'
				placeholder='Поиск'
				name='search'
			/>
		</div>
	)
}

export default Search;