// SONG AUDIO
let audioFiles = [
    "tunes/test1.mp3",
    "tunes/test2.mp3",
    "tunes/test3.mp3",
    "tunes/test4.mp3",
    "tunes/test5.mp3"
  ];
  
  // Get all the audio elements
  let audioLst = document.querySelectorAll(".options audio");
  
  // Loop through each audio element
  for (let i = 0; i < audioLst.length; i++) {
    // Get the current audio element
    let audio = audioLst[i];
  
    // Assign the src attribute from your array
    audio.src = audioFiles[i];
  }

// Get all the buttons and audio elements
let buttons = document.querySelectorAll(".options button");
let audios = document.querySelectorAll(".options audio");

// Variable to keep track of the currently playing audio
let currentAudio = null;

// Loop through each button and audio element
for (let i = 0; i < buttons.length; i++) {
  // Get the current button and audio element
  let button = buttons[i];
  let audio = audios[i];

  // Add a click event listener to the button
  button.addEventListener("click", function () {
    // If another audio is playing, pause it and change its button's icon
    if (currentAudio && currentAudio != audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.parentElement.firstChild.src = "images/guess/play.png";
      currentAudio.parentElement.classList.remove("playing");
    }

    // If the clicked audio is not playing, play it and change the icon
    if (audio.paused) {
      audio.play();
      button.firstChild.src = "images/guess/stop.png";
      button.classList.add("playing");
      currentAudio = audio;  // Update the currently playing audio
    }
    // Otherwise, pause it and change the icon back
    else {
      audio.pause();
      button.firstChild.src = "images/guess/play.png";
      button.classList.remove("playing");
      currentAudio = null;  // No audio is currently playing
    }
  });

  // Add an ended event listener to the audio element
  audio.addEventListener("ended", function () {
    // Reset the audio and change the icon back
    audio.currentTime = 0;
    button.firstChild.src = "images/guess/play.png";
    button.classList.remove("playing");
    currentAudio = null;  // No audio is currently playing
  });
}

// SONG COVER
let imgFiles = [
    "images/guess/test.png",
    "images/guess/test.png",
    "images/guess/test.png",
    "images/guess/test.png",
    "images/guess/test.png"
  ];
  
  let imgLst = document.querySelectorAll(".answer img");
  
  for (let i = 0; i < imgLst.length; i++) {
    let img = imgLst[i];
  
    img.src = imgFiles[i];
  }

// SONG TITLE
let songTitles = [
    "Unified Love",
    "Unified Love",
    "Unified Love",
    "Unified Love",
    "Unified Love"
  ];
  
  let titleLst = document.querySelectorAll(".answer h3");
  
  for (let i = 0; i < titleLst.length; i++) {
    let title = titleLst[i];
  
    title.textContent = songTitles[i];
  }

  // SONG ARTIST
  let songArtists = [
    "Lucas Toh",
    "Lucas Toh",
    "Lucas Toh",
    "Lucas Toh",
    "Lucas Toh"
  ];
  
  let artistLst = document.querySelectorAll(".answer h5");
  
  for (let i = 0; i < artistLst.length; i++) {
    let artist = artistLst[i];
  
    artist.textContent = songArtists[i];
  }

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.answer button');

    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            buttons.forEach(function(btn) {
                if (btn !== button && btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    btn.querySelector('.overlay').classList.remove('selected');
                }
            });

            var overlay = this.querySelector('.overlay');
            this.classList.toggle('selected');
            overlay.classList.toggle('selected');
        });
    });
});
