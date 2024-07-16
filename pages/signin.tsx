import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { loginUser, getToken } from '@/app/api'
import styles from './signin.module.css'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { setUser } from '@/store/features/authSlice'

export default function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()
	const dispatch = useDispatch()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const user = await loginUser(email, password)
			const tokens = await getToken(email, password)

			localStorage.setItem('accessToken', tokens.access)
			localStorage.setItem('refreshToken', tokens.refresh)
			localStorage.setItem('username', user.username)

			dispatch(setUser(user.username))

			router.push('/')
		} catch (err) {
			if (err instanceof Error) {
				let errorMsg = 'Попробуйте снова позже'
				try {
					const parsedError = JSON.parse(err.message)
					if (parsedError && typeof parsedError === 'object') {
						errorMsg = parsedError
					}
				} catch (parseError) {
				}
				setError('Ошибка авторизации: ' + errorMsg)
			} else {
				setError('Ошибка авторизации: Попробуйте снова позже')
			}
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.containerEnter}>
				<div className={styles.modalBlock}>
					<form className={styles.modalFormLogin} onSubmit={handleSubmit}>
						<Link href='/'>
							<div className={styles.modalLogo}>
								<Image src='/img/logo_modal.png' alt='logo' width={140} height={21} />
							</div>
						</Link>
						<input
							className={`${styles.modalInput} ${styles.login}`}
							type='text'
							name='login'
							placeholder='Почта'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<input
							className={styles.modalInput}
							type='password'
							name='password'
							placeholder='Пароль'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						{error && <p className={styles.error}>{error}</p>}
						<button className={styles.modalBtnEnter} type='submit'>
							Войти
						</button>
						<button className={styles.modalBtnSignup}>
							<Link href='/signup'>Зарегистрироваться</Link>
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
