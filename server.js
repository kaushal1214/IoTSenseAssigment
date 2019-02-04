const express = require('express'),
      path    = require('path')
      http    = require('http'),
      morgan  = require('morgan'),
      bodyParser = require('body-parser');

//To set the page routes of Server
const router = require('./router/routes');

const app = express();

//Setting up the middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Point static path to dist
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//HTTP request Logger for app
app.use(morgan('dev'));

//To set our router in place
app.use('/',router);

//To handle HTTP 404 requests. Redirects to the homepage
app.use('*',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'../src/index.html'));
})

//Default PORT=3300
const PORT = process.env.PORT || '3300';

//SET few parameters
app.set('port', PORT);
app.set('views', __dirname+'/views');

const server = http.createServer(app);

server.listen(PORT,()=>{
  console.log(`IoT server up and running at ${PORT}`);
});
