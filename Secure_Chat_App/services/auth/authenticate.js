const authenticateUser = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        req.flash("danger", "You are not authenticated!");
        res.redirect("/");
    }
}

module.exports = {
    authenticateUser,
}