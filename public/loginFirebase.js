"use strict";

var email = "example@e.com";
var globalUser = null;
var userData;
var landsData;

function Demo() {
  // createLandBlock();
  $(window, document, undefined).ready(function() {
 // checkUserDb();
    $(".input").blur(function() {
      var $this = $(this);
      if ($this.val()) $this.addClass("used");
      else $this.removeClass("used");
    });
  });

  $('#registerBt').click(function() {
    $('#modal-login').modal('toggle');
    $('#modal-register').modal('toggle');
  });

  $("#saveEditProfile").click(function() {
    if(fullName.checkValidity() &&phoneNumber.checkValidity()){
      var userData = '{"name": "'+fullName.value+'","phone": "'+phoneNumber.value+'","email":"'+email+'"}'
      registerDB(userData);
    }
   

  })

  document.addEventListener(
    "DOMContentLoaded",
    function() {
      // Shortcuts to DOM Elements.
      this.loginNev = document.getElementById("loginNev");
      this.userNev = document.getElementById("userNev");
      this.profilePic = document.querySelector(".demo-profile-pic");
      this.loginGoogle = document.getElementById("loginWithGoogle");

      this.emailToLogin = document.getElementById("emailToLogin");
      this.passwordToLogin = document.getElementById("passwordToLogin");
      this.emailToSignUp = document.getElementById("emailToSignUp");
      this.passwordToSignUp = document.getElementById("passwordToSignUp");
      this.firstNameToSignUp = document.getElementById("firstNameToSignUp");
      this.phoneToSignUp = document.getElementById("phoneToSignUp");

      this.loginButton = document.getElementById("signin");
      this.registerButton = document.getElementById("confirmsignup");


      this.fullName = document.getElementById("modal-username-regis");
      this.phoneNumber = document.getElementById("modal-userphone-regis");


      this.loginButton.addEventListener("click", this.signIn.bind(this));
      this.registerButton.addEventListener("click", this.register.bind(this));
      this.loginGoogle.addEventListener(
        "click",
        this.loginWithGoogle.bind(this)
      );

      firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
    }.bind(this)
  );
}

// Triggered on Firebase auth state change.
Demo.prototype.onAuthStateChanged = function(user) {
  if (user) {
 
    globalUser = user;
    this.profilePic.src = user.photoURL;
    this.userNev.style.display = "block";
    this.loginNev.style.display = "none";
    email = user.email;
    readUserData();
    $("#modal-login").modal("hide");
    checkUserDb();
  } else {
    this.userNev.style.display = "none";
    this.loginNev.style.display = "block";
    alert("เกิดข้อผิดพลาดขณะ login โปรดลองใหม่อีกครั้ง");
  }
};

Demo.prototype.register = function() {
  var email = this.emailToSignUp;
  var password = this.passwordToSignUp;
  var firstName = this.firstNameToSignUp;
  var phone = this.phoneToSignUp;

  if (
    email.checkValidity() &&
    password.checkValidity() &&
    firstName.checkValidity() &&
    phone.checkValidity()
  ) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });

    var userData = '{"name": "'+firstName.value+'","phone": "'+phone.value+'","email":"'+email.value+'"}'
    registerDB(userData);
  }
};

Demo.prototype.loginWithGoogle = function() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  $('#modalSubscriptionForm').modal('toggle');
};

// Initiates the sign-in flow using LinkedIn sign in in a popup.
Demo.prototype.signIn = function() {
  var email = this.emailToLogin;
  var password = this.passwordToLogin;

  if (email.checkValidity() && password.checkValidity()) {
    console.log(email.value, password.value);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }
};

// Signs-out of Firebase.
Demo.prototype.signOut = function() {
  firebase.auth().signOut();
};

// Deletes the user's account.
Demo.prototype.deleteAccount = function() {
  firebase
    .auth()
    .currentUser.delete()
    .then(function() {
      window.alert("Account deleted. Check your email for a confirmation.");
    })
    .catch(function(error) {
      if (error.code === "auth/requires-recent-login") {
        window.alert(
          "You need to have recently signed-in to delete your account. Please sign-in and try again."
        );
        firebase.auth().signOut();
      }
    });
};

function checkUserDb() {
  var getUrl = "https://stark-sea-12441.herokuapp.com/users/" + email;
  $.ajax({
    url: getUrl,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function(data, status) {
      // $("#content-api").html(JSON.stringify(data));
      userData = data;
    },
    error: function(jqXhr, textStatus, errorThrown) {
      firebase.auth().signOut();
    }
  });
}

function registerDB(regisData){
  $.ajax({
    type: "POST",
    url: "https://stark-sea-12441.herokuapp.com/register",
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(JSON.parse(regisData)),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
      alert("ลงทะเบียนสำเร็จ");
      $('#modal-register').modal('hide');
      $('#modalSubscriptionForm').modal('hide');
    },
    failure: function(errMsg) {
      alert("เกิดข้อผิดพลาดขณะลงทะเบียน ลองใหม่อีกครั้ง");
    }
  });
}

// Load the demo.
window.demo = new Demo();
