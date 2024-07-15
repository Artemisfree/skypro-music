import React from 'react'
import Favorites from '@/app/components/Playlist/Favorites'
import App from '@/app/components/Main/Main'


const FavoritesPage: React.FC = () => {
	return (
		<App title='Избранное'>
			<Favorites />
		</App>
	)
}

export default FavoritesPage
