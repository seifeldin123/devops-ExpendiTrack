import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

// Function to create a user by sending a POST request
export const createUser = (userData) => axios.post(API_URL, userData)
    .then(response => response.data)
    .catch((error) => {
        // Check for the specific status code and message
        if (error.response && error.response.status === 400 && error.response.data === 'An account with these credentials already exists.') {
            return Promise.reject('A user with these credentials already exists. Please login or use different credentials.');
        } else {
            // You can further refine this by checking for different error codes and messages
            return Promise.reject('An error occurred during the signup process. Please try again later.');
        }
    });

// Function to find a user by name and email using a GET request
export const findUser = async (name, email) => {
    try {
        // Send a GET request to find a user with provided name and email
        const response = await axios.get(`${API_URL}/find`, { params: { name, email } });
        return response.data; // Return the data if successful
    } catch (error) {
        return null; // Return null in case of an error
    }
};
