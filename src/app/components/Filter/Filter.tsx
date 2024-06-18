import React from 'react'
import styles from './Filter.module.css'

const Filter = () => {
	return (
		<div className={styles.centerblock__filter}>
			<div className={styles.filter__title}>Искать по:</div>
			<div className={`${styles.filter__button} ${styles.button_author}`}>
				исполнителю
			</div>
			<div className={`${styles.filter__button} ${styles.button_year}`}>
				году выпуска
			</div>
			<div className={`${styles.filter__button} ${styles.button_genre}`}>
				жанру
			</div>
		</div>
	)
}

export default Filter
