import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import pg from "pg";


const app = express();
const port = 3000;

env.config();


// Middlewares

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


// Database connection

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

db.connect();


let listOfBlogs = [];


// Route to get the home page

app.get("/", (req, res) => {
    res.render("index.ejs");
});


// Route to get the Create form page to write a blog post

app.get("/create", (req, res) => {
    res.render("create.ejs");
});


// Route to view list of blog posts

app.get("/view", (req, res) => {
    res.render("bloglist.ejs", { blogs: listOfBlogs });
});


// Route to display the full contents of a specific blog post

app.get("/details/:id", (req, res) => {
    const postID = req.params.id;
    const blogDetails = listOfBlogs.find((blog) => blog.id === parseInt(postID));

    res.render("details.ejs", { blogDetails: blogDetails });
});


// Route to get the edit page to edit a blog post

app.get("/edit/:id", (req, res) => {

    try {
        const editID = parseInt(req.params.id);
        const editBlog = listOfBlogs.find((blog) => blog.id === editID);
    
        if (editBlog) {
            res.render("edit.ejs", { editBlog });
        } else {
            res.status(404).send("Post not found!");
        };
        
    } catch (error) {
        console.log(error);
    };

});


// Route to store details of a created blog post in an array and simultaneously displaying the success page

app.post("/create", (req, res) => {
    const titleInput = req.body.blogTitle;
    const desInput = req.body.blogDes;
    const msg = "Your post has been published successfully!";

    const blogPostsObj = {
        id: generateID(),
        title: titleInput,
        description: desInput,
        createdAt: new Date().toDateString('en-US'), 
        time: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };

    listOfBlogs.push(blogPostsObj);

    res.render("message.ejs", {
        blogs: listOfBlogs,
        message: msg
    });
});


// Route to update a blog post after an edit

app.post("/edit/:id", (req, res) => {
    const editID = parseInt(req.params.id);
    const {title, description} = req.body;
    const blogs = listOfBlogs;


    const editBlog = listOfBlogs.findIndex((blog) => blog.id === editID);

    if (editBlog !== -1) {
        listOfBlogs[editBlog] = { id: editID, title, description, blogs };
    
        res.redirect("/view");
    } else {
        res.status(404).send("Post not found!");
    }

});


// Route to Delete a blog post

app.post("/delete/:id", (req, res) => {
    const postID = req.params.id;
    listOfBlogs = listOfBlogs.filter((blog) => blog.id !== parseInt(postID));

    res.send("<script>window.location='/view'</script>");
});


// Function to generate a random unique ID for each blog post

function generateID() {
    return Math.floor(Math.random() * 10000);
};

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`); 
});