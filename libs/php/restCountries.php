<?php

  $executionStartTime = microtime(true) / 1000;
  
  // Rest Countries - Country Info
  $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=' . $_REQUEST['countryCode'];
  // $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=GB';

  // flickr api key
//   d05256dfd2c01b4b9a532e1a8a15ba47

// Secret:
// 595c7987bb0fe5ef

// Edit app details - Edit auth flow for this app - View all Apps by You



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

  // ea1848fa-ca80-4ada-9cf9-3390bc72f3c8

  


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

  // $currencyUrl = 'https://v2.api.forex/infos/currency/GBP.json';


  // $flickrKey = 'd05256dfd2c01b4b9a532e1a8a15ba47';
  // $flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' . $flickrKey.'&lat=55&lon=-1.6&per_page=10&format=json';

  $newsKey = 'a920f9bb0b2f438ea92c53fa19f9a2d9';
  $newsUrl = 'https://newsapi.org/v2/top-headlines?country='. $_REQUEST['countryCode'].'&apiKey=a920f9bb0b2f438ea92c53fa19f9a2d9&pageSize=5';

  $ch4 = curl_init();
	curl_setopt($ch4, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch4, CURLOPT_URL,$newsUrl);

  $newsInfo = curl_exec($ch4);
  $newsDecode = json_decode($newsInfo,true);

  $output['data']['news'] = $newsDecode; 

  curl_close($ch4);

  header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 

?>
