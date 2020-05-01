let idNum = 0;

// method for getting the proper form to delete
const handleFavorite = (e) => {
	e.preventDefault();
	
	let currentId = "#" + e.target.id;

	sendAjax('POST', $(currentId).attr("action"), $(currentId).serialize(), function() {
	});
	
	return false;
};

// method for creating the favorites list to display
const FavoriteList = function(props) {
	if(props.favorites.length === 0) {
		return (
			<div className="row">
				<h3 classname="emptyFavorites">No Favorites yet</h3>
			</div>
		);
	};
	
	const favoritesNodes = props.favorites.map(function(favorite) {
		idNum = idNum + 1;
		return(
			<tr key={favorite._id}>
				<form id = {`favoriteForm${idNum}`} name= {`favoriteForm${idNum}`}
				onSubmit={handleFavorite}
				action="/delete"
				method="POST"
				className="favoriteForm"
				></form>
				<td className="foodType">{favorite.name} </td>
				<td className="city">{favorite.address} <input type="hidden" form={`favoriteForm${idNum}`} name="address" value={favorite.address}/></td>
				<td><a href = {favorite.menu} >View menu on Zomato.com</a> <input type="hidden" form={`favoriteForm${idNum}`} name="_csrf" value={favorite.csrf} /> </td>
				<td><input type="submit" value="delete" form={`favoriteForm${idNum}`} /> </td>
			</tr>
		);
	});
	
	return(
		<div id="favoritesDisplay">
			<div>
				<table>
					<tr>
						<th>Name</th>
						<th>Address</th>
						<th>Menu</th>
					</tr>
					{favoritesNodes}
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


// method for rendering the DOM elements and adding onClicks
const loadDataFromServer = () => {
	sendAjax('GET', '/getFavorites', null, (data) => {
		ReactDOM.render(
			<FavoriteList favorites={data.favorites} />, document.querySelector("#favoriteTable")
		);
		ReactDOM.render(
			<SideAd />, document.querySelector(".sideAd")
		);
		ReactDOM.render(
			<BannerAd />, document.querySelector(".bannerAd")
		);
		document.querySelector(".close").addEventListener("click", function(){
			document.querySelector(".bannerAd").style.display = "none";
		});
	});
};

// method for getting the csrf token being used
const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		loadDataFromServer();
	});
};

// method for preparing the page right after it loads
$(document).ready(function() {
	getToken();
	
});

