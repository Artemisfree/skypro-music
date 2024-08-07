import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Volume from './Volume'

describe('Volume Component', () => {
	const mockOnVolumeChange = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('renders correctly', () => {
		const { getByRole } = render(
			<Volume volume={0.5} onVolumeChange={mockOnVolumeChange} />
		)

		expect(getByRole('slider')).toBeInTheDocument()
	})

	test('displays the correct initial volume', () => {
		const { getByRole } = render(
			<Volume volume={0.5} onVolumeChange={mockOnVolumeChange} />
		)

		const volumeSlider = getByRole('slider')
		expect(volumeSlider).toHaveValue('0.5')
	})

	test('calls onVolumeChange when the volume is changed', () => {
		const { getByRole } = render(
			<Volume volume={0.5} onVolumeChange={mockOnVolumeChange} />
		)

		const volumeSlider = getByRole('slider')
		fireEvent.change(volumeSlider, { target: { value: '0.7' } })

		expect(mockOnVolumeChange).toHaveBeenCalled()
		expect(mockOnVolumeChange).toHaveBeenCalledWith(expect.any(Object))
	})
})
