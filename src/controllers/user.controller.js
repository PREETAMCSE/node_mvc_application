import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export default class UserController{
    getRegister(req, res){
        res.render('register');

    }

    getLogin(req,res){
        res.render('login', { errorMessage: null });
    }

    postRegister(req,res){
      const {name,email,password} = req.body;
      UserModel.add(name,email,password);
      res.render('login', { errorMessage: null });
    }

    postLogin(req,res){
        const { email, password } = req.body;
        const user = UserModel.isValidUser(email, password);
        if(!user){
            res.render('login', {
                errorMessage : 'Invalid Crendiatals'
            })
        }
        req.session.userEmail=email;
        let products = ProductModel.get();
        return res.render('products', { products, userEmail:req.session.userEmail });
    }

    logout(req,res){
        // On logout We have to destroy session
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect('/login');
            }
        })
        res.clearCookie('lastVisit');
    }
}