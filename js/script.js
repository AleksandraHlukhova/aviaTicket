'use strict';

const form = document.querySelector('.form'),
inputCityFrom = document.querySelector('.city_from'),
inputCityTo = document.querySelector('.city_to'),
inputFormDate = document.querySelector('.form_date'),
dropdownCitiesFrom = document.querySelector('.dropdown__cities_from'),
dropdownCitiesTo = document.querySelector('.dropdown__cities_to'),
btnSearch = document.querySelector('.btn_search');

const cities = ['Киев', 'Львов', 'Одесса', 'Днепр', 'Харьков', 'Прага', 'Варшава', 'Краков', 'Вильнюс'],
proxy = 'https://cors-anywhere.herokuapp.com/';

let showCities = (input, list) => {
	list.textContent = '';
	if(input.value === '') return;
	const val = input.value.toLowerCase();
	console.log(val)
	let filteredCities  = cities.filter((item) => {
		let fixedItem = item.toLowerCase();
		console.log(item)
		return fixedItem.startsWith(val);
	});
	console.log(filteredCities);
	filteredCities.forEach((item) => {
		const li = document.createElement('li');
		li.textContent = item;
		list.append(li);
		console.log(li)
	});
}

let selectCity = (event, input, list) => {
	list.textContent = '';
	const target = event.target;
	if(target.tagName.toLowerCase() === 'li') {
		input.value = target.textContent;
	}
}





inputCityFrom.addEventListener('input', () => {
	showCities(inputCityFrom, dropdownCitiesFrom);
})
inputCityTo.addEventListener('input', () => {
	showCities(inputCityTo, dropdownCitiesTo);
})
dropdownCitiesFrom.addEventListener('click', (event) => {
	selectCity(event, inputCityFrom, dropdownCitiesFrom);
})
dropdownCitiesTo.addEventListener('click', (event) => {
	selectCity(event, inputCityTo, dropdownCitiesTo);
})

form.addEventListener('submit', (event) => {
	event.preventDefault();
})