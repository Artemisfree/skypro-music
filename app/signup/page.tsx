'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './signup.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { register } from '@/store/features/authSlice'

const SignUp = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [username, setUsername] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()
	const dispatch = useDispatch<AppDispatch>()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (isSubmitting) {
			console.log('Форма отправляется, пожалуйста подождите')
			return
		}

		setIsSubmitting(true)

		if (password !== confirmPassword) {
			setError('Пароли не совпадают')
			setIsSubmitting(false)
			return
		}

		try {
			await dispatch(register({ email, password, username })).unwrap()
			router.push('/signin')
		} catch (err) {
			if (err instanceof Error) {
				let errorMsg = 'Попробуйте снова позже'
				try {
					const parsedError = JSON.parse(err.message.split(': ')[1])
					if (parsedError && typeof parsedError === 'object') {
						errorMsg = Object.values(parsedError).flat().join(' ')
					}
				} catch (parseError) {}
				setError('Ошибка регистрации: ' + errorMsg)
			} else {
				setError('Ошибка регистрации: Попробуйте снова позже')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form className={styles.modalFormLogin} onSubmit={handleSubmit}>
			<Link href='/'>
				<div className={styles.modalLogo}>
					<Image
						src='/img/logo_modal.png'
						alt='logo'
						width={140}
						height={21}
					/>
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
	)
}

export default SignUp
