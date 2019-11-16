"use strict";

// Initializes the Demo.

function Demo() {
  // createLandBlock();
  $(window, document, undefined).ready(function() {
    $(".input").blur(function() {
      console.log("blur");
      var $this = $(this);
      if ($this.val()) $this.addClass("used");
      else $this.removeClass("used");
    });
  });

  // $("#tab1").on("click", function() {
  //   $("#tab1").addClass("login-shadow");
  //   $("#tab2").removeClass("signup-shadow");
  // });

  // $("#tab2").on("click", function() {
  //   $("#tab2").addClass("signup-shadow");
  //   $("#tab1").removeClass("login-shadow");
  // });
  document.addEventListener(
    "DOMContentLoaded",
    function() {
      // Shortcuts to DOM Elements.
      this.loginNev = document.getElementById("loginNev");
      this.userNev = document.getElementById("userNev");
      this.profilePic = document.querySelector(".demo-profile-pic");
      this.loginGoogle = document.getElementById("loginWithGoogle");

      // this.deleteButton.addEventListener(
      //   "click",
      //   this.deleteAccount.bind(this)
      // );

      this.emailToLogin = document.getElementById("emailToLogin");
      this.passwordToLogin = document.getElementById("passwordToLogin");
      this.emailToSignUp = document.getElementById("emailToSignUp");
      this.passwordToSignUp = document.getElementById("passwordToSignUp");
      this.firstNameToSignUp = document.getElementById("firstNameToSignUp");
      this.lastNameToSignUp = document.getElementById("lastNameToSignUp");
      this.phoneToSignUp = document.getElementById("phoneToSignUp");

      this.loginButton = document.getElementById("signin");
      this.registerButton = document.getElementById("confirmsignup");

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
    this.profilePic.src = user.photoURL;
    this.userNev.style.display = "block";
    this.loginNev.style.display = 'none';
   
  } else {
    this.userNev.style.display = "none";
    this.loginNev.style.display = 'block';
  }
};

Demo.prototype.register = function() {
  var email = this.emailToSignUp;
  var password = this.passwordToSignUp;
  var firstName = this.firstNameToSignUp;
  var lastName = this.lastNameToSignUp;
  var phone = this.phoneToSignUp;

  if (
    email.checkValidity() &&
    password.checkValidity() &&
    firstName.checkValidity() &&
    lastName.checkValidity() &&
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

    //
  }
};

Demo.prototype.loginWithGoogle = function() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

// Initiates the sign-in flow using LinkedIn sign in in a popup.
Demo.prototype.signIn = function() {
  var email = this.emailToLogin;
  var password = this.emailToLogin;

  if (email.checkValidity() && password.checkValidity()) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
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

// Load the demo.
window.demo = new Demo();
