// Replace these values with your actual Spotify API credentials
const clientId = '4adfe3f7169a4ac0a892439ea002f811';
const clientSecret = '306c8c2bb0144ac28e1c2e1fa4b0d7f6';
const playlistId = '37i9dQZF1DWVlLVXKTOAYa';
const clientSecretBase64 = btoa(`${clientId}:${clientSecret}`);

let accessToken;
let currentTracks;
let roundsPlayed = 0;
let correctGuesses = 0;

// Authenticate with Spotify API
function authenticate() {
  return $.ajax({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    data: {
      'grant_type': 'client_credentials'
    }
  });
}

// Get playlist tracks
function getPlaylistTracks(accessToken) {
  return $.ajax({
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });
}

// Display playlist tracks with audio player and guessing game
// Display playlist tracks with audio player, album cover, and guessing game
function displayTracksWithGame(tracks) {
    currentTracks = tracks;
    const playlist = $('#options');
    const randomIndex = Math.floor(Math.random() * tracks.length); // Choose a random track
    const randomTrack = tracks[randomIndex].track;
  
    // Fetch additional details of the selected track including album details
    $.ajax({
      url: `https://api.spotify.com/v1/tracks/${randomTrack.id}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response) {
        const trackUrl = response.preview_url; // Use the preview URL for audio player
        const audioPlayer = $('<audio controls>').attr('src', trackUrl); // Create audio player with track preview URL
        const albumCoverUrl = response.album.images[0].url; // Get the URL of the first album cover
  
        // Randomly select correct and incorrect titles
        const correctTitle = randomTrack.name;
        const correctArtist = randomTrack.artists[0].name;
        const incorrectTitles = [];
        while (incorrectTitles.length < 2) {
          const randomTrackIndex = Math.floor(Math.random() * tracks.length);
          const track = tracks[randomTrackIndex].track;
          if (track.name !== correctTitle) {
            incorrectTitles.push(track.name);
          }
        }
        incorrectTitles.push(correctTitle);
        incorrectTitles.sort(() => Math.random() - 0.5); // Shuffle the titles
  
        // Display album cover along with audio player
        $('#audioPlayerContainer').html(audioPlayer);
        $('#albumCover').attr('src', albumCoverUrl); // Set the album cover image source
  
        // Display track options
        playlist.empty();
        incorrectTitles.forEach(title => {
          const button = $('<button>').text(title).click(function() {
            if ($(this).text() === correctTitle) {
              $('#feedback').html('Correct! You guessed the right title: ' + correctTitle + ' by ' + correctArtist);
              correctGuesses++;
            } else {
              $('#feedback').html('Incorrect! The correct title is: ' + correctTitle + ' by ' + correctArtist);
            }
            $('#nextButton').show();
            $(this).off('click');
          });
          playlist.append(button);
        });
      }
    });
  }
// Start a new game
function newGame() {
  roundsPlayed++;
  $('#feedback').empty();
  $('#nextButton').hide();
  if (roundsPlayed < 5) {
    displayTracksWithGame(currentTracks);
  } else {
    // Display total score
    $('#options').empty();
    $('#audioPlayerContainer').empty();
    $('#feedback').html('Game Over! Total Score: ' + correctGuesses + '/5');
  }
}

$(document).ready(function() {
  authenticate().then(response => {
    accessToken = response.access_token;
    getPlaylistTracks(accessToken).then(response => {
      displayTracksWithGame(response.items); // Display playlist tracks with guessing game
    });
  });

  $('#nextButton').on('click', function() {
    newGame();
  });
});
