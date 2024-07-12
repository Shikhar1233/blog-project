//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const dotenv = require("dotenv");

const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const path = require("path")
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

dotenv.config();
const port = 8080;


// const posts = [];

// connect to the database
mongoose.connect(process.env.MONGODB_URI_KEY);
// ----------------------------------------------------------------

// creating a blog schema for the database
const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: [true, "There is no Title, please enter a title"]
  },
  postBody: String,
  linkTitle: String,
});
//----------------------------------------------------------------

// create a model instance
const Post = mongoose.model("Post", postSchema);
// ----------------------------------------------------------------



app.get("/", (req, res) => {
  Post.find({}).then(foundList => {
    // console.log(foundList);
    res.render("home", {
      homeContent: homeStartingContent,
      postsContent: foundList
    });
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent
  })
})
app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent
  })
})
app.get("/compose", (req, res) => {
  res.render("compose")
})

app.post("/compose", (req, res) => {

  const post = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
    linkTitle: _.kebabCase(req.body.postTitle),
  });

  post.save().then(() => {
    console.log("post saved successfully")
    res.redirect("/")
  }).catch(err => {
    console.log(
      "Save err => ",
      err._message +
      " in " +
      err.errors.postTitle.path +
      ": => " +
      err.errors.postTitle
    );
    res.redirect("/compose")
  })
  // posts.push(post)

  // res.redirect("/")
})

app.post("/deletePost", (req, res) => {
  const deletePost = req.body.deleteBtn;
  // console.log(deletePost);
  Post.findByIdAndRemove(deletePost).then(() => {
    console.log("deletePost => ", deletePost);
    res.redirect("/");
  });
});

app.get("/posts/:postId", (req, res) => {
  Post.find({}).then(posts => {
    posts.forEach((post, i) => {
      // _.lowerCase(post.postTitle) it also works with numbers. but when i use "post.postTitle.toLowerCase()"  it doesnt work with numbers
      if (_.lowerCase(post._id) === _.lowerCase(req.params.postId)) {
        res.render("post", {
          post,
        });
      } else {
        console.log(post, " ", i, "Match Not Found");
      }
    });
  })

})








app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});