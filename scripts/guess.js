// Replace these values with your actual Spotify API credentials
const clientId = '4adfe3f7169a4ac0a892439ea002f811';
const clientSecret = '306c8c2bb0144ac28e1c2e1fa4b0d7f6';
const playlistId = '3dbBF7CHMUwehGOwtdr2UY';
const clientSecretBase64 = btoa(`${clientId}:${clientSecret}`);

let accessToken;
let currentTracks;
let questionsPlayed = 0;
let levelsPlayed = 0;
let correctGuesses = 0;
let roundResults = '';

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
  let randomIndex;

  // Select a random track based on the current level
  if (levelsPlayed == 0) { // Easy level
    randomIndex = Math.floor(Math.random() * 11);
  } else if (levelsPlayed == 1) { // Medium level
    randomIndex = Math.floor(Math.random() * 15) + 11;
  } else if (levelsPlayed == 2) { // Hard level
    randomIndex = Math.floor(Math.random() * 25) + 26;
  }

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
      $('.next-round').css('display', 'none');
      $('#feedback').css('display', 'none');
      $('#correctAnswer').css('display', 'none');
      // Display track options
      playlist.empty();
      incorrectTitles.forEach(option => {
        const button = $('<button>').addClass('option-button').click(function() {
          $(this).addClass('clicked');
          $('.option-button').prop('disabled', true).addClass('disabled');
          $('#feedback').css('display', 'block');
          $('.next-round').css('display', 'block');
          if (option.title === correctTitle) { // Change this line
            $('#feedback').html('Correct!');
            $(this).css('outline', '4px solid #00D26A');
            $('#feedback').css('background-color', '#00D26A');
            roundResults += '🟩';
            correctGuesses++;
          } else {
            $('#correctAnswer').css('display', 'block');
            $('#feedback').html('Incorrect!');
            $(this).css('outline', '4px solid #F8312F');
            $('#feedback').css('background-color', '#F8312F');
            roundResults += '🟥';
            $('.option-button').each(function() {
              if ($(this).find('.track-title').text() === correctTitle) {
                $(this).addClass('clicked');
                $(this).css('outline', '4px solid #00D26A');
              }
            });
            $('#correctTitle').html(correctTitle);
            $('#correctArtist').html('By ' + correctArtist);
          }
          $('html, body').animate({
            scrollTop: $('#feedback').offset().top
          }, 1000);
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
  questionsPlayed++;
  // Enable all buttons
  $('.option-button').prop('disabled', false).removeClass('disabled');
  if (questionsPlayed < 5) {
    if (levelsPlayed == 0){
      $('.level h2').text('Level One: Easy');
    } else if (levelsPlayed == 1) {
      $('.level h2').text('Level Two: Medium');
    } else if (levelsPlayed == 2) {
      $('.level h2').text('Level Three: Hard');
    }
    displayTracksWithGame(currentTracks);
  } else {
    roundResults += '\n';
    questionsPlayed = 0;
    levelsPlayed++;
  }
  if (levelsPlayed == 3) {
    window.location.href = 'home.html';
  }
}

$(document).ready(function() {
  authenticate().then(response => {
    accessToken = response.access_token;
    getPlaylistTracks(accessToken).then(response => {
      $('.level h2').text('Level One: Easy');
      displayTracksWithGame(response.items); // Display playlist tracks with guessing game
    });
  });

  $('#nextButton').on('click', function() {
    newGame();
  });
});
