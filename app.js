const express         = require("express"),
    flash           = require("connect-flash"),
    sendMail        = require('./mail'),
    bodyParser      = require("body-parser")
    session         = require("express-session")
    cookieParser    = require("cookie-parser"),
    dotenv          = require("dotenv"),
    app             = express();

// load environment variables
dotenv.config();
 
// APP CONFIG
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser("secret123"));
app.use(session({
    secret: "secret123",
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// RESTFUL ROUTES
app.get("/", (req, res) =>{
    res.render("home");
});

app.post("/", (req, res) => {
    var fromEmail = req.body.fromEmail;
    var toEmail = req.body.toEmail;
    var subject = req.body.subject;
    var text = req.body.text;
    if((process.env.API_KEY && process.env.API_KEY.length > 0) && (process.env.DOMAIN && process.env.DOMAIN.length > 0)){
        sendMail(fromEmail, toEmail, subject, text, function(err, data){
            if (err) {
                console.log('ERROR: ', err);
                req.flash("error", "Internal Error");
                res.redirect("/");
            }
            console.log('Email sent!!!');
            req.flash("success", "Email was sent!");
            res.redirect("/"); 
        });
    } else {
        req.flash("error", "Error Missing Domain or API Key, to send emails must populate env variables");
        res.redirect("/");
    }
});

if(process.env.PORT && process.env.PORT > 0){

    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Server has Started on port " + process.env.PORT + " and IP " + process.env.IP);
    });

} else {

    var processEnvPORT = 3000;
    var processEnvIP = '0.0.0.0';
    app.listen(processEnvPORT, processEnvIP, function(){
        console.log("Server has Started on port " + processEnvPORT + " and IP " + processEnvIP);
    });
}