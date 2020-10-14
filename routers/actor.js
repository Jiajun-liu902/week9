let mongoose = require('mongoose');

// import modules created by yourself
let Actor = require('../models/actor');
let Movie = require('../models/movie');

module.exports = {
  getAll: function(req, res) {
    Actor.find({})
      .populate('movies')
      .exec(function(err, actors) {
        if (err) {
          return res.json(err);
        } else {
          // res.json() response data will be in JSON format
          res.json(actors);
        }
      });
  },
  createOne: function(req, res) {
    let newActorDetails = req.body;
    newActorDetails._id = new mongoose.Types.ObjectId();
    let actor = new Actor(newActorDetails);
    actor.save(function(err) {
      if (err) {
        return res.json(err);
      } else {
        console.log('done');
        res.json();
      }
    })
  },
  getOne: function(req, res) {
    Actor.findOne({ _id: req.params.id })
      .populate('movies')
      .exec(function(err, actor) {
        if (err) {
          // early return, code after return won't be executed
          return res.json(err);
        }
        if (!actor) {
          return res.json();
        }
        res.json(actor);
      })
  },
  updateOne: function(req, res) {
    Actor.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      function(err, actor) {
        if (err) {
          return res.status(400).json(err);
        }
        if (!actor) {
          return res.status(404).json();
        }
        res.json(actor);
      }
    )
  },
  deleteOne: function(req, res) {
    Actor.findOneAndRemove(
      { _id: req.params.id },
      function(err, actor) {
        if (err) {
          return res.status(400).json(err);
        }
        let movies = actor.movies;
        Movie.deleteMany(
          { _id: { $in: movies } },
          function(err) {
            if (err) {
              return res.status(400).json(err);
            }
            res.json();
          }
        )
      }
    )
  },
  addMovie: function(req, res) {
    Actor.findOne(
      { _id: req.params.id },
      function (err, actor) {
        if (err) { 
          return res.status(400).json(err);
        }
        if (!actor) {
          return res.status(404).json();
        }
        Movie.findOne(
          { _id: req.body.id },
          function(err, movie) {
            if (err) { 
              return res.status(400).json(err);
            }
            if (!movie) {
              return res.status(404).json();
            }
            actor.movies.push(movie._id);
            actor.save(function(err) {
              if (err) { 
                return res.status(400).json(err);
              }
              res.json(actor);
            })
          }
        )
      }
    )
  },
  removeMovie: function(req, res) {
    Actor.findOne(
      { _id: req.params.actorId },
      function (err, actor) {
        if (err) { 
          return res.status(400).json(err);
        }
        if (!actor) {
          return res.status(404).json();
        }
        // find movie by movieId
        Movie.findById(req.params.movieId, function(err, movie) {
          if (err) { 
            return res.status(400).json(err);
          }
          if (!movie) {
            return res.status(404).json();
          }
          let newMovies = [];
          for (let i = 0; index < actor.movies.length; i++) {
            // ObjectId and string can't be compared directly
            // if (actor.movies[i]._id.toString() !== req.params.movieId) {
            //  newMovies.push(actor.movies[i]);
            // }

            // Two ObjectId can't be compared directly
            if (!actor.movies[i]._id.equals(movie._id)) {
              newMovies.push(actor.movies[i]._id);
            } 
          }
          actor.movies = newMovies;
          actor.save(function(err, newActor) {
            if (err) {
              return res.status(400).json(err);
            }
            res.json(newActor);
          })
        })
      }
    )
  }
}