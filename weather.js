const appId = '622cc29a246cffc4f2e0b9446ab8c15d';
let currentClock = '';

async function searchSubmit(){
	event.preventDefault();
	if(document.querySelector('#searchBarOne').value && document.querySelector('#searchBarTwo').value){
		const scale = document.querySelector('#tempScale').value === '°C' ? '&units=metric'
		: document.querySelector('#tempScale').value === '°F' ? '&units=imperial'
		: '';
		const searchType = [...document.querySelectorAll('#searchType input')].filter(radio => { return radio.checked })[0].value;
		const searchString = `${ document.getElementById('searchBarOne').value }${ searchType === 'lat' ? '&' : ',' }${ searchType === 'lat' ? 'lon=' : '' }${ document.getElementById('searchBarTwo').value.toLowerCase() }${ scale }`;
		const fullStr = `https://api.openweathermap.org/data/2.5/weather?${ searchType }=${ searchString }&APPID=${ appId }`;
		
		if((fullStr.length > 90 && scale === '') || (fullStr.length > 103 && scale === '&units=metric') || (fullStr.length > 105 && scale === '&units=imperial')){
			const response = await fetch(fullStr);
			const str = await response.json();
			const dateArr = setBackground(str);
			currentClock = buildWeatherCard(str, dateArr);
			const newEars = setListeners();
		}
	}
}

function buildWeatherCard(apiResponse, dateArr){
	const date = dateArr[0];
	const umbra = dateArr[1].substr(0,1).toUpperCase() + dateArr[1].substr(1, dateArr[1].length - 1);
	const currentScale = document.querySelector('.umbraScale') ? document.querySelector('.umbraScale').value : document.querySelector('#tempScale').value;
	const buildLocus = () => {
		const sbo = apiResponse.name;
		let newArr = sbo.split(' ');
		newArr = newArr.map(([...word]) => {
			word[0] = word[0].toUpperCase();
			for(let i = 1; i < word.length; i++){
				word[i] = word[i].toLowerCase();
			}
			return word.join('');
		});
		return newArr.join(' ');
	}
	const windDir = () => {
		const response = apiResponse.wind.deg;
		const direction = response > 337.5 || response < 22.6 ? 'North' 
		: response > 292.5 ? 'North West'
		: response > 247.5 ? 'West'
		: response > 202.5 ? 'South West'
		: response > 157.5 ? 'South'
		: response > 112.5 ? 'South East'
		: response > 67.5 ? 'East'
		: 'North East'
		return direction;
	}
	document.querySelector('body').innerHTML = `
	<div id = 'container' class = 'columnNW'>
	<h1>Global Weather Search</h1>
	<div id = 'searchCard' class = 'infoCard columnWrap rowNW'>
	<div id = 'searchType' class = 'columnNW'>
	<span style = 'text-align:center'>Search By:<span>
	<span class = 'rowNW'>
	<input type = 'radio' name = 'searchType' value = 'q' checked>
	City Name
	</span>
	<span class = 'rowNW'>
	<input type = 'radio' name = 'searchType' value = 'zip'>
	Zip Code
	</span>
	<span class = 'rowNW'>
	<input type = 'radio' name = 'searchType' value = 'lat'>
	Latitude & Longitude
	</span>
	</div>
	<div>
	<form id = 'searchSection' class = 'columnNW'>
	<span id = 'texts' class = 'columnNW'>
	<input type = 'text' maxlength = 30 id = 'searchBarOne' placeholder = 'City Name...'>
	<input type = 'text' maxlength = 2 id = 'searchBarTwo' placeholder = 'Country Abbreviation...'>
	</span>
	<span class = 'scaleRow rowNW' style = 'width: 108%'>
	<input type = 'button' style = 'width:33.3%' id = 'tempScale' value = '°C'>
	<input type = 'button' style = 'width:33.3%' value = '°F'>
	<input type = 'button' style = 'width:33.3%' value = '°K'>
	</span>
	<span id = 'submitWrapper' class = 'scaleRow rowNW' style = 'width: 108%'>
	<input type = 'button' id = 'Sumbit' style = 'width:100%' value = 'Submit'>
	</span>
	</form>
	</div>
	</div>
	<div id = 'umbraCard' class = 'umbra rowNW'>
	<span class = 'rowNW' style = 'width: 50%; justify-content: center;'>
	 ${ umbra }${ umbra === 'Dusk' ? '' : '-Time' }
	</span>
	<span class = 'umbral'><input type = 'button' class = "${ currentScale === '°F' || currentScale === ' 12H ' ? 'umbraScale' : '' }" value = ' 12H '><input type = 'button' id = 'umbra2' class = "${ currentScale === '°F' || currentScale === ' 12H ' ? '' : 'umbraScale' }" value = ' 24H '></span>
	</div>
	<div id = 'placeCard' class = 'infoCard columnNW'>
	${ buildLocus() }, ${ apiResponse.sys.country.toUpperCase() }
	</div>
	<div id = 'timeCard' class = 'clock rowNW'>
	${ setClock(date) }
	</div>
	<div id = "airTemp" class = 'weatherCard columnWrap'>
	<h3>Air Temperature</h3>
	<div class = 'infoCard columnWrap largeFont'>${ Math.round(apiResponse.main.temp) }${ document.querySelector('#tempScale').value }</div>
	</div>
	<div id = "hourlyCard" class = 'weatherCard columnWrap'>
	<h3>Temperature Variance</h3>
	<div class = 'infoCard columnWrap smallFont'>
	<span>Low: ${ Math.round(apiResponse.main.temp_min) }${ document.querySelector('#tempScale').value }</span>
	<span>High: ${ Math.round(apiResponse.main.temp_max) }${ document.querySelector('#tempScale').value }</span>
	</div>
	</div>
	<div id = "weatherDesc" class = 'weatherCard columnWrap'>
	<h3>Current Weather</h3>
	<div class = 'infoCard columnWrap smallFont'>${ apiResponse.weather[0].main }</div>
	<div class = 'infoCard columnWrap addOn' style = 'font-size:24px'>${ apiResponse.weather[0].description }</div>
	</div>
	<div id = "currentHumidity" class = 'weatherCard columnWrap'>
	<h3>Humidity</h3>
	<div class = 'infoCard columnWrap largeFont'>
	<span>${ apiResponse.main.humidity }%</span>
	</div>
	</div>
	<div id = 'windData' class = 'weatherCard columnWrap'>
	<h3>Wind Status</h3>
	<div class = 'infoCard columnWrap smallFont'>Blowing: ${ windDir() }</div>
	<div class = 'infoCard columnWrap smallFont addOn'>Speed: ${ apiResponse.wind.speed } ${ document.querySelector('#tempScale').value === '°F' ? 'mph' : 'm/s' }</div>
	</div>
	</div>
	<footer>
	<div class = 'rowNW' style = 'margin-top: 0; margin-bottom: 1rem; justify-content: center'>© 2019 Cody Frazier</div>
	</footer>	
	`;
	return date;
}

