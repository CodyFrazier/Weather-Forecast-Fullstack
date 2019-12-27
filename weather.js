//units: K [ default ], C [ units=metric ], F [ units=imperial] 

//To Do:
/*
	//background image mapping:
		//map based on screen size: 
		//map based on weather:
	
	//To Show:
		//Hourly Forecast for several days
		//Several maps
			//precipitation intensity
			//accumulated precipitation
			//air temperature
	
	//True goal:
		//Make it pleasant to use
		//Make it easy to read
*/


const appId = '622cc29a246cffc4f2e0b9446ab8c15d';

async function searchSubmit(){
	const scale = document.querySelector('#tempScale').value === 'C°' ? '&units=metric'
	: document.querySelector('#tempScale').value === 'F°' ? '&units=imperial'
	: '';
	const searchType = [...document.querySelectorAll('#searchType input')].filter(radio => { return radio.checked })[0].value;
	const searchString = `${ document.getElementById('searchBarOne').value }${ searchType === 'lat' ? '&' : ',' }${ searchType === 'lat' ? 'lon=' : '' }${ document.getElementById('searchBarTwo').value.toLowerCase() }${ scale }`;
	console.log(`searchType: ${ searchType }; searchString: ${ searchString }`);
	const fullStr = `https://api.openweathermap.org/data/2.5/weather?${ searchType }=${ searchString }&APPID=${ appId }`;
	if(fullStr.length > 90){
		const response = await fetch(fullStr);
		const str = await response.json();
		buildWeatherCard(str);
	}
	
}

function buildWeatherCard(apiResponse){
	document.querySelector('#container').innerHTML += `
	<div id = "airTemp" class = 'weatherCard columnWrap'>
	<h3>Air Temperature</h3>
	<div class = 'infoCard columnWrap largeFont'>${ Math.round(apiResponse.main.temp) }</div>
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
	<div class = 'infoCard columnWrap'>Amount of Preciptation Accumulated</div>
	</div>
	`;	
}

document.querySelector('#searchType').addEventListener('click', ({ target }) => { //alter text input fields to reflect the possible values.
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
			console.log(radio.value); //When a search is submitted, use the value here.
		}
	});
});

document.querySelector('.scaleRow').addEventListener('click', ({ target }) => {
	console.log('target:', target);
	document.querySelectorAll('.scaleRow input').forEach(button => {
		if(button.id === 'tempScale'){
			button.id = '';
		}
	});
	target.id = 'tempScale';
});

document.querySelector('#submitWrapper').addEventListener('click', searchSubmit);

