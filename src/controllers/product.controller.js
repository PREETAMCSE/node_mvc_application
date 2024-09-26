import path from 'path';
import ProductModel from "../models/product.model.js"

export default class ProductController{

    getProducts(req,res){
        let products = ProductModel.get();
        // here name in {} should be same as in ejs file
        res.render("products", {products:products, userEmail:req.session.userEmail})

        //console.log(products);
        //console.log(path.resolve()); //It gives running directory
       // return res.sendFile(path.join(path.resolve(),"src",'views',"products.html" ));
    }

    getAddForm(req, res,next){
        return res.render("new-product", {errorMessage:null, userEmail:req.session.userEmail});
    }

    addNewProduct(req, res,next){
        // access data from form
        console.log(req.body);   
        const {name,desc,price} = req.body;
        const imageUrl = 'images/'+req.file.filename;
        ProductModel.add(name,desc,price,imageUrl);
        let products = ProductModel.get();
        return res.render('products', { products, userEmail:req.session.userEmail })
    }

    getUpdateProductView(req,res,next){
        // 1. If product exist return view
          const id = req.params.id;
          const productFound = ProductModel.getById(id);
          if(productFound){
            res.render('update-product', {product:productFound, errorMessage:null, userEmail:req.session.userEmail});
          }else{
            res.status(401).send("Product not found");
          }

        //2. else return errors
    }

    postUpdateProduct(req, res){
        ProductModel.update(req.body)
        let products = ProductModel.get();
        return res.render('products', { products, userEmail:req.session.userEmail})
    }

    deleteProduct(req,res){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
          if(!productFound){
            return res.status(401).send("Product not found");
          }
        ProductModel.delete(id);
        let products = ProductModel.get();
        return res.render('products', { products, userEmail:req.session.userEmail })
    }
}