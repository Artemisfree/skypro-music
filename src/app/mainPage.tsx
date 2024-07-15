'use client'

import React from 'react'
import './globals.css'
import { Montserrat } from 'next/font/google'
import {
	CurrentTrackProvider
} from '@/contexts/CurrentTrackProvider'
import { Bar } from './components/Bar/Bar'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import Main from './components/Main/Main'

const montserrat = Montserrat({
	subsets: ['cyrillic', 'latin'],
	weight: ['400', '500', '600', '700'],
})

function App() {
	return (
		<Provider store={store}>
			<div className={`wrapper ${montserrat.className}`}>
				<div className='container'>
					<CurrentTrackProvider>
						< Main />
						<Bar />
					</CurrentTrackProvider>
					<footer className='footer'></footer>
				</div>
			</div>
		</Provider>
	)
}

export default App
