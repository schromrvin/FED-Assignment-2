let date = new Date();

window.onload = function() {
    // Parse the URL parameters to get the results
    const urlParams = new URLSearchParams(window.location.search);
    let results = urlParams.get('results');

    // Split the results into 5 sections
    let sections = [];
    for (let i = 0; i < results.length; i += 5) {
        sections.push(results.slice(i, i + 5));
    }

    // Decode the sections
    let decodedSections = sections.map(section => section.replace(/A/g, '🟩').replace(/B/g, '🟥'));

    // Join the decoded sections with '\n' and display them
    const resultsDiv = document.getElementById('results');
    resultsDiv.textContent = decodedSections.join('\n');

    // Calculate the score
    let score = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i] === 'A') {
            if (i < 5) {
                score += 100;
            } else if (i < 10) {
                score += 150;
            } else {
                score += 200;
            }
        }
    }

    // Display the score
    const scoreH3 = document.querySelector('#score h3');
    scoreH3.textContent = score;

    // Get the copy button
    const copyButton = document.querySelector('.copy');

    // Add an event listener to the copy button
    copyButton.addEventListener('click', function() {
        // Encode the results back to 'A' and 'B'
        let encodedResults = decodedResults.replace(/🟩/g, 'A').replace(/🟥/g, 'B');

        // Format the results according to the sample
        let formattedText = '🎵 Tunify! 🎵\n';
        formattedText += date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '\n';
        formattedText += encodedResults.slice(0, 5) + '\n';
        formattedText += encodedResults.slice(5, 10) + '\n';
        formattedText += encodedResults.slice(10, 15) + '\n';
        formattedText += 'Score: ' + score + '\n';
        formattedText += '\n';

        // Decode the formatted text
        formattedText = formattedText.replace(/A/g, '🟩').replace(/B/g, '🟥');

        formattedText += 'Play at https://s10260527.github.io/FED-Assignment-2/';

        // Create a new textarea element and set its value to the formatted text
        const textarea = document.createElement('textarea');
        textarea.value = formattedText;

        // Append the textarea to the body
        document.body.appendChild(textarea);

        // Select the textarea and copy it to the clipboard
        textarea.select();
        document.execCommand('copy');

        // Remove the textarea from the body
        document.body.removeChild(textarea);

        // Optionally, show a message to the user
        alert('Results copied to clipboard! 📋🎉');
    });

    let formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    const dateH3 = document.querySelector('#date h3');
    dateH3.textContent = formattedDate;
};