var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var keys = require('./keys');
var SpotifyWebApi = require('spotify-web-api-node');
var fs = require('fs');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '3d574b4fab3846648fb12ace23ab7e1e',
  clientSecret: 'eb0230a98bc94f8b89cd1d228356e29c',
  redirectUri: 'http://www.example.com/callback'
});

var command = process.argv[2];
var option = process.argv[3];

checkCommand();

function checkCommand () {
  switch (command) {
    case 'spotify-this-song':
      spotifySong();
      break;
    case 'do-what-it-says':
      randomText();
      break;
    case 'movie-this':
      movie();
      break;
    case 'my-tweets':
      tweets();
      break;
  }
}

function spotifySong () {
  spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    // if not option passed then make ace of base default
    option = option || 'track:the sign artist:ace of base';
    // search song
    spotifyApi.searchTracks(option)
    .then(function (trackData) {
      var track = trackData.body.tracks.items[0];
      // logOutput('track: ', track);
      logOutput('Track artist: ', track.artists[0].name);
      logOutput('Track name: ', track.name);
      logOutput('Track preview url: ', track.preview_url);
      logOutput('Track album: ', track.album.name);
    }, function (err) {
      console.error(err);
      // console.error('ace of base');
    });
  }, function (err) {
    logOutput('Something went wrong when retrieving an access token', err.message);
  });
}

function randomText () {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) return logOutput("Can't read file");

    [command, option] = data.split(',');
    checkCommand();
  });
}

function movie () {
  var API_KEY = '40e9cece';
  request('http://www.omdbapi.com/?t=' + option + '&y=&plot=short&apikey=' + API_KEY, function (error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      // set data
      var movieInfo = JSON.parse(body);

      /*
      * Title of the movie.
      * Year the movie came out.
      * IMDB Rating of the movie.
      * Country where the movie was produced.
      * Language of the movie.
      * Plot of the movie.
      * Actors in the movie.
      * Rotten Tomatoes URL.
      */
      logOutput('Movie title: ' + movieInfo.Title);
      logOutput('Year movie came out: ' + movieInfo.Year);
      logOutput('IMDB Rating: ' + movieInfo.imdbRating);
      logOutput('Country where movie produced: ' + movieInfo.Country);
      logOutput('Language movie: ' + movieInfo.Language);
      logOutput('Plot of the movie: ' + movieInfo.Plot);
      logOutput('Actors in the movie: ' + movieInfo.Actors);
      logOutput('Rotten tomatoes URL: ' + movieInfo.imdbRating);
    }
  });
}

function tweets () {
  var client = new Twitter(keys.twitterKeys);
  var params = {screen_name: 'nodejs'};
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < 20; i++) {
        logOutput(tweets[i].text + ' - ' + tweets[i].created_at);
      }
    }
  });
}

function logOutput (s) {
  console.log(s);
  var date = new Date();
  s = '\n[' + date + ']\nInput: ' + command + ' ' + option + '\nOutput: ' + s;
  fs.appendFile('log.txt', '\n' + s, function (err) {
    if (err) throw err;
  });
}
