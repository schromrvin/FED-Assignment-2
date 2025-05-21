// Replace these values with your actual Spotify API credentials
const clientId = 'ea4a7daaacdb4b14a32ce2fbaad66797';
const clientSecret = '66442624a619498196bc24bc4766e264';
const playlistId = '2cXd7q4IGo837mNkNAamvf';
const clientSecretBase64 = btoa(`${clientId}:${clientSecret}`);

let accessToken;
let currentTracks;
let questionsPlayed = 0;
let levelsPlayed = 0;
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
function displayTracksWithGame(tracks) {
  currentTracks = tracks;
  const playlist = $('#options');
  let randomIndex;
  let randomTrack;

  // Select a random track based on the current level
  do {
    if (levelsPlayed == 0) { // Easy level
      randomIndex = Math.floor(Math.random() * 11); // 0 to 10
    } else if (levelsPlayed == 1) { // Medium level
      randomIndex = Math.floor(Math.random() * 31); // 0 to 30
    } else if (levelsPlayed == 2) { // Hard level
      randomIndex = Math.floor(Math.random() * 51); // 0 to 50
    }
  
    randomTrack = tracks[randomIndex]?.track;
  } while (!randomTrack);

  // Remove the selected track from the array
  tracks.splice(randomIndex, 1);

  // Also remove the selected track from the currentTracks array
  currentTracks = currentTracks.filter(track => track.track.id !== randomTrack.id);

  // Fetch additional details of the selected track including album details
  $.ajax({
    url: `https://api.spotify.com/v1/tracks/${randomTrack.id}`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response) {
      const trackUrl = response.preview_url; // Use the preview URL for audio player

      // If the track doesn't have a preview URL, select a different track
      if (!trackUrl) {
        displayTracksWithGame(tracks);
        return;
      }

      const audioPlayer = $('<audio controls>').attr('src', trackUrl); // Create audio player with track preview URL
      const albumCoverUrl = response.album.images[0].url; // Get the URL of the first album cover

      // Randomly select incorrect titles
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
            roundResults += 'A';
            $('#tune-' + questionsPlayed + ' img').attr('src', 'images/guess/right.png');
            $($('#tune-' + questionsPlayed).css('background-color', '#00D26A'));
          } else {
            $('#correctAnswer').css('display', 'block');
            $('#feedback').html('Incorrect!');
            $(this).css('outline', '4px solid #F8312F');
            $('#feedback').css('background-color', '#F8312F');
            roundResults += 'B';
            $('#tune-' + questionsPlayed + ' img').attr('src', 'images/guess/wrong.png');
            $($('#tune-' + questionsPlayed).css('background-color', '#F8312F'));
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
  displayTracksWithGame(currentTracks);
  // Enable all buttons
  $('.option-button').prop('disabled', false).removeClass('disabled');
 if (questionsPlayed == 5) {
    questionsPlayed = 0;
    levelsPlayed++;
    for (let i = 0; i < 5; i++) {
      $('#tune-' + i + ' img').attr('src', 'images/guess/music.png');
      $('#tune-' + i).css('background-color', 'rgb(165, 40, 225, 0.8)');
    }
  }
}

$(document).ready(function() {
  authenticate().then(response => {
    accessToken = response.access_token;
    getPlaylistTracks(accessToken).then(response => {
      $('.level h2').text('Level One: Easy');
      for (let i = 0; i < 5; i++) {
        $('#tune-' + i + ' img').attr('src', 'images/guess/music.png');
        $('#tune-' + i).css('background-color', 'rgb(165, 40, 225, 0.8)');
      }
      displayTracksWithGame(response.items); // Display playlist tracks with guessing game
    });
  });
  $('#nextButton').on('click', function() {
    questionsPlayed++;
    newGame();
    if (levelsPlayed == 0){
      $('.level h2').text('Level One: Easy');
      if (questionsPlayed == 4) {
        $('#nextButton').css('display', 'none');
        $('#nextButton').text('Go next level ☝️');
      }
      else {
        $('#nextButton').css('display', 'none');
        $('#nextButton').text('Next tune 🎵');
      }
    } else if (levelsPlayed == 1) {
      $('.level h2').text('Level Two: Medium');
      if (questionsPlayed == 4) {
        $('#nextButton').css('display', 'none');
        $('#nextButton').text('Go next level ☝️');
      }
      else {
        $('#nextButton').css('display', 'none');
        $('#nextButton').text('Next tune 🎵');
      }
    } else if (levelsPlayed == 2) {
      $('.level h2').text('Level Three: Hard');
      if (questionsPlayed == 4) {
        $('#nextButton').css('display', 'none');
        $('#nextButton').text('Go to results 📄');
      }
      else {
        $('#nextButton').css('display', 'none');
        $('#nextButton').text('Next tune 🎵');
      }
    }
    else if (levelsPlayed == 3) {
      window.location.href = "results.html?results=" + roundResults;
    }
  });
});
