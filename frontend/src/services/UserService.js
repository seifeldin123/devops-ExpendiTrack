import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

// Function to create a user by sending a POST request
export const createUser = (userData) => axios.post(API_URL, userData)
    .then(response => response.data)
    .catch((error) => {
        // Assuming the error message is directly in error.response.data
        throw new Error(error.response.data || 'An error occurred during the signup process. Please try again later.');
    });


// Function to find a user by name and email using a GET request
export const findUser = async (name, email) => {
    try {
        const response = await axios.get(`${API_URL}/find`, { params: { name, email } });
        return response.data;
    } catch (error) {
        // Adjusted to throw an error for consistency with createUser
        throw new Error(error.response?.data || 'Server error occurred. Please try again later.');
    }
};
