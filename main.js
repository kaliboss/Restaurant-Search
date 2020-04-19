// Initialize Firebase
let config = {
apiKey: "AIzaSyDOzAE6W7hkoHLtT9RnGPxub-Ljv_VF7hw",
authDomain: "restaruant-search.firebaseapp.com",
databaseURL: "https://restaruant-search.firebaseio.com",
projectId: "restaruant-search",
storageBucket: "restaruant-search.appspot.com",
messagingSenderId: "832569178792"
};
firebase.initializeApp(config);

// initialize local storage
let storage = window.localStorage;
				  
const app = new Vue({
	el: '#app',
	data: {
		title: "Restaurant Search",
		result: [],
		term: "",
		state: "",
		city: "",
		start: 0,
		cityId: "",
		favorites: [],
		statusText: "",
		userName: ""
	},
	// used to call methods on startup
	created(){
		//this.search()
		
		// grabbing last saved terms
		this.firebaseRead();
		this.term = localStorage.getItem("axs6207name");
		this.city = localStorage.getItem("axs6207city");
	},
	methods:{
		 
		 // main method used for getting data from the 3 API calls and displaying on map and tableDiv
		 // called whenever search is hit // controller, maybe model?
		search() { 
			this.$refs.switch.disabled = false;
			this.$refs.status.style.color = "black";
			this.statusText = "Loading results...";
			if(this.start != 0 && this.start != 80){
				this.$refs.previous.style.display = "inline-block";
				this.$refs.next.style.display = "inline-block";
				this.$refs.next.style.margin = "0px"
			}
			
			else if(this.start == 0){
				this.$refs.previous.style.display = "none";
				this.$refs.next.style.display = "inline-block";
				this.$refs.next.style.margin = "0px 0px 0px 50%"
			}
			
			else if(this.start == 80){
				this.$refs.next.style.display = "none";
				this.$refs.previous.style.display = "inline-block";
			}
			
			// getting the field data and url ready for later
			let url;
			
			let term = this.term;
			
			term = term.trim();
			
			term = term.replace(" ", "");
			this.term = term;
			
			term = encodeURIComponent(term);
			
			let city = this.city;
			
			city = city.trim();
			
			let state = this.state;
			
			//let radius = amount.value;
			
			// checking if the fields are empty
			if(term.length < 1){ 
				this.$refs.status.style.color = "red";
				this.statusText = "Please enter a type of food to search for";
				this.$refs.switch.disabled = true;
				return;
			}
			
			if(city.length < 1) { 
				this.$refs.status.style.color = "red";
				this.statusText = "Please enter a city to search";
				this.$refs.switch.disabled = true;
				return;
			}
			
			if(state.length < 2)  { 
				this.$refs.status.style.color = "red";
				this.statusText = "Please select a state";
				this.$refs.switch.disabled = true;
				return;
			}
			
			cityArr = city.split("");
			
			
			cityArr[0] = cityArr[0].toUpperCase();
			
			this.city = cityArr.join("");
			
			//this.city = this.city.replace(" ", "");
			
			city = encodeURIComponent(city);
			
			// local storage
			storage.setItem("axs6207name", term);
			
			storage.setItem("axs6207city", this.city);
			// fetch to get city geocode for use later
			let cityUrl = "https://developers.zomato.com/api/v2.1/cities?"
			cityUrl += "q=" + this.city + "&"
			cityUrl += "apikey=26a628922607a67df0d325e594d41c90";
			that = this;
			fetch(cityUrl)
			.then(response => {
				if(!response.ok){
					throw Error(`ERROR: ${response.statusText}`);
				}
				return response.json();
			})
			.then(cityJson => {
				
				//console.log(cityJson.location_suggestions);
				cityJson.location_suggestions.forEach(function(city) {
					if(city.state_code == that.state){
						let name;
						if(that.state != "NY"){
							name = that.city + ", " + that.state;
						}
						
						// extra checks are needed for NY since the state code is formatted differently and new york city is a special case
						else{
							if(that.city.toLowerCase() == "new york city"){
								that.city = "New York City";
								name = that.city + ", " + that.state;
							}
							else{
								name = that.city + ", " + "New York" + ", " + that.state;
							}
						}
						
						// https://stackoverflow.com/questions/21792367/replace-underscores-with-spaces-and-capitalize-words
						// needed to check if name has spaces and capitalizes words
						let nameFrags = name.split(' ');
						  for (i=0; i< nameFrags.length; i++) {
							nameFrags[i] = nameFrags[i].charAt(0).toUpperCase() + nameFrags[i].slice(1);
						  }
						  name = nameFrags.join(' ');
						  
						//console.log(city.name);
						//console.log(name);
						if(name == city.name ){
							that.cityId = city.id;
							//console.log(that.cityId);
							url = new Url(that.cityId, term, that.start)
							url = url.createUrl();
							//console.log(url);
						}
						
						// needed to check if name is real place with missing spaces in it
						else{
							that.cityId = cityJson.location_suggestions[0].id;
							//console.log(that.cityId);
							url = new Url(that.cityId, term, that.start)
							url = url.createUrl();
						}
							
					}
				})
				if(cityJson.location_suggestions.length != 0){
					let found = false;
					for(let c of cityJson.location_suggestions){
						if(c.state_code == this.state){
							found = true;
						}
						
					}
					
					if(found){
						// fetch to get all displayed table info
						fetch(url)
						.then(response => {
							if(!response.ok){
								throw Error(`ERROR: ${response.statusText}`);
							}
							return response.json();
						})
						.then(json => {	
							this.result = json.restaurants;
							//console.log(this.result);
							if(this.result.length != 0){
								mapboxgl.accessToken = 'pk.eyJ1IjoiYXhzNjIwNyIsImEiOiJjanUzMmw4N2owaXZsNDNwdnVpeWExYXlkIn0.9fWe9GvQAdJrx-MJFI3GAA';

								this.map = new mapboxgl.Map({
								container: 'map',
								style: 'mapbox://styles/mapbox/streets-v11',
								});
								this.map.setZoom(13)
								this.map.setCenter([this.result[0].restaurant.location.longitude,this.result[0].restaurant.location.latitude]); // note the order - it's longitude,latitude - which is opposite of Google Maps
								let thisScope = this;
								
								// setting up mapbox api
								let geojson = {
								  type: 'FeatureCollection',
								  features: []
								  
								};
								
								let i;
								for(i = 0; i < this.result.length; i++){
									geojson.features[i] = {
										type: 'Feature',
									geometry: {
									  type: 'Point',
									  coordinates: [parseFloat(json.restaurants[i].restaurant.location.longitude), parseFloat(json.restaurants[i].restaurant.location.latitude)]
									},
									properties: {
									  title: json.restaurants[i].restaurant.name,
									  description: json.restaurants[i].restaurant.menu_url
									}
									}
								}
								
								//console.log(geojson.features);
								// add markers to map
								geojson.features.forEach(function(marker) {

								  // create a HTML element for each feature
								  var el = document.createElement('div');
								  el.className = 'marker';
								  //console.log(thisScope.map);

								  // make a marker for each feature and add to the map
								  new mapboxgl.Marker(el)
									.setLngLat(marker.geometry.coordinates)
									.addTo(thisScope.map);
									
									new mapboxgl.Marker(el)
								  .setLngLat(marker.geometry.coordinates)
								  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
									.setHTML('<h3>' + marker.properties.title + '</h3><a href="' + marker.properties.description + '">' + 'View Menu on Zomato.com' + '</a>'))
								  .addTo(thisScope.map);
								});
								//console.log(this.result);
								this.statusText = "";
								//app.firebaseSave();
							}
							
							else if(this.result.length == 0 && this.start > 0){
								this.$refs.switch.disabled = true;
								this.$refs.status.style.color = "black";
								this.$refs.next.style.display = "none";
								this.$refs.previous.style.display = "inline-block";
								this.statusText = "End of results"
							}
							
							else{
								this.$refs.switch.disabled = true;
								this.$refs.status.style.color = "red";
								this.statusText = "Please enter a valid food/restuarant"
							}
						})
						
					}
					else{
						this.$refs.switch.disabled = true;
						this.$refs.status.style.color = "red";
						this.statusText = "Please select the correct state"
					}
					
				}
				
				else{
					this.$refs.status.style.color = "red";
					this.statusText = "Please enter a valid city"
				}
				
			})
			
			//let limit = amount.value;
			//url += "&limit=" + limit;
			app.firebaseRead();
			
		   }, // end search
		   
		   // used to switch between map and table view when button is hit // controller
		   viewSwitch(){
				if(this.$refs.tableDiv.style.display == "none"){
					this.$refs.tableDiv.style.display = "block";
					this.$refs.mapDiv.style.display = "none";
				}
				
				else{
					this.$refs.tableDiv.style.display = "none";
					this.$refs.mapDiv.style.display = "block";
					this.map.resize();
				}
		   	
		   },
		   
		   // used for the next and prev buttons to get more results // controller
		   pageSwitch: (e) =>{
			if(e.target.id == "prevButton" && app.start != 0){
				app.start -= 20;
			}
			
			else if(e.target.id == "nextButton" && app.start != 80){
				app.start += 20;
				app.search();
			}	
			app.search();
		   },
		   
		   // used to store data in firebase database // controller and switch to mongo
		   firebaseSave: (e) =>{

			   // gets the row of the clicked button
			   let rowIndex = e.target.parentElement.parentElement.parentElement.rowIndex;
				rowIndex = rowIndex - 1;
				
				let exists = false;
				
				

				//https://stackoverflow.com/questions/24824732/test-if-a-data-exist-in-firebase
				// code to see if data exists already
				if(app.userName.trim() != ""){
					firebase.database().ref(app.userName).on('child_added', function(snapshot) {
					   var message = snapshot.val();
					   
					   for (let key in message){
						   
							if (app.result[rowIndex] != null && message.data.location.address == app.result[rowIndex].restaurant.location.address)
							exists = true
							
						}
					});
				}
			   //console.log(rowIndex);
				  
				   // #1 - get a reference to the databse
				  //let database = firebase.database();
				  
				  // #2 - refer to a root node named `restaurants`
				  //let ref = database.ref('restaurants');
				 
				 //console.log(app.result);
				 // #3 - create some data
				 if(exists == false && app.result[rowIndex] != null && app.userName.trim() != ""){
					 firebase.database().ref(app.userName).push({
						data: app.result[rowIndex].restaurant
						
					 });
				 }
					  
				   // #4 - send data, in this case we are adding it to the `scores` node
					//ref.push(data);
			   
		   },
		   
		   // used for getting the data back from the database and storing it
		   // needs page reload to work correctly // controller and switch to mongo (maybe model?)
		   firebaseRead(){
			   if(this.userName.trim() != ""){
			   firebase.database().ref(this.userName).on("value", dataChanged, firebaseError);
					
					// internal methods for the .on above
					 function dataChanged(data){
						let obj = data.val();
						app.favorites = [];
						
						for (let key in obj){
							//console.log(obj[key].data);
							app.favorites.push(obj[key].data);
							
						}
					  }
						
					  function firebaseError(error){
						//console.log(error);
					  }
			   }
		   },

		   
		   
	} // end methods
	
});

