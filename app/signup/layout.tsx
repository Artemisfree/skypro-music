'use client'

import React from 'react'
import styles from './signup.module.css'

const SignupLayout = ({ children }) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.containerSignup}>
				<div className={styles.modalBlock}>{children}</div>
			</div>
		</div>
	)
}

export default SignupLayout
