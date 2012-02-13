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

function serializeAppState(leftMap, rightMap) {
  var c1 = leftMap.getCenter();
  var c2 = rightMap.getCenter();
  return [leftMap.getZoom(), c1.lat(), c1.lng(), c2.lat(), c2.lng()].join(',');
}

function deserializeAppState() {
  var state = location.hash.indexOf('#') == 0 ? location.hash.substring(1) : location.hash;
  var parts =  state.split(',');
  return {
    'zoom': parseInt(parts[0]),
    'leftCenter': new google.maps.LatLng(parts[1], parts[2]),
    'rightCenter': new google.maps.LatLng(parts[3], parts[4]) 
  }
}

/** Initializes everything. */
function initialize() {
  var state = deserializeAppState();
  var leftOptions = {
    center: state.leftCenter,
    zoom: state.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var rightOptions = {
    center: state.rightCenter,
    zoom: state.zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var leftMap = new google.maps.Map(document.getElementById('leftMap'), leftOptions);
  var rightMap = new google.maps.Map(document.getElementById('rightMap'), rightOptions);
  
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
  google.maps.event.addListener(leftMap, 'idle', function() {
    location.hash = serializeAppState(leftMap, rightMap);
  });
  google.maps.event.addListener(rightMap, 'idle', function() {
    location.hash = serializeAppState(leftMap, rightMap);
  });
  
  window.onhashchange = loadAppState(leftMap, rightMap);
}

$(document).ready(function() {
  initialize();
});