var landBlock = document.querySelector(".landRows");
var approvedRow = document.querySelector(".approvedlandRows");
var notApprovedRow = document.querySelector(".notapprovedlandRows");

function createLandBlock() {
  return Promise.resolve(
    $.ajax({
      url: "https://stark-sea-12441.herokuapp.com/lands/approved",
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function notapprovedLandBlock() {
  return Promise.resolve(
    $.ajax({
      url: "https://stark-sea-12441.herokuapp.com/lands/notapprove",
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function queryLandBlock(keyWord) {
  var urlQ = "https://stark-sea-12441.herokuapp.com/lands/q" + keyWord;
  return Promise.resolve(
    $.ajax({
      url: urlQ,
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function queryLandFev(email) {
  var urlQ =
    "https://stark-sea-12441.herokuapp.com/users/" + email + "?likes=0";
  return Promise.resolve(
    $.ajax({
      url: urlQ,
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function landsIndexQuery() {
  var data = createLandBlock();
  data.then(data => {
    indexLandCard(data, landBlock);
  });
}

function landFevQuery(email) {
  var likesId = queryLandFev(email);
  likesId.then(likes => {
    var data = createLandBlock();
    var query = [];
    data.then(data => {
      landsData = data;
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < likes.length; j++) {
          if (data[i]._id == likes[j]) {
            query.push(data[i]);
          }
        }
        if (query.length == likes.length) {
          allLandsCard(query, landBlock);
          break;
        }
      }
    });
    // allLandsCard(data);
  });
}

function approvedQuery(requestArr) {
  //! approved
  var requestAppove = [];
  for (var i = 0; i < landsData.length; i++) {
    for (var j = 0; j < requestArr.length; j++) {
      if (landsData[i]._id == requestArr[j]) {
        requestAppove.push(landsData[i]);
      }
    }
  }
  allLandsCard(requestAppove, approvedRow);

  //!not approved yet
  var notapprove = notapprovedLandBlock();
  var requestNotAppove = [];
  notapprove.then(data => {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < requestArr.length; j++) {
        if (data[i]._id == requestArr[j]) {
          requestNotAppove.push(data[i]);
        }
      }
    }
    allLandsCard(requestNotAppove, notApprovedRow);
  });
}

function allLandsQuery(keyWord) {
  if (keyWord == null) {
    var data = createLandBlock();
    data.then(data => {
      filterAddress(data);
      createSlider(data);
      allLandsCard(data, landBlock);
    });
  } else {
    var data = queryLandBlock(keyWord);
    data.then(data => {
      createSlider(data);
      allLandsCard(data, landBlock);
    });
  }
}

//! create cared for index
function indexLandCard(data, block) {
  var cardDeck = document.createElement("div");
  var br = document.createElement("br");
  cardDeck.setAttribute("class", "card-deck");
  for (let i = data.length - 1; i > data.length - 4; i--) {
    var card = document.createElement("div");
    var img = document.createElement("img");
    var cardBody = document.createElement("div");
    var cardTitle = document.createElement("h5");
    var cardText = document.createElement("p");

    card.setAttribute("class", "card");
    img.setAttribute("class", "card-img-top");
    cardBody.setAttribute("class", "card-body");
    cardTitle.setAttribute("class", "card-title");
    cardText.setAttribute("class", "card-text");

    if (data[i].img_link.length == 0) {
      img.src = "images/landscape.png";
    } else {
      img.src = data[i].img_link[0];
    }

    cardTitle.innerHTML = "<center>" + data[i].land_name;
    +"</center>";
    cardText.innerHTML = data[i].area.size + " " + data[i].area.type;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    card.appendChild(img);
    card.appendChild(cardBody);

    cardDeck.appendChild(card);

    card.onclick = (function(arg) {
      return function() {
        openLandDetailClick(arg);
      };
    })(data[i]);
  }
  block.appendChild(cardDeck);
  //landBlock.appendChild(br);
}
//! create cared for other
function allLandsCard(data, block) {
  block.innerHTML = "";
  var count = 0;
  var length = data.length;
  var allRow = parseInt(length / 3 + 1);
  var lastRow = length - 3 * (allRow - 1);

  for (let i = 0; i < allRow; i++) {
    var cardDeck = document.createElement("div");
    var br = document.createElement("br");
    cardDeck.setAttribute("class", "card-deck");

    for (let j = 0; j < 3; j++) {
      var card = document.createElement("div");
      var img = document.createElement("img");
      var cardBody = document.createElement("div");
      var cardTitle = document.createElement("h5");
      var cardText = document.createElement("p");

      card.setAttribute("class", "card");
     
      if (count < length) {
        card.classList.add( "card-shadow");
        img.setAttribute("class", "card-img-top");
        cardBody.setAttribute("class", "card-body");
        cardTitle.setAttribute("class", "card-title");
        cardText.setAttribute("class", "card-text");

        if (data[count].img_link.length == 0) {
          img.src = "images/landscape.png";
        } else {
          img.src = data[count].img_link[0];
        }
        cardTitle.innerHTML = "<center>" + data[count].land_name;
        +"</center>";
        cardText.innerHTML =
          data[count].area.size + " " + data[count].area.type;
        card.onclick = (function(arg) {
          return function() {
            openLandDetailClick(arg);
          };
        })(data[count]);
      }else{
         card.classList.add( "bg-light");
      }

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);

      card.appendChild(img);
      card.appendChild(cardBody);

      cardDeck.appendChild(card);

      count++;
    }

    block.appendChild(cardDeck);
    block.appendChild(br);
  }
}

function openLandDetailClick(data) {
  sessionStorage.landId = JSON.stringify(data); //will set object to the stringified myObject
  window.location.href = "detailland.html";
}
