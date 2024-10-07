'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Sidebar.module.css'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/features/authSlice'
import { RootState } from '@/store/store'
import Link from 'next/link'

const Sidebar: React.FC = () => {
	const router = useRouter()
	const dispatch = useDispatch()

	const [localUsername, setLocalUsername] = useState<string | null>(null)
	const reduxUsername = useSelector((state: RootState) => state.auth.username)

	useEffect(() => {
		const storedUsername = localStorage.getItem('username')
		if (storedUsername) {
			setLocalUsername(storedUsername)
		}
	}, [])

	const username = reduxUsername || localUsername

	const handleLogout = async () => {
		try {
			dispatch(logout())
			router.push('/signin')
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	return (
		<div className={styles.main__sidebar}>
			<div className={styles.sidebar__personal}>
				<p className={styles.sidebar__personal_name}>{username}</p>
				<div className={styles.sidebar__icon} onClick={handleLogout}>
					<svg>
						<use xlinkHref='/img/icon/sprite.svg#logout'></use>
					</svg>
				</div>
			</div>
			<div className={styles.sidebar__block}>
				<div className={styles.sidebar__list}>
					<div className={styles.sidebar__item}>
						<Link
							className={styles.sidebar__link}
							href='/tracks/categories/2'
						>
							<Image
								className={styles.sidebar__img}
								src='/img/playlist01.png'
								alt='Playlist of the day'
								width={250}
								height={170}
								priority
							/>
						</Link>
					</div>
					<div className={styles.sidebar__item}>
						<Link className={styles.sidebar__link} href='/tracks/categories/3'>
							<Image
								className={styles.sidebar__img}
								src='/img/playlist02.png'
								alt='Hits Playlist'
								width={250}
								height={170}
							/>
						</Link>
					</div>
					<div className={styles.sidebar__item}>
						<Link className={styles.sidebar__link} href='/tracks/categories/4'>
							<Image
								className={styles.sidebar__img}
								src='/img/playlist03.png'
								alt='Indie Playlist'
								width={250}
								height={170}
							/>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar

