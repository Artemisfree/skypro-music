import fetchMock from 'jest-fetch-mock'
import {
	getAllTracks,
	getTrackById,
	addTrackToFavorites,
	registerUser,
	cacheData,
	getCachedData,
} from './api'

fetchMock.enableMocks()

beforeEach(() => {
	fetchMock.resetMocks()
	localStorage.clear()
})

describe('API Functions', () => {
	describe('getAllTracks', () => {
		it('should return cached data if available', async () => {
			const cachedData = [{ id: 1, name: 'Track 1' }]
			localStorage.setItem(
				'allTracks',
				JSON.stringify({ data: cachedData, expiration: Date.now() + 3600000 })
			)

			const data = await getAllTracks()
			expect(data).toEqual(cachedData)
		})

		it('should fetch data if no cached data available', async () => {
			const tracks = [{ id: 1, name: 'Track 1' }]
			fetchMock.mockResponseOnce(JSON.stringify(tracks))

			const data = await getAllTracks()
			expect(data).toEqual(tracks)
		})
	})

	describe('getTrackById', () => {
		it('should return track data by ID', async () => {
			const track = { id: 1, name: 'Track 1' }
			fetchMock.mockResponseOnce(JSON.stringify(track))

			const data = await getTrackById(1)
			expect(data).toEqual(track)
		})
	})

	describe('addTrackToFavorites', () => {
		it('should add track to favorites', async () => {
			const track = { id: 1, name: 'Track 1' }
			fetchMock.mockResponseOnce(JSON.stringify(track))

			const data = await addTrackToFavorites(1, 'accessToken', 'refreshToken')
			expect(data).toEqual(track)
		})
	})

	describe('registerUser', () => {
		it('should register a new user', async () => {
			const user = { email: 'test@example.com', username: 'testuser' }
			fetchMock.mockResponseOnce(JSON.stringify(user))

			const data = await registerUser(
				'test@example.com',
				'password',
				'testuser'
			)
			expect(data).toEqual(user)
		})
	})
})

describe('Caching Functions', () => {
	it('should cache data with expiration', () => {
		const key = 'testKey'
		const data = { test: 'data' }
		cacheData(key, data)

		const cached = getCachedData(key)
		expect(cached).toEqual(data)
	})

	it('should return null for expired cache', () => {
		const key = 'testKey'
		const data = { test: 'data' }
		localStorage.setItem(
			key,
			JSON.stringify({ data, expiration: Date.now() - 1000 })
		)

		const cached = getCachedData(key)
		expect(cached).toBeNull()
	})
})
