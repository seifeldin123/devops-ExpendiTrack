jest.mock('axios');
import axios from 'axios';
import {createUser, findUser} from '../UserService';

describe('UserService Tests', () => {
    // Verify Successful User Creation
    it('should create a user successfully', async () => {
        const userData = {name: 'JohnDoe', email: 'john@example.com'};
        const mockResponse = {id: 1, name: 'JohnDoe', email: 'john@example.com'};

        axios.post.mockResolvedValue({response: {status: 201, mockResponse}});

        await expect(createUser(userData)).resolves.toEqual(mockResponse.data);
    });

    // Verify User Creation Failure due to Duplicate Accounts
    it('should handle duplicate user error', async () => {
        const userData = {name: 'JaneDoe', email: 'jane@example.com'};

        axios.post.mockRejectedValue({
            response: {
                status: 400, // Including the status to reflect a bad request
                data: 'An account with these credentials already exists.' // Ensuring the message matches exactly
            }
        });

        // Adjusting the expected error message to match the one provided in the Postman response
        await expect(createUser(userData)).rejects.toThrow('An account with these credentials already exists.');
    });

    // Verify User Creation Failure due to Server Error
    it('should handle server error on user creation', async () => {
        const userData = {name: 'NewUser', email: 'newuser@example.com'};

        axios.post.mockRejectedValue({
            response: {
                status: 400,
                data: 'An error occurred during the signup process. Please try again later.'
            }
        });

        await expect(createUser(userData)).rejects.toThrow('An error occurred during the signup process. Please try again later.');
    });

    // Verify Successful User Search by Name and Email
    it('should find a user by name and email successfully', async () => {
        const userData = {name: 'JohnDoe', email: 'john@example.com'};

        const mockResponse = {id: 1, name: userData.name, email: userData.email};
        axios.get.mockResolvedValue({response: {status: 201, mockResponse}});

        await expect(findUser(userData.name, userData.email)).resolves.toEqual(mockResponse.data);
    });

    // Verify User Search Failure due to Nonexistent User
    it('should handle user search for a nonexistent user', async () => {

        const userData = {name: 'NotExist', email: 'notexist@example.com'};
        const mockResponse = "User not found. Proceed with creation.";

        axios.get.mockResolvedValue({
            response: {
                status: 200,
                mockResponse
            }
        });

        await expect(findUser(userData)).resolves.toEqual(mockResponse.data);
    });

    // Verify User Search Failure due to Server Error
    it('should handle server error during user search', async () => {
        axios.get.mockRejectedValue({
            response: {
                status: 400,
                data: 'Server error occurred. Please try again later.'
            }
        });

        await expect(findUser('ExistingUser', 'existing@example.com')).rejects.toThrow('Server error occurred. Please try again later.');
    });


    // Verify User Creation Failure due to Invalid Name Format
    it('should reject user creation due to invalid name format', async () => {
        const userData = {name: "123456", email: "user@example.com"};

        axios.post.mockRejectedValue({
            response: {
                status: 400,
                data: 'Invalid input: Name must be alphanumeric'
            }
        });

        // Expecting the createUser function to throw an error with the specific message
        await expect(createUser(userData)).rejects.toThrow('Invalid input: Name must be alphanumeric');
    });


    // Verify User Creation Failure due to Invalid Email Format
    it('should reject user creation due to invalid email format', async () => {
        const userData = {name: "ValidName", email: "invalidemail"};

        axios.post.mockRejectedValue({
            response: {
                status: 400,
                data: 'Invalid input: Invalid email format'
            }
        });

        // Expecting the createUser function to throw an error with the exact message
        await expect(createUser(userData)).rejects.toThrow('Invalid input: Invalid email format');
    });

});
