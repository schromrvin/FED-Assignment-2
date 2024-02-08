document.getElementById('btn-submit').addEventListener('click', function(event) {
    event.preventDefault();
  
    var points = 0;
    var daystreak = 1;
    var base64data = null;
  
    var reader = new FileReader();
    reader.onloadend = function() {
        base64data = reader.result;
        submitForm();
    }

    var file = $('#profile-pic')[0].files[0];
    if (file) {
        reader.readAsDataURL(file);
    } else {
        submitForm();
    }

    function submitForm() {
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
            alert('Account has successfully created! You will now be redirected to the login page.');
            window.location.href = 'index.html';
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('An error occurred while creating your account. Please try again.');
            console.error('Error: ' + textStatus + ', ' + errorThrown);
            console.error('Response: ' + jqXHR.responseText);
        });
    }
});