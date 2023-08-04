// const axios = require('axios')

import axios from 'axios'

interface IConfig {
	URL: string
	WEATHER_API_KEY: string
	IP_ADDRESS_KEY: string
}

interface ICurrentForecast {
	current: {
		temp_c: number
		condition: {
			text: string
			icon: string
		}
		wind_kph: number
		precip_in: number
		humidity: number
	}
	day: {
		condition: {
			text: string
			icon: string
		}
		maxtemp_c: string
	}
	date: string
}

interface IServerResponse extends ICurrentForecast{
	ip:string,
	city:string,
	forecast:{
		forecastday:Array<ICurrentForecast>
	},
}
const configData: IConfig = {
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

let ip: string
let city: string
let todayWeatherForecast: ICurrentForecast
let severalDaysForecast: Array<ICurrentForecast>
let searchCityField: string
let cityWeatherForecast:string
// Date&time&weekDay info
const date = new Date()
const month: string = months[date.getMonth()]
const [day, , year]: Array<string> = date.toLocaleDateString().split('.')
const time: string = date.toLocaleTimeString().split(':').splice(0, 2).join(':')

let loader: HTMLElement
let currentCity: HTMLElement
let weekDay: HTMLElement
let currentDate: HTMLElement
let forecastTime: HTMLElement
let weatherForecastIcon: HTMLElement
let weatherTemperature: HTMLElement
let weatherCondition: HTMLElement
let precipitationValue: HTMLElement
let humidityValue: HTMLElement
let windValue: HTMLElement
let weatherSeveralDaysForecast: HTMLElement
let changeLocationBtn: HTMLElement
let popup: HTMLElement
let changeLocationField: HTMLInputElement
let popupChangeBtn: HTMLElement

function getElements(): void {
	loader = document.querySelector('.loader') as HTMLElement

	//App left side
	currentCity = document.querySelector(
		'.weather-app-left-aside-geolocation-info__city'
	) as HTMLElement
	weekDay = document.querySelector(
		'.weather-app-left-aside__title'
	) as HTMLElement
	currentDate = document.querySelector(
		'.weather-app-left-aside__date'
	) as HTMLElement
	forecastTime = document.querySelector(
		'.weather-app-left-aside__time'
	) as HTMLElement
	weatherForecastIcon = document.querySelector(
		'.weather-app-left-aside-current-day-forecast__icon'
	) as HTMLElement
	weatherTemperature = document.querySelector(
		'.weather-app-left-aside-current-day-forecast__temperature'
	) as HTMLElement
	weatherCondition = document.querySelector(
		'.weather-app-left-aside-current-day-forecast__condition'
	) as HTMLElement
	// App right side
	precipitationValue = document.querySelector(
		'.precipitation-value'
	) as HTMLElement
	humidityValue = document.querySelector('.humidity-value') as HTMLElement
	windValue = document.querySelector('.wind-value') as HTMLElement
	weatherSeveralDaysForecast = document.querySelector(
		'.weather-app-right-aside-several-days-forecast'
	) as HTMLElement
	changeLocationBtn = document.querySelector(
		'.weather-app-right-aside-button'
	) as HTMLElement
	// popup
	popup = document.querySelector('.popup') as HTMLElement
	changeLocationField = document.querySelector(
		'.popup__search'
	) as HTMLInputElement
	popupChangeBtn = document.querySelector('.popup__btn') as HTMLElement
}
getElements()

function setTemplate(key: string, arr: ICurrentForecast) {
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

function init(): void {
	weekDay.innerHTML = weekDays[date.getDay()]
	currentDate.innerHTML = `${day} ${month} ${year} `
	forecastTime.innerHTML = time
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

function initHandleClick(): void {
	//Initialize Listeners
	function popupCloseClick(e: Event) {
		const { target } = e
		if (!(e.target instanceof HTMLButtonElement)) {
			return
		} else {
			e?.target?.dataset?.type === 'popup-close-body'
				? (popup.style.display = 'none')
				: (popup.style.display = 'block')
		}
	}
	function getInputValue(e: Event) {
		const { target } = e
		if (!(e.target instanceof HTMLButtonElement)) {
			return
		} else {
			searchCityField = e?.target?.value
		}
	}

	//open popup
	changeLocationBtn.addEventListener(
		'click',
		e => (popup.style.display = 'block')
	)

	//close popup
	popup.addEventListener('click', popupCloseClick)

	changeLocationField.addEventListener('input', getInputValue)

	popupChangeBtn.addEventListener('click', () => {
		if (searchCityField.length) {
			clearText()
			render()
			changeLocationField.value = ''
		}
	})
}
initHandleClick()

function setLoadingStatus(status: boolean): string {
	return status
		? (loader.style.display = 'flex')
		: (loader.style.display = 'none')
}

function clearText(): void {
	currentCity.innerHTML = ''
	weatherSeveralDaysForecast.innerHTML = ''
}

async function getIpAddress(): Promise<IServerResponse> {
	return await (
		await axios(
			`https://api.ipgeolocation.io/getip?apiKey=${configData.IP_ADDRESS_KEY}`
		)
	).data
}

async function getCityByIp(ipAddress: string): Promise<IServerResponse> {
	return await (
		await axios(
			`${configData.URL}/ip.json?q=${ipAddress}&key=${configData.WEATHER_API_KEY}&lang=ru`
		)
	).data
}

async function getCurrentCityForecast(city: string): Promise<IServerResponse> {
	return await (
		await axios(
			`${configData.URL}/current.json?q=${city}&key=${configData.WEATHER_API_KEY}&lang=ru`
		)
	).data
}

async function getSeveralDaysForecast(
	city: string,
	days: number
): Promise<IServerResponse> {
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
		severalDaysForecast = [...forecast?.forecastday]
		console.log(severalDaysForecast)
	} catch (e) {
		throw e
	} finally {
		setLoadingStatus(false)
	}
}

async function render() {
	await update()
	init()
}

render()
