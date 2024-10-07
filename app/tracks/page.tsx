import React from 'react'
import Playlist from '@/components/Playlist/Playlist'
import { getAllTracks } from '../../api/api'
import Filter from '@/components/Filter/Filter'

const TracksPage: React.FC = async () => {
    const title = 'Треки'

    const response = await getAllTracks()

	return (
		<>
			<h2 className='centerblock__h2'>{title}</h2>
			<Filter />
			<Playlist playlistId={undefined} tracks={response.data} />
		</>
	)
}

export default TracksPage
