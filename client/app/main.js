const handleSearch = (e) => {
	e.preventDefault();
	//$("#domoMessage").animate({width:'hide'},350);
	
	if($("#foodType").val() == '' || $("#city").val() == '' || $("#stateSelect").val() == '' ) {
		//handleError("Please enter all required fields");
		return false;
	}
	//let serializedData = $("#searchForm").serialize();
	//serializedData += "&"$("#stateSelect").val();
	console.log($("#searchForm").serialize());
	sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function() {
		console.log("running");
		loadDataFromServer();
	});
	
	return false;
};

const SearchForm = (props) => {
	return (
	<form id="searchForm" name="searchForm" 
		onSubmit={handleSearch}
		action="/search"
		method="POST"
		className="searchForm"
	>
	<input id="foodType" type="text" name="foodType" placeholder="Please enter a type of food"/>
	<input id="city" type="text" name="city" placeholder="Please enter a city"/>
	<select id = "stateSelect" className="form-control" name="state">
		<option value="" disabled selected>Select your State</option>
		<option value="AL">AL</option>
		<option value="AK">AK</option>
		<option value="AR">AR</option>	
		<option value="AZ">AZ</option>
		<option value="CA">CA</option>
		<option value="CO">CO</option>
		<option value="CT">CT</option>
		<option value="DC">DC</option>
		<option value="DE">DE</option>
		<option value="FL">FL</option>
		<option value="GA">GA</option>
		<option value="HI">HI</option>
		<option value="IA">IA</option>	
		<option value="ID">ID</option>
		<option value="IL">IL</option>
		<option value="IN">IN</option>
		<option value="KS">KS</option>
		<option value="KY">KY</option>
		<option value="LA">LA</option>
		<option value="MA">MA</option>
		<option value="MD">MD</option>
		<option value="ME">ME</option>
		<option value="MI">MI</option>
		<option value="MN">MN</option>
		<option value="MO">MO</option>	
		<option value="MS">MS</option>
		<option value="MT">MT</option>
		<option value="NC">NC</option>	
		<option value="NE">NE</option>
		<option value="NH">NH</option>
		<option value="NJ">NJ</option>
		<option value="NM">NM</option>			
		<option value="NV">NV</option>
		<option value="NY">NY</option>
		<option value="ND">ND</option>
		<option value="OH">OH</option>
		<option value="OK">OK</option>
		<option value="OR">OR</option>
		<option value="PA">PA</option>
		<option value="RI">RI</option>
		<option value="SC">SC</option>
		<option value="SD">SD</option>
		<option value="TN">TN</option>
		<option value="TX">TX</option>
		<option value="UT">UT</option>
		<option value="VT">VT</option>
		<option value="VA">VA</option>
		<option value="WA">WA</option>
		<option value="WI">WI</option>	
		<option value="WV">WV</option>
		<option value="WY">WY</option>
	</select>
	<input className="btn btn-outline-success" type="submit" value="Search" />
	</form>
	);
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

const loadDataFromServer = () => {
	console.log("run");
	sendAjax('GET', '/getData', null, (data) => {
		console.log(data);
		/*ReactDOM.render(
			<DomoList domos={data.domos} />, document.querySelector("#domos")
		);*/
	});
};

const setup = function() {
	ReactDOM.render(
		<SearchForm />, document.querySelector("#search")
	);

};





$(document).ready(function() {
	setup();
});