function setBackground(apiResponse){
	const variance = (apiResponse.timezone * 1000) + (1000 * 60 * 60 * 8);
	const time = new Date(new Date().getTime() + variance);
	setDayNight = (time.getTime() - variance > apiResponse.sys.sunrise * 1000 + 900000) && (time.getTime() - variance < apiResponse.sys.sunset * 1000 - 900000) ? 'day'
	: (time.getTime() - variance > apiResponse.sys.sunset * 1000 + 900000) || (time.getTime() - variance < apiResponse.sys.sunrise * 1000 - 900000) ? 'night'
	: 'dusk';
	const clouds = apiResponse.clouds.all;
	const clarity = apiResponse.weather[0].main.toLowerCase();
	
	//Need to rework this so it will account for fire, lighning, and fog
	const backURL = `${ clouds > 35 ? 'cloudy' : clouds > 20 ? 'partCloudy' : 'clear' }-${ setDayNight }`;
	document.querySelector('body').style.backgroundImage = `url('assets/img/${ backURL }.jpg')`;
	return [time, setDayNight];
}

function getKey(eventKey){
	if(eventKey.code === 'Enter'){
		searchSubmit();
	}
}

function setClock(date){
	let day = date.getDay();
	day = day > 5 ? 'Sat'
	: day > 4 ? 'Fri'
	: day > 3 ? 'Thu'
	: day > 2 ? 'Wed'
	: day > 1 ? 'Tue'
	: day > 0 ? 'Mon'
	: 'Sun';
	let month = date.getMonth();
	const dayNum = date.getDate() > 9 ? date.getDate() : `0${ date.getDate() }`;
	const year = date.getFullYear();
	const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${ date.getMinutes() }`;
	let hour = date.getHours() > 9 ? date.getHours() : `0${ date.getHours() }`;
	let clockRotation = '';
	
	const formatDate = () => {
		month = month > 10 ? 'Dec'
		: month > 9 ? 'Nov'
		: month > 8 ? 'Oct'
		: month > 7 ? 'Sep'
		: month > 6 ? 'Aug'
		: month > 5 ? 'Jul'
		: month > 4 ? 'Jun'
		: month > 3 ? 'May'
		: month > 2 ? 'Apr'
		: month > 1 ? 'Mar'
		: month > 0 ? 'Feb'
		: 'Jan';
		return `${day.slice(0, 3)} ${dayNum} ${month} ${year}, ${hour}:${minutes} ${ clockRotation }`;
	}
	
	if(!document.querySelector('.umbraScale')){
		if(document.querySelector('#tempScale').value === '°F' && hour > 12){
			clockRotation = 'PM';
			hour = hour - 12;
		}else if(document.querySelector('#tempScale').value === '°F' && !(hour > 12)){
			clockRotation = 'AM';
		}else{
			return formatDate();
		}
		return `${day.slice(0, 3)} ${ month > 8 ? month + 1 : '0' + (month + 1) }/${ dayNum }/${ year }, ${ hour }:${ minutes } ${ clockRotation }`;	
	}else{
		if(document.querySelector('.umbraScale').value === ' 12H ' && hour > 12){
			clockRotation = 'PM';
			hour = hour - 12;
		}else if(document.querySelector('.umbraScale').value === ' 12H ' && !(hour > 12)){
			clockRotation = 'AM';
		}else{
			return formatDate();
		}
		return `${day.slice(0, 3)} ${ month > 8 ? month + 1 : '0' + (month + 1) }/${ dayNum }/${ year }, ${ hour }:${ minutes } ${ clockRotation }`;
	}
}

function setListeners(){
	const radioEar = document.querySelector('#searchType').addEventListener('click', ({ target }) => {
		const bar1 = document.querySelector('#searchBarOne');
		const bar2 = document.querySelector('#searchBarTwo');
		bar1.value = '';
		bar2.value = '';
		document.querySelectorAll('#searchType input').forEach(radio => {
			if(radio.checked){
				if(radio.value === 'lat'){
					document.querySelector('#texts').innerHTML = `
					<input type = 'text' maxlength = 4 min = -180 max = 180 id = 'searchBarOne' placeholder = 'Latitude...'>
					<input type = 'text' maxlength = 4 min = -180 max = 180 id = 'searchBarTwo' placeholder = 'Longitude...'>
					`;
				}else if(radio.value === 'zip'){
					document.querySelector('#texts').innerHTML = `
					<input type = 'text' maxlength = 5 id = 'searchBarOne' placeholder = 'Zip Code...'>
					<input type = 'text' maxlength = 2 id = 'searchBarTwo' placeholder = 'Country Abbreviation...'>
					`;
				}else{
					document.querySelector('#texts').innerHTML = `
					<input type = 'text' maxlength = 30 id = 'searchBarOne' placeholder = 'City Name...'>
					<input type = 'text' maxlength = 2 id = 'searchBarTwo' placeholder = 'Country Abbreviation...'>
					`;
				}
			}
		});
	});

	const tempEar = document.querySelector('.scaleRow').addEventListener('click', ({ target }) => {
		document.querySelectorAll('.scaleRow input').forEach(button => {
			if(button.id === 'tempScale'){
				button.id = '';
			}
		});
		target.id = 'tempScale';
	});
	
	if(document.querySelector('.umbral')){
		const hourEar = document.querySelector('.umbral').addEventListener('click', ({ target }) => {
			document.querySelectorAll('.umbral input').forEach(button => {
				if(button.classList.contains('umbraScale')){
					button.classList = '';
				}
			});
			if(target.type === 'button'){
				target.classList = 'umbraScale';
				console.log('currentClock: ', currentClock);
				console.log(document.querySelector('.clock').innerHTML = setClock(currentClock));
				console.log(document.querySelector('.clock'));
			}
		});
	}	

	const submissionEar = document.querySelector('#submitWrapper').addEventListener('click', searchSubmit);
	
	const entEar = document.addEventListener('keydown', getKey);
	
	return [submissionEar, tempEar, radioEar];
}

const listeners = setListeners();


