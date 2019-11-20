var buildingBt = document.querySelector("div.utilities-b");
var electricBt = document.querySelector("div.utilities-e");
var waterBt = document.querySelector("div.utilities-w");
var submitBt = document.getElementById("submit-form");

var land_name = document.getElementById("land_name");
var area_rai = document.getElementById("area_rai");
var area_type = document.getElementById("area_type");
var wide_face = document.getElementById("wide_face");
var square_yard = document.getElementById("square_yard");
var details = document.getElementById("details");
var rai = document.getElementById("rai");
var all = document.getElementById("all");
var address = document.getElementById("address");
var sea_level = document.getElementById("sea_level");
var land_for = document.getElementById("land_for");
var transfer_terms = document.getElementById("transfer_terms");
var bounds = [];
var arrayfile = [];
var map_area = 0;
var locality, lev_2, lev_1;
var building = false;
var electric = false;
var water = false;
var data = null;

var resultJson = document.getElementById("resultJson");

$(window).keydown(function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
});

$(".utilities-b").click(function() {
  if (building) {
    $(".utilities-b").removeClass("active");
    $("img.utilities-b").attr("src", "images/buildingGreen.png");
    building = false;
  } else {
    $(".utilities-b").addClass("active");
    $("img.utilities-b").attr("src", "images/buildingWhite.png");
    building = true;
  }
  // $(".utilities-b").addClass("active");
  // $(".utilities-e").removeClass("active");
  // $(".utilities-w").removeClass("active");
  // $("img.utilities-b").attr("src", "images/buildingWhite.png");
  // $("img.utilities-e").attr("src", "images/electricGreen.png");
  // $("img.utilities-w").attr("src", "images/waterGreen.png");
});
$(".utilities-e").click(function() {
  if (electric) {
    $(".utilities-e").removeClass("active");
    $("img.utilities-e").attr("src", "images/electricGreen.png");
    electric = false;
  } else {
    $(".utilities-e").addClass("active");
    $("img.utilities-e").attr("src", "images/electricWhite.png");
    electric = true;
  }
  // $(".utilities-e").addClass("active");
  // $(".utilities-b").removeClass("active");
  // $(".utilities-w").removeClass("active");
  // $("img.utilities-e").attr("src", "images/electricWhite.png");
  // $("img.utilities-b").attr("src", "images/buildingGreen.png");
  // $("img.utilities-w").attr("src", "images/waterGreen.png");
});
$(".utilities-w").click(function() {
  if (water) {
    $(".utilities-w").removeClass("active");
    $("img.utilities-w").attr("src", "images/waterGreen.png");
    water = false;
  } else {
    $(".utilities-w").addClass("active");
    $("img.utilities-w").attr("src", "images/waterWhite.png");
    water = true;
  }
  // $(".utilities-w").addClass("active");
  // $(".utilities-b").removeClass("active");
  // $(".utilities-e").removeClass("active");
  // $("img.utilities-w").attr("src", "images//waterWhite.png");
  // $("img.utilities-b").attr("src", "images/buildingGreen.png");
  // $("img.utilities-e").attr("src", "images/electricGreen.png");
});

function postToDatabase(imgArr) {
  var results = "";
  if (
    land_name.checkValidity() &&
    area_rai.checkValidity() &&
    wide_face.checkValidity() &&
    address.checkValidity()
  ) {
    if (bounds.length == 0) {
      alert("กรุณาเลือกพื้นที่ของที่ดินในแผนที่แล้วกดปุ่ม 'บันทึกแผนที่'");
    } else {
      event.preventDefault();
      arrayfile.forEach(function(file) {
        uplodeImageFirebase(file, num);
      });
    }
  }
}

// function onEditLand(landDetails) {
//   land_name.value = landDetails.land_name;
//   area_rai.value = landDetails.area.size;
//   area_type.value = landDetails.area.type;
//   details.value = landDetails.details;
//   wide_face.value = landDetails.area.wide_face;
//   square_yard.value = landDetails.price.square_yard || 0;
//   rai.value = landDetails.price.rai || 0;
//   all.value = landDetails.price.all || 0;
//   address.value = landDetails.address.full;
//   sea_level.value = landDetails.sea_level;
//   if (landDetails.public_utilities.building) {
//     buildingBt.click();
//   }
//   if (landDetails.public_utilities.water) {
//     waterBt.click();
//   }
//   if (landDetails.public_utilities.electric) {
//     electricBt.click();
//   }
//   getLatLng(landDetails);
// }

//! submit land

//! for add images
$(document).ready(function() {

  data =  JSON.parse(sessionStorage.landEdit);

  console.log(data);

  if (data != null) {
    var landDetails = data;
    land_name.value = landDetails.land_name;
    area_rai.value = landDetails.area.size;
    area_type.value = landDetails.area.type;
    details.value = landDetails.details;
    wide_face.value = landDetails.area.wide_face;
    square_yard.value = landDetails.price.square_yard || 0;
    rai.value = landDetails.price.rai || 0;
    all.value = landDetails.price.all || 0;
    address.value = landDetails.address.full;
    sea_level.value = landDetails.sea_level;
    if (landDetails.public_utilities.building) {
      buildingBt.click();
    }
    if (landDetails.public_utilities.water) {
      waterBt.click();
    }
    if (landDetails.public_utilities.electric) {
      electricBt.click();
    }
    getLatLng(landDetails);
  }

  document
    .getElementById("pro-image")
    .addEventListener("change", readImage, false);

  $(".preview-images-zone").sortable();

  $(document).on("click", ".image-cancel", function() {
    let no = $(this).data("no");
    $(".preview-image.preview-show-" + no).remove();
  });
});

