var express  = require('express')
  , path     = require('path')
  , stylus   = require('stylus')
  , routes   = require('./backend/routes')
  , tasks    = require('./backend/routes/tasks')
  , opts     = require('./backend/routes/options');

var app = express();
  
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.configure(function() {
  // all environments
  app.set('port', process.env.PORT || 8080);

  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: "secret key"}));

  app.use(stylus.middleware({ 
      src : path.join(__dirname, '/frontend/stylesheets'),
      dest: path.join(__dirname, '/public/compiled')
    }
  ));

  app.use(app.router);
  app.use(express.static(__dirname + '/public/' ));
  app.use('/', express.static(__dirname + '/frontend/' ));
});


app.use(tasks);
app.use(opts);

var i = 0;
var timer;

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  function never_call () {
    io.emit('chat message', 'at ' + i);
    i++;
  }
  timer = setInterval(never_call,1000);
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
//app.listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
