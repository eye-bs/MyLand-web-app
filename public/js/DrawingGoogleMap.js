var kku = {
  lat: 14.9780154,
  lng: 102.1029185
};
var drawingManager;
var controlUI;
var saveEditBt;
var clearBt;
var countButton = 0;
var geocoder;
var infowindow;
var map;
//ปุ่มเพิ่่ม-บันทึก
function addButton(controlDiv, map) {
  // Set CSS for the control border.

  controlUI = document.createElement("div");
  controlUI.setAttribute("class", "control-ui");
  controlUI.title = "Click to recenter the map";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  saveEditBt = document.createElement("p");
  saveEditBt.setAttribute("class", "control-map");
  saveEditBt.innerHTML = "+ เพิ่มพื้นที่";
  // controlUI.appendChild(saveEditBt);

  clearBt = document.createElement("p");
  clearBt.setAttribute("class", "clean-map");
  clearBt.innerHTML = "ล้าง";

  controlUI.appendChild(saveEditBt);
  controlUI.appendChild(clearBt);

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: false,
    polygonOptions: {
      editable: true,
      strokeColor: "red",
      strokeOpacity: 1.0,
      strokeWeight: 3,
      fillColor: "red"
    }
  });

  // Setup the click event listeners: simply set the map to Chicago.
  saveEditBt.addEventListener("click", function() {
    saveEditBt.innerHTML = "บันทึกแผนที่";
    drawingManager.setMap(map);
  });
}
// ปักหมุดเสร็จแล้ว
function onPolygonComplete(polygon) {
  saveEditBt.addEventListener("click", function() {
    //save
    if (countButton % 2 === 0) {
      saveEditBt.innerHTML = "แก้ไข";
      polygon.setEditable(false);
      polygon.setOptions({
        fillColor: "blue",
        strokeColor: "blue"
      });
      var polygonBounds = polygon.getPath();
      var latLngTocalc = [];
      for (var i = 0; i < polygonBounds.length; i++) {
        var lat = polygonBounds.getAt(i).lat();
        var lng = polygonBounds.getAt(i).lng();
        var point = {
          pointer: i,
          lat: lat,
          lng: lng
        };
        latLngTocalc.push(new google.maps.LatLng(lat, lng));

        bounds.push(point);
      }
      var area = google.maps.geometry.spherical.computeArea(latLngTocalc);
      map_area = area;
      geocodeLatLng(geocoder, map, infowindow, bounds[0]);
      console.log(area);
    }
    //edit
    else {
      saveEditBt.innerHTML = "บันทึกแผนที่";
      polygon.setEditable(true);
      polygon.setOptions({
        fillColor: "orange",
        strokeColor: "orange"
      });
    }
    countButton++;
  });
  clearBt.addEventListener("click", function() {
    initMap();
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: kku,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });

  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow();

  var centerControlDiv = document.createElement("div");
  var centerControl = new addButton(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  google.maps.event.addListener(drawingManager, "polygoncomplete", function(
    polygon
  ) {
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.FALSE);
    onPolygonComplete(polygon);
  });
}

function initMapDetails() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: kku,
    zoom: 18,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });

  var centerControlDiv = document.createElement("div");
  var centerControl = new addButton(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  centerControlDiv.style.display = 'none';

  // Define the LatLng coordinates for the polygon's path.
}

function getLandByID() {
  return Promise.resolve(
    $.ajax({
      url:
        "https://stark-sea-12441.herokuapp.com/lands/5da2eedca3e6ea2ea83c5248",
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function getLatLng(data) {
  //  var data = getLandByID();
  var ret = [];
  var centerLat = 0,
    centerLng = 0;
  // data.then(data => {
  var location = data.location;
  for (let i = 0; i < location.length; i++) {
    var obj = { lat: location[i].lat, lng: location[i].lng };
    ret.push(obj);
    centerLat += location[i].lat;
    centerLng += location[i].lng;
  }

  centerLat = centerLat / location.length;
  centerLng = centerLng / location.length;

  var areaPointer = ret;

  // Construct the polygon.123+456+789
  var drawArea = new google.maps.Polygon({
    paths: areaPointer,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
  map.setCenter({ lat: centerLat, lng: centerLng });
  onPolygonComplete(drawArea);
  saveEditBt.click();
  drawArea.setMap(map);
  // });
}

//!map search
$("#mapSearchBt").click(function() {
  initSearchMap($("#map_search").val());
});

function initSearchMap(inputQuery) {
  var sydney = new google.maps.LatLng(-33.867, 151.195);

  infowindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();

  var request = {
    query: inputQuery,
    fields: ["name", "geometry"]
  };

  var service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      //  createMarker(results[i]);
      var marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map
      });

      map.setCenter(results[0].geometry.location);
    }
  });
}

function geocodeLatLng(geocoder, map, infowindow, getlatlng) {
  var latlng = getlatlng;
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === "OK") {
      if (results[0]) {
        var address_components = results[0].address_components;
        for (let i = 0; i < address_components.length; i++) {
          var types = address_components[i].types;
          if (types.includes("sublocality_level_1")) {
            locality = address_components[i].short_name;
          }else if (types.includes("administrative_area_level_2")){
            lev_2 = address_components[i].short_name;
          }else if(types.includes("administrative_area_level_1")){
            lev_1 = address_components[i].short_name;
            break;
          }
        }

      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}

function include(arr, obj) {
  return arr.indexOf(obj) != -1;
}
