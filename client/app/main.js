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
	<input type="hidden" name="_csrf" value={props.csrf}/>
	<input className="btn btn-outline-success" type="submit" value="Search" />
	</form>
	);
};

const SearchList = function(props) {
	if(props.restaurants.length === 0) {
		return (
			<div className="row">
				//<h3 classname="emptyDomo">No Domos yet</h3>
			</div>
		);
	};
	
	const searchNodes = props.restaurants.map(function(restaurant) {
		//console.log(restaurant.restaurant.name);
		return(
			<tr key={restaurant.id}>
				<td className="foodType">{restaurant.restaurant.name} </td>
				<td className="city">{restaurant.restaurant.location.address} </td>
				<td><a href = {restaurant.restaurant.menu_url} >View menu on Zomato.com</a></td>
			</tr>
		);
	});
	
	return(
		<div id="searchDisplay">
			<div>
				<table>
					<tr>
						<th>Name</th>
						<th>Address</th>
						<th>Menu</th>
					</tr>
					{searchNodes}
				</table>
			</div>
		</div>
	);
};

const loadDataFromServer = () => {
	sendAjax('GET', '/getData', null, (data) => {
		//console.log(data);
		ReactDOM.render(
			<SearchList restaurants={data.restaurants} />, document.querySelector("#tableDiv")
		);
	});
};

/*const switchJson = (e) => {
	e.preventDefault();
	console.log($("#start").val());
	if(e.target.id == "prevButton" && $("#start").val() != 0){
		$("#start").value -= 20;
	}
			
	else if(e.target.id == "nextButton" && $("#start").val() != 80){
		$("#start").value += 20;
	}
	handleSearch();
	loadDataFromServer();
	
	// may be used later so moving it out of render
	<div className="search-row">
				<form id="switchForm" name="switchForm" 
					onSubmit={switchJson}
					className="switchForm"
				>
					<input id = "prevButton" className="btn btn-outline-success bottomButtons" type="submit" value = "Previous Page" />
					<input id = "nextButton" className="btn btn-outline-success bottomButtons" type="submit"value = "Next Page" />
				</form>
			</div> 
}*/

const setup = function(csrf) {
	ReactDOM.render(
		<SearchForm csrf={csrf}/>, document.querySelector("#search")
	);

};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};


$(document).ready(function() {
	getToken();
});

