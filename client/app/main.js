let idNum = 0;
let csrfToken;

// method for getting the search form data to fetch
const handleSearch = (e) => {
	e.preventDefault();
	
	if($("#foodType").val() == '' || $("#city").val() == '' || $("#stateSelect").val() == '' ) {
		handleError("Please enter all required fields");
		return false;
	}

	sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function() {
		handleError("");
		loadDataFromServer();
	});
	
	return false;
};

// method for getting the proper form to send
const handleFavorite = (e) => {
	e.preventDefault();
	
	//let serializedData = $("#searchForm").serialize();
	//serializedData += "&"$("#stateSelect").val();
	let currentId = "#" + e.target.id;
	console.log($(currentId).serialize());
	sendAjax('POST', $(currentId).attr("action"), $(currentId).serialize(), function() {
	});
	
	return false;
};

// method for creating the search form to display
const SearchForm = (props) => {
	csrfToken = props.csrf;
	return (
	<div>
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
		<p className = "errorMessage"></p>
	</div>
	);
};

// method for creating the search results to display
const SearchList = function(props) {
	if(props.restaurants.length === 0) {
		return (
			<div className="row">
			</div>
		);
	};
	
	const searchNodes = props.restaurants.map(function(restaurant) {
		//console.log(restaurant.restaurant.name);
		idNum = idNum + 1;
		return(
			<tr key={restaurant.id}>
				<form id = {`favoriteForm${idNum}`} name= {`favoriteForm${idNum}`}
				onSubmit={handleFavorite}
				action="/favorite"
				method="POST"
				className="favoriteForm"
				></form>
				<td className="foodType">{restaurant.restaurant.name} <input type="hidden" form={`favoriteForm${idNum}`} name="name" value={restaurant.restaurant.name}/> </td>
				<td className="city">{restaurant.restaurant.location.address} <input type="hidden" form={`favoriteForm${idNum}`} name="address" value={restaurant.restaurant.location.address}/> </td>
				<td><a href = {restaurant.restaurant.menu_url} >View menu on Zomato.com</a> <input type="hidden" form={`favoriteForm${idNum}`} name="_csrf" value={csrfToken} /> <input type="hidden" form={`favoriteForm${idNum}`} name="menu" value={restaurant.restaurant.menu_url}/>  </td>
				<td><input type="image" value="submit" form={`favoriteForm${idNum}`} src="/assets/img/favorite.png" alt="favorite button" height="20" width="20"/> </td>
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

// method for creating the side ad to display
const SideAd = function() {
	
	return(
		<img src="/assets/img/sideAd.png" className="sideImg"/>
	);
};

// method for creating the banner ad to display
const BannerAd = function() {
	
	return(
		<div>
			<a href="#" className="close"></a>
			<img src="/assets/img/bannerAd.png" className="bannerImg"/>
		</div>
	);
};

// method for rendering the DOM elements
const loadDataFromServer = () => {
	sendAjax('GET', '/getData', null, (data) => {
		//console.log(data);
		ReactDOM.render(
			<SearchList restaurants={data.restaurants} />, document.querySelector(".tableDiv")
		);
		ReactDOM.render(
			<SideAd />, document.querySelector(".sideAd")
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

// method for rendering the DOM elements and adding onClicks
const setup = function(csrf) {
	ReactDOM.render(
		<SearchForm csrf={csrf}/>, document.querySelector(".search")
	);
	ReactDOM.render(
			<BannerAd />, document.querySelector(".bannerAd")
	);
	document.querySelector(".close").addEventListener("click", function(){
		document.querySelector(".bannerAd").style.display = "none";
	});
	
};

// method for getting the csrf token being used
const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

// method for preparing the page right after it loads
$(document).ready(function() {
	getToken();
});

