var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
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
  }
}

function spotifySong () {
  spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    // console.log('The access token expires in ' + data.body['expires_in']);
    // console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    // if not option passed then make ace of base default
    option = option || 'track:the sign artist:ace of base';
    // search song
    spotifyApi.searchTracks(option)
    .then(function (trackData) {
      var track = trackData.body.tracks.items[0];
      // console.log('track: ', track);
      console.log('Track artist: ', track.artists[0].name);
      console.log('Track name: ', track.name);
      console.log('Track preview url: ', track.preview_url);
      console.log('Track album: ', track.album.name);
    }, function (err) {
      console.error(err);
      // console.error('ace of base');
    });
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });
}

function randomText () {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) return console.log("Can't read file");

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
      console.log(movieInfo);
      console.log('Movie title: ' + movieInfo.Title);
      console.log('Year movie came out: ' + movieInfo.Year);
      console.log('IMDB Rating: ' + movieInfo.imdbRating);
      console.log('Country where movie produced: ' + movieInfo.Country);
      console.log('Language movie: ' + movieInfo.Language);
      console.log('Plot of the movie: ' + movieInfo.Plot);
      console.log('Actors in the movie: ' + movieInfo.Actors);
      console.log('Rotten tomatoes URL: ' + movieInfo.imdbRating);
    }
  });
}
