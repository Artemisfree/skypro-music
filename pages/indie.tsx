import React from 'react'
import App from '@/app/components/Main/Main'
import IndiePlaylist from '@/app/components/Playlist/Indie'

const IndiePage: React.FC = () => {
	return (
		<App title='Инди-заряд'>
			<IndiePlaylist />
		</App>
	)
}

export default IndiePage
