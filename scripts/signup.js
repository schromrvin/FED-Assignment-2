document.getElementById('btn-submit').addEventListener('click', function(event) {
    event.preventDefault();
  
    var points = 0;
    var daystreak = 1;
  
    var reader = new FileReader();
    reader.onloadend = function() {
        var base64data = reader.result;
        
        var data = {
            'name': $('#username').val(),
            'password': $('#password').val(),
            'points': points,
            'daystreak': daystreak,
            'profilepic': base64data
        };
      
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://tunify-4f5a.restdb.io/rest/player",
            "method": "POST",
            "headers": {
                "x-apikey": "65c0fe7573f36e9e5400b51a",
                "cache-control": "no-cache",
                "Content-Type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
      
        $.ajax(settings).done(function (response) {
            alert('Data successfully posted to the API');
            console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('Error: ' + textStatus + ', ' + errorThrown);
            console.error('Error: ' + textStatus + ', ' + errorThrown);
            console.error('Response: ' + jqXHR.responseText);
        });
    }
    reader.readAsDataURL($('#profile-pic')[0].files[0]);
});