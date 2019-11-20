var containerCon = document.querySelector(".container-con");
var containerNoncon = document.querySelector(".container-noncon");
var landRows = document.querySelector(".landRows");
var userName = document.getElementById("profile-username");
var userEmail = document.getElementById("profile-email");
var userPhone = document.getElementById("profile-phone");
var modalUserName = document.getElementById("modal-username");
var modalUserPhone = document.getElementById("modal-userphone");
var saveEditProfile = document.getElementById("saveEditProfile");

var userData;
var landsData;

$(window, document).ready(function() {
  containerCon.style.display = "none";
  containerNoncon.style.display = "none";
  sessionStorage.landEdit = null;
  landFevQuery(email);
  setUserrData();
});
var sortByDate = document.getElementById("sortBy1");
var sortBySize = document.getElementById("sortBy2");

//! set user data
function setUserrData() {

  var user = queryUser(email);
  user.then(data => {
    userData = data;
    userName.innerHTML = data.name;
    userEmail.innerHTML = data.email;
    userPhone.innerHTML = data.phone

    modalUserName.value = data.name;
    modalUserPhone.value = data.phone;
  });
}

//!toggle sort bar
function toggleSortBar(bt) {
  if (bt.srcElement == sortByDate) {
    sortByDate.classList.add("active");
    sortBySize.classList.remove("active");
    createBody(sortByDate);
  } else {
    createBody(sortBySize);
    sortBySize.classList.add("active");
    sortByDate.classList.remove("active");
  }
}

sortByDate.addEventListener("click", function(e) {
  toggleSortBar(e);
});
sortBySize.addEventListener("click", function(e) {
  toggleSortBar(e);
});
//!toggle sort bar

function createBody(bt) {
  if (bt == sortByDate) {
    //landFevQuery(email);
    landRows.style.display = "block";
    containerCon.style.display = "none";
    containerNoncon.style.display = "none";
  } else {
    approvedQuery(userData.requests_id);
    landRows.style.display = "none";
    containerCon.style.display = "block";
    containerNoncon.style.display = "block";
  }
}

saveEditProfile.addEventListener( "click", function(){
  var results = '{"name":"'+ modalUserName.value+'", "phone":"'+ modalUserPhone.value+'"}'
  $.ajax({
    type: "PUT",
    url: "https://stark-sea-12441.herokuapp.com/users/" + email,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(JSON.parse(results)),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function() {
    $('#modalSubscriptionForm').modal('toggle');
    userName.innerHTML =  modalUserName.value;
    userPhone.innerHTML = modalUserPhone.value;

    },
    failure: function(errMsg) {
      alert(errMsg);
    }
  });
})