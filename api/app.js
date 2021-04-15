var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors');
var app = express();
const multer = require('multer');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var fs = require('fs');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');

var indexRouter = require('../api/routes/index');
var usersRouter = require('../api/routes/users');
var boardRouter = require('../api/routes/board');

var Humans = require('./models/humans');
var Faces = require('./models/faces')




const { MongoClient } = require('mongodb'); // how we will conntect to MongoDB database, cluster, and close cluster
var mongoDB = 'mongodb+srv://chriszhu:Czhu6843@cluster0.bxozc.mongodb.net/human?retryWrites=true&w=majority'
mongoose.connect(mongoDB,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const client = new MongoClient(mongoDB);



var app = express();
app.use(bodyParser.json({limit: '16mb', extended: true}));     // Make sure you add these two lines
app.use(bodyParser.urlencoded({limit: '16mb', extended: true}))    //Make sure you add these two lines


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public'))); // allows us to serve static data from public folder

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);




app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);

app.post('/create', function(req, res) {
  console.log("does something")
  var imgstring = req.body.selectedFile;
  console.log("image string is ", imgstring);
  console.log("image string is " + imgstring);
  // var imagetoBuffer = Buffer.from(imgstring, "base64");
  // console.log("image Buffer is " + imagetoBuffer);
  
  //buffer stores raw data (raw memory)

  var image = Buffer.from(imgstring, "base64");
  var newimage = image.toString('base64');
  console.log("image is", image);
  console.log("new image is", newiamge);

  var doc = new Humans.HumanSchema({ img: image, imagestring: image.toString('base64')});
  const board = {
    img: image,
    imagestring: newimage
  };

  console.log("board is ", board);

  Humans.create(board);
  console.log("Humans is", Humans);

  doc.save();
  console.log("doc is " , doc);
  //console.log(imagetoBuffer.toString('base64'));
  // Humans.create(board)
  console.log("Humans is ", Humans);

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
