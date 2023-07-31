const URL = 'http://api.weatherapi.com/v1'
const KEY = '544e535e35644ffeb4c93434232107'
const IP_KEY = '68b0fd85539e4558b75a061381a881ce'
const city = ''
const weekLongNameDays = [
	'Воскресенье',
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота'
]
const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
]
const weekShortNameDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const getWeekDay = (date, arr) => {
	return arr[date.getDay()]
}
const getMonth = (date, arr) => {
	return arr[date.getMonth()]
}

const date = new Date()
const weekday = getWeekDay(date, weekLongNameDays)
const month = getMonth(date, months)
const [day, , year] = date.toLocaleDateString().split('.')

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

async function getRequest(...[type, city, days, ipAddress]) {
	try {
		const { data } = await axios(
			`${URL}/${type}.json?key=${KEY}&q=${city}&days=${days}&lang=ru`
		)
		return data
	} catch (error) {
		console.error(error)
	}
}

// types = ip, current, forecast

const render = async () => {
	const ip = await getIpAddress(IP_KEY)
	//get city by ipAddress
	const { city } = await getRequest('ip', ip)
	// get current cities weather forecast
	// const todayWeatherForecast = await getRequest('current', city)
	// console.log('current day forecast', todayWeatherForecast)
	// get forecast for several days
	// const severalDaysForecast = await getRequest('forecast', city, 5)
	// console.log('Several days forecast', severalDaysForecast)
}

render()
