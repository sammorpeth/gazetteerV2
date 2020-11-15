<?php
$executionStartTime = microtime(true) / 1000;

// $climatePastYears = '1940|1959';
$climatePastYears = $_REQUEST['climatePastYears'];
$exploded_value = explode('|', $climatePastYears);
$fromYear = $exploded_value[0];
$toYear = $exploded_value[1];



// $avgPastMonthlyTempsUrl = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/bccr_bcm2_0/tas/1940/1959/GBR.json';
$avgPastMonthlyTempsUrl = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/bccr_bcm2_0/tas/' . $fromYear.'/' . $toYear .'/' . 
$_REQUEST['countryCode']. '.json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$avgPastMonthlyTempsUrl);

$avgPastMonthlyTempsInfo = curl_exec($ch);
$avgPastMonthlyTempsDecode = json_decode($avgPastMonthlyTempsInfo,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['pastAvgMonthlyTemps'] = $avgPastMonthlyTempsDecode[0];
curl_close($ch);


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>