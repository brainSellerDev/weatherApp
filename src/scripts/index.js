const URL = 'http://api.weatherapi.com/v1'
const KEY = '544e535e35644ffeb4c93434232107'
const IP_KEY = '68b0fd85539e4558b75a061381a881ce'
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
	'Января',
	'Февраля',
	'Марта',
	'Апреля',
	'Мая',
	'Июня',
	'Июля',
	'Августа',
	'Сентября',
	'Октября',
	'Ноября',
	'Декабря'
]
const weekShortNameDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
let ip = ''
//App left side 
const currentCity = document.querySelector('.weather-app-left-aside-geolocation-info__city')
const weekDay = document.querySelector('.weather-app-left-aside__title') 
const currentDate = document.querySelector('.weather-app-left-aside__date')
const weatherForecastIcon = document.querySelector('.weather-app-left-aside-current-day-forecast__icon')
const weatherTemperature = document.querySelector('.weather-app-left-aside-current-day-forecast__temperature')
const weatherCondition = document.querySelector('.weather-app-left-aside-current-day-forecast__condition')
// App right side 
const precipitationValue = document.querySelector('.precipitation-value')
const humidityValue = document.querySelector('.humidity-value')
const windValue = document.querySelector('.wind-value')

const date = new Date()
weekDay.innerHTML = getWeekDay(date, weekLongNameDays)
const month = getMonth(date, months)
const [day, , year] = date.toLocaleDateString().split('.')
currentDate.innerHTML = `${day} ${month} ${year}`

function getWeekDay (date, arr) {
	return arr[date.getDay()]
}

function getMonth(date, arr){
	return arr[date.getMonth()]
}

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
	ip = await getIpAddress(IP_KEY)
	//get city by ipAddress
	const {city} = await getRequest('ip', ip)
	currentCity.innerHTML = city
	// get current cities weather forecast
	const todayWeatherForecast = await getRequest('current', city)
	console.log('current day forecast', todayWeatherForecast)
	weatherForecastIcon.style.backgroundImage = `url(${todayWeatherForecast?.current?.condition?.icon})`
	weatherTemperature.innerHTML = `${todayWeatherForecast?.current?.temp_c} °C`
	weatherCondition.innerHTML = todayWeatherForecast?.current?.condition?.text
	precipitationValue.innerHTML = `${todayWeatherForecast?.current?.precip_in} %`
	humidityValue.innerHTML = `${todayWeatherForecast?.current?.humidity} %`
	windValue.innerHTML = `${todayWeatherForecast?.current?.wind_kph} km/h`
	// get forecast for several days
	// const severalDaysForecast = await getRequest('forecast', city, 5)
	// console.log('Several days forecast', severalDaysForecast)
}

render()
