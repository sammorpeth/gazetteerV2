<?php


$coronaUrl='https://api.covid19api.com/summary';

$ch6 = curl_init();
curl_setopt($ch6, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch6, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch6, CURLOPT_URL,$coronaUrl);

$coronaInfo = curl_exec($ch6);
$coronaInfoDecode = json_decode($coronaInfo,true);

$coronaInfoDecode['Countries']; 
curl_close($ch6);

foreach ($coronaInfoDecode['Countries'] as $country) {
  if($country['CountryCode'] == $_REQUEST['countryCode']) {
    $matchedStats = $country;
  }
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($matchedStats); 


?>