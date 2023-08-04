"use strict";
// const axios = require('axios')
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var configData = {
    URL: 'http://api.weatherapi.com/v1',
    WEATHER_API_KEY: '544e535e35644ffeb4c93434232107',
    IP_ADDRESS_KEY: '68b0fd85539e4558b75a061381a881ce'
};
var weekDays = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];
var months = [
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
];
var ip;
var city;
var todayWeatherForecast;
var severalDaysForecast;
var searchCityField;
var cityWeatherForecast;
// Date&time&weekDay info
var date = new Date();
var month = months[date.getMonth()];
var _a = date.toLocaleDateString().split('.'), day = _a[0], year = _a[2];
var time = date.toLocaleTimeString().split(':').splice(0, 2).join(':');
var loader;
var currentCity;
var weekDay;
var currentDate;
var forecastTime;
var weatherForecastIcon;
var weatherTemperature;
var weatherCondition;
var precipitationValue;
var humidityValue;
var windValue;
var weatherSeveralDaysForecast;
var changeLocationBtn;
var popup;
var changeLocationField;
var popupChangeBtn;
function getElements() {
    loader = document.querySelector('.loader');
    //App left side
    currentCity = document.querySelector('.weather-app-left-aside-geolocation-info__city');
    weekDay = document.querySelector('.weather-app-left-aside__title');
    currentDate = document.querySelector('.weather-app-left-aside__date');
    forecastTime = document.querySelector('.weather-app-left-aside__time');
    weatherForecastIcon = document.querySelector('.weather-app-left-aside-current-day-forecast__icon');
    weatherTemperature = document.querySelector('.weather-app-left-aside-current-day-forecast__temperature');
    weatherCondition = document.querySelector('.weather-app-left-aside-current-day-forecast__condition');
    // App right side
    precipitationValue = document.querySelector('.precipitation-value');
    humidityValue = document.querySelector('.humidity-value');
    windValue = document.querySelector('.wind-value');
    weatherSeveralDaysForecast = document.querySelector('.weather-app-right-aside-several-days-forecast');
    changeLocationBtn = document.querySelector('.weather-app-right-aside-button');
    // popup
    popup = document.querySelector('.popup');
    changeLocationField = document.querySelector('.popup__search');
    popupChangeBtn = document.querySelector('.popup__btn');
}
getElements();
function setTemplate(key, arr) {
    var _a, _b, _c;
    return "\n\t<button class=\"weather-app-right-aside-several-days-forecast-day-btn\" data-index=".concat(key, ">\n\t<span class=\"weather-app-right-aside-several-days-forecast-day-btn__icon\" style=\"background-image:url(").concat((_b = (_a = arr === null || arr === void 0 ? void 0 : arr.day) === null || _a === void 0 ? void 0 : _a.condition) === null || _b === void 0 ? void 0 : _b.icon, ")\">\n\t</span>\n\t<p class=\"weather-app-right-aside-several-days-forecast-day-btn__weekday\">").concat(arr === null || arr === void 0 ? void 0 : arr.date.split('-')[2], "</p>\n\t<p class=\"weather-app-right-aside-several-days-forecast-day-btn__temperature\">").concat((_c = arr === null || arr === void 0 ? void 0 : arr.day) === null || _c === void 0 ? void 0 : _c.maxtemp_c, " \u00B0C</p>\n\t</button>\n\t");
}
function init() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    weekDay.innerHTML = weekDays[date.getDay()];
    currentDate.innerHTML = "".concat(day, " ").concat(month, " ").concat(year, " ");
    forecastTime.innerHTML = time;
    weatherForecastIcon.style.backgroundImage = "url(".concat((_b = (_a = todayWeatherForecast === null || todayWeatherForecast === void 0 ? void 0 : todayWeatherForecast.current) === null || _a === void 0 ? void 0 : _a.condition) === null || _b === void 0 ? void 0 : _b.icon, ")");
    weatherTemperature.innerHTML = "".concat((_c = todayWeatherForecast === null || todayWeatherForecast === void 0 ? void 0 : todayWeatherForecast.current) === null || _c === void 0 ? void 0 : _c.temp_c, " \u00B0C");
    weatherCondition.innerHTML = (_e = (_d = todayWeatherForecast === null || todayWeatherForecast === void 0 ? void 0 : todayWeatherForecast.current) === null || _d === void 0 ? void 0 : _d.condition) === null || _e === void 0 ? void 0 : _e.text;
    precipitationValue.innerHTML = "".concat((_f = todayWeatherForecast === null || todayWeatherForecast === void 0 ? void 0 : todayWeatherForecast.current) === null || _f === void 0 ? void 0 : _f.precip_in, " %");
    humidityValue.innerHTML = "".concat((_g = todayWeatherForecast === null || todayWeatherForecast === void 0 ? void 0 : todayWeatherForecast.current) === null || _g === void 0 ? void 0 : _g.humidity, " %");
    windValue.innerHTML = "".concat((_h = todayWeatherForecast === null || todayWeatherForecast === void 0 ? void 0 : todayWeatherForecast.current) === null || _h === void 0 ? void 0 : _h.wind_kph, " km/h");
    for (var _i = 0, _j = Object.entries(severalDaysForecast); _i < _j.length; _i++) {
        var _k = _j[_i], key = _k[0], forecast = _k[1];
        // console.log(forecast)
        weatherSeveralDaysForecast.insertAdjacentHTML('beforeend', setTemplate(key, forecast));
    }
}
function initHandleClick() {
    //Initialize Listeners
    function popupCloseClick(e) {
        var _a, _b;
        var target = e.target;
        if (!(e.target instanceof HTMLButtonElement)) {
            return;
        }
        else {
            ((_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.dataset) === null || _b === void 0 ? void 0 : _b.type) === 'popup-close-body'
                ? (popup.style.display = 'none')
                : (popup.style.display = 'block');
        }
    }
    function getInputValue(e) {
        var _a;
        var target = e.target;
        if (!(e.target instanceof HTMLButtonElement)) {
            return;
        }
        else {
            searchCityField = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.value;
        }
    }
    //open popup
    changeLocationBtn.addEventListener('click', function (e) { return (popup.style.display = 'block'); });
    //close popup
    popup.addEventListener('click', popupCloseClick);
    changeLocationField.addEventListener('input', getInputValue);
    popupChangeBtn.addEventListener('click', function () {
        if (searchCityField.length) {
            clearText();
            render();
            changeLocationField.value = '';
        }
    });
}
initHandleClick();
function setLoadingStatus(status) {
    return status
        ? (loader.style.display = 'flex')
        : (loader.style.display = 'none');
}
function clearText() {
    currentCity.innerHTML = '';
    weatherSeveralDaysForecast.innerHTML = '';
}
function getIpAddress() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)("https://api.ipgeolocation.io/getip?apiKey=".concat(configData.IP_ADDRESS_KEY))];
                case 1: return [4 /*yield*/, (_a.sent()).data];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getCityByIp(ipAddress) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)("".concat(configData.URL, "/ip.json?q=").concat(ipAddress, "&key=").concat(configData.WEATHER_API_KEY, "&lang=ru"))];
                case 1: return [4 /*yield*/, (_a.sent()).data];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getCurrentCityForecast(city) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)("".concat(configData.URL, "/current.json?q=").concat(city, "&key=").concat(configData.WEATHER_API_KEY, "&lang=ru"))];
                case 1: return [4 /*yield*/, (_a.sent()).data];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getSeveralDaysForecast(city, days) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)("".concat(configData.URL, "/forecast.json?q=").concat(city, "&days=").concat(days, "&key=").concat(configData.WEATHER_API_KEY, "&lang=ru"))];
                case 1: return [4 /*yield*/, (_a.sent()).data];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function update() {
    return __awaiter(this, void 0, void 0, function () {
        var ip_1, city_1, forecast, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoadingStatus(true);
                    return [4 /*yield*/, getIpAddress()];
                case 1:
                    ip_1 = (_a.sent()).ip;
                    return [4 /*yield*/, getCityByIp(ip_1)];
                case 2:
                    city_1 = (_a.sent()).city;
                    searchCityField
                        ? (cityWeatherForecast = searchCityField)
                        : (cityWeatherForecast = city_1);
                    return [4 /*yield*/, getCurrentCityForecast(cityWeatherForecast)];
                case 3:
                    todayWeatherForecast = _a.sent();
                    return [4 /*yield*/, getSeveralDaysForecast(cityWeatherForecast, 6)];
                case 4:
                    forecast = (_a.sent()).forecast;
                    severalDaysForecast = __spreadArray([], forecast === null || forecast === void 0 ? void 0 : forecast.forecastday, true);
                    console.log(severalDaysForecast);
                    return [3 /*break*/, 7];
                case 5:
                    e_1 = _a.sent();
                    throw e_1;
                case 6:
                    setLoadingStatus(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function render() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, update()];
                case 1:
                    _a.sent();
                    init();
                    return [2 /*return*/];
            }
        });
    });
}
render();
