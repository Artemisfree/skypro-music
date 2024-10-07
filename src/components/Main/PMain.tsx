// 'use client'
// import React from 'react'
// import Nav from '../Nav/Nav'
// import Search from '../Search/Search'
// import Filter from '../Filter/Filter'
// import Sidebar from '../Sidebar/Sidebar'
// import '../../globals.css'
// import { CurrentTrackProvider } from '@/contexts/CurrentTrackProvider'
// import { Provider } from 'react-redux'
// import { store } from '@/store/store'
// import Bar from '../Bar/Bar'
// import { FilteredTracksProvider } from '@/contexts/FilteredTracksContext'

// function App({ children, title }) {
// 	return (
// 		<Provider store={store}>
// 			<FilteredTracksProvider>
// 				<div className='container'>
// 					<CurrentTrackProvider>
// 						<main className='main'>
// 							<Nav />
// 							<div className='main__centerblock centerblock'>
// 								<Search />
// 								<h2 className='centerblock__h2'>{title}</h2>
// 								<Filter />
// 								{children}
// 							</div>
// 							<Sidebar />
// 						</main>
// 						<Bar />
// 					</CurrentTrackProvider>
// 					<footer className='footer'></footer>
// 				</div>
// 			</FilteredTracksProvider>
// 		</Provider>
// 	)
// }

// export default App
