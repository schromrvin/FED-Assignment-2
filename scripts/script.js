const APIKEY = "65c0fe7573f36e9e5400b51a";

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Retrieve username and password from the form
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Make a GET request to retrieve data from the database based on the entered username
    fetch(`https://tunify-4f5a.restdb.io/rest/player?q={"username":"${username}"}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        }
    })
    .then(response => response.json())
    .then(data => {
        // Check if the username exists in the database
        if (data.length > 0) {
            // Username exists, check if the entered password matches
            if (data[0].password === password) {
                // Password matches, login successful
                console.log("Login successful!");
                // Optionally, you can redirect the user to another page
                // For example:
                window.location.href = "dashboard.html"; // Redirect to the dashboard page
            } else {
                // Password doesn't match, show error message
                console.log("Incorrect password!");
                // Optionally, you can display an error message to the user
                // For example:
                document.getElementById("login-error").innerText = "Incorrect password!";
            }
        } else {
            // Username doesn't exist, show error message
            console.log("Username not found!");
            // Optionally, you can display an error message to the user
            // For example:
            document.getElementById("login-error").innerText = "Username not found!";
        }
    })
    .catch(error => {
        // Handle any errors
        console.error("Error:", error);
    });
});
