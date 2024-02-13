import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createUser, findUser } from '../userService'; // Ensure this path matches your project structure

// Define the API base URL for easy reference
const API_URL = 'http://localhost:8080/users';

describe('UserService', () => {
    let mock;

    beforeEach(() => {
        // Create a new instance of axios-mock-adapter for each test
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        // Reset the mock adapter after each test
        mock.reset();
    });

    it('TC_UI_001: should create a user successfully', async () => {
        const userData = { name: 'JohnDoe', email: 'john@example.com' };
        const response = { message: "User created successfully" };

        // Mocking successful user creation
        mock.onPost(`${API_URL}`, userData).reply(200, response);

        await expect(createUser(userData)).resolves.toEqual(response);
    });

    it('TC_UI_002: should handle duplicate user error', async () => {
        const userData = { name: 'JaneDoe', email: 'jane@example.com' };
        const errorMessage = 'A user with these credentials already exists. Please login or use different credentials.';

        // Mocking duplicate user error
        mock.onPost(`${API_URL}`, userData).reply(400, errorMessage);

        await expect(createUser(userData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_003: should handle server error on user creation', async () => {
        const userData = { name: 'NewUser', email: 'newuser@example.com' };
        const errorMessage = 'An error occurred during the signup process. Please try again later.';

        // Mocking server error
        mock.onPost(`${API_URL}`, userData).reply(500, errorMessage);

        await expect(createUser(userData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_004: should find a user by name and email successfully', async () => {
        const userData = { name: 'JohnDoe', email: 'john@example.com' };
        const response = { ...userData, id: 1 };

        // Mocking successful user search
        mock.onGet(`${API_URL}/find`, { params: { name: 'JohnDoe', email: 'john@example.com' } }).reply(200, response);

        await expect(findUser('JohnDoe', 'john@example.com')).resolves.toEqual(response);
    });

    it('TC_UI_005: should handle user search for a nonexistent user', async () => {
        const errorMessage = "User not found. Proceed with creation.";

        // Mocking search for a nonexistent user
        mock.onGet(`${API_URL}/find`, { params: { name: 'NotExist', email: 'notexist@example.com' } }).reply(200, errorMessage);

        await expect(findUser('NotExist', 'notexist@example.com')).resolves.toMatch(errorMessage);
    });

    it('TC_UI_006: should handle server error during user search', async () => {
        const errorMessage = "Server error occurred. Please try again later.";

        // Mocking server error during user search
        mock.onGet(`${API_URL}/find`, { params: { name: 'ExistingUser', email: 'existing@example.com' } }).reply(500, errorMessage);

        await expect(findUser('ExistingUser', 'existing@example.com')).rejects.toEqual(null);
    });

    it('TC_UI_007: should reject user creation due to invalid name format', async () => {
        const userData = { name: "123456", email: "user@example.com" };
        const errorMessage = "Invalid name format";

        // Mocking invalid name format error
        mock.onPost(`${API_URL}`, userData).reply(400, errorMessage);

        await expect(createUser(userData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_008: should reject user creation due to invalid email format', async () => {
        const userData = { name: "ValidName", email: "invalidemail" };
        const errorMessage = "Invalid email format";

        // Mocking invalid email format error
        mock.onPost(`${API_URL}`, userData).reply(400, errorMessage);

        await expect(createUser(userData)).rejects.toMatch(errorMessage);
    });
});
