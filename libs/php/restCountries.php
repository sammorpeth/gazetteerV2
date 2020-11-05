<?php

  $executionStartTime = microtime(true) / 1000;
  
  // Rest Countries - Country Info
  $infoUrl='https://restcountries.eu/rest/v2/alpha?codes=' . $_REQUEST['countryCode'];
  

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

  header('Content-Type: application/json; charset=UTF-8');
	
	echo json_encode($output); 

?>
