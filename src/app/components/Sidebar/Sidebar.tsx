import React, { useEffect } from 'react'
import Image from 'next/image'
import styles from './Sidebar.module.css'
import { logoutUser } from '@/app/api'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/features/authSlice'
import { RootState } from '@/store/store'

const Sidebar: React.FC = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const username =
		useSelector((state: RootState) => state.auth.username) ||
		localStorage.getItem('username')
	
	useEffect(() => {
	}, [username])


	const handleLogout = async () => {
		try {
			await logoutUser()
			dispatch(logout())
			localStorage.removeItem('username')
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
						<a className={styles.sidebar__link} href='#'>
							<Image
								className={styles.sidebar__img}
								src='/img/playlist01.png'
								alt="day's playlist"
								width={250}
								height={170}
								priority
							/>
						</a>
					</div>
					<div className={styles.sidebar__item}>
						<a className={styles.sidebar__link} href='#'>
							<Image
								className={styles.sidebar__img}
								src='/img/playlist02.png'
								alt="day's playlist"
								width={250}
								height={170}
							/>
						</a>
					</div>
					<div className={styles.sidebar__item}>
						<a className={styles.sidebar__link} href='#'>
							<Image
								className={styles.sidebar__img}
								src='/img/playlist03.png'
								alt="day's playlist"
								width={250}
								height={170}
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
