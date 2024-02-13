import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createUser, findUser } from '../UserService'; // Adjust the import path as necessary

describe('UserService Integration Tests', () => {
    let mock = new MockAdapter(axios);
    const API_URL = 'http://localhost:8080/users';

    beforeEach(() => {
        mock.reset(); // Reset the mock adapter before each test
    });

    it('TC_I_001: creates a user successfully', async () => {
        const userData = { name: 'JohnDoe', email: 'john@example.com' };
        mock.onPost(`${API_URL}`, userData).reply(200, userData);

        await expect(createUser(userData)).resolves.toEqual(userData);
    });

    it('TC_I_002: handles duplicate user creation attempt with a custom error message', async () => {
        const duplicateUserData = { name: 'JaneDoe', email: 'jane@example.com' };
        mock.onPost(`${API_URL}`, duplicateUserData).reply(400, 'An account with these credentials already exists.');

        await expect(createUser(duplicateUserData)).rejects.toEqual('A user with these credentials already exists. Please login or use different credentials.');
    });

    it('TC_I_003: handles server error during user creation', async () => {
        const userData = { name: 'NewUser', email: 'newuser@example.com' };
        mock.onPost(`${API_URL}`, userData).reply(500);

        await expect(createUser(userData)).rejects.toEqual('An error occurred during the signup process. Please try again later.');
    });

    it('TC_I_004: finds a user successfully by name and email', async () => {
        const userData = { name: 'JohnDoe', email: 'john@example.com' };
        mock.onGet(`${API_URL}/find`, { params: { name: userData.name, email: userData.email } }).reply(200, userData);

        await expect(findUser(userData.name, userData.email)).resolves.toEqual(userData);
    });

    it('TC_I_005: returns null when user is not found', async () => {
        const userData = { name: 'NotExist', email: 'notexist@example.com' };
        mock.onGet(`${API_URL}/find`, { params: { name: userData.name, email: userData.email } }).reply(404);

        await expect(findUser(userData.name, userData.email)).resolves.toBeNull();
    });

    it('TC_I_006: handles server error during user search', async () => {
        const userData = { name: 'ExistingUser', email: 'existing@example.com' };
        mock.onGet(`${API_URL}/find`, { params: { name: userData.name, email: userData.email } }).reply(500);

        await expect(findUser(userData.name, userData.email)).resolves.toBeNull();
    });

    it('TC_I_007: rejects user creation due to invalid name format', async () => {
        const userData = { name: '123456', email: 'user@example.com' };
        mock.onPost(`${API_URL}`, userData).reply(400, 'Name must be alphanumeric');

        await expect(createUser(userData)).rejects.toEqual('Name must be alphanumeric');
    });

    it('TC_I_008: rejects user creation due to invalid email format', async () => {
        const userData = { name: 'ValidName', email: 'invalidemail' };
        mock.onPost(`${API_URL}`, userData).reply(400, 'Invalid email format');

        await expect(createUser(userData)).rejects.toEqual('Invalid email format');
    });
});
