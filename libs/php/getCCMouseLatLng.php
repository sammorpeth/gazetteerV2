<?php 

  $executionStartTime = microtime(true) / 1000;

  // Rest Countries - Country Info
  $CountryCodeLatLngUrl = 'http://api.geonames.org/countryCode?lat=' .$_REQUEST['mouseLat']. '&lng='. $_REQUEST['mouseLng'] .'&type=JSON&username=sammorpeth';
  // $CountryCodeLatLngUrl = 'http://api.geonames.org/countryCode?lat=47.03&lng=10.2&username=sammorpeth';


  $ch1 = curl_init();
  curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch1, CURLOPT_URL,$CountryCodeLatLngUrl);

  $CountryCodeLatLngInfo = curl_exec($ch1);
  $decode = json_decode($CountryCodeLatLngInfo,true);

  curl_close($ch1);

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "mission saved";
  $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = $decode;

  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output); 
?>