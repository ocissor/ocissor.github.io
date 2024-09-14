document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Send data to AWS API
    try {
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

            // Now send the data to Google Sheets
            await sendToGoogleSheets(name, mobile, email, message);
        } else {
            console.error('Failed to send data to AWS API.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to send data to Google Sheets
async function sendToGoogleSheets(name, mobile, email, message) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby2ZmruZbjARsKJcXcHfG6RC-rbppCgZUAFoH4gXuu9ph0dP1frNEvA3ZDlKx6WMxilaQ/exec'; // Replace with your script URL

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
            alert('Thank you! Your message has been sent.');
        } else {
            console.error('Failed to save data to Google Sheets.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}