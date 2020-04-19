const fetch = require('node-fetch');
const models = require('../models');

const { Restaurant } = models;


class Url {
  constructor(entityId, q, start) {
    this.entityId = entityId;
    this.q = q;
    this.start = start;
    this.ZOMATO_URL = 'https://developers.zomato.com/api/v2.1/search?';
  }

  createUrl() {
    let url = this.ZOMATO_URL;
    url += `entity_id=${this.entityId}&`;
    url += 'entity_type=city&';
    url += `q=${this.q}&`;
    url += `start=${this.start}&`;
    url += 'apikey=26a628922607a67df0d325e594d41c90';
    return url;
  }
}

const searchPage = (req, res) => res.render('app');

// no need to store these on the database so storing in variables instead
let foodType;
let city;
let state;
const start = 0;
let cityId;
let result;
// let map;

/*const getFormData = (req, res) => {
  if (!req.body.foodType || !req.body.city || !req.body.state) {
    return res.status(400).json({ error: 'Please enter all required information' });
  }

  foodType = req.body.foodType;
  city = req.body.city;
  state = req.body.state;
  
  return;
};*/
 const getFormData = (req, res) => {
  if (!req.body.foodType || !req.body.city || !req.body.state) {
    return res.status(400).json({ error: 'Please enter all required information' });
  }

  foodType = req.body.foodType;
  city = req.body.city;
  state = req.body.state;

  const restaurantData = {
    foodType: req.body.foodType,
    city: req.body.city,
    state: req.body.state,
    // owner: req.session.account._id,
  };

  const newSearch = new Restaurant.SearchModel(restaurantData);

  const searchPromise = newSearch.save();

  searchPromise.then(() => res.json({ redirect: '/search' }));

  searchPromise.catch((err) => {
    console.log(err);
     if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return searchPromise;
}; 

const search = (request, res) => {
  const req = request;
  const res2 = res;
  let url;
  let term = foodType;
  term = term.trim();
  term = term.replace(' ', '');
  term = encodeURIComponent(term);

  city = city.trim();
  const cityArr = city.split('');
  cityArr[0] = cityArr[0].toUpperCase();
  city = cityArr.join('');
  city = encodeURIComponent(city);

  let cityUrl = 'https://developers.zomato.com/api/v2.1/cities?';
  cityUrl += `q=${city}&`;
  cityUrl += 'apikey=26a628922607a67df0d325e594d41c90';
  fetch(cityUrl)
    .then((response) => {
      if (!response.ok) {
        throw Error('ERROR');
      }
      return response.json();
    })
    .then((cityJson) => {
      console.log(cityJson.location_suggestions);
      cityJson.location_suggestions.forEach((cityParam) => {
        if (cityParam.state_code === state) {
          let name;
          if (state !== 'NY') {
            name = `${city}, ${state}`;
          }

          // extra checks are needed for NY
          // since the state code is formatted differently and new york city is a special case
          else if (city.toLowerCase() === 'new york city') {
            city = 'New York City';
            name = `${city}, ${state}`;
          } else {
            name = `${city},New York, ${state}`;
          }

          // https://stackoverflow.com/questions/21792367/replace-underscores-with-spaces-and-capitalize-words
          // needed to check if name has spaces and capitalizes words
          const nameFrags = name.split(' ');
          let i = 0;
          for (i; i < nameFrags.length; i++) {
            nameFrags[i] = nameFrags[i].charAt(0).toUpperCase() + nameFrags[i].slice(1);
          }
          name = nameFrags.join(' ');

          // console.log(city.name);
          // console.log(name);
          if (name === cityParam.name) {
            cityId = cityParam.id;
            // console.log(cityId);
            url = new Url(cityId, term, start);
            url = url.createUrl();
            // console.log(url);
          }

          // needed to check if name is real place with missing spaces in it
          else {
            cityId = cityJson.location_suggestions[0].id;
            // console.log(cityId);
            url = new Url(cityId, term, start);
            url = url.createUrl();
          }
        }
      });
      if (cityJson.location_suggestions.length !== 0) {
        let found = false;
        /* for (const c of cityJson.location_suggestions) {
      if (c.state_code == state) {
        found = true;
      }
    } */
        cityJson.location_suggestions.forEach((c) => {
          if (c.state_code === state) {
            found = true;
          }
        });

        if (found) {
        // fetch to get all displayed table info
          fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw Error(`ERROR: ${response.statusText}`);
              }
              return response.json();
            })
            .then((json) => {
              result = json.restaurants;
			  console.log(result);
              // console.log(this.result);
              /* if (result.length != 0) {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYXhzNjIwNyIsImEiOiJjanUzMmw4N2owaXZsNDNwdnVpeWExYXlkIn0.9fWe9GvQAdJrx-MJFI3GAA';

            map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
            });
            map.setZoom(13);
            map.setCenter([result[0].restaurant.location.longitude, result[0].restaurant.location.latitude]); // note the order - it's longitude,latitude - which is opposite of Google Maps
            const thisScope = this;

            // setting up mapbox api
            const geojson = {
              type: 'FeatureCollection',
              features: [],
            };

            let i;
            for (i = 0; i < result.length; i++) {
              geojson.features[i] = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(json.restaurants[i].restaurant.location.longitude), parseFloat(json.restaurants[i].restaurant.location.latitude)],
                },
                properties: {
                  title: json.restaurants[i].restaurant.name,
                  description: json.restaurants[i].restaurant.menu_url,
                },
              };
            }

            // console.log(geojson.features);
            // add markers to map
            geojson.features.forEach((marker) => {
            // create a HTML element for each feature
              const el = document.createElement('div');
              el.className = 'marker';
              // console.log(thisScope.map);

              // make a marker for each feature and add to the map
              new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(thisScope.map);

              new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                  .setHTML(`<h3>${marker.properties.title}</h3><a href="${marker.properties.description}">` + 'View Menu on Zomato.com' + '</a>'))
                .addTo(thisScope.map);
            });
          } */
            });
        }
      }
    });
};

module.exports.formData = getFormData;
module.exports.searchPage = searchPage;
module.exports.search = search;
