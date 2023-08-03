interface Config {
	URL: string
	WEATHER_API_KEY: string
	IP_ADDRESS_KEY: string
}

const configData: Config = {
	URL: 'http://api.weatherapi.com/v1',
	WEATHER_API_KEY: '544e535e35644ffeb4c93434232107',
	IP_ADDRESS_KEY: '68b0fd85539e4558b75a061381a881ce'
}

const weekDays: Array<string> = [
	'Воскресенье',
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота'
]
const months: Array<string> = [
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

interface ServerData {
	[propName: string]: string
}

let ip: string
let city: string
let todayWeatherForecast: ServerData
let severalDaysForecastInfo: Array<ServerData>
// Date&time&weekDay info
const date = new Date()
const month: string = months[date.getMonth()]
const [day, , year]: Array<string> = date.toLocaleDateString().split('.')
const time: string = date.toLocaleTimeString().split(':').splice(0, 2).join(':')

// type WebElement<T> = Element | T

let loader: Element | null
let currentCity: Element | null
let weekDay: Element | null
let currentDate: Element | null
let forecastTime: Element | null
let weatherForecastIcon: Element | null
let weatherTemperature: Element | null
let weatherCondition: Element | null
let precipitationValue: Element | null
let humidityValue: Element | null
let windValue: Element | null
let weatherSeveralDaysForecast: Element | null
let changeLocationBtn: Element | null
let popup: Element | null
let changeLocationField: Element | null
let popupChangeBtn: Element | null

export function getElements(): void {
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

function init(): void {
	weekDay.innerHTML = weekLongNameDays[date.getDay()]
	currentDate.innerHTML = `${day} ${month} ${year} `
	forecastTime.innerHTML = time
	weatherForecastIcon.style.backgroundImage = `url(${todayWeatherForecast?.current?.condition?.icon})`
	weatherTemperature.innerHTML = `${todayWeatherForecast?.current?.temp_c} °C`
	weatherCondition.innerHTML = todayWeatherForecast?.current?.condition?.text
	precipitationValue.innerHTML = `${todayWeatherForecast?.current?.precip_in} %`
	humidityValue.innerHTML = `${todayWeatherForecast?.current?.humidity} %`
	windValue.innerHTML = `${todayWeatherForecast?.current?.wind_kph} km/h`
	for (const [key, forecast] of Object.entries(severalDaysForecastInfo)) {
		// console.log(forecast)
		weatherSeveralDaysForecast.insertAdjacentHTML(
			'beforeend',
			setTemplate(key, forecast)
		)
	}
}
