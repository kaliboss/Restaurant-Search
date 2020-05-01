const fetch = require('node-fetch');
const models = require('../models');

const { Restaurant } = models;

// class for creating url to fetch
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

// displays the app.handlebars page since the user is not logged in
const searchPage = (req, res) => res.render('app');

// displays the app2.handlebars page since the user is logged in
const searchPage2 = (req, res) => res.render('app2');

// no need to store these on the database so storing in variables instead
let foodType;
let city;
let state;
const start = 0;
let cityId;
let result;
// let map;

// grabs the form data from the search form on the front page
const getFormData = (req, res) => {
  if (!req.body.foodType || !req.body.city || !req.body.state) {
    return res.status(400).json({ error: 'Please enter all required information' });
  }

  foodType = req.body.foodType;
  city = req.body.city;
  state = req.body.state;
  // start = req.body.startNum;

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
      return res.status(400).json({ error: 'Restaurant already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  return searchPromise;
};

// grabs search data from the zomato API
const search = (request, res) => {
  // const req = request;
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
      // console.log(cityJson.location_suggestions);
      cityJson.location_suggestions.forEach((cityParam) => {
        if (cityParam.state_code === state) {
          let name;
          if (state !== 'NY') {
            name = `${city}, ${state}`;
          } else if (city.toLowerCase() === 'new york city') {
            // extra checks are needed for NY
            // since the state code is formatted differently and new york city is a special case
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
          } else {
            // needed to check if name is real place with missing spaces in it
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
              // console.log(result);
              return res2.json({ restaurants: result });
              // console.log(this.result);
            });
        }
      }
    });
};


module.exports.formData = getFormData;
module.exports.searchPage = searchPage;
module.exports.searchPage2 = searchPage2;
module.exports.search = search;
