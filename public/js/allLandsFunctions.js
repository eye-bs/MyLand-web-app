var data = [];
var sortByDate = document.getElementById("sortBy1");
var sortBySize = document.getElementById("sortBy2");

var minQuery = 0;
var maxQuery = 0;

$(window, document).ready(function() {
  allLandsQuery(null);
});

//!show / hidden filter
var vDrop = document.querySelector(".filter-row-right");

$(".filter-row").click(function() {
  showFilterDetail($(".filter-detail").css("display"));
});

function showFilterDetail(display) {
  if (display == "none") {
    $(".filter-detail").fadeIn();
    vDrop.innerHTML = "&#128770;";
  } else {
    $(".filter-detail").fadeOut();
    vDrop.innerHTML = "&#128772;";
  }
}

//!toggle sort bar
function toggleSortBar(bt) {
  if (bt.srcElement == sortByDate) {
    sortByDate.classList.add("active");
    sortBySize.classList.remove("active");
  } else {
    sortBySize.classList.add("active");
    sortByDate.classList.remove("active");
  }
}
//!toggle sort bar

sortByDate.addEventListener("click", function(e) {
  toggleSortBar(e);
});
sortBySize.addEventListener("click", function(e) {
  toggleSortBar(e);
});

//!handle option province select
$("#province").change(function() {
  allLandsQuery("?province=" + $("#province").val());
  $("#district").addClass("select-block-clicked");
  $("#locality").addClass("select-block-clicked");
  optionDistrict($("#province").val(), data);
});
//!handle option province select

//!handle option prodistrictvince select
$("#district").change(function() {
  allLandsQuery("?province=" + $("#province").val() + "&district=" + $("#district").val() );
  $("#locality").addClass("select-block-clicked");
  optionLocality($("#district").val(), data);
});
//!handle option district select

//!handle option prodistrictvince select
$("#locality").change(function() {
  allLandsQuery(
    "?district=" + $("#district").val() + "&locality=" + $("#locality").val()
  );
});
//!handle option district select

function filterAddress(getdata) {
  data = getdata
  province.innerHTML = "";
  var hashProvince = new Map();
  hashProvince.set("ทั้งหมด", "ทั้งหมด");

  for (let i = 0; i < data.length; i++) {
    hashProvince.set(data[i].address.lev_1, data[i].address.lev_1);
  }

  for (const [key, value] of hashProvince.entries()) {
    var option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    province.appendChild(option);
  }
}

function optionDistrict(value, data) {
  district.innerHTML = "";

  var hashDistrict = new Map();
  hashDistrict.set("ทั้งหมด", "ทั้งหมด");

  if (value != "ทั้งหมด") {
    district.classList.remove("select-block-clicked");
    for (let i = 0; i < data.length; i++) {
      if (data[i].address.lev_1 == value) {
        hashDistrict.set(data[i].address.lev_2, data[i].address.lev_2);
      }
    }

    for (const [key, value] of hashDistrict.entries()) {
      var option = document.createElement("option");
      option.value = value;
      option.innerHTML = value;
      district.appendChild(option);
    }
  } else {
    district.classList.add("select-block-clicked");
  }
}

function optionLocality(value, data) {
  locality.innerHTML = "";

  var hashLocality = new Map();
  hashLocality.set("ทั้งหมด", "ทั้งหมด");

  if (value != "ทั้งหมด") {
    locality.classList.remove("select-block-clicked");
    for (let i = 0; i < data.length; i++) {
      if (data[i].address.lev_2 == value) {
        hashLocality.set(data[i].address.locality, data[i].address.locality);
      }
    }

    for (const [key, value] of hashLocality.entries()) {
      var option = document.createElement("option");
      option.value = value;
      option.innerHTML = value;
      locality.appendChild(option);
    }
  } else {
    locality.classList.add("select-block-clicked");
  }
}

function createSlider(data) {
  var mapArea = [];
  for (let i = 0; i < data.length; i++) {
    mapArea.push(data[i].area.map_area);
  }
  //! create area slider
  mapArea.sort();
  var minRange = mapArea[0] - 100;
  var maxRange = mapArea[mapArea.length - 1] + 100;

  //! create area slider

  var regularSlider = document.querySelector(".regular-slider");
  // wNumb is their tool to format the number. We us it to format the numbers that appear in the handles
  var dollarPrefixFormat = wNumb({ decimals: 0, suffix: " ตรม." });

  try {
    var slider = noUiSlider.create(regularSlider, {
      // two handles
      start: [minRange, maxRange],
      // they are connected
      connect: true,
      // their minimal difference is 5 - this makes sense, because we want the user to always find items
      margin: 5,
      // tooltip for handle 1 and handle 2
      tooltips: [dollarPrefixFormat, dollarPrefixFormat],
      pips: {
        mode: "steps",
        density: 100,
        format: dollarPrefixFormat
      },
      // start and end point of the slider - we are going to calculate that later based on a set of items
      range: { min: minRange, max: maxRange }
    });
  } catch (e) {
    regularSlider.noUiSlider.updateOptions({
      start: [minRange, maxRange]
    });
  }

  regularSlider.noUiSlider.on("end", function(values) {
    var getRangeSlide = regularSlider.noUiSlider.get();
    minQuery = getRangeSlide[0];
    maxQuery = getRangeSlide[1];
    if (locality.value != "ทั้งหมด") {
      allLandsQuery(
        "?locality=" +
          locality.value +
          "&minsize=" +
          minQuery +
          "&maxsize=" +
          maxQuery
      );
    } else if (district.value != "ทั้งหมด") {
      allLandsQuery(
        "?district=" +
          district.value +
          "&minsize=" +
          minQuery +
          "&maxsize=" +
          maxQuery
      );
    } else {
      allLandsQuery(
        "?province=" +
          province.value +
          "&minsize=" +
          minQuery +
          "&maxsize=" +
          maxQuery
      );
    }

    // let filteredItems = filterItems(items, values)
    // renderItems(filteredItems)
  });
}
