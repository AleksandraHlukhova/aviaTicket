'use strict';

const form = document.querySelector('.form'),
inputCityFrom = document.querySelector('.city_from'),
inputCityTo = document.querySelector('.city_to'),
inputFormDate = document.querySelector('.form_date'),
dropdownCitiesFrom = document.querySelector('.dropdown__cities_from'),
dropdownCitiesTo = document.querySelector('.dropdown__cities_to'),
btnSearch = document.querySelector('.btn_search'),
dayCheapestCardWrap = document.querySelector('.day_cheapest_card_wrap'),
otherCheapestCardWrap = document.querySelector('.other_cheapest_card_wrap');


// cities = ['Киев', 'Львов', 'Одесса', 'Днепр', 'Харьков', 'Прага', 'Варшава', 'Краков', 'Вильнюс'],
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
proxy = 'https://cors-anywhere.herokuapp.com/',
API_KEY = '03c44b4753478c69f77d12869a43930f',
calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let cities = [];

let getCities = (url, callback) => {
	const request = new XMLHttpRequest();
	request.open('GET', url);
	//request.setRequestHeader('Accept-Encoding', 'gzip, deflate'); //script.js:23 Refused to set unsafe header "Accept-Encoding"
	request.addEventListener('readystatechange', () =>{
		if(request.readyState !== 4)  return;
		if(request.status === 200){
			// console.log(request.status)
			// console.log(request.response)
			callback(request.response)

		}else{
			console.error(`${request.status}: ${request.status.text}`);
		}
	})
	request.send();

}

let showCities = (input, list) => {
	list.textContent = '';
	if(input.value === '') return;
	const val = input.value.toLowerCase();
	console.log(val)
	let filteredCities  = cities.filter((item) => {
		let fixedItem = item.name.toLowerCase();
		return fixedItem.startsWith(val);
	});
	console.log(filteredCities);
	filteredCities.forEach((item) => {
		const li = document.createElement('li');
		li.textContent = item.name;
		list.append(li);
	});
}

let selectCity = (event, input, list) => {
	list.textContent = '';
	const target = event.target;
	if(target.tagName.toLowerCase() === 'li') {
		input.value = target.textContent;
	}
}

let getCityName = (code) => {
	let city = cities.find((item) => code === item.code);
	return city.name;
}
let getChanges = (num) => {
	if(num){
		return num === 1 ? 'Одна пересадка' : 'Две пересадки';
	}else{
		return 'Без пересадки';
	}
}
const getPayLink = (data) => {
	let link = 'https://www.aviasales.ru/search/';
	link += data.origin;
	const date = new Date(data.depart_date);
	const day = date.getDate();
	const month = date.getMonth()+1;
	link += day < 10 ? '0' + day : day;
	link += month < 10 ? '0' + month : month;
	link += data.destination;
	link += '1';
	console.log(link)
	return link;
}

const createCard = (data) => {
	const ticket = document.createElement('article');
	let deep = '';
	if(data){
		deep = `
		<div class="ticket_wrapper">
		<div class="row no-gutters">
		<div class="col-4">
		<div class="left-side ticket_wrapper_part">
		<a href="${getPayLink(data)}" class="btn_b btn_buy">Купить
		за ${data.value}</a>
		</div>
		</div>
		<div class="col-8">
		<div class="right-side ticket_wrapper_part">
		<div class="block-left block">
		<div class="city_from">Вылет из города:<br>
		<span class="city_name">${getCityName(data.origin)}</span>
		</div>
		<div class="date">${data.depart_date}</div>
		</div>
		<div class="block-right block">
		<div class="changes">${getChanges(data.number_of_changes)}</div>
		<div class="city_to">Город назначения:
		<span class="city_name">${getCityName(data.destination)}</span>
		</div>
		</div>
		</div>
		</div>
		</div>
		</div>`
	}else{
		deep = 'К сожалению на эту дату билетов не найдено'
	}
	ticket.insertAdjacentHTML('afterbegin', deep);
	return ticket;
}

const renderCheapYear = (cheapTickets) => {
	otherCheapestCardWrap.style.display = 'block';
	otherCheapestCardWrap.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
	console.log(cheapTickets)
	for(let i = 0; i < cheapTickets.length && i < 10; i++){
		let ticket = createCard(cheapTickets[i]);
		otherCheapestCardWrap.append(ticket);
	}
	// createCard()
}

const renderCheapDay = (cheapTicket) => {
	dayCheapestCardWrap.style.display = 'block';
	dayCheapestCardWrap.innerHTML = '<h2>Самые дешевые билеты на текущую даты</h2>';
	console.log(cheapTicket);
	let ticket = createCard(cheapTicket);
	dayCheapestCardWrap.append(ticket);
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

getCities(proxy + citiesApi, (response) => {
	cities = JSON.parse(response).filter((item) => item.name);
	console.log(cities)
})

form.addEventListener('submit', (event) => {
	event.preventDefault();
	console.log(event)
	const formData = {
		from: cities.find((item) => item.name === inputCityFrom.value),
		to: cities.find((item) => item.name === inputCityTo.value),
		date: inputFormDate.value,
	};
	console.log(formData)
	const requestData = `?depart_date=${formData.date}&origin=${formData.from.code}&destination=${formData.to.code}
	&calendar_type=departure_date&token=${API_KEY}`;
	getCities(proxy + calendar + requestData, (response) => {
		// reanderCheap(response, formData.date);
		let cheapestYearTickets = JSON.parse(response).best_prices;
		console.log(cheapestYearTickets);
		let cheapestDayTicket = cheapestYearTickets.filter((item) => item.depart_date === inputFormDate.value);
		console.log(cheapestDayTicket);
		renderCheapYear(cheapestYearTickets);
		renderCheapDay(cheapestDayTicket[0]);

	})

})
