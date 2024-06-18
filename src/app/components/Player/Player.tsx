import React from 'react'
import styles from './Player.module.css'

const Player = () => {
	return (
		<div className={styles.bar__player}>
			<div className={styles.player__controls}>
				<div className={styles.player__btn_prev}>
					<svg className={styles.player__btn_prev_svg}>
						<use xlinkHref='/img/icon/sprite.svg#icon-prev'></use>
					</svg>
				</div>
				<div className={`${styles.player__btn_play} _btn`}>
					<svg className={styles.player__btn_play_svg}>
						<use xlinkHref='/img/icon/sprite.svg#icon-play'></use>
					</svg>
				</div>
				<div className={styles.player__btn_next}>
					<svg className={styles.player__btn_next_svg}>
						<use xlinkHref='/img/icon/sprite.svg#icon-next'></use>
					</svg>
				</div>
				<div className={`${styles.player__btn_repeat} _btn-icon`}>
					<svg className={styles.player__btn_repeat_svg}>
						<use xlinkHref='img/icon/sprite.svg#icon-repeat'></use>
					</svg>
				</div>
				<div className={`${styles.player__btn_shuffle} _btn-icon`}>
					<svg className={styles.player__btn_shuffle_svg}>
						<use xlinkHref='img/icon/sprite.svg#icon-shuffle'></use>
					</svg>
				</div>
			</div>

			<div className={styles.player__track_play}>
				<div className={styles.track_play__contain}>
					<div className={styles.track_play__image}>
						<svg className={styles.track_play__svg}>
							<use xlinkHref='/img/icon/sprite.svg#icon-note'></use>
						</svg>
					</div>
					<div className={styles.track_play__author}>
						<a className={styles.track_play__author_link} href='http://'>
							Ты та...
						</a>
					</div>
					<div className={styles.track_play__album}>
						<a className={styles.track_play__album_link} href='http://'>
							Баста
						</a>
					</div>
				</div>

				<div className={styles.track_play__like_dis}>
					<div className={`${styles.track_play__like} _btn-icon`}>
						<svg className={styles.track_play__like_svg}>
							<use xlinkHref='/img/icon/sprite.svg#icon-like'></use>
						</svg>
					</div>
					<div className={`${styles.track_play__dislike} _btn-icon`}>
						<svg className={styles.track_play__dislike_svg}>
							<use xlinkHref='/img/icon/sprite.svg#icon-dislike'></use>
						</svg>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Player
