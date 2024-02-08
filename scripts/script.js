//[STEP 1]: Create our submit form listener
document.getElementById("contact-submit").addEventListener("click", function (e) {
    // Prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: Let's retrieve form data
    // For now, we assume all information is valid
    // You are to do your own data validation
    //****** CAPTURE THE DATA FORM THE FORM AND STORE INTO VARIABLE TOTAL 6 VARIABLES
    let playerName = document.getElementById("player-name").value;
    let playerPassword = document.getElementById("player-password").value;
    let playerPoints = document.getElementById("player-points").value;
    let playerDayStreak = document.getElementById("player-daystreak").value;
    let playerProfilePic = document.getElementById("player-profilepic").value;

    //[STEP 3]: Get form values when the user clicks on send
    // Adapted from restdb API
    //****** CHANGE THE JSONDATA TO INCLUDE THE STUDENT VARIABLE TOTAL 6 VARIABLES
    let jsondata = {
        "name": playerName,
        "password": playerPassword,
        "points": playerPoints,
        "daystreak": playerDayStreak,
        "profilepic": playerProfilePic
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
        method: "POST", //[cher] we will use post to send info
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata),
        beforeSend: function () {
            //@TODO use loading bar instead
            // Disable our button or show loading bar
            document.getElementById("contact-submit").disabled = true;

        }
    }

    //[STEP 5]: Send our AJAX request over to the DB and print response of the RESTDB storage to console.
    //***** CHANGED TO YOUR RESTDB STUDENT DATABASE SCHEMA URL
    fetch("https://tunify-4f5a.restdb.io/rest/player", settings)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById("contact-submit").disabled = false;
            //@TODO update frontend UI 
            document.getElementById("add-update-msg").style.display = "block";
            setTimeout(function () {
                document.getElementById("add-update-msg").style.display = "none";
            }, 3000);
            // Update our table 
            getContacts();
            // Clear our form using the form ID and triggering its reset feature
            document.getElementById("add-contact-form").reset();
        });
});//end click 

//[STEP 6]: Let's create a function to allow you to retrieve all the information in your contacts
function getContacts(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
        method: "GET", //[cher] we will use GET to retrieve info
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
    }

    //[STEP 8]: Make our AJAX calls
    // Once we get the response, we modify our table content by creating the content internally. We run a loop to continuously add on data
    // RESTDb/NoSql always adds in a unique id for each data; we tap on it to have our data and place it into our links 
    //***** CHANGED TO YOUR RESTDB STUDENT DATABASE SCHEMA URL
    fetch("https://tunify-4f5a.restdb.io/rest/player", settings)
        .then(response => response.json())
        .then(response => {
            let content = "";

            for (var i = 0; i < response.length && i < limit; i++) {
                //console.log(response[i]);
                //[METHOD 1]
                // Let's run our loop and slowly append content
                // We can use the normal string append += method
                /*
                content += "<tr><td>" + response[i].name + "</td>" +
                    "<td>" + response[i].email + "</td>" +
                    "<td>" + response[i].message + "</td>
                    "<td>Dreel</td><td>Update</td</tr>";
                */

                //[METHOD 2]
                // Using our template literal method using backticks
                // Take note that we can't use += for template literal strings
                // We use ${content} because -> content += content 
                // We want to add on previous content at the same time
                content = `${content}<tr id='${response[i]._id}'>
                <td>${response[i].name}</td>
                <td>${response[i].password}</td>
                <td>${response[i].points}</td>
                <td>${response[i].daystreak}</td>
                <td>${response[i].profilepic}</td>
                <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td>
                <td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-name='${response[i].name}' data-password='${response[i].password}' data-points='${response[i].points}' data-daystreak='${response[i].daystreak}' data-profilepic='${response[i].profilepic}'>Update</a></td></tr>`;

            }

            //[STEP 9]: Update our HTML content
            // Let's dump the content into our table body
            document.getElementById("contact-list").getElementsByTagName("tbody")[0].innerHTML = content;

            document.getElementById("total-contacts").innerHTML = response.length;
        });
}
