let countryMarker;
let wikiMarkers;
let weatherMarker;
let border;
const mymap = L.map('mapid').setView([0, 0], 6);

const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

$(document).ready(function() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userPosLat = position.coords.latitude;
      userPosLng = position.coords.longitude;
      mymap.setView([userPosLat, userPosLng]);
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
    // console.log(result['data']);

      const selectedCountry = result['data'];
      // set country's lat and lng
      const countryLat = selectedCountry[0]['latlng'][0];
      const countryLng = selectedCountry[0]['latlng'][1];
      const weatherLat = selectedCountry['capitalWeather']['coord']['lat'];
      const weatherLng = selectedCountry['capitalWeather']['coord']['lon'];
      const capitalWiki = selectedCountry['capitalWiki'];
      const capitalWeather = selectedCountry['capitalWeather'];
      
      const countryInfoHTML = `<h2>${selectedCountry[0]['name']}</h2>
                            <ul class="country-info">
                              <li>Region: ${selectedCountry[0]['region']}</li>
                              <li>Subregion: ${selectedCountry[0]['subregion']}</li>
                              <li>Population: ${selectedCountry[0]['population']}</li>
                              <li>Capital City: ${selectedCountry[0]['capital']}</li>
                              <li>Currency: ${selectedCountry[0]['currencies'][0]['name']} - ${selectedCountry[0]['currencies'][0]['code']}</li>
                              <img class="national-flag" src='${selectedCountry[0]['flag']}' alt='${selectedCountry[0]['name']}'s national flag'>
                            <ul>`

       // go to relevant lat and lng
      mymap.flyTo([countryLat, countryLng], 4);

      if(mymap.hasLayer(countryMarker)) {
        mymap.removeLayer(countryMarker);
      };
      
      // Country Marker
      countryMarker = L.marker([countryLat,countryLng],)
                                .addTo(mymap);

      countryMarker.bindPopup(countryInfoHTML);

      // Weather Marker
      if(mymap.hasLayer(weatherMarker)) {
        mymap.removeLayer(weatherMarker);
      };

      weatherMarker = L.marker([weatherLat, weatherLng]).addTo(mymap);

      const capitalWeatherHTML = `<h2>${capitalWeather['name']}</h2>
                                  <ul>
                                    <li>Weather: ${capitalWeather['weather'][0]['description']}</li>
                                    <li>Temperature: ${capitalWeather['main']['temp']}&#176;C</li>
                                    <li>Humidity: ${capitalWeather['main']['humidity']}%</li>
                                    <li>Wind Speed: ${capitalWeather['wind']['speed']}km/h</li>
                                   
                                  <ul>`
      
      weatherMarker.bindPopup(capitalWeatherHTML);

      // Wiki Marker Clusters
      if(mymap.hasLayer(wikiMarkers)) {
        mymap.removeLayer(wikiMarkers);
      }

      wikiMarkers = L.markerClusterGroup();

      capitalWiki.forEach(element => {
        const wikiHTML = `${element.summary}
                          <a href="https://${element.wikipediaUrl}">Read more...</a>
                          `;
        wikiMarker = L.marker([element.lat, element.lng]);
        wikiMarker.bindPopup(wikiHTML);

        wikiMarkers.addLayer(wikiMarker);
      })

      mymap.addLayer(wikiMarkers);


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
        style: function (feature) {
          return {opacity: 1, color: '#8AC0DE'}
      }});

    // Zoom and fit the map edge around it
    mymap.fitBounds(border.getBounds());
    border.addTo(mymap);
  
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    }
  }); 
});
