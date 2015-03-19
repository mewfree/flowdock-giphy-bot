var conf = require('./conf.json');
var request = require('request');
var Session = require('flowdock').Session;

var CODE = '!gifbot';
var s = new Session(conf.fdkey);
var flowid = conf.flowid;
var stream = s.stream(flowid);

stream.on('message', function(message) {
  if (message.event == 'message') {
    var query = message.content;
    query = query.split(' ');
    if (query[0] == CODE) {
      query.shift();
      query = query.toString().replace(/,/g, '+');
      request('http://api.giphy.com/v1/gifs/random?api_key='+conf.giphykey+'&tag='+query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var gif = JSON.parse(body).data.image_original_url;
          s.comment(flowid, message.id, gif);
        }
      });
    }
  }
});