var num = 4;

submitBt.addEventListener("click", function(event) {
  if (
    land_name.checkValidity() &&
    area_rai.checkValidity() &&
    wide_face.checkValidity() &&
    address.checkValidity()
  ) {
    if (bounds.length == 0) {
      alert("กรุณาเลือกพื้นที่ของที่ดินในแผนที่แล้วกดปุ่ม 'บันทึกแผนที่'");
    } else {
      if(arrayfile.length != 0){
  event.preventDefault();
      arrayfile.forEach(function(file) {
        uplodeImageFirebase(file, num);
      });
      }else{
        alert("กรุณาเพิ่มรูปภาพ'อย่างน้อย 1 ภาพ");
      }
    
    }
  }
});

function readImage() {
  if (window.File && window.FileList && window.FileReader) {
    var files = event.target.files; //FileList object
    var output = $(".preview-images-zone");
    arrayfile = [];

    for (let i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file.type.match("image")) continue;
      arrayfile.push(file);

      var picReader = new FileReader();

      picReader.addEventListener("load", function(event) {
        var picFile = event.target;
        var html =
          '<div class="preview-image preview-show-' +
          num +
          '">' +
          '<div class="image-cancel" data-no="' +
          num +
          '">x</div>' +
          '<div class="image-zone"><img id="pro-img-' +
          num +
          '" src="' +
          picFile.result +
          '"></div>' +
          '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' +
          num +
          '" class="btn btn-light btn-edit-image">edit</a></div>' +
          "</div>";

        output.append(html);
        num = num + 1;
      });

      picReader.readAsDataURL(file);
    }

    $("#pro-image").val("");
  } else {
    console.log("Browser not support");
  }
}

var arrayURL = [];
function uplodeImageFirebase(file, num) {
  var uploader = document.getElementById("uploader");

  var storageRef = firebase.storage().ref("me/" + file.name);
  var uploadTask = storageRef.put(file);
  uploadTask.on(
    "state_changed",
    function(snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = progress;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function(error) {
      // Handle unsuccessful uploads
    },
    function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        // user defined length
        arrayURL.push(downloadURL);
        covertToJson(arrayURL);
      });
    }
  );
}
function covertToJson(arrayurl) {
  console.log("start covertToJson", arrayurl);
  var results = "";
  var imgArr = "";
  for (var i = 0; i < arrayurl.length; i++) {
    imgArr += '"' + arrayurl[i] + '"';
    if (i == arrayurl.length - 1) {
      break;
    } else {
      imgArr += ",";
    }
  }


  var tt = transfer_terms.value;
  var square_yard_price = square_yard.value || 0;
  var rai_price = rai.value || 0;
  var all_price = all.value || 0;
  var b1 = bounds[0].toString();

  results +=
    '{"area": {"map_area":' +
    map_area +
    ',"size": "' +
    area_rai.value +
    '","type": "' +
    area_type.value +
    '","wide_face": ' +
    wide_face.value +
    '},"address": {"full": "' +
    address.value +
    '","locality": "' +
    locality +
    '","lev_2": "' +
    lev_2 +
    '","lev_1": "' +
    lev_1 +
    '"},"price": {"square_yard": ' +
    square_yard_price +
    ',"rai": ' +
    rai_price +
    ',"all": ' +
    all_price +
    '},"public_utilities": {"building": ' +
    building +
    ',"water":' +
    water +
    ',"electric":' +
    electric +
    '},"img_link": [' +
    imgArr +
    '],"land_name":"' +
    land_name.value +
    '","land_for": "' +
    land_for.value +
    '","details": "' +
    details.value +
    '","sea_level": "' +
    sea_level.value +
    '","transfer_terms": "' +
    tt +
    '","location": ' +
    JSON.stringify(bounds) +
    ',"approved": false , "owner": "' +
    userData._id +
    '"}';

  console.log(results);

  if (data != null) {

    $.ajax({
      type: "PUT",
      url: " https://stark-sea-12441.herokuapp.com/lands/update/" + data._id,
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(JSON.parse(results)),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
      
        sessionStorage.landId = JSON.stringify(data); //will set object to the stringified myObject
            window.location.href = "detailland.html";
      },
      failure: function(errMsg) {
        alert(errMsg);
      }
    });
  } else {
    console.log("ajax post", results);
    $.ajax({
      type: "POST",
      url: "https://stark-sea-12441.herokuapp.com/new/land",
      // The key needs to match your method's input parameter (case-sensitive).
      data: JSON.stringify(JSON.parse(results)),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data) {
        $.ajax({
          type: "PUT",
          url: "https://stark-sea-12441.herokuapp.com/users/" + email,
          // The key needs to match your method's input parameter (case-sensitive).
          data: JSON.stringify(
            JSON.parse('{"requests_id" : "' + data._id + '"}')
          ),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function() {
            console.log("บันทึกเรียบร้อย");
            sessionStorage.landId = JSON.stringify(data); //will set object to the stringified myObject
            window.location.href = "detailland.html";
          },
          failure: function(errMsg) {
            alert(errMsg);
          }
        });
      },
      failure: function(errMsg) {
        alert(errMsg);
      }
    });
  }
}

//! for add images
