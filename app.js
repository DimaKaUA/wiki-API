//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const articleSchema = {
  
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  }
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  .get(function(req, res) {

    Article.find(function(err, foundArticles) {

      if (!err){
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {

      if(!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    
    Article.deleteMany(function(err) {

      if (!err) {
        res.send("Successfully deleted all article.");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle")

  .get(function(req, res) {

    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {

      if (foundArticle) {
        res.send(foundArticle);
      } else {
        if(!err) {
          res.send("No articles matching that title was found.");
        } else {
          res.send(err);
        }
      }
    });
  })

  .put(function(req, res) {

    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content},
      function(err) {
        if (!err) {
          res.send("Successfully updated the hole article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function(req, res) {

    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body},
      function(err) {
        if (!err) {
          res.send("Successfully updated the article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {

    Article.deleteOne(
      { title: req.params.articleTitle },
      function(err) {
        if (!err) {
          res.send("Successfully deleted the article.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function() {

  console.log("Server is running on port: " + 3000);

  mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", function() {
    mongoose.connection.close(function () {
      console.log("Mongoose disconnected on app termination");
      process.exit(0);
    });
  });
});