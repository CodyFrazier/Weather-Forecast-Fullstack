//To Do:
/*	
	//To Show:
		//Hourly Forecast for several days
		//Several maps
			//precipitation intensity
			//accumulated precipitation
	
	//True goal:
		//Make it pleasant to use
		//Make it easy to read
*/


const appId = '622cc29a246cffc4f2e0b9446ab8c15d';

async function searchSubmit(){
	const scale = document.querySelector('#tempScale').value === '°C' ? '&units=metric'
	: document.querySelector('#tempScale').value === '°F' ? '&units=imperial'
	: '';
	const searchType = [...document.querySelectorAll('#searchType input')].filter(radio => { return radio.checked })[0].value;
	const searchString = `${ document.getElementById('searchBarOne').value }${ searchType === 'lat' ? '&' : ',' }${ searchType === 'lat' ? 'lon=' : '' }${ document.getElementById('searchBarTwo').value.toLowerCase() }${ scale }`;
	const fullStr = `https://api.openweathermap.org/data/2.5/weather?${ searchType }=${ searchString }&APPID=${ appId }`;
	console.log(`searchType: ${ searchType }; searchString: ${ searchString } :
	: ${ fullStr } ::
	:: ${ fullStr.length }`);
	if((fullStr.length > 90 && scale === '') || (fullStr.length > 103 && scale === '&units=metric') || (fullStr.length > 105 && scale === '&units=imperial')){
		const response = await fetch(fullStr);
		const str = await response.json();
		setBackground(str);
		buildWeatherCard(str);
		const newEars = setListeners();
	}
}

function buildWeatherCard(apiResponse){
	const buildLocus = () => {
		const sbo = document.querySelector('#searchBarOne').value;
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
	document.querySelector('body').innerHTML = `
	<div id = 'container' class = 'columnNW'>
	<h1>Weather Dashboard</h1>
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
	<div id = 'searchSection' class = 'columnNW'>
	<input type = 'text' maxlength = 30 id = 'searchBarOne' placeholder = 'Type Search Criteria...'>
	<input type = 'text' maxlength = 2 id = 'searchBarTwo' placeholder = 'Country Abbreviation...'>
	<span class = 'scaleRow rowNW'>
	<input type = 'button' style = 'width:33.3%' id = 'tempScale' value = '°C'>
	<input type = 'button' style = 'width:33.3%' value = '°F'>
	<input type = 'button' style = 'width:33.3%' value = '°K'>
	</span>
	<span id = 'submitWrapper' class = 'scaleRow rowNW'>
	<input type = 'button' id = 'Sumbit' style = 'width:100%' value = 'Submit'>
	</span>
	</div>
	</div>
	</div>
	<div id = 'placeCard' class = 'infoCard columnNW'>${ buildLocus() }, ${ document.querySelector('#searchBarTwo').value.toUpperCase() }</div>
	<div id = "airTemp" class = 'weatherCard columnWrap'>
	<h3>Air Temperature</h3>
	<div class = 'infoCard columnWrap largeFont'>${ Math.round(apiResponse.main.temp) }${ document.querySelector('#tempScale').value }</div>
	</div>
	<div id = "hourlyCard" class = 'weatherCard columnWrap'>
	<h3>Hourly Forecast</h3>
	<div class = 'infoCard columnWrap'>Graph of Daily Data</div>
	</div>
	<div id = "precipRate" class = 'weatherCard columnWrap'>
	<h3>Precipitation Intensity</h3>
	<div class = 'infoCard columnWrap'>Rainfall per given time</div>
	</div>
	<div id = "precipAmount" class = 'weatherCard columnWrap'>
	<h3>Accumulated Precipitation</h3>
	<div class = 'infoCard columnWrap'>
<span>Rain over 3 hours: ${ "apiResponse.rain['3h']" }mm</span>
	<span>Rain over 1 hour: ${ "apiResponse.rain['1h']" }mm</span>
	</div>
	</div>
	</div>
	<footer>
	<div class = 'rowNW' style = 'margin-top: 0; margin-bottom: 1rem; justify-content: center'>© 2019 Cody Frazier</div>
	</footer>	
	`;	
}

function setBackground(apiResponse){
	/*
		list of images:
		
			partCloudy-night **
			fog-dusk **
			fog-night **
			lightning-day **
			snow-day **
			snow-dusk **
			snow-night **
			rain-day ** 	clarity: rain
	*/
	
	//timezone: apiResponse.timezone;
	const time = new Date(new Date().getTime() + (apiResponse.timezone * 1000) + (1000 * 60 * 60 * 8));
	setDayNight = (time.getTime() > apiResponse.sys.sunrise * 1000 + 30000) && (time.getTime() < apiResponse.sys.sunset * 1000 - 30000) ? 'day'
	: (time.getTime() > apiResponse.sys.sunset * 1000 + 30000) || (time.getTime() < apiResponse.sys.sunrise * 1000 - 30000) ? 'night'
	: 'dusk';
	const clouds = apiResponse.clouds.all;
	const clarity = apiResponse.weather[0].main.toLowerCase();
	console.log(`clarity is: ${ clarity }; cloudiness is: ${ clouds }`);
	const backURL = `${ clouds > 35 ? 'cloudy' : clouds > 20 ? 'partCloudy' : 'clear' }-${ setDayNight }`;
	document.querySelector('body').style.backgroundImage = `url('assets/img/${ backURL }.jpg')`;
	console.log(`url('assets/img/${ backURL }.jpg')`);
}

function setListeners(){
	const radioEar = document.querySelector('#searchType').addEventListener('click', ({ target }) => { //alter text input fields to reflect the possible values.
		const bar1 = document.querySelector('#searchBarOne');
		const bar2 = document.querySelector('#searchBarTwo');
		document.querySelectorAll('#searchType input').forEach(radio => {
			if(radio.checked){
				
				if(radio.value === 'lat'){
					bar2.attributes.type = 'number';
					bar2.attributes.max = '180';
					bar2.attributes.min = '-180';
					bar2.removeAttribute('maxlength');
				}
				else{
					bar2.attributes.type = 'text';
					bar2.removeAttribute('max');
					bar2.removeAttribute('min');
					bar2.attributes.maxlength = '2';
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

	const submissionEar = document.querySelector('#submitWrapper').addEventListener('click', searchSubmit);
	
	return [submissionEar, tempEar, radioEar];
}

const listeners = setListeners();


