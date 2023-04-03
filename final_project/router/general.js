const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getBooks = () => new Promise((resolve, reject) => {
  resolve(books || []);
});

const getBookByIsbn = (isbn) => new Promise((resolve, reject) => {
  if (books[isbn]) {
    resolve(books);
  }
  resolve({});
});

const getBookByAuthor = (author) => new Promise((resolve, reject) => {
  const result = [];
  Object.keys(books).forEach(b => {
    const book = books[b];
    if (book.author === author) {
      result.push(book);
    }
  })

  resolve(result);
});

const getBookByTitle = (title) => new Promise((resolve, reject) => {
  const result = [];
  Object.keys(books).forEach(b => {
    const book = books[b];
    if (book.title === title) {
      result.push(book);
    }
  });
  resolve(result);
});

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const booksFromPromise = await getBooks();
  console.log("booksFromPromise", booksFromPromise)
  return res.status(200).send(booksFromPromise);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  if (req.params.isbn) {
    const filteredBooks = await getBookByIsbn(req.params.isbn);
    return res.status(200).send(filteredBooks);
  }
  return res.status(404).send("cannot find book");
 });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;

  if (req.params.author) {
    const filteredBooks = await getBookByAuthor(req.params.author);
    return res.status(200).send(filteredBooks);
  }

  return res.status(404).send("cannot find book");
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  if (req.params.title) {
    const filteredBooks = await getBookByTitle(req.params.title);
    return res.status(200).send(filteredBooks);
  }
  return res.status(404).send("cannot find book");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  console.log("isbn", req.params.isbn, books[isbn])
  if (books[isbn].reviews) {
    return res.status(200).send(books[isbn].reviews);
  }
  return res.status(404).send("cannot find book");
});

module.exports.general = public_users;
