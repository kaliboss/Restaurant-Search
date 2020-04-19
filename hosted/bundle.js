"use strict";

var handleSearch = function handleSearch(e) {
  e.preventDefault(); //$("#domoMessage").animate({width:'hide'},350);

  if ($("#foodType").val() == '' || $("#city").val() == '' || $("#stateSelect").val() == '') {
    //handleError("Please enter all required fields");
    return false;
  } //let serializedData = $("#searchForm").serialize();
  //serializedData += "&"$("#stateSelect").val();


  console.log($("#searchForm").serialize());
  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function () {
    console.log("running");
    loadDataFromServer();
  });
  return false;
};

var SearchForm = function SearchForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    name: "searchForm",
    onSubmit: handleSearch,
    action: "/search",
    method: "POST",
    className: "searchForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "foodType",
    type: "text",
    name: "foodType",
    placeholder: "Please enter a type of food"
  }), /*#__PURE__*/React.createElement("input", {
    id: "city",
    type: "text",
    name: "city",
    placeholder: "Please enter a city"
  }), /*#__PURE__*/React.createElement("select", {
    id: "stateSelect",
    className: "form-control",
    name: "state"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    selected: true
  }, "Select your State"), /*#__PURE__*/React.createElement("option", {
    value: "AL"
  }, "AL"), /*#__PURE__*/React.createElement("option", {
    value: "AK"
  }, "AK"), /*#__PURE__*/React.createElement("option", {
    value: "AR"
  }, "AR"), /*#__PURE__*/React.createElement("option", {
    value: "AZ"
  }, "AZ"), /*#__PURE__*/React.createElement("option", {
    value: "CA"
  }, "CA"), /*#__PURE__*/React.createElement("option", {
    value: "CO"
  }, "CO"), /*#__PURE__*/React.createElement("option", {
    value: "CT"
  }, "CT"), /*#__PURE__*/React.createElement("option", {
    value: "DC"
  }, "DC"), /*#__PURE__*/React.createElement("option", {
    value: "DE"
  }, "DE"), /*#__PURE__*/React.createElement("option", {
    value: "FL"
  }, "FL"), /*#__PURE__*/React.createElement("option", {
    value: "GA"
  }, "GA"), /*#__PURE__*/React.createElement("option", {
    value: "HI"
  }, "HI"), /*#__PURE__*/React.createElement("option", {
    value: "IA"
  }, "IA"), /*#__PURE__*/React.createElement("option", {
    value: "ID"
  }, "ID"), /*#__PURE__*/React.createElement("option", {
    value: "IL"
  }, "IL"), /*#__PURE__*/React.createElement("option", {
    value: "IN"
  }, "IN"), /*#__PURE__*/React.createElement("option", {
    value: "KS"
  }, "KS"), /*#__PURE__*/React.createElement("option", {
    value: "KY"
  }, "KY"), /*#__PURE__*/React.createElement("option", {
    value: "LA"
  }, "LA"), /*#__PURE__*/React.createElement("option", {
    value: "MA"
  }, "MA"), /*#__PURE__*/React.createElement("option", {
    value: "MD"
  }, "MD"), /*#__PURE__*/React.createElement("option", {
    value: "ME"
  }, "ME"), /*#__PURE__*/React.createElement("option", {
    value: "MI"
  }, "MI"), /*#__PURE__*/React.createElement("option", {
    value: "MN"
  }, "MN"), /*#__PURE__*/React.createElement("option", {
    value: "MO"
  }, "MO"), /*#__PURE__*/React.createElement("option", {
    value: "MS"
  }, "MS"), /*#__PURE__*/React.createElement("option", {
    value: "MT"
  }, "MT"), /*#__PURE__*/React.createElement("option", {
    value: "NC"
  }, "NC"), /*#__PURE__*/React.createElement("option", {
    value: "NE"
  }, "NE"), /*#__PURE__*/React.createElement("option", {
    value: "NH"
  }, "NH"), /*#__PURE__*/React.createElement("option", {
    value: "NJ"
  }, "NJ"), /*#__PURE__*/React.createElement("option", {
    value: "NM"
  }, "NM"), /*#__PURE__*/React.createElement("option", {
    value: "NV"
  }, "NV"), /*#__PURE__*/React.createElement("option", {
    value: "NY"
  }, "NY"), /*#__PURE__*/React.createElement("option", {
    value: "ND"
  }, "ND"), /*#__PURE__*/React.createElement("option", {
    value: "OH"
  }, "OH"), /*#__PURE__*/React.createElement("option", {
    value: "OK"
  }, "OK"), /*#__PURE__*/React.createElement("option", {
    value: "OR"
  }, "OR"), /*#__PURE__*/React.createElement("option", {
    value: "PA"
  }, "PA"), /*#__PURE__*/React.createElement("option", {
    value: "RI"
  }, "RI"), /*#__PURE__*/React.createElement("option", {
    value: "SC"
  }, "SC"), /*#__PURE__*/React.createElement("option", {
    value: "SD"
  }, "SD"), /*#__PURE__*/React.createElement("option", {
    value: "TN"
  }, "TN"), /*#__PURE__*/React.createElement("option", {
    value: "TX"
  }, "TX"), /*#__PURE__*/React.createElement("option", {
    value: "UT"
  }, "UT"), /*#__PURE__*/React.createElement("option", {
    value: "VT"
  }, "VT"), /*#__PURE__*/React.createElement("option", {
    value: "VA"
  }, "VA"), /*#__PURE__*/React.createElement("option", {
    value: "WA"
  }, "WA"), /*#__PURE__*/React.createElement("option", {
    value: "WI"
  }, "WI"), /*#__PURE__*/React.createElement("option", {
    value: "WV"
  }, "WV"), /*#__PURE__*/React.createElement("option", {
    value: "WY"
  }, "WY")), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-outline-success",
    type: "submit",
    value: "Search"
  }));
};
/*const DomoList = function(props) {
	if(props.domos.length === 0) {
		return (
			<div className="domoList">
				<h3 classname="emptyDomo">No Domos yet</h3>
			</div>
		);
	};
	
	const domoNodes = props.domos.map(function(domo) {
		return(
			<div key={domo._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
				<h3 className="foodType"> Name: {domo.name} </h3>
				<h3 className="city"> Age: {domo.age} </h3>
				<h3 className="domoHeight"> Height: {domo.height} cm</h3>
			</div>
		);
	});
	
	return(
		<div className="domoList">
			{domoNodes}
		</div>
	);
};*/


var loadDataFromServer = function loadDataFromServer() {
  console.log("run");
  sendAjax('GET', '/getData', null, function (data) {
    console.log(data);
    /*ReactDOM.render(
    	<DomoList domos={data.domos} />, document.querySelector("#domos")
    );*/
  });
};

var setup = function setup() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search"));
};

$(document).ready(function () {
  setup();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  //$("domoMessage").animate({width:'hide'},350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText); //handleError(messageObj.error);
    }
  });
};
