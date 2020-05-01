"use strict";

var idNum = 0; // method for getting the proper form to delete

var handleFavorite = function handleFavorite(e) {
  e.preventDefault(); //let serializedData = $("#searchForm").serialize();
  //serializedData += "&"$("#stateSelect").val();

  var currentId = "#" + e.target.id;
  console.log($(currentId).serialize());
  sendAjax('POST', $(currentId).attr("action"), $(currentId).serialize(), function () {});
  return false;
}; // method for creating the favorites list to display


var FavoriteList = function FavoriteList(props) {
  if (props.favorites.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("h3", {
      classname: "emptyFavorites"
    }, "No Favorites yet"));
  }

  ;
  var favoritesNodes = props.favorites.map(function (favorite) {
    idNum = idNum + 1;
    return /*#__PURE__*/React.createElement("tr", {
      key: favorite._id
    }, /*#__PURE__*/React.createElement("form", {
      id: "favoriteForm".concat(idNum),
      name: "favoriteForm".concat(idNum),
      onSubmit: handleFavorite,
      action: "/delete",
      method: "POST",
      className: "favoriteForm"
    }), /*#__PURE__*/React.createElement("td", {
      className: "foodType"
    }, favorite.name, " "), /*#__PURE__*/React.createElement("td", {
      className: "city"
    }, favorite.address, " ", /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      form: "favoriteForm".concat(idNum),
      name: "address",
      value: favorite.address
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: favorite.menu
    }, "View menu on Zomato.com"), " ", /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      form: "favoriteForm".concat(idNum),
      name: "_csrf",
      value: favorite.csrf
    }), " "), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "delete",
      form: "favoriteForm".concat(idNum)
    }), " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "favoritesDisplay"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Address"), /*#__PURE__*/React.createElement("th", null, "Menu")), favoritesNodes)));
}; // method for creating the side ad to display


var SideAd = function SideAd() {
  return /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/sideAd.png",
    className: "sideImg"
  });
}; // method for creating the banner ad to display


var BannerAd = function BannerAd() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "close"
  }), /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/bannerAd.png",
    className: "bannerImg"
  }));
}; // method for rendering the DOM elements and adding onClicks


var loadDataFromServer = function loadDataFromServer() {
  sendAjax('GET', '/getFavorites', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(FavoriteList, {
      favorites: data.favorites
    }), document.querySelector("#favoriteTable"));
    ReactDOM.render( /*#__PURE__*/React.createElement(SideAd, null), document.querySelector(".sideAd"));
    ReactDOM.render( /*#__PURE__*/React.createElement(BannerAd, null), document.querySelector(".bannerAd"));
    document.querySelector(".close").addEventListener("click", function () {
      document.querySelector(".bannerAd").style.display = "none";
    });
  });
}; // method for getting the csrf token being used


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    loadDataFromServer();
  });
}; // method for preparing the page right after it loads


$(document).ready(function () {
  getToken();
});
"use strict";

// method for writing error messages to screen
var handleError = function handleError(message) {
  $(".errorMessage").text(message);
}; // method for redirecting to correct url


var redirect = function redirect(response) {
  window.location = response.redirect;
}; // method for sending Ajax call


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
