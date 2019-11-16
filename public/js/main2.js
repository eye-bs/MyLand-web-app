/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes the Demo.

var loginUser = null;

var toPage2 = document.getElementById('toPage2');

function itemClick(){
    sessionStorage.myObject =  JSON.stringify({ "email": loginUser.email,"picture" : loginUser.picture }); //will set object to the stringified myObject
    
    window.location.href = "page22.html";
}

toPage2.addEventListener('click' ,itemClick);

function Demo() {
  document.addEventListener('DOMContentLoaded', function() {
    // Shortcuts to DOM Elements.
    this.signInButton = document.getElementById('demo-sign-in-button');
    this.signOutButton = document.getElementById('demo-sign-out-button');
    this.nameContainer = document.getElementById('demo-name-container');
    this.uidContainer = document.getElementById('demo-uid-container');
    this.deleteButton = document.getElementById('demo-delete-button');
    this.profilePic = document.getElementById('demo-profile-pic');
    this.signedOutCard = document.getElementById('demo-signed-out-card');
    this.signedInCard = document.getElementById('demo-signed-in-card');

    // Bind events.
    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.deleteButton.addEventListener('click', this.deleteAccount.bind(this));
    
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }.bind(this));
}

// Triggered on Firebase auth state change.
Demo.prototype.onAuthStateChanged = function(user) {
  if (user) {
    loginUser = user;
    this.nameContainer.innerText = user.displayName;
    this.uidContainer.innerText = user.uid;
    this.profilePic.src = user.photoURL;
    this.signedOutCard.style.display = 'none';
    this.signedInCard.style.display = 'block';
    console.log(loginUser);
  } else {
    this.signedOutCard.style.display = 'block';
    this.signedInCard.style.display = 'none';
  }
};

// Initiates the sign-in flow using LinkedIn sign in in a popup.
Demo.prototype.signIn = function() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

// Signs-out of Firebase.
Demo.prototype.signOut = function() {
  firebase.auth().signOut();
};

// Deletes the user's account.
Demo.prototype.deleteAccount = function() {
  firebase.auth().currentUser.delete().then(function() {
    window.alert('Account deleted. Check your email for a confirmation.');
  }).catch(function(error) {
    if (error.code === 'auth/requires-recent-login') {
      window.alert('You need to have recently signed-in to delete your account. Please sign-in and try again.');
      firebase.auth().signOut();
    }
  });
};

// Load the demo.
window.demo = new Demo();

// 'use strict';

// function Demo() {
//     $(window, document, undefined).ready(function() {
//         $('.input').blur(function() {
//             console.log("blur");
//           var $this = $(this);
//           if ($this.val())
//             $this.addClass('used');
//           else
//             $this.removeClass('used');
//         });
        
//         });
      
//       $('#tab1').on('click' , function(){
//           $('#tab1').addClass('login-shadow');
//          $('#tab2').removeClass('signup-shadow');
//       });
      
//       $('#tab2').on('click' , function(){
          
//           $('#tab2').addClass('signup-shadow');
//          $('#tab1').removeClass('login-shadow');
//       });

//     document.addEventListener('DOMContentLoaded', function () {
//         // Shortcuts to DOM Elements.
//         this.loginNev = document.getElementById('loginNev');
//         this.userNev= document.getElementById('userNev');
//         this.signOutButton = document.getElementById('demo-sign-out-button');
//         this.nameContainer = document.getElementById('demo-name-container');
//         this.uidContainer = document.getElementById('demo-uid-container');
//         this.deleteButton = document.getElementById('demo-delete-button');
//         this.profilePic = document.getElementById('demo-profile-pic');
//         this.signedInCard = document.getElementById('demo-signed-in-card');
//         this.username = document.getElementById('username');
//         this.profilePicNev = document.getElementById('profile-pic');
//         this.modal = document.getElementById('myModal');

//         // Bind events.

//         this.signOutButton.addEventListener('click', this.signOut.bind(this));
//         this.deleteButton.addEventListener('click', this.deleteAccount.bind(this));

//         this.emailToLogin = document.getElementById('emailToLogin');
//         this.passwordToLogin = document.getElementById('passwordToLogin');
//         this.emailToSignUp = document.getElementById('emailToSignUp');
//         this.passwordToSignUp = document.getElementById('passwordToSignUp');
//         this.firstNameToSignUp = document.getElementById('firstNameToSignUp');
//         this.lastNameToSignUp = document.getElementById('lastNameToSignUp');
//         this.phoneToSignUp = document.getElementById('phoneToSignUp');


//         this.loginButton = document.getElementById('signin');
//         this.registerButton = document.getElementById('confirmsignup');

//         this.loginButton.addEventListener('click', this.signIn.bind(this));
//         this.registerButton.addEventListener('click', this.register.bind(this));

//         // $('#loginButton').click(function() {
//         //     $('#modalLRForm').modal('hide');
//         // });

//         firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
//     }.bind(this));
// }

// // Triggered on Firebase auth state change.
// Demo.prototype.onAuthStateChanged = function (user) {
//     if (user) {
//         console.log("user.photoURL", user.photoURL, "username", user.displayName);
//         loginUser = user;
//         this.nameContainer.innerText = user.displayName;
//         this.username = user.displayName;
//         this.uidContainer.innerText = user.uid;
//         this.profilePicNev.src = user.photoURL;
//         this.profilePic.src = user.photoURL;
//         this.signedInCard.style.display = 'block';
//         this.loginNev.style.display = 'none';
//         this.userNev.style.display = 'block';
     
//     } else {
//         this.signedInCard.style.display = 'none';
//         this.loginNev.style.display = 'block';
//         this.userNev.style.display = 'none';
//     }
// };

// Demo.prototype.register = function () {
//     var email = this.emailToSignUp;
//     var password = this.passwordToSignUp;
//     var firstName = this.firstNameToSignUp;
//     var lastName = this.lastNameToSignUp;
//     var phone = this.phoneToSignUp;

//     if (email.checkValidity() && password.checkValidity() && firstName.checkValidity() && lastName.checkValidity() && phone.checkValidity()) {

//         firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch(function (error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             console.log(errorCode);
//             console.log(errorMessage);
//         });

//         // firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
//     }
// }

// // Initiates the sign-in flow using LinkedIn sign in in a popup.
// Demo.prototype.signIn = function () {
//     var email = this.emailToLogin;
//     var password = this.emailToLogin;
   
//     if (email.checkValidity() && password.checkValidity()) {

//         firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             console.log(errorCode);
//             console.log(errorMessage);
//         });
//     };

//     // Signs-out of Firebase.
//     Demo.prototype.signOut = function () {
//         firebase.auth().signOut();
//     };

//     // Deletes the user's account.
//     Demo.prototype.deleteAccount = function () {
//         firebase.auth().currentUser.delete().then(function () {
//             window.alert('Account deleted. Check your email for a confirmation.');
//         }).catch(function (error) {
//             if (error.code === 'auth/requires-recent-login') {
//                 window.alert('You need to have recently signed-in to delete your account. Please sign-in and try again.');
//                 firebase.auth().signOut();
//             }
//         });
//     };
// };
//     // Load the demo.
//     window.demo = new Demo();
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */