<?php
$executionStartTime = microtime(true) / 1000;

// $climateFutureYears = '2040|2059';
$climateYears = $_REQUEST['climateYears'];
$exploded_value = explode('|', $climateYears);
$fromYear = $exploded_value[0];
$toYear = $exploded_value[1];



// $avgFutureMonthlyTempsUrl = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/bccr_bcm2_0/tas/2020/2039/GBR.json';
$avgFutureMonthlyTempsUrl = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/bccr_bcm2_0/tas/' . $fromYear.'/' . $toYear .'/'
. $_REQUEST['countryCode'].'.json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$avgFutureMonthlyTempsUrl);

$avgFutureMonthlyTempsInfo = curl_exec($ch);
$avgFutureMonthlyTempsDecode = json_decode($avgFutureMonthlyTempsInfo,true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['avgMonthlyTemps'] = $avgFutureMonthlyTempsDecode[0];
curl_close($ch);


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>