const userName = document.getElementById("username");
const password = document.getElementById("password");


// Assuming this code is in a JavaScript file in your front end application

// Define the URL of your backend server where the Express app is running
const backendUrl = 'http://localhost:3000/';

// Function to perform the login request
async function loginUser(username, password) {
  try {
    // Make a POST request to the /login endpoint
    const response = await fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Send username and password in the request body
    });

    // Check if the response is successful
    if (response.ok) {
      // If successful, parse the response JSON
      const data = await response.json();
      console.log(data.message); // Message from the server
      // You can perform further actions after successful login here
    } else {
      // If not successful, parse the error response JSON
      const errorData = await response.json();
      console.error(errorData.error); // Error message from the server
      // You can handle the error appropriately here
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle any network errors or exceptions here
  }
}

// Example usage of the loginUser function
loginUser(userName.innerHTML, password.innerHTML);