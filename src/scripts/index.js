const configData ={
	URL:'http://api.weatherapi.com/v1',
	WEATHER_API_KEY: '544e535e35644ffeb4c93434232107',
	IP_ADDRESS_KEY: '68b0fd85539e4558b75a061381a881ce'
}

const weekDays = [
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

let searchCityField = ''
let cityWeatherForecast
let todayWeatherForecast = {}
let severalDaysForecast = []
// Date&time&weekDay info
const date = new Date()
const month = months[date.getMonth()]
const [day, , year] = date.toLocaleDateString().split('.')
const time = date.toLocaleTimeString().split(':').splice(0, 2).join(':')

let loader
let currentCity
let weekDay
let currentDate
let forecastTime
let weatherForecastIcon
let weatherTemperature
let weatherCondition
let precipitationValue
let humidityValue
let windValue
let weatherSeveralDaysForecast
let changeLocationBtn
let popup
let changeLocationField
let popupChangeBtn

// let isLoad = false

function getElements() {
	loader = document.querySelector('.loader')
	//App left side
	currentCity = document.querySelector(
		'.weather-app-left-aside-geolocation-info__city'
	)
	weekDay = document.querySelector('.weather-app-left-aside__title')
	currentDate = document.querySelector('.weather-app-left-aside__date')
	forecastTime = document.querySelector('.weather-app-left-aside__time')
	weatherForecastIcon = document.querySelector(
		'.weather-app-left-aside-current-day-forecast__icon'
	)
	weatherTemperature = document.querySelector(
		'.weather-app-left-aside-current-day-forecast__temperature'
	)
	weatherCondition = document.querySelector(
		'.weather-app-left-aside-current-day-forecast__condition'
	)
	// App right side
	precipitationValue = document.querySelector('.precipitation-value')
	humidityValue = document.querySelector('.humidity-value')
	windValue = document.querySelector('.wind-value')
	weatherSeveralDaysForecast = document.querySelector(
		'.weather-app-right-aside-several-days-forecast'
	)
	changeLocationBtn = document.querySelector('.weather-app-right-aside-button')
	// popup
	popup = document.querySelector('.popup')
	changeLocationField = document.querySelector('.popup__search')
	popupChangeBtn = document.querySelector('.popup__btn')
}
getElements()

function setTemplate(key, arr) {
	return `
	<button class="weather-app-right-aside-several-days-forecast-day-btn" data-index=${key}>
	<span class="weather-app-right-aside-several-days-forecast-day-btn__icon" style="background-image:url(${
		arr?.day?.condition?.icon
	})">
	</span>
	<p class="weather-app-right-aside-several-days-forecast-day-btn__weekday">${
		arr?.date.split('-')[2]
	}</p>
	<p class="weather-app-right-aside-several-days-forecast-day-btn__temperature">${
		arr?.day?.maxtemp_c
	} °C</p>
	</button>
	`
}

function init() {
	weekDay.innerHTML = weekDays[date.getDay()]
	currentDate.innerHTML = `${day} ${month} ${year} `
	forecastTime.innerHTML = time
	currentCity.innerHTML = cityWeatherForecast
	weatherForecastIcon.style.backgroundImage = `url(${todayWeatherForecast?.current?.condition?.icon})`
	weatherTemperature.innerHTML = `${todayWeatherForecast?.current?.temp_c} °C`
	weatherCondition.innerHTML = todayWeatherForecast?.current?.condition?.text
	precipitationValue.innerHTML = `${todayWeatherForecast?.current?.precip_in} %`
	humidityValue.innerHTML = `${todayWeatherForecast?.current?.humidity} %`
	windValue.innerHTML = `${todayWeatherForecast?.current?.wind_kph} km/h`
	for (const [key, forecast] of Object.entries(severalDaysForecast)) {
		// console.log(forecast)
		weatherSeveralDaysForecast.insertAdjacentHTML(
			'beforeend',
			setTemplate(key, forecast)
		)
	}
}

//open popup
changeLocationBtn.addEventListener(
	'click',
	e => (popup.style.display = 'block')
)
//close popup
popup.addEventListener('click', e =>
	e.target.dataset.type === 'popup-close-body'
		? (popup.style.display = 'none')
		: (popup.style.display = 'block')
)

changeLocationField.addEventListener('input', event => {
	searchCityField = event.target.value
})

popupChangeBtn.addEventListener('click', async => {
	if (searchCityField.length) {
		clearText()
		render()
		changeLocationField.value = ''
	}
})

function setLoadingStatus(status) {
	return status
		? (loader.style.display = 'flex')
		: (loader.style.display = 'none')
}

function clearText() {
	currentCity.innerHTML = ''
	weatherSeveralDaysForecast.innerHTML = ''
}

async function getIpAddress() {
	return await (
		await axios(`https://api.ipgeolocation.io/getip?apiKey=${configData.IP_ADDRESS_KEY}`)
	).data
}

async function getCityByIp(ipAddress) {
	return await (
		await axios(`${configData.URL}/ip.json?q=${ipAddress}&key=${configData.WEATHER_API_KEY}&lang=ru`)
	).data
}

async function getCurrentCityForecast(city) {
	return await (
		await axios(`${configData.URL}/current.json?q=${city}&key=${configData.WEATHER_API_KEY}&lang=ru`)
	).data
}

async function getSeveralDaysForecast(city, days) {
	return await (
		await axios(
			`${configData.URL}/forecast.json?q=${city}&days=${days}&key=${configData.WEATHER_API_KEY}&lang=ru`
		)
	).data
}

async function update() {
	try {
		setLoadingStatus(true)
		const { ip } = await getIpAddress()
		const { city } = await getCityByIp(ip)
		searchCityField
			? (cityWeatherForecast = searchCityField)
			: (cityWeatherForecast = city)
		todayWeatherForecast = await getCurrentCityForecast(cityWeatherForecast)
		const { forecast } = await getSeveralDaysForecast(cityWeatherForecast, 6)
		severalDaysForecast = [...forecast.forecastday]
	} catch (e) {
		throw e
	}finally{
		setLoadingStatus(false)
	}
}

async function render() {
	await update()
	init()
}

render()
