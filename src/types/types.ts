export interface Track {
	_id: number
	album: string
	author: string
	duration_in_seconds: number
	genre: string[]
	name: string
	release_date: string
	track_file: string
	isLiked: boolean
}
