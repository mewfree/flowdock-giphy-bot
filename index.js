var conf = require('./conf.json');
var request = require('request');
var emoji = require('emoji-random');
var Session = require('flowdock').Session;
var session = new Session(conf.fdkey);

var CODE = '!gifbot';

session.flows(function(err, flows) {
  var anotherStream, flowIds;
  flowIds = flows.map(function(f) {
    return f.id;
  });
  anotherStream = session.stream(flowIds);
  return anotherStream.on('message', function(message) {
    if (message.event == 'message') {
      var query = message.content;
      query = query.split(' ');
      if (query[0] == CODE) {
        query.shift();
        query = query.toString().replace(/,/g, '+');
        request('http://api.giphy.com/v1/gifs/random?api_key='+conf.giphykey+'&tag='+query, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var gif = JSON.parse(body).data.image_original_url;
            if (!gif) {
              session.comment(message.flow, message.id, 'Sorry, no GIF has been found. Here is a random emoji to make you feel better: '+emoji.random());
            }
            else {
              session.comment(message.flow, message.id, gif);
            }
          }
        });
      }
    }
  });
});
