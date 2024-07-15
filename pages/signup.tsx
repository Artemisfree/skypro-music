import { useState } from 'react'
import { useRouter } from 'next/router'
import { registerUser } from '@/app/api'
import styles from './signup.module.css'
import Image from 'next/image'

export default function SignUp() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [username, setUsername] = useState('')
	const [error, setError] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError('Пароли не совпадают');
			return;
		}

		try {
			await registerUser(email, password, username)
			router.push('/signin')
		} catch (err) {
			if (err instanceof Error) {
				setError('Ошибка регистрации: ' + err.message)
			} else {
				setError('Ошибка регистрации: Попробуйте снова позже')
			}
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.containerSignup}>
				<div className={styles.modalBlock}>
					<form className={styles.modalFormLogin} onSubmit={handleSubmit}>
						<a href='/'>
							<div className={styles.modalLogo}>
								<Image
									src='/img/logo_modal.png'
									alt='logo'
									width={140}
									height={21}
								/>
							</div>
						</a>
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
							type='text'
							name='username'
							placeholder='Имя пользователя'
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
						<input
							className={`${styles.modalInput} ${styles.passwordFirst}`}
							type='password'
							name='password'
							placeholder='Пароль'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<input
							className={`${styles.modalInput} ${styles.passwordDouble}`}
							type='password'
							name='confirmPassword'
							placeholder='Повторите пароль'
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
						/>
						{error && <p className={styles.error}>{error}</p>}
						<button className={styles.modalBtnSignupEnt} type='submit'>
							Зарегистрироваться
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
