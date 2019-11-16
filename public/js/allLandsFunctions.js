$(window, document).ready(function() {
  createSlider();
  allLandsQuery();
});

function filterAddress(data) {
  var province = document.getElementById("province");
 
  var locality = document.getElementById(" locality");

  var hashProvince = new Map();

  for (let i = 0; i < data.length; i++) {
    hashProvince.set(data[i].address.lev_1,data[i].address.lev_1);
  } 
  for(const [key, value] of hashProvince.entries()) {
       var optionsProvince = document.createElement("option");
      optionsProvince.value = value;
      optionsProvince.innerHTML = value;
      province.appendChild(optionsProvince);

      optionsProvince.onclick = (function(arg) {
        return function() {
          optionDistrict(arg);
        };
      })(optionsProvince.value);

  }

}

function optionDistrict(value , data){
   var district = document.getElementById("district");
   district.classList.remove("select-block-clicked");
   console.log("value", value);
  
}

function createSlider() {
  var regularSlider = document.querySelector(".regular-slider");
  // wNumb is their tool to format the number. We us it to format the numbers that appear in the handles
  var dollarPrefixFormat = wNumb({ decimals: 0, suffix: " ตรม." });
  var slider = noUiSlider.create(regularSlider, {
    // two handles
    start: [20, 60],
    // they are connected
    connect: true,
    // their minimal difference is 5 - this makes sense, because we want the user to always find items
    margin: 5,
    // tooltip for handle 1 and handle 2
    tooltips: [dollarPrefixFormat, dollarPrefixFormat],
    pips: {
      mode: "steps",
      density: 5,
      format: dollarPrefixFormat
    },
    // start and end point of the slider - we are going to calculate that later based on a set of items
    range: { min: 0, max: 100 }
  });
}
