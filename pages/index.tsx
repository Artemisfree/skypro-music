import React from 'react'
import Playlist from '@/app/components/Playlist/Playlist'
import App from '@/app/components/Main/Main'

const HomePage: React.FC = () => {
	return (
		<App title='Треки'>
			<Playlist />
		</App>
	)
}

export default HomePage
