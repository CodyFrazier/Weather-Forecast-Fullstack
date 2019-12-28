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
	if(document.querySelector('#searchBarOne').value && document.querySelector('#searchBarTwo').value){
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
			const clock = setBackground(str);
			buildWeatherCard(str, clock);
			const newEars = setListeners();
		}
	}
}

function buildWeatherCard(apiResponse, date){
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
	console.log(date);
	const clock = date => {
		console.log(date);
		let day = date.getDay();
		switch(day){
			case 0:
				day = 'Sun';
			case 1:
				day = 'Mon';
			case 2:
				day = 'Tue';
			case 3:
				day = 'Wed';
			case 4:
				day = 'Thu';
			case 5:
				day = 'Fri';
			case 6:
				day = 'Sat';
		}
		let month = date.getMonth();
		switch(month){
			case 0:
				month = 'Jan';
			case 1:
				month = 'Feb';
			case 2:
				month = 'Mar';
			case 3:
				month = 'Apr';
			case 4:
				month = 'May';
			case 5:
				month = 'Jun';
			case 6:
				month = 'Jul';
			case 7:
				month = 'Aug';
			case 8:
				month = 'Sep';
			case 9:
				month = 'Oct';
			case 10:
				month = 'Nov';
			case 11:
				month = 'Dec';
		}
		const dayNum = date.getDate();
		const hour = date.getHours();
		const minutes = date.getMinutes();
		const year = date.getFullYear();
		return `${day.slice(0, 3)} ${dayNum} ${month} ${year}, ${hour}:${minutes}`;
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
	<span id = 'texts' class = 'columnNW'>
	<input type = 'text' maxlength = 30 id = 'searchBarOne' placeholder = 'City Name...'>
	<input type = 'text' maxlength = 2 id = 'searchBarTwo' placeholder = 'Country Abbreviation...'>
	</span>
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
	<div id = 'placeCard' class = 'infoCard columnNW'>
	${ buildLocus() }, ${ document.querySelector('#searchBarTwo').value.toUpperCase() }
	</div>
	<div id = 'timeCard' class = 'clock rowNW'>
	${ clock(date) }
	</div>
	<div id = "airTemp" class = 'weatherCard columnWrap'>
	<h3>Air Temperature</h3>
	<div class = 'infoCard columnWrap largeFont'>${ Math.round(apiResponse.main.temp) }${ document.querySelector('#tempScale').value }</div>
	</div>
	<div id = "hourlyCard" class = 'weatherCard columnWrap'>
	<h3>Hourly Forecast</h3>
	<div class = 'infoCard columnWrap'>
	<span>Graph of Daily Data</span>
	<span>Low: ${ apiResponse.main.temp_min }${ document.querySelector('#tempScale').value }</span>
	<span>High: ${ apiResponse.main.temp_max }${ document.querySelector('#tempScale').value }</span>
	</div>
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
			rain-day **
	*/
	
	//timezone: apiResponse.timezone;
	const time = new Date(new Date().getTime() + (apiResponse.timezone * 1000) + (1000 * 60 * 60 * 8));
	setDayNight = (time.getTime() > apiResponse.sys.sunrise * 1000 + 30000) && (time.getTime() < apiResponse.sys.sunset * 1000 - 30000) ? 'day'
	: (time.getTime() > apiResponse.sys.sunset * 1000 + 30000) || (time.getTime() < apiResponse.sys.sunrise * 1000 - 30000) ? 'night'
	: 'dusk';
	const clouds = apiResponse.clouds.all;
	const clarity = apiResponse.weather[0].main.toLowerCase();
	const backURL = `${ clouds > 35 ? 'cloudy' : clouds > 20 ? 'partCloudy' : 'clear' }-${ setDayNight }`;
	document.querySelector('body').style.backgroundImage = `url('assets/img/${ backURL }.jpg')`;
	return time;
}

function setListeners(){
	const radioEar = document.querySelector('#searchType').addEventListener('click', ({ target }) => { //alter text input fields to reflect the possible values.
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

	const submissionEar = document.querySelector('#submitWrapper').addEventListener('click', searchSubmit);
	
	return [submissionEar, tempEar, radioEar];
}

const listeners = setListeners();


