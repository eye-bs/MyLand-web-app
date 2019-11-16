'use strict';

var jsonOfLand = JSON.parse(sessionStorage.myObject); 

console.log(jsonOfLand);

$.ajax({
    contentType: 'application/json',
 //   data: JSON.stringify({ "email": "6YnTm1N1HAaKnENjZt5GMYZhD9h2" }),
    dataType: 'json',
    success: function(data){
        console.log(data);
    },
    error: function(){
      
    },
    processData: false,
    type: 'GET',
    url: 'https://stark-sea-12441.herokuapp.com/users/example@e.com'
});