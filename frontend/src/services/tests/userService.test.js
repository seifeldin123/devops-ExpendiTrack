import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createUser, findUser } from '../userService';

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
});
