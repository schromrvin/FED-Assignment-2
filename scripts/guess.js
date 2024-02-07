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
      const trackSet = new Set(); // Create a set to store unique track names
      trackSet.add(correctTitle); // Add the correct title to the set

      while (incorrectTitles.length < 4) {
        const randomTrackIndex = Math.floor(Math.random() * tracks.length);
        const track = tracks[randomTrackIndex].track;
        if (!trackSet.has(track.name)) { // Check if the track name is not in the set
          incorrectTitles.push({
            title: track.name,
            artist: track.artists[0].name,
            coverImage: track.album.images[0].url
          });
          trackSet.add(track.name); // Add the track name to the set
        }
      }
      incorrectTitles.push({
        title: correctTitle,
        artist: correctArtist,
        coverImage: albumCoverUrl
      });
      incorrectTitles.sort(() => Math.random() - 0.5); // Shuffle the titles

      // Display album cover along with audio player
      $('#audioPlayerContainer').html(audioPlayer);
      $('#albumCover').attr('src', albumCoverUrl); // Set the album cover image source

      // Display track options
      playlist.empty();
      incorrectTitles.forEach(option => {
        const button = $('<button>').addClass('option-button').click(function() {
          $(this).addClass('clicked');
          $('.option-button').prop('disabled', true).addClass('disabled');
          if (option.title === correctTitle) { // Change this line
            $('#feedback').html('Correct! You guessed the right title: ' + correctTitle + ' by ' + correctArtist);
            correctGuesses++;
          } else {
            $('#feedback').html('Incorrect! The correct title is: ' + correctTitle + ' by ' + correctArtist);
          }
          $('#nextButton').show();
          $(this).off('click');
        });
      
        const coverImage = $('<div>').addClass('cover-image').html(`<img src="${option.coverImage}" alt="Cover Image">`);
        const title = $('<div>').addClass('track-title').text(option.title);
        const artist = $('<div>').addClass('track-artist').text(option.artist);
      
        button.append(coverImage, title, artist);
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
  // Enable all buttons
  $('.option-button').prop('disabled', false).removeClass('disabled');
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
