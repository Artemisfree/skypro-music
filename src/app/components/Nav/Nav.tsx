'use client';

import React, { useState, MouseEvent } from 'react'
import Image from 'next/image'
import styles from './Nav.module.css'

const Nav: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState<boolean>(false)

	const toggleMenu = (event: MouseEvent<HTMLDivElement>): void => {
		setMenuOpen(!menuOpen)
	}

	return (
		<nav className={styles.main__nav}>
			<div className={styles.nav__logo}>
				<Image
					className={styles.logo__image}
					src='/img/logo.png'
					alt='Logo'
					width={113}
					height={17}
				/>
			</div>
			<div className={styles.nav__burger} onClick={toggleMenu}>
				<span className={styles.burger__line}></span>
				<span className={styles.burger__line}></span>
				<span className={styles.burger__line}></span>
			</div>
			{menuOpen ? (
				<div className={`${styles.nav__menu} ${styles.nav__menu_open}`}>
					<ul className={styles.menu__list}>
						<li className={styles.menu__item}>
							<a href='#' className={styles.menu__link}>
								Главное
							</a>
						</li>
						<li className={styles.menu__item}>
							<a href='#' className={styles.menu__link}>
								Мой плейлист
							</a>
						</li>
						<li className={styles.menu__item}>
							<a href='../signin.html' className={styles.menu__link}>
								Войти
							</a>
						</li>
					</ul>
				</div>
			) : null}
		</nav>
	)
}

export default Nav
