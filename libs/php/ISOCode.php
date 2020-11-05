<?php

  $executionStartTime = microtime(true);

  // convert the JSON into PHP variable
  $countryData = json_decode(file_get_contents('../json/countryBorders.geo.json'), true);

  $countryCodes = [];

  foreach ($countryData['features'] as $feature) {
    $temp = null;
    $temp['code'] = $feature['properties']['iso_a2'];
    $temp['name'] = $feature['properties']['name'];
    $temp['borders'] = $feature['geometry']['coordinates'];

    array_push($countryCodes, $temp);
  }

  usort($countryCodes, function ($item1, $item2) {
    return $item1['name'] <=> $item2['name'];
  });



  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
  $output['data'] = $countryCodes;
  
  
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);
?>