'use client';

import React, { useState, MouseEvent } from 'react'
import Image from 'next/image'
import styles from './Nav.module.css'
import Link from 'next/link';

const Nav: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState<boolean>(false)

	const toggleMenu = (event: MouseEvent<HTMLDivElement>): void => {
		setMenuOpen(!menuOpen)
	}

	return (
		<nav className={styles.main__nav}>
			<div className={styles.nav__logo}>
				<Link href='/' className={styles.menu__link}>
					<Image
						className={styles.logo__image}
						src='/img/logo.png'
						alt='Logo'
						width={113}
						height={17}
					/>
				</Link>
			</div>
			<div
				className={styles.nav__burger}
				onClick={toggleMenu}
				role='button'
				aria-label='Toggle menu'
			>
				<span className={styles.burger__line}></span>
				<span className={styles.burger__line}></span>
				<span className={styles.burger__line}></span>
			</div>
			{menuOpen ? (
				<div className={`${styles.nav__menu} ${styles.nav__menu_open}`}>
					<ul className={styles.menu__list}>
						<li className={styles.menu__item}>
							<Link href='/' className={styles.menu__link}>
								Главное
							</Link>
						</li>
						<li className={styles.menu__item}>
							<Link href='/tracks/favorites' className={styles.menu__link}>
								Мой плейлист
							</Link>
						</li>
						<li className={styles.menu__item}>
							<Link href='/signin' className={styles.menu__link}>
								Войти
							</Link>
						</li>
					</ul>
				</div>
			) : null}
		</nav>
	)
}

export default Nav
