import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

// Function to create a user by sending a POST request
export const createUser = (userData) => axios.post(API_URL, userData);

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
