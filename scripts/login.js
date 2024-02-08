document.getElementById('btn-submit').addEventListener('click', function(event) {
    event.preventDefault();

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://tunify-4f5a.restdb.io/rest/player",
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": "65c0fe7573f36e9e5400b51a",
          "cache-control": "no-cache"
        }
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });
});