const url = 'js/data.json';
const temperatureUnit = '°';
const humidityUnit = ' %';
const pressureUnit = ' мм. рт. ст.';
const windUnit = ' м/с';

// текущая информация о погоде
let currentData;

// асинхронная функция получения информации
async function getData() {
	let response = await fetch(url);

	if (response.ok) {
		let jsonData = response.json();
		return jsonData;
	} else {
		alert('Error: ' + response.status);
	}
}

// функция конвертирования давления
function convertPressure(value) {
	return (value / 1.33).toFixed();
}

// функция добавляет ведущий ноль
Number.prototype.pad = function (size) {
	let s = String(this);
	while (s.length < (size || 2)) {
		s = '0' + s;
	}
	return s;
};

// функция даты и времени с ведущим нулем
function getHoursString(dateTime) {
	let date = new Date(dateTime);
	let hours = date.getHours().pad();

	return hours;
}

// склеивание 2-х значений в одну строку, отображение значений с единицами измерений
function getValueWithUnit(value, unit) {
	return `${value}${unit}`;
}

// получение строки с температурой
function getTemperature(value) {
	let roundedValue = value.toFixed();
	return getValueWithUnit(roundedValue, temperatureUnit);
}

// метод для отрисовки
function render(data) {
	renderCity(data);
	renderCurrentTemperature(data);
	renderCurrentDescription(data);
	renderForecast(data);
	renderDetails(data);
}

function renderCity(data) {
	let cityName = document.querySelector('.current__city');
	cityName.innerHTML = data.city.name;
}

function renderCurrentTemperature(data) {
	let tmp = data.list[0].main.temp;

	let currentTmp = document.querySelector('.current_temperature');
	currentTmp.innerHTML = getTemperature(tmp);
}

function renderCurrentDescription(data) {
	let tmp = data.list[0].weather[0].description;

	let description = document.querySelector('.current__description');
	description.innerHTML = tmp;
}

// метод для отображения прогноза
function renderForecast(data) {
	let forecastDataContainer = document.querySelector('.forecast');
	let forecast = '';

	for (let i = 0; i < 6; i++) {
		// получим текущий элемент массива
		let item = data.list[i];

		let icon = item.weather[0].icon;
		let temp = getTemperature(item.main.temp);
		let hours = i == 0 ? 'Сейчас' : getHoursString(item.dt * 1000);

		let template = `<div class="forecast__item">
            <div class="forecast__time">${hours}</div>
            <div class="forecast__icon icon-${icon}"></div>
            <div class="forecast__temperature">${temp}</div>
        </div>`;
		forecast += template;
	}
	forecastDataContainer.innerHTML = forecast;
}

// метод для отображения детальной информации
function renderDetails(data) {
	let item = data.list[0];
	let pressureValue = convertPressure(item.main.pressure);
	let pressure = getValueWithUnit(pressureValue, pressureUnit);
	let humidity = getValueWithUnit(item.main.humidity, humidityUnit);
	let feels_like = getTemperature(item.main.feels_like);
	let wind = getValueWithUnit(item.wind.speed, windUnit);

	renderDetailsItem('feelslike', feels_like);
	renderDetailsItem('humidity', humidity);
	renderDetailsItem('pressure', humidity);
	renderDetailsItem('wind', humidity);
}

// метод для рендера одной ячейки
function renderDetailsItem(className, value) {
	container = document.querySelector(`.${className}`).querySelector('.details__value');
	container.innerHTML = value;
}

// Старт при загрузке приложения
function start() {
	getData().then((data) => {
		currentData = data;
		render(data);
	});
}

start();
