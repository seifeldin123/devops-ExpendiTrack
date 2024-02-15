jest.mock('axios');
import axios from 'axios';
import {createUser, findUser} from '../userService'; // Adjust the path as needed

describe('UserService Tests', () => {
    // TC_UI_001: Verify Successful User Creation
    it('TC_UI_001: should create a user successfully', async () => {
        const userData = {name: 'JohnDoe', email: 'john@example.com'};
        const mockResponse = {id: 1, name: 'JohnDoe', email: 'john@example.com'};

        axios.post.mockResolvedValue({response: {status: 201, mockResponse}});

        await expect(createUser(userData)).resolves.toEqual(mockResponse.data);
    });

    // TC_UI_002: Verify User Creation Failure due to Duplicate Accounts
    it('TC_UI_002: should handle duplicate user error', async () => {
        const userData = {name: 'JaneDoe', email: 'jane@example.com'};

        axios.post.mockRejectedValue({
            response: {
                status: 400, // Including the status to reflect a bad request
                data: 'An account with these credentials already exist' // Ensuring the message matches exactly
            }
        });

        // Adjusting the expected error message to match the one provided in the Postman response
        await expect(createUser(userData)).rejects.toThrow('An account with these credentials already exists.');
    });

    // TC_UI_003: Verify User Creation Failure due to Server Error
    it('TC_UI_003: should handle server error on user creation', async () => {
        const userData = {name: 'NewUser', email: 'newuser@example.com'};

        axios.post.mockRejectedValue({
            response: {
                status: 400,
                data: 'An error occurred during the signup process. Please try again later.'
            }
        });

        await expect(createUser(userData)).rejects.toThrow('An error occurred during the signup process. Please try again later.');
    });

    // TC_UI_004: Verify Successful User Search by Name and Email
    it('TC_UI_004: should find a user by name and email successfully', async () => {
        const userData = {name: 'JohnDoe', email: 'john@example.com'};

        const mockResponse = {id: 1, name: userData.name, email: userData.email};
        axios.get.mockResolvedValue({response: {status: 201, mockResponse}});

        await expect(findUser(userData.name, userData.email)).resolves.toEqual(mockResponse.data);
    });

    // TC_UI_005: Verify User Search Failure due to Nonexistent User
    it('TC_UI_005: should handle user search for a nonexistent user', async () => {

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

    // TC_UI_006: Verify User Search Failure due to Server Error
    it('TC_UI_006: should handle server error during user search', async () => {
        axios.get.mockRejectedValue({
            response: {
                status: 400,
                data: 'Server error occurred. Please try again later.'
            }
        });

        await expect(findUser('ExistingUser', 'existing@example.com')).rejects.toThrow('Server error occurred. Please try again later.');
    });


    // TC_UI_007: Verify User Creation Failure due to Invalid Name Format
    it('TC_UI_007: should reject user creation due to invalid name format', async () => {
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


    // TC_UI_008: Verify User Creation Failure due to Invalid Email Format
    it('TC_UI_008: should reject user creation due to invalid email format', async () => {
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
