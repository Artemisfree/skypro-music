import React from 'react'
import styles from './Volume.module.css'

const Volume = () => {
	return (
		<div className={styles.bar__volume_block}>
			<div className={styles.volume__content}>
				<div className={styles.volume__image}>
					<svg className={styles.volume__svg}>
						<use xlinkHref='/img/icon/sprite.svg#icon-volume'></use>
					</svg>
				</div>
				<div className={styles.volume__progress}>
					<input
						className={styles.volume__progress_line}
						type='range'
						name='range'
					/>
				</div>
			</div>
		</div>
	)
}

export default Volume
