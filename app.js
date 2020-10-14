let bodyParser = require('body-parser');
let express = require('express');
let mongoose = require('mongoose');
let path = require('path');
// import routers
let actors = require('./routers/actor');
let movies = require('./routers/movie');

let app = express();

app.listen(8080);

app.use(bodyParser.json()); // bodyParser.json() parse request body that is in JSON format
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/',express.static(path.join(__dirname,'dist/movieAng')));

mongoose.connect('mongodb://localhost:27017/movies', function(err) {
  if (err) {
    return console.log('Mongoose - connection error:', err);
  }
  console.log('Connect Successfully');
})

app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);

app.delete('/actors/:actorId/:movieId', actors.removeMovie);


app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);

app.delete('/movies/:id', movies.deleteOne);
app.delete('/movies/:movieId/:actorId', movies.removeActor);
app.post('/movies/:id/actors', movies.addActor);
app.get('/movies/:year1/:year2', movies.getByYear);
app.delete('/movies', movies.deleteByYear); // year data will be sent via req.body
