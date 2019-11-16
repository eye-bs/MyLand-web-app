var kku = {
  lat: 14.9780154,
  lng: 102.1029185
};
var drawingManager;
var controlUI;
var saveEditBt;
var clearBt;
var countButton = 0;
var map;
//ปุ่มเพิ่่ม-บันทึก
function addButton(controlDiv, map) {
  // Set CSS for the control border.

  controlUI = document.createElement("div");
  controlUI.setAttribute("class", "control-ui");
  controlUI.title = "Click to recenter the map";
  controlDiv.appendChild(controlUI);

  var table = document.createElement("table");
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");

  // Set CSS for the control interior.
  saveEditBt = document.createElement("div");
  saveEditBt.setAttribute("class", "control-map");
  saveEditBt.style.lineHeight = "38px";
  saveEditBt.innerHTML = "+ เพิ่มพื้นที่";
  // controlUI.appendChild(saveEditBt);

  td1.appendChild(saveEditBt);
  tr.appendChild(td1);
  table.appendChild(tr);

  controlUI.appendChild(table);

  clearBt = document.createElement("div");
  clearBt.setAttribute("class", "control-map");
  clearBt.style.lineHeight = "38px";
  clearBt.innerHTML = "ล้าง";
  td2.appendChild(clearBt);
  tr.appendChild(td2);

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
    saveEditBt.innerHTML = "บันทึก";
    drawingManager.setMap(map);
  });
}
// ปักหมุดเสร็จแล้ว
function onPolygonComplete(polygon) {
  saveEditBt.addEventListener("click", function() {
    console.log("count" + countButton);
    //save
    if (countButton % 2 === 0) {
      saveEditBt.innerHTML = "แก้ไข";
      polygon.setEditable(false);
      polygon.setOptions({
        fillColor: "blue",
        strokeColor: "blue"
      });
      var polygonBounds = polygon.getPath();
      var bounds = [];
      for (var i = 0; i < polygonBounds.length; i++) {
        var point = {
          pointer: i,
          lat: polygonBounds.getAt(i).lat(),
          lng: polygonBounds.getAt(i).lng()
        };
        bounds.push(point);
      }
      console.log(JSON.stringify(bounds));
    }
    //edit
    else {
      saveEditBt.innerHTML = "บันทึก";
      polygon.setEditable(true);
      polygon.setOptions({
        fillColor: "orange",
        strokeColor: "orange"
      });
    }
    countButton++;
  });
  clearBt.addEventListener("click", function() {
    polygon.setEditable(true);
    polygon.setOptions({
      path: []
    });
    countButton = 0;
    saveEditBt.innerHTML = "+ เพิ่มพื้นที่";
  });
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: kku,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });

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
    zoom: 18.5,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });

  
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
  var latLngTocalc = [];
  var centerLat = 0,
    centerLng = 0;
  // data.then(data => {
    var location = data.location;
    for (let i = 0; i < location.length; i++) {
      var obj = { lat: location[i].lat, lng: location[i].lng };
      ret.push(obj);
      latLngTocalc.push(new google.maps.LatLng(location[i].lat, location[i].lng));
      centerLat += location[i].lat;
      centerLng += location[i].lng;
    }

    centerLat = centerLat / location.length;
    centerLng = centerLng / location.length;

    var areaPointer = ret;
    
    //! var area = google.maps.geometry.spherical.computeArea(latLngTocalc);
    //! console.log('area', area);

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
    drawArea.setMap(map);
 // });
}
