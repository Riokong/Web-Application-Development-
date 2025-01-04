import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import path from "path";
import methodOverride from 'method-override';
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let posts = [];

const app = express();
const port = 3000;



app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
   
     const today = new Date(); 
     let day = today.getDay();

     let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
     let formattedDate = today.toLocaleDateString('en-US', options);
     
 
     let type = "a weekday";
     let adv = "It's time to work hard";
 
 
     if(day === 0 || day === 6)
     {
         type = "the weekend";
         adv = "It's time to have some fun";
     }
 
     res.render("index.ejs", {
         formatDay: formattedDate,
         dayType: type,
         advice: adv,
         posts: posts
     });
 });


 app.get("/about", (req, res) => {
    res.render("about.ejs");
  });
  
 app.get("/contact", (req, res) => {
    res.render("contact.ejs");
  });

 app.get("/compose",(req, res) => {
   res.render("compose.ejs");
});

app.get('/posts/:postID', (req, res) => {
  const postTitle = _.unescape(req.params.postID); // Decode URL-encoded post title
  const foundPost = posts.find(post => _.toLower(post.title) === _.toLower(postTitle));

  if (foundPost) {
    res.render('post', { // Render the post view with the found post's data
        title: foundPost.title,
        content: foundPost.content
    });
} else {
    res.status(404).send('Post not found'); // Handle the case where no post is found
}
});


app.put('/posts/:postID', (req, res) => {
  const postTitle = _.unescape(req.params.postID);
  const postIndex = posts.findIndex(post => _.toLower(post.title) === _.toLower(postTitle));

  if (postIndex !== -1) {
    posts[postIndex].title = req.body.postTitle;
    posts[postIndex].content = req.body.postContent;
    res.redirect(`/posts/${encodeURIComponent(req.body.postTitle)}`);
  } else {
    res.status(404).send('Post not found');
  }
});

app.get('/posts/:postID/edit', (req, res) => {
  const postTitle = _.unescape(req.params.postID); // Decode the URL-encoded post title
  const foundPost = posts.find(post => _.toLower(post.title) === _.toLower(postTitle));

  if (foundPost) {
    res.render('edit', { 
      title: foundPost.title,
      content: foundPost.content
    });
  } else {
    res.status(404).send('Post not found');
  }
});

app.put('/posts/:postID', (req, res) => {
  const postTitle = _.unescape(req.params.postID);
  const postIndex = posts.findIndex(post => _.toLower(post.title) === _.toLower(postTitle));

  if (postIndex !== -1) {
    posts[postIndex].title = req.body.postTitle;
    posts[postIndex].content = req.body.postContent;
    res.redirect(`/posts/${encodeURIComponent(req.body.postTitle)}`);
  } else {
    res.status(404).send('Post not found');
  }
});

app.delete('/posts/:postID', (req, res) => {
  const postTitle = _.unescape(req.params.postID);
  const postIndex = posts.findIndex(post => _.toLower(post.title) === _.toLower(postTitle));

  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

 app.post("/compose", (req,res) => { 
  const newPostTitle = req.body.postTitle;
  const newPostContent = req.body.postContent;

  const postObj = {
    "title": newPostTitle,
    "content": newPostContent
  }
  
   posts.push(postObj);
   console.log(posts); 
   res.redirect("/"); 
});

 app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});