import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createUser, findUser } from '../UserService';

// Describe block for the UserService test suite
describe('userService', () => {
    const mock = new MockAdapter(axios);
    const API_URL = 'http://localhost:8080/users';

    // Test for finding a user successfully
    it('finds a user successfully', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com' };
        mock.onGet(`${API_URL}/find`, { params: userData }).reply(200, userData);

        const response = await findUser(userData.name, userData.email);
        expect(response).toEqual(userData);
    });

    // Test for returning null when user is not found
    it('returns null when user is not found', async () => {
        mock.onGet(`${API_URL}/find`, { params: { name: 'Jane', email: 'jane@example.com' } }).reply(404);

        const response = await findUser('Jane', 'jane@example.com');
        expect(response).toBeNull();
    });

    // Test for creating a user successfully
    it('creates a user successfully', async () => {
        const newUser = { name: 'Alice', email: 'alice@example.com' };
        mock.onPost(API_URL, newUser).reply(201, newUser);

        const response = await createUser(newUser);
        expect(response.data).toEqual(newUser);
    });

    // Test for handling the scenario where an attempt is made to create a user that already exists
    it('handles duplicate user creation attempt with a custom error message', async () => {
        const duplicateUserData = { name: 'Alice', email: 'alice@example.com' };
        // Adjusting mock to reflect a real JSON error response
        mock.onPost(API_URL, duplicateUserData).reply(400, {
            message: 'An account with these credentials already exists.'
        });

        try {
            await createUser(duplicateUserData);
        } catch (error) {
            expect(error).toBe('A user with these credentials already exists. Please login or use different credentials.');
        }
    });



});
