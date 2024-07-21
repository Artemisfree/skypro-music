'use client'
import React from 'react'
import Nav from '../Nav/Nav'
import Search from '../Search/Search'
import Filter from '../Filter/Filter'
import Sidebar from '../Sidebar/Sidebar'
import '../../globals.css'
// import { Montserrat } from 'next/font/google'
import { CurrentTrackProvider } from '@/contexts/CurrentTrackProvider'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import Bar from '../Bar/Bar'

// const montserrat = Montserrat({
// 	subsets: ['cyrillic', 'latin'],
// 	weight: ['400', '500', '600', '700'],
// })

function App({ children, title }) {
	return (
		<Provider store={store}>
			{/* <div className={`wrapper ${montserrat.className}`}> */}
				<div className='container'>
					<CurrentTrackProvider>
						<main className='main'>
							<Nav />
							<div className='main__centerblock centerblock'>
								<Search />
								<h2 className='centerblock__h2'>{title}</h2>
								<Filter />
								{children}
							</div>
							<Sidebar />
						</main>
						<Bar />
					</CurrentTrackProvider>
					<footer className='footer'></footer>
				</div>
			{/* </div> */}
		</Provider>
	)
}

export default App
