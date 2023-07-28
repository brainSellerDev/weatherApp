const URL = 'http://api.weatherapi.com/v1'
const KEY = '544e535e35644ffeb4c93434232107'
const IP_KEY = '68b0fd85539e4558b75a061381a881ce'

const getIpAddress = async key => {
	try {
		const { data } = await axios(
			`https://api.ipgeolocation.io/getip?apiKey=${key}`
		)
		return data.ip
	} catch (error) {
		console.error(error)
	}
}

async function getRequest(...[url, type, key, city, days, ipAddress]) {
	try {
		const { data } = await axios(
			`${url}/${type}.json?key=${key}&q=${city}&days=${days}&lang=ru`
		)
		return data
	} catch (error) {
		console.error(error)
	}
}

// types = ip, current, forecast

const render = async () => {
	const ip = await getIpAddress(IP_KEY)
	const { city } = await getRequest(URL, 'ip', KEY, ip)
	const todayWeatherForecast = await getRequest(URL,  'current', KEY, city)
	console.log('current', todayWeatherForecast)
    const forecast = await getRequest(URL,  'forecast', KEY, city, 5 )
	console.log('forecast',forecast)
}

render()
