export interface Track {
	id: number
	name: string
	author: string
	album: string
	duration_in_seconds: number
	track_file: string
	isLiked: boolean
	collection: 'playlist' | 'favorites'
}
