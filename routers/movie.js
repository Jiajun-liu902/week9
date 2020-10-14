let mongoose = require('mongoose');

// import modules created by yourself
let Actor = require('../models/actor');
let Movie = require('../models/movie');

module.exports = {
  getAll: function(req, res) {
    Movie.find({})
      .populate('actors')
      .exec(function(err, movies) {
        if (err) {
          return res.status(400).json(err);
        } else {
          // res.json() response data will be in JSON format
          res.json(movies);
        }
      })
  },
  createOne: function(req, res) {
    let newMovieDetails = req.body;
    newMovieDetails._id = new mongoose.Types.ObjectId();

    Movie.create(newMovieDetails, function(err, movie) {
      if (err) {
        return res.status(400).json(err);
      }
      res.json(movie);
    })
  },
  getOne: function (req, res) {
    Movie.findOne({ _id: req.params.id })
      .populate('actors')
      .exec(function (err, movie) {
        if (err) { 
          return res.status(400).json(err);
        }
        if (!movie) {
          return res.status(404).json();
        }
        res.json(movie);
      });
  },
  updateOne: function (req, res) {
    Movie.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      function (err, movie) {
        if (err) { 
          return res.status(400).json(err);
        }
        if (!movie) {
          return res.status(404).json();
        }
        res.json(movie);
      }
    )
  },
  deleteOne: function(req, res) {
    Movie.findOneAndRemove(
      { _id: req.params.id },
      function(err) {
        if (err) {
          return res.status(400).json(err);
        }
        res.json();
      }
    )
  },
  removeActor: function(req, res) {
    Movie.findOne(
      { _id: req.params.movieId },
      function (err, movie) {
        if (err) { 
          return res.status(400).json(err);
        }
        if (!movie) {
          return res.status(404).json();
        }
        Actor.findById(req.params.actorId, function(err, actor) {
          if (err) { 
            return res.status(400).json(err);
          }
          if (!actor) {
            return res.status(404).json();
          }
          let newActors = [];
          for (let i = 0; index < movie.actors.length; i++) {
            // ObjectId and string can't be compared directly
            // if (actor.movies[i]._id.toString() !== req.params.movieId) {
            //  newMovies.push(actor.movies[i]);
            // }

            // Two ObjectId can't be compared directly
            if (!movie.actors[i]._id.equals(actor._id)) {
              newActors.push(movie.actors[i]._id);
            } 
          }
          movie.actors = newActors;
          movie.save(function(err, newMovie) {
            if (err) {
              return res.status(400).json(err);
            }
            res.json(newMovie);
          })
        })
      }
    )
  },
  addActor: function(req, res) {
    // req.params.id is movie's id
    Movie.findById(req.params.id, function(err, movie) {
      if (err) { 
        return res.status(400).json(err);
      }
      if (!movie) {
        return res.status(404).json();
      }
      // req.body.id is actor's id
      Actor.findById(req.body.id, function(err, actor) {
        if (err) { 
          return res.status(400).json(err);
        }
        if (!actor) {
          return res.status(404).json();
        }
        movie.actors.push(actor._id);
        movie.save(function(err, newMovie) {
          if (err) { 
            return res.status(400).json(err);
          }
          res.json(newMovie);
        })
      })
    })
  },
  getByYear: function(req, res) {
    let year1 = parseInt(req.params.year1);
    let year2 = parseInt(req.params.year2);
    if (year1 <= year2) {
      return res.status(400).json('year1 should be greater than year2');
    }
    Movie
      .where('year')
      .lte(year1)
      .gte(year2)
      .exec(function(err, movies) {
        if (err) {
          return res.status(400).json(err);
        }
        res.json(movies);
      })
  },
  deleteByYear: function(req, res) {
    let year1 = parseInt(req.body.year1);
    let year2 = parseInt(req.body.year2);
    if(year1 <= year2) {
      return res.status(400).json('year1 should be greater than year2');
    }
    Movie.deleteMany(
      { year: { $lte: year1, $gte: year2 } },
      function(err) {
        if (err) {
          return res.status(400).json(err);
        }
        res.json();
      }
    )
  }
}