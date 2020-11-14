let countryMarker;
let wikiMarkers;
let weatherMarker;
let border;
let forexMarker;

const mymap = L.map('mapid').setView([0, 0], 6);

const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

const removeMarker = (typeOfMarker) => {
  if(mymap.hasLayer(typeOfMarker)) {
    mymap.removeLayer(typeOfMarker);
  };
}

const roundTempsDown = (arr) => {
  const roundedTemps = arr.map(element => {
    return element.toFixed(1);
   
  })
  return roundedTemps;
}

const formatMonths = (arr, year) => {
  const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const combined = monthsArr.map((val, idx) => `<li>${val} - ${arr[idx]}</li>`);
  climateHTML = `<h3>${year}</h3>
                  <ul>`;
  combined.forEach(dataPoint => {
    climateHTML += dataPoint;
  })

  climateHTML += `</ul>`;
  return climateHTML;
}


const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [50, 50]
  }
})

$(document).ready(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const userPosLat = position.coords.latitude;
      const userPosLng = position.coords.longitude;



      $.ajax({
        url: "libs/php/getUserCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
          userLat: userPosLat,
          userLng: userPosLng,
        },
        
        success: function(result) {
      
        //  console.log(result['data']);
         $('#country-select').val(result['data']);
         $('#country-select').trigger("change");
    
      
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
        }
      }); 
      
    })
  }
  $.ajax({
    url: "libs/php/ISOCode.php",
    type: 'POST',
    dataType: 'json',
    
    success: function(result) {
  
      // Look through each country in the array and append them to the select element
     result['data'].forEach(element => {
      $('#country-select').append($('<option>', {
        value: element['code'],
        text: `${element['name']}`
      }))
     });

  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});

$('#country-select').on('change', function() {
  $.ajax({
    url: "libs/php/restCountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: $('#country-select').val()
    },
    
    success: function(result) {
    console.log(result['data']);
   
      const selectedCountry = result['data'];
      // set country's lat and lng
      const countryLat = selectedCountry[0]['latlng'][0];
      const countryLng = selectedCountry[0]['latlng'][1];
      const countryName = selectedCountry[0]['name'];

      const weatherLat = selectedCountry['capitalWeather']['coord']['lat'];
      const weatherLng = selectedCountry['capitalWeather']['coord']['lon'];
      const capitalWiki = selectedCountry['capitalWiki'];

      const capitalWeather = selectedCountry['capitalWeather'];

      const countryNews = selectedCountry['news']['articles'];
    
      const todaysDate = new Date().toISOString().slice(0,10);
      const todaysExchange = selectedCountry['conversionUSD'][todaysDate];
      const countryCurrencyCode = selectedCountry[0]['currencies'][0]['code'];

      const covidStats = selectedCountry['covidStats'];

      const avgPastTemps = selectedCountry['pastAvgMonthlyTemps'][0]['monthVals'];
      const avgFutureTemps = selectedCountry['futureAvgMonthlyTemps'][0]['monthVals'];
      const avgPastTempsFromYear = selectedCountry['pastAvgMonthlyTemps'][0]['fromYear'];
      const avgPastTempsToYear = selectedCountry['pastAvgMonthlyTemps'][0]['toYear'];

      
      
      const countryInfoHTML = `<h3>${selectedCountry[0]['name']}</h3>
                            <ul class="country-info">
                              <li>Region: ${selectedCountry[0]['region']}</li>
                              <li>Subregion: ${selectedCountry[0]['subregion']}</li>
                              <li>Population: ${selectedCountry[0]['population']}</li>
                              <li>Capital City: ${selectedCountry[0]['capital']}</li>
                              <li>Currency: ${selectedCountry[0]['currencies'][0]['name']} - ${selectedCountry[0]['currencies'][0]['code']}</li>
                              <img class="national-flag" src='${selectedCountry[0]['flag']}' alt='${selectedCountry[0]['name']}'s national flag'>
                            <ul>`

       // go to relevant lat and lng

      const countryPopup = L.popup()
            .setLatLng([countryLat, countryLng])
            .setContent(countryInfoHTML)
            .openOn(mymap);

      border.bindPopup(countryPopup);
      

      // Weather Marker
      removeMarker(weatherMarker);
   

      const weatherMarkerIcon = new LeafIcon({iconUrl: 'imgs/blue-icon.png'});


      weatherMarker = L.marker([weatherLat, weatherLng], {icon: weatherMarkerIcon}).addTo(mymap);

      const capitalWeatherHTML = `<h2>${capitalWeather['name']}</h2>
                                  <ul>
                                    <li>Weather: ${capitalWeather['weather'][0]['description']}</li>
                                    <li>Temperature: ${capitalWeather['main']['temp']}&#176;C</li>
                                    <li>Humidity: ${capitalWeather['main']['humidity']}%</li>
                                    <li>Wind Speed: ${capitalWeather['wind']['speed']}km/h</li>
                                   
                                  <ul>`
      
      weatherMarker.bindPopup(capitalWeatherHTML);

      // Wiki Marker Clusters
      removeMarker(wikiMarkers);


      wikiMarkers = L.markerClusterGroup();
      const wikiMarkerIcon = new LeafIcon({iconUrl: 'imgs/green-icon.png'});


      capitalWiki.forEach(element => {
        const wikiHTML = `${element.summary}
                          <a href="https://${element.wikipediaUrl}">Read more...</a>
                          `;
        wikiMarker = L.marker([element.lat, element.lng], {icon: wikiMarkerIcon});
        wikiMarker.bindPopup(wikiHTML);

        wikiMarkers.addLayer(wikiMarker);
      })

      mymap.addLayer(wikiMarkers);
      
      // News Info
      // Set a dummy item
      let newsHTML = `<div class="carousel-item"></div>`;
                     
   
      if(countryNews.length === 0) {
         // Default HTML for most countries
        newsHTML = `<h4>It seems we can't get any news for your chosen country. Please choose a different country.</h4>`
      } else {
        countryNews.forEach(article => {
          newsHTML +=  `<div class="carousel-item">
          <img class="d-block w-100 news-img" src="${article.urlToImage}" alt="${article.title}">
          <h2>${article.title}</h2>
          <a href="${article.url}">Read more...</a>
        </div>`;
        })
      }
      // Attach controls 
      newsHTML += ` <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="sr-only">Next</span>
                    </a>`
      // Set HTML 
      $('.carousel-inner').html(newsHTML);
      // Remove dummy item
      $('#news-items div:first-of-type').remove();
      // Add active class to first item to make it appear
      $('#news-items div:nth-of-type(2)').addClass('active');
     
      // Forex info
      if(mymap.hasLayer(forexMarker)) {
        mymap.removeLayer(forexMarker);
      }
      const forexMarkerIcon = new LeafIcon({iconUrl: 'imgs/icons8-money-64.png'});

      let forexHTML;
      forexMarker = L.marker([countryLat, countryLng], {icon: forexMarkerIcon}).addTo(mymap);
      
      if (todaysExchange) {
         forexHTML = `<h3>Forex Information</h3>
        <p>1 USD equals ${todaysExchange.close} ${countryCurrencyCode}</p>
        <ul>
          <li>Close: ${todaysExchange.close}</li>
          <li>Open: ${todaysExchange.open}</li>
          <li>High: ${todaysExchange.high}</li>
          <li>Low: ${todaysExchange.low}</li>
        </ul>
        `;
        
      } else {
        forexHTML = `<p>Please check back later for Forex information</p>`;
      }
     
      forexMarker.bindPopup(forexHTML);

      // Covid info
      const covidHTML = `<h2>${covidStats.Country}</h2>
      <ul>
        <li>Date: ${covidStats.Date}</li>
        <li>Confirmed today: ${covidStats.NewConfirmed}</li>
        <li>Deaths today: ${covidStats.NewDeaths}</li>
        <li>Recovered today: ${covidStats.NewRecovered}</li>
        <li>Total Confirmed cases: ${covidStats.TotalConfirmed}</li>
        <li>Total Confirmed deaths: ${covidStats.TotalDeaths}</li>
        <li>Total Confirmed recovered: ${covidStats.TotalRecovered}</li>
      </ul>
        `;

      $('#corona-stats').html(covidHTML);

      // Climate Change info
      $('#climateChangeTitle').html(`Climate Change from ${avgPastTempsFromYear} to ${avgPastTempsToYear}`);

      const roundedPastTemps = roundTempsDown(avgPastTemps);
      const roundedFutureTemps = roundTempsDown(avgFutureTemps);
     

      const pastTempsHTML = formatMonths(roundedPastTemps, avgPastTempsFromYear);
      const futureTempsHTML = formatMonths(roundedFutureTemps, avgPastTempsToYear);

      $('#past-stats').html(pastTempsHTML);
      $('#future-stats').html(futureTempsHTML);


    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
})

$('#country-select').on('change', function() {
  $.ajax({
    url: "libs/php/countryBorders.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: $('#country-select').val()
    },
    
    success: function(result) {
    
    // Check if there's a previous border, if so remove it.
    if(mymap.hasLayer(border)) {
      mymap.removeLayer(border);
    };


    border = L.geoJSON(result['data'], {
        style: function () {
          return {opacity: 1, color: '#67B26F'}
      }});

    // Zoom and fit the map edge around it
    border.addTo(mymap);
    mymap.fitBounds(border.getBounds());

  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});

$('#country-select').on('change', function() {
  $.ajax({
    url: "libs/php/countryBorders.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: $('#country-select').val()
    },
    
    success: function(result) {
    
    // Check if there's a previous border, if so remove it.
    if(mymap.hasLayer(border)) {
      mymap.removeLayer(border);
    };


    border = L.geoJSON(result['data'], {
        style: function () {
          return {opacity: 1, color: '#67B26F'}
      }});

    // Zoom and fit the map edge around it
    border.addTo(mymap);
    mymap.fitBounds(border.getBounds());

  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});
