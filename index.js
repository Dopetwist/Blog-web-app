import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import pg from "pg";


const app = express();
const port = 3000;

env.config();


// Middlewares

app.use(bodyParser.urlencoded({ extended: true }));

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


// Home page

app.get("/", (req, res) => {
    res.render("index.ejs");
});


// Display Create page

app.get("/create", (req, res) => {
    res.render("create.ejs");
});


// View list of blog posts

app.get("/view", async (req, res) => {

    try {
        const result = await db.query("SELECT * FROM posts");

        listOfBlogs = result.rows;

        res.render("bloglist.ejs", { blogs: listOfBlogs });
    } catch (error) {
        res.render("bloglist.ejs", { message: "An error occured, please try again later." });
        console.error(error);
    }
});


// Route to display the full contents of a specific blog post

app.get("/details/:id", async (req, res) => {
    try {
        const postID = req.params.id;

        const result = await db.query("SELECT * FROM posts WHERE id = $1", [postID]);

        res.render("details.ejs", { blogDetails: result.rows[0] });
    } catch (error) {
        res.render("details.ejs", { message: "An error occured, please try again later." });
        console.error(error);
    }
});


// Route to get the edit page to edit a blog post

app.get("/edit/:id", async (req, res) => {

    try {
        const editID = req.params.id;

        const result = await db.query("SELECT * FROM posts WHERE id = $1", [editID]);
    
        
        res.render("edit.ejs", { editBlog: result.rows[0] });
    } catch (error) {
        console.error(error);
    };

});


// Route to store details of a created blog post in an array and simultaneously displaying the success page

app.post("/create", async (req, res) => {
    const titleInput = req.body.blogTitle;
    const desInput = req.body.blogDes;
    const time = "06-06-2025";
    const msg = "Your post has been published successfully!";


    await db.query("INSERT INTO posts (title, article, created_at) VALUES ($1, $2, $3)", [titleInput, desInput, time])

    res.render("message.ejs", {
        message: msg
    });
});


// Route to update a blog post after an edit

app.post("/edit/:id", async (req, res) => {
    const editID = req.params.id;
    const { title, description } = req.body;

    try {
        await db.query("UPDATE posts SET title = $1, article = $2 WHERE id = $3", [title, description, editID]);

        res.redirect("/view");
    } catch (error) {
        res.render("edit.ejs", { message: "An error occured, please try again later."});
        console.error(error);
    }
});


// Route to Delete a blog post

app.post("/delete/:id", async (req, res) => {
    const postID = req.params.id;

    try {
        await db.query("DELETE FROM posts WHERE id = $1", [postID]);
        
        res.send("<script>window.location='/view'</script>");
    } catch (error) {
        res.render("bloglist.ejs", { message: "Error: Unable to delete post. Try again." });
        console.error(error);
    }
});


// Function to generate a random unique ID for each blog post

function generateID() {
    return Math.floor(Math.random() * 10000);
};

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`); 
});