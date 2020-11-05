let countryMarker;
let border;
const mymap = L.map('mapid').setView([0, 0], 6);

const OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

$(document).ready(function() {
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

     console.log(result['data']);
  
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

      const selectedCountry = result['data'];
      // set country's lat and lng
      countryLat = selectedCountry[0]['latlng'][0];
      countryLng = selectedCountry[0]['latlng'][1];
      
      const countryInfo = `<h2>${selectedCountry[0]['name']}</h2>
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
      
       countryMarker = L.marker([countryLat,countryLng],)
                                 .addTo(mymap);
 
      //  L.DomUtil.addClass(countryMarker._icon, 'country-marker');
       countryMarker.bindPopup(countryInfo);
    

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
    
    console.log(result['data']);

    if(mymap.hasLayer(border)) {
      mymap.removeLayer(border);
    };

    border = L.geoJSON(result['data']);
    console.log(border);

    
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
