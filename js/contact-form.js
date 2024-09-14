document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true; // Disable the submit button to prevent multiple submissions

    // Collect form data
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        // Send data to AWS API
        const awsResponse = await fetch('https://o1eurkyz65.execute-api.ap-south-1.amazonaws.com/prod/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                mobile: mobile,
                email: email,
                reason: message
            })
        });

        if (awsResponse.ok) {
            console.log('Data sent to AWS API successfully.');

            // Send data to Google Sheets
            await sendToGoogleSheets(name, mobile, email, message);

            // Show success message
            alert('Thank you! Your message has been sent.');

        } else {
            console.error('Failed to send data to AWS API.');
            alert('There was a problem submitting the form. Please try again.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form. Please try again.');
    } finally {
        // Re-enable the submit button after completion or error
        submitButton.disabled = false;
    }
});

// Function to send data to Google Sheets
async function sendToGoogleSheets(name, mobile, email, message) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby2ZmruZbjARsKJcXcHfG6RC-rbppCgZUAFoH4gXuu9ph0dP1frNEvA3ZDlKx6WMxilaQ/exec'; // Add your Google Script URL here

    const formData = new FormData();
    formData.append('name', name);
    formData.append('mobile', mobile);
    formData.append('email', email);
    formData.append('message', message);

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Data saved to Google Sheets successfully.');
        } else {
            console.error('Failed to save data to Google Sheets.');
            alert('There was a problem saving your data. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving data to Google Sheets.');
    }
}
