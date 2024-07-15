import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import '../src/app/globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
	subsets: ['cyrillic', 'latin'],
	weight: ['400', '500', '600', '700'],
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<div className={`wrapper ${montserrat.className}`}>
				<Component {...pageProps} />
			</div>
		</Provider>
	)
}

export default MyApp
