import React from 'react'
import Nav from '@/components/Nav/Nav'
import Sidebar from '@/components/Sidebar/Sidebar'
import Bar from '@/components/Bar/Bar'
import Search from '@/components/Search/Search'

const TracksLayout = ({ children, title }) => {

	return (
		<div className='container'>
			<main className='main'>
				<Nav />
				<div className='main__centerblock centerblock'>
					<Search />
					{children}
				</div>
				<Sidebar />
			</main>
			<Bar />
			<footer className='footer'></footer>
		</div>
	)
}

export default TracksLayout
