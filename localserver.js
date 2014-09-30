var express = require('express')
  , hash = require('./scripts/pass').hash;
var bodyParser = require('body-parser');  
var session = require('express-session');
var cookieParser = require('cookie-parser');  
// var swig = require('swig');
var app = express();             

var fs = require('fs'); 
eval(fs.readFileSync('./scripts/search.js')+'');

// config                         
            
// app.engine('.html',require('swig').renderFile);                      
// app.set('view engine', 'html');    
// app.set('views', __dirname + '/views');


// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '/views'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
// app.engine('html', require('ejs').renderFile);
                                  
// middleware                     
                                  
app.use(bodyParser());    
app.use(cookieParser('shhhh, very secret'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
app.use(session());                              
app.use(express.static(__dirname + '/'))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                  
// Session-persisted message middleware                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                  
app.use(function(req, res, next){ 
  var err = req.session.error     
    , msg = req.session.success;  
  delete req.session.error;       
  delete req.session.success;     
  res.locals.message = '';        
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  next();                         
});                               
                                  
// dummy database                 
                                  
var users = {                     
  jaydatt: { name: 'jaydatt' }              
};                                
                                  
// when you create a user, generate a salt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
// and hash the password ('jaydatt' is the pass here)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
                                  
hash('jaydatt', function(err, salt, hash){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  if (err) throw err;             
  // store the salt & hash in the "db"
  users.jaydatt.salt = salt;           
  users.jaydatt.hash = hash.toString();
});                               
                                  
                                  
// Authenticate using our plain-object database of doom!                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                  
function authenticate(name, pass, fn) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  if (!module.parent) console.log('authenticating %s:%s', name, pass);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  var user = users[name];         
  // query the db for the given username                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  if (!user) return fn(new Error('cannot find user'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  // apply the same algorithm to the POSTed password, applying                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  // the hash against the pass / salt, if there is a match we                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  // found the user               
  hash(pass, user.salt, function(err, hash){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    if (err) return fn(err);      
    if (hash.toString() == user.hash) return fn(null, user);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    fn(new Error('invalid password'));
  })                              
}                                 
                                  
function restrict(req, res, next) {   
  if (req.session.user) {         
    next();                       
  } else {                        
    req.session.error = 'Access denied!';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    res.redirect('/login');       
  }                               
}                                 
                                  
app.get('/', function(req, res){ 
	if(restrict){
		res.redirect('restricted');          
	} else {  
	  res.redirect('login');          
	}
});                               
                                  
app.get('/restricted', restrict, function(req, res){   
  // res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  // res.render('sntiles');
  res.sendfile(__dirname + '/views/index.html')
});                               
                                  
app.get('/logout', function(req, res){
  // destroy the user's session to log them out                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  // will be re-created next request  
  req.session.destroy(function(){ 
    res.redirect('/');            
  });                             
});                               
                                  
app.get('/login', function(req, res){ 	
  req.session.error = 'Please Enter username and password';
  // res.render('login');  
  res.sendfile(__dirname + '/views/login.html')          
});                               
                                  
app.post('/login', function(req, res){     	
  authenticate(req.body.username, req.body.password, function(err, user){                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    if (user) {                   
      // Regenerate session when signing in                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
      // to prevent fixation      
      req.session.regenerate(function(){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        // Store the user's primary key                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        // in the session store to be retrieved,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        // or in this case the entire user object                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        req.session.user = user;  
        req.session.success = 'Authenticated as ' + user.name                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          + ' click to <a href="/logout">logout</a>. '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
          + ' You may now access <a href="/restricted">/restricted</a>.';                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        res.redirect('restricted');     
      });                         
    } else {                      
      req.session.error = 'Authentication failed, please check your '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        + ' username and password.'   
        + ' (use "jaydatt" and "jaydatt")'; 
      res.redirect('login');      
    }                             
  });                             
});                               
                                  
                                  
app.listen(8000);                   
console.log('Express started on port ' + 8000); 