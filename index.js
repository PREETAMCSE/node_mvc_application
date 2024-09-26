//const express = require('express');
import express from 'express'
import ProductController from './src/controllers/product.controller.js';
import UserController from './src/controllers/user.controller.js';
import ejsLayouts from 'express-ejs-layouts'
import path from 'path';
import validationMiddleware from './src/middlewares/validation.middleware.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';
import session from 'express-session';
import { auth } from './src/middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import { setLastVisit } from './src/middlewares/lastVisit.middleware.js';


const server = express();
server.use(express.json());
server.use(cookieParser());
//server.use(setLastVisit); // it will set for all request
server.use(session({
    secret: 'SecretKey', //key should be random generated
    resave:false,
    saveUninitialized:true,
    cookie: {secure: false},//here cookie would be sent on unsecure http connection
})
);
//parse form data for encoding
server.use(express.urlencoded({ extended: true })) // extended true means use latest qs library
server.use(express.static('public'));
// Set up view engine settings
server.set("view engine", "ejs")
server.set("views", path.join(path.resolve(),"src",'views'))


server.use(ejsLayouts)
// create an instance of ProductController
const productController = new ProductController(); 
const userController = new UserController();
server.get('/register', (userController.getRegister));
server.get('/login', (userController.getLogin));
server.post('/login', (userController.postLogin));
server.post('/register', (userController.postRegister ));
server.get('/', setLastVisit,auth,(productController.getProducts));
server.get('/logout',(userController.logout));
server.get('/new',auth, productController.getAddForm)
server.post('/',auth,uploadFile.single('imageUrl'),validationMiddleware, productController.addNewProduct)
server.get('/update-product/:id',auth,productController.getUpdateProductView);
server.post('/update-product',auth,productController.postUpdateProduct)
server.post('/delete-product/:id',auth, productController.deleteProduct)
server.use(express.static('src/views'));
    // return res.send('Welcome to Inventory App');
server.listen(3400);
console.log('Server is listening on port 3400');