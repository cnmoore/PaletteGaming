var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    News            = require("./models/news"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
//====================
// IMPORTED ROUTES
//====================

var indexRoutes     = require("./routes/index"),
    newsRoutes      = require("./routes/news"),
    commentRoutes   = require("./routes/comments");
    
//====================
// PLUGINS
//====================
    
mongoose.connect("mongodb://localhost/test_news");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(methodOverride("_method"));

//====================
// PASSPORT CONFIG
//====================

app.use(require("express-session")({
    secret: "Look at the size of this amazing passcode!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//====================
// SERVER ROUTES
//====================

app.use("/", indexRoutes);
app.use("/news", newsRoutes);
app.use("/news/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Palette Gaming Starting..."); 
});

