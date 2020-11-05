<?php

  $executionStartTime = microtime(true) / 1000;
  
  // Rest Countries - Country Info
  $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=' . $_REQUEST['countryCode'];
  // $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=GB';
  

	$ch1 = curl_init();
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$infoUrl);

  $countryInfo = curl_exec($ch1);
  $decode = json_decode($countryInfo,true);

  curl_close($ch1);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = $decode;

  // Set country's lat and lng
  
  $countryLat = $output['data'][0]['latlng'][0];
  $countryLng = $output['data'][0]['latlng'][1];
  $countryCapital = $output['data'][0]['capital'];
  $alpha2Code = $output['data'][0]['alpha2Code'];

  $openWeatherID = '1ed19a25d23908772ac5615f151b498d';
  // $weatherUrl='http://api.openweathermap.org/data/2.5/weather?lat=' . $countryLat. '&lon='. $countryLng . '&appid=' . $openWeatherID;
  $capitalWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' . $countryCapital . ',' . $alpha2Code . '&appid=' . $openWeatherID . '&units=metric';
  

	$ch2 = curl_init();
	curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$capitalWeatherUrl);

  $weatherInfo = curl_exec($ch2);
  $capitalWeatherDecode = json_decode($weatherInfo,true);

  $output['data']['capitalWeather'] = $capitalWeatherDecode; 
  curl_close($ch2);

  $capitalLat = $output['data']['capitalWeather']['coord']['lat'];
  $capitalLng = $output['data']['capitalWeather']['coord']['lon'];

  // $weatherUrl='http://api.openweathermap.org/data/2.5/weather?lat=' . $countryLat. '&lon='. $countryLng . '&appid=' . $openWeatherID;
  $capitalWikiUrl = 'http://api.geonames.org/findNearbyWikipediaJSON?lat=' . $capitalLat .'&lng=' . $capitalLng . '&username=sammorpeth&maxRows=35';
  

	$ch3 = curl_init();
	curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch3, CURLOPT_URL,$capitalWikiUrl);

  $wikiInfo = curl_exec($ch3);
  $capitalWikiDecode = json_decode($wikiInfo,true);

  $output['data']['capitalWiki'] = $capitalWikiDecode['geonames']; 

  curl_close($ch3);

  header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 

?>
