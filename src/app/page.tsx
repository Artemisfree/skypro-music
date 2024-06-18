import React from 'react'
import './globals.css'
import Nav from './components/Nav/Nav'
import Search from './components/Search/Search'
import Filter from './components/Filter/Filter'
import Sidebar from './components/Sidebar/Sidebar'
import Player from './components/Player/Player'
import Volume from './components/Volume/Volume'
import Playlist from './components/Playlist/Playlist'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
	subsets: ['cyrillic', 'latin'],
	weight: ['400', '500', '600', '700'],
})

function App() {
	return (
		<div className={`wrapper ${montserrat.className}`}>
			<div className='container'>
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
				<div className='bar'>
					<div className='bar__content'>
						<div className='bar__player-progress'></div>
						<div className='bar__player-block'>
							<Player />
							<Volume />
						</div>
					</div>
				</div>
				<footer className='footer'></footer>
			</div>
		</div>
	)
}

export default App
