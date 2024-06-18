import React from 'react'
import styles from './Playlist.module.css'

const Playlist = () => {
	return (
		<div className={styles.centerblock__content}>
			<div className={styles.content__title}>
				<div className={styles.col01}>Трек</div>
				<div className={styles.col02}>Исполнитель</div>
				<div className={styles.col03}>Альбом</div>
				<div className={styles.col04}>
					<svg className={styles.playlist_title__svg}>
						<use xlinkHref='img/icon/sprite.svg#icon-watch'></use>
					</svg>
				</div>
			</div>
			<div className={styles.content__playlist}>
				<div className={styles.playlist__item}>
					<div className={styles.playlist__track}>
						<div className={styles.track__title}>
							<div className={styles.track__title_image}>
								<svg className={styles.track__title_svg}>
									<use xlinkHref='img/icon/sprite.svg#icon-note'></use>
								</svg>
							</div>
							<div className={styles.track__title_text}>
								<a className={styles.track__title_link} href='http://'>
									Guilt <span className={styles.track__title_span}></span>
								</a>
							</div>
						</div>
						<div className={styles.track__author}>
							<a className={styles.track__author_link} href='http://'>
								Nero
							</a>
						</div>
						<div className={styles.track__album}>
							<a className={styles.track__album_link} href='http://'>
								Welcome Reality
							</a>
						</div>
						<div className={styles.track__time}>
							<svg className={styles.track__time_svg}>
								<use xlinkHref='img/icon/sprite.svg#icon-like'></use>
							</svg>
							<span className={styles.track__time_text}>4:44</span>
						</div>
					</div>
					<div className={styles.playlist__track}>
						<div className={styles.track__title}>
							<div className={styles.track__title_image}>
								<svg className={styles.track__title_svg}>
									<use xlinkHref='img/icon/sprite.svg#icon-note'></use>
								</svg>
							</div>
							<div className={styles.track__title_text}>
								<a className={styles.track__title_link} href='http://'>
									Elektro <span className={styles.track__title_span}></span>
								</a>
							</div>
						</div>
						<div className={styles.track__author}>
							<a className={styles.track__author_link} href='http://'>
								Dynoro, Outwork, Mr. Gee
							</a>
						</div>
						<div className={styles.track__album}>
							<a className={styles.track__album_link} href='http://'>
								Elektro
							</a>
						</div>
						<div className={styles.track__time}>
							<svg className={styles.track__time_svg}>
								<use xlinkHref='img/icon/sprite.svg#icon-like'></use>
							</svg>
							<span className={styles.track__time_text}>2:22</span>
						</div>
					</div>
					<div className={styles.playlist__track}>
						<div className={styles.track__title}>
							<div className={styles.track__title_image}>
								<svg className={styles.track__title_svg}>
									<use xlinkHref='img/icon/sprite.svg#icon-note'></use>
								</svg>
							</div>
							<div className={styles.track__title_text}>
								<a className={styles.track__title_link} href='http://'>
									I’m Fire <span className={styles.track__title_span}></span>
								</a>
							</div>
						</div>
						<div className={styles.track__author}>
							<a className={styles.track__author_link} href='http://'>
								Ali Bakgor
							</a>
						</div>
						<div className={styles.track__album}>
							<a className={styles.track__album_link} href='http://'>
								I’m Fire
							</a>
						</div>
						<div className={styles.track__time}>
							<svg className={styles.track__time_svg}>
								<use xlinkHref='img/icon/sprite.svg#icon-like'></use>
							</svg>
							<span className={styles.track__time_text}>2:22</span>
						</div>
					</div>
					<div className={styles.playlist__track}>
						<div className={styles.track__title}>
							<div className={styles.track__title_image}>
								<svg className={styles.track__title_svg}>
									<use xlinkHref='img/icon/sprite.svg#icon-note'></use>
								</svg>
							</div>
							<div className={styles.track__title_text}>
								<a className={styles.track__title_link} href='http://'>
									Non Stop <span className={styles.track__title_span}></span>
								</a>
							</div>
						</div>
						<div className={styles.track__author}>
							<a className={styles.track__author_link} href='http://'>
								Стоункат, Psychopath
							</a>
						</div>
						<div className={styles.track__album}>
							<a className={styles.track__album_link} href='http://'>
								Non Stop
							</a>
						</div>
						<div className={styles.track__time}>
							<svg className={styles.track__time_svg}>
								<use xlinkHref='img/icon/sprite.svg#icon-like'></use>
							</svg>
							<span className={styles.track__time_text}>4:12</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Playlist
