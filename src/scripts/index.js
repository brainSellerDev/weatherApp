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
let city = ''
let todayWeatherForecast = {}
let severalDaysForecastInfo = []

const loader = document.querySelector('.loader')
let isLoad = false

//App left side
const currentCity = document.querySelector(
	'.weather-app-left-aside-geolocation-info__city'
)
const weekDay = document.querySelector('.weather-app-left-aside__title')
const currentDate = document.querySelector('.weather-app-left-aside__date')
const forecastTime = document.querySelector('.weather-app-left-aside__time')

const weatherForecastIcon = document.querySelector(
	'.weather-app-left-aside-current-day-forecast__icon'
)
const weatherTemperature = document.querySelector(
	'.weather-app-left-aside-current-day-forecast__temperature'
)
const weatherCondition = document.querySelector(
	'.weather-app-left-aside-current-day-forecast__condition'
)
// App right side
const precipitationValue = document.querySelector('.precipitation-value')
const humidityValue = document.querySelector('.humidity-value')
const windValue = document.querySelector('.wind-value')
const weatherSeveralDaysForecast = document.querySelector(
	'.weather-app-right-aside-several-days-forecast'
)
const changeLocationBtn = document.querySelector(
	'.weather-app-right-aside-button'
)
// popup
const popup = document.querySelector('.popup')
const changeLocationField = document.querySelector('.popup__search')
const popupChangeBtn = document.querySelector('.popup__btn')

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
	city = event.target.value
})

popupChangeBtn.addEventListener('click', async => {
	if (city.length) {
		clearText()
		render(city)
		changeLocationField.value = ''
	}
})

function checkLoading(){
	if (isLoad) {
		loader.style.display = 'flex'
	}else{
		loader.style.display = 'none'
	}
}

function clearText() {
	currentCity.innerHTML = ''
}

// Date&time&weekDay info
const date = new Date()
weekDay.innerHTML = getWeekDay(date, weekLongNameDays)
const month = getMonth(date, months)
const [day, , year] = date.toLocaleDateString().split('.')
const time = date.toLocaleTimeString().split(':').splice(0, 2).join(':')
currentDate.innerHTML = `${day} ${month} ${year} `
forecastTime.innerHTML = time

function getWeekDay(date, arr) {
	return arr[date.getDay()]
}

function getMonth(date, arr) {
	return arr[date.getMonth()]
}

const getIpAddress = async key => {
	try {
		isLoad = true
		checkLoading()
		const { data } = await axios(
			`https://api.ipgeolocation.io/getip?apiKey=${key}`
		)
		return data.ip
	} catch (error) {
		console.error(error)
	}
	finally{
		isLoad = false
		checkLoading()
	}
}

async function getRequest(...[type, city, days, ipAddress]) {
	try {
		isLoad = true
		checkLoading()
		const { data } = await axios(
			`${URL}/${type}.json?key=${KEY}&q=${city}&days=${days}&lang=ru`
		)
		return data
	} catch (error) {
		console.error(error)
	}
	finally{
		isLoad = false
		checkLoading()
	}
}

const setTemplate = (key, arr) => {
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

// types = ip, current, forecast

const render = async currentCityValue => {
	if (currentCityValue) {
		currentCity.innerHTML = currentCityValue
		todayWeatherForecast = await getRequest('current', currentCityValue)
		weatherSeveralDaysForecast.innerHTML = ''
		const { forecast } = await getRequest('forecast', currentCityValue, 6)
		severalDaysForecastInfo = [...forecast.forecastday]
	} else {
		ip = await getIpAddress(IP_KEY)
		//get city by ipAddress
		const { city } = await getRequest('ip', ip)
		currentCity.innerHTML = city
		// get current cities weather forecast
		todayWeatherForecast = await getRequest('current', city)
		// get forecast for several days
		const { forecast } = await getRequest('forecast', city, 6)
		severalDaysForecastInfo = [...forecast.forecastday]
	}
	weatherForecastIcon.style.backgroundImage = `url(${todayWeatherForecast?.current?.condition?.icon})`
	weatherTemperature.innerHTML = `${todayWeatherForecast?.current?.temp_c} °C`
	weatherCondition.innerHTML = todayWeatherForecast?.current?.condition?.text
	precipitationValue.innerHTML = `${todayWeatherForecast?.current?.precip_in} %`
	humidityValue.innerHTML = `${todayWeatherForecast?.current?.humidity} %`
	windValue.innerHTML = `${todayWeatherForecast?.current?.wind_kph} km/h`
	// // console.log('Several days forecast', severalDaysForecastInfo)
	for (const [key, forecast] of Object.entries(severalDaysForecastInfo)) {
		// console.log(forecast)
		weatherSeveralDaysForecast.insertAdjacentHTML(
			'beforeend',
			setTemplate(key, forecast)
		)
	}
}

render()
