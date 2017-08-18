var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: '3d574b4fab3846648fb12ace23ab7e1e',
  clientSecret: 'eb0230a98bc94f8b89cd1d228356e29c',
  redirectUri: 'http://www.example.com/callback'
});

var command = process.argv[2];
var option = process.argv[3];

switch (command) {
  case 'spotify-this-song':
    spotifySong();
    break;
}

function spotifySong () {
  spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    // console.log('The access token expires in ' + data.body['expires_in']);
    // console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    //if not option passed then make ace of base default
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

/*
function spotifySong () {
  if (option) {
    spotifyApi.clientCredentialsGrant()
      .then(function(data) {
        // console.log('The access token expires in ' + data.body['expires_in']);
        // console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.searchTracks(option)
        .then(function (trackData) {
          // console.log('Search by "Love"', data.body);
          var track = trackData.body.tracks.items[0];
          console.log('Track artist: ', track.artists[0].name);
          console.log('Track name: ', track.name);
          console.log('Track preview url: ', track.preview_url);
          console.log('Track preview url: ', track.preview_url);
        }, function (err) {
          console.error(err);
        });
      }, function(err) {
        console.log('Something went wrong when retrieving an access token', err.message);
      });
  } else {
    console.log('ace of base');
  }
}
*/
