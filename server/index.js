const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const { api } = require('../client/src/config/config.js');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//PRODUCT VIEW ROUTES
app.get('/products', (req, res) => {
  let urlVariable = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/products/${req.query.id}`;

  let options = {
    'headers': {
      'Authorization': api
    }
  };

  axios.get(urlVariable, options)
    .then(results => {
      // console.log('these are the /products response from the api -->', results);
      res.send(results.data);
    })
    .catch(err => {
      //console.log('there was an error in the api call for the get product --> ', err);
      res.status(404).end();
    });

});

app.get('/products/:product_id/styles', (req, res) => {
  let urlVariable = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/products/${req.query.id}/styles`;

  let options = {
    'headers': {
      'Authorization': api
    }
  };

  axios.get(urlVariable, options)
    .then(results => {
      //console.log('these are the /products response from the api -->', results);
      res.send(results.data);
    })
    .catch( err => {
      console.log('there was an error in the api call for the get product/product_id/styles --> ', err);
      res.status(404).end();
    });
});


//REVIEWS ROUTES

//List Reviews
app.get('/reviews/', (req, res) => {
  //console.log('reviews query', req.query);
  let apiUrl = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/reviews/';

  console.log(req.query);
  let options = {
    params: {
      'page': 1,
      'count': 1000,
      'sort': req.query.sort,
      'product_id': req.query.id
    },
    headers: {
      'Authorization': api
    }
  };

  axios.get(apiUrl, options)
    .then((data) => {
      res.json(data.data);
      res.end();
    })
    .catch((err) => {
      console.log('error in server request', err);
      res.status(500);
      res.end();
    });

});

//Get Review Metadata
app.get('/reviews/meta', (req, res) => {

});

//Add a Review
app.post('/reviews', (req, res) => {

});

//Mark Review as Helpful
app.put('/reviews/:review_id/helpful', (req, res) => {

});

//Report Review
app.put('/reviews/:review_id/report', (req, res) => {

});

//Q&A routes

// Get Questions
app.get('/qa/questions/', (req, res) => {
  let urlVariable = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/';

  let options = {
    'headers': {
      'Authorization': api
    },
    'params': {
      'product_id': req.query.id
    }
  };

  axios.get(urlVariable, options)
    .then(results => {
      // console.log('answers data: ', results.data);
      res.send(results.data);
    })
    .catch(err => {
      console.log('error getting questions: ', err);
      res.status(404).end();
    });

});

// Post Questions
app.post('/qa/questions/', (req, res) => {
  // console.log(req.body);
  // res.send('hit server');
  let urlVariable = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/';
  let options = {
    'body': JSON.stringify(req.body.body),
    'name': JSON.stringify(req.body.name),
    'email': JSON.stringify(req.body.email),
    'product_id': Number(JSON.stringify(req.body.product_id))
  };
  let authHeaders = {
    'headers': {
      'Authorization': api
    }
  };

  axios.post(urlVariable, options, authHeaders)
    .then(results => {
      // console.log('question post results:', results);
      res.send(' queston posted');
    })
    .catch((err) => {
      console.log('error posting questions: ', err);
      res.status(404).end();
    });
});

// Post Answer
app.post('/qa/questions/:question_id/ansers', (req, res) => {
  // console.log(req.body);
  // res.send('hit server');
  let urlVariable = `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/${req.body.question_id}/answers`;
  let body = {
    'body': JSON.stringify(req.body.body),
    'name': JSON.stringify(req.body.name),
    'email': JSON.stringify(req.body.email),
    'photos': []
  };
  let options = {
    'headers': {
      'Authorization': api
    }
  };

  axios.post(urlVariable, body, options)
    .then(results => {
      console.log('question post results:', results);
      res.send(' queston posted');
    })
    .catch((err) => {
      console.log('error posting questions: ', err);
      res.status(404).end();
    });
});

//Q&A Puts
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  let options = {
    'headers': {
      'Authorization': api
    }
  };
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/${req.body.question}/helpful`, {}, options)
    .then((results) => {
      console.log(results);
      res.send('question marked helpful');
    })
    .catch((err) => {
      console.log('error putting Q helpful: ', err);
      res.status(404).end();
    });
});

app.listen(3001);



console.log('Listening on port 3001');