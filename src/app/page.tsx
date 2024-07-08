'use client'

import React from 'react'
import './globals.css'
import Nav from './components/Nav/Nav'
import Search from './components/Search/Search'
import Filter from './components/Filter/Filter'
import Sidebar from './components/Sidebar/Sidebar'
import Playlist from './components/Playlist/Playlist'
import { Montserrat } from 'next/font/google'
import {
	CurrentTrackProvider,
	useCurrentTrack,
} from '@/contexts/CurrentTrackProvider'
import { Bar } from './components/Bar/Bar'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

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
						<main className='main'>
							<Nav />
							<div className='main__centerblock centerblock'>
								<Search />
								<h2 className='centerblock__h2'>Треки</h2>
								<Filter />
								<Playlist />
							</div>
							<Sidebar />
						</main>
						<Bar />
					</CurrentTrackProvider>
					<footer className='footer'></footer>
				</div>
			</div>
		</Provider>
	)
}

export default App
