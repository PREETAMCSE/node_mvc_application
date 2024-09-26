
export const auth = (req, res, next) => {
    if(req.session.userEmail){
        next();
    }
    res.redirect('/login');
}