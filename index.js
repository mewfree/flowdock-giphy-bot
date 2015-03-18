var conf = require('./conf.json');

var code = '!gifbot';
var request = require('request');

var Session = require('flowdock').Session;
var s = new Session(conf.fdkey);

var flowid = conf.flowid;
var stream = s.stream(flowid);
stream.on('message', function(message) {
  //if (message.event == 'message' && message.thread.title == message.content) {
  if (message.event == 'message') {
  var query = message.content;
  query = query.split(' ');

    if (query[0] == code) {
      query.shift();
      query = query.toString().replace(/,/g, '+');
      request('http://api.giphy.com/v1/gifs/search?q='+query+'&api_key='+conf.giphykey+'&limit=1', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var d = JSON.parse(body);
          var gif = d.data[0].images.original.url;
          s.comment(flowid, message.id, gif);
        }
      });
    }
  }
  //return stream.end();
});
