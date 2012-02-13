/** Enables Places autocomplete for given text input and adds a listener
 *  that centers the map when a place is selected. */
function initializeSearch(input, map) {
  // http://code.google.com/apis/maps/documentation/javascript/examples/places-autocomplete.html
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.setTypes(['geocode']); // [] == all types (establishment and geocode)
  autocomplete.bindTo('bounds', map);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
  });
}

/** Initializes everything. */
function initialize() {
  var options = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var leftMap = new google.maps.Map(document.getElementById('leftMap'), options);
  var rightMap = new google.maps.Map(document.getElementById('rightMap'), options);
  
  initializeSearch(document.getElementById('leftSearchField'), leftMap);
  initializeSearch(document.getElementById('rightSearchField'), rightMap);
  
  var setZoom = true;
  google.maps.event.addListener(leftMap, 'zoom_changed', function() {
    if (setZoom) {
      setZoom = false;
      rightMap.setZoom(leftMap.getZoom());
      setZoom = true;
    }
  });
  google.maps.event.addListener(rightMap, 'zoom_changed', function() {
    if (setZoom) {
      setZoom = false;  // temporarily disable handling to prevent infinite recursion
      leftMap.setZoom(rightMap.getZoom());
      setZoom = true;
    }
  });
}

$(document).ready(function() {
  initialize();
});