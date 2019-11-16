var landBlock = document.querySelector(".landRows");
var viewall = document.getElementById("viewall");
var startAllLand = document.getElementById("startAllLand");

function createLandBlock() {
  return Promise.resolve(
    $.ajax({
      url: "https://stark-sea-12441.herokuapp.com/lands/all",
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function indexLandCard(data) {
  var cardDeck = document.createElement("div");
  var br = document.createElement("br");
  cardDeck.setAttribute("class", "card-deck");
  for (let i = data.length - 1; i > data.length - 4; i--) {
    var card = document.createElement("div");
    var img = document.createElement("img");
    var cardBody = document.createElement("div");
    var cardTitle = document.createElement("h3");
    var cardText = document.createElement("p");

    card.setAttribute("class", "card");
    img.setAttribute("class", "card-img-top");
    cardBody.setAttribute("class", "card-body");
    cardTitle.setAttribute("class", "card-title");
    cardText.setAttribute("class", "card-text");

    img.src = data[i].img_link[0];
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
    })(data[i]._id);
  }
  landBlock.appendChild(br);
  landBlock.appendChild(cardDeck);
}

function landsIndexQuery() {
  var data = createLandBlock();
  data.then(data => {
    indexLandCard(data);
  });
}

function allLandsQuery() {
  var data = createLandBlock();
  data.then(data => {
    filterAddress(data);
    allLandsCard(data);
  });
}

function allLandsCard(data) {
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
      var cardTitle = document.createElement("h3");
      var cardText = document.createElement("p");

      card.setAttribute("class", "card");
      img.setAttribute("class", "card-img-top");
      cardBody.setAttribute("class", "card-body");
      cardTitle.setAttribute("class", "card-title");
      cardText.setAttribute("class", "card-text");

      if (count < length) {
        img.src = data[count].img_link[0];
        cardTitle.innerHTML = "<center>" + data[count].land_name;
        +"</center>";
        cardText.innerHTML =
          data[count].area.size + " " + data[count].area.type;
        card.onclick = (function(arg) {
          return function() {
            openLandDetailClick(arg);
          };
        })(data[count]._id);
      }

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);

      card.appendChild(img);
      card.appendChild(cardBody);

      cardDeck.appendChild(card);

      count++;
    }
    landBlock.appendChild(br);
    landBlock.appendChild(cardDeck);
  }
}

function openLandDetailClick(id) {
  sessionStorage.landId = id; //will set object to the stringified myObject
  window.location.href = "detailland.html";
}
