var apiCall = document.getElementById("apiLandDtail");
var imgSlide = document.getElementById("carousel-example-2");
var containerDetail = document.querySelector(".container-detail");
var showMapBt = document.getElementById("showMapBt");
var toggleMapWidth = (window.innerHeight * 60) / 100;
var slideIndex = 1;

// ajax get land by id
function getLandByID(id) {
  getUrl = "https://stark-sea-12441.herokuapp.com/lands/" + id;
  return Promise.resolve(
    $.ajax({
      url: getUrl,
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

// สร้างหน้า detail
function createElementDetail() {
  var landId = sessionStorage.landId;
  if (landId == null) {
    landId = "5da2eedca3e6ea2ea83c5248";
  }
  var data = getLandByID(landId);
  data.then(data => {
    createImageSlide(data.img_link);
    getLatLng(data);

    var name = document.getElementById("detail");
    var detail = document.getElementById('details');
    var area = document.getElementById("area");
    var wide_face = document.getElementById('wide_face');
    var price = document.getElementById("price");
    var address = document.getElementById("address");

    name.innerHTML = data.land_name;
    detail.innerHTML = data.details;
    area.innerHTML = data.area.size + " " + data.area.type;
    wide_face.innerHTML = data.area.wide_face + " เมตร";
    price.innerHTML = getAllPrice(data.price);
    address.innerHTML = data.address;

    //! for admin 
    var public_utilities = document.getElementById('public_utilities');
    var land_for = document.getElementById('land_for');
    var sea_level = document.getElementById('sea_level');
    var transfer_terms = document.getElementById('transfer_terms');
    var approved = document.getElementById('approved');

    public_utilities.innerHTML = getPublicUtilities(data.public_utilities);
    land_for.innerHTML = data.land_for;
    sea_level.innerHTML = data.sea_level;
    transfer_terms.innerHTML = data.transfer_terms;
    approved.innerHTML = data.approved;

    //!
  });
}

//เก็บค่า สาธารณูปโภค
function getPublicUtilities(public_utilities) {
  var ret = "";
  if (public_utilities.water) {
    ret += "<p>น้ำ</p>"
  }
  if (public_utilities.electric) {
    ret += "<p>ไฟฟ้า</p>"
  }
  if (public_utilities.building) {
    ret += "<p>สิ่งก่อสร้าง</p>"
  }
  return ret;
}

// เก็บค่าราคาที่ดิน return เป็น string
function getAllPrice(price) {
  var getPrice = "";
  if (price.all != 0) {
    var all = price.all.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    getPrice += "<p>" + all + " บาท</p>";
  }
  if (price.square_yard != 0) {
    var square_yard = price.square_yard
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    getPrice += "<p>" + square_yard + " ต่อตารางวา</p>";
  }
  if (price.rai != 0) {
    var rai = price.rai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    getPrice += "<p>" + rai + " ต่อไร่</p> ";
  }
  return getPrice;
}

// image slide
function createImageSlide(imgArr) {
  var slideLayout = document.getElementById("slideLayout");
  for (let i = 0; i < imgArr.length; i++) {
    var img = document.createElement("img");
    img.setAttribute("class", "mySlides");
    img.src = imgArr[i];
    slideLayout.appendChild(img);
  }
  showDivs(slideIndex);
}

function plusDivs(n) {
  showDivs((slideIndex += n));
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex - 1].style.display = "block";
}
// end image slide

apiCall.addEventListener("click", createElementDetail);

// วาดรูปบน map ตาม lat lng
showMapBt.addEventListener("click", function () {
  $("#map").animate({
    height: toggleMapWidth + "px"
  });
  if (toggleMapWidth == 0) {
    toggleMapWidth = (window.innerHeight * 60) / 100;
  } else toggleMapWidth = 0;
});