// `api.openweathermap.org/data/2.5/weather?`
	//id: 		+= `id=${ city id }`
	//zip:		+= `zip=${ city zip }`
	//coords:	+= `lat=${ latitude }&lon=${ longitude }`
// 622cc29a246cffc4f2e0b9446ab8c15d

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
	
	//Weather Search:
		//Radio Buttons to specify type
			//By Place Name (city)
			//By Zip
			//By Lat and Longitude
	
	//True goal:
		//Make it pleasant to use
		//Make it easy to read
*/

function buildWeatherCard(id, cardName, info){
	
	console.log(info,':', data[info]);
	document.querySelector('#container').innerHTML += `
	<div id = ${ id } class = 'weatherCard columnWrap'>
	<h3>${ cardName }</h3>
	<div id = ${ info } class = 'infoCard columnWrap'>${ info }: ${ data[info] }</div>
	</div>
	`;
}

for(let i = 1; i <= 10; i++){
	buildWeatherCard(`card${ i }`, `card${ i }`, `visibility`);
}
