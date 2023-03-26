import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import md5 from 'md5'

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb+srv://ashu:ashu@cluster0.6u8vayi.mongodb.net/securityDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const User = new mongoose.model("User", userSchema);


app.get("/", async (req, res)=>{
    res.render("home");
});

app.get("/register", async(req, res)=>{
    res.render("register");
})

app.get("/login", async(req, res)=>{
    res.render("login");
})


app.post("/register", async(req, res)=>{

    const newUser = new User({
        email : req.body.username,
        password : md5(req.body.password)
    });
    try {
        await newUser.save();
        res.render("secrets");
    } catch (error) {
        console.log(error);
    }
})

app.post("/login" , async(req ,res)=>{
    
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({email: username});
        if(foundUser){
            if(foundUser.password === md5(password)){
                res.render("secrets");
            }
            else{
                res.send("Wrong password");
            }
        }
        else{
            res.send("User doesn't exist");
        }
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, function(req ,res){
    console.log("Server started at port 3000");
})