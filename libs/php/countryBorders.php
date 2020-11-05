<?php
$executionStartTime = microtime(true) / 1000;

$countries = json_decode(file_get_contents('../json/countryBorders.geo.json'), true);

$matchedCountryBorders;

foreach ($countries['features'] as $feature) {
 if ($feature['properties']['iso_a2'] == $_REQUEST['countryCode']) {
  $matchedCountryBorders = $feature;
 }
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $matchedCountryBorders;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>