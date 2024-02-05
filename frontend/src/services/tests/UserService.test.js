import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createUser, findUser } from '../UserService';

describe('UserService', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    const API_URL = 'http://localhost:8080/users';

    it('finds a user successfully', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com' };
        mock.onGet(`${API_URL}/find`, { params: userData }).reply(200, userData);

        const response = await findUser(userData.name, userData.email);
        expect(response).toEqual(userData);
    });

    it('returns null when user is not found', async () => {
        mock.onGet(`${API_URL}/find`, { params: { name: 'Jane', email: 'jane@example.com' } }).reply(404);

        const response = await findUser('Jane', 'jane@example.com');
        expect(response).toBeNull();
    });

    it('creates a user successfully', async () => {
        const newUser = { name: 'Alice', email: 'alice@example.com' };
        mock.onPost(API_URL, newUser).reply(201, newUser);

        const response = await createUser(newUser);
        expect(response).toEqual(newUser);
    });

    it('handles duplicate user creation attempt with a custom error message', async () => {
        const duplicateUserData = { name: 'Alice', email: 'alice@example.com' };
        mock.onPost(API_URL, duplicateUserData).reply(400, 'An account with these credentials already exists.');

        await expect(createUser(duplicateUserData)).rejects.toEqual('A user with these credentials already exists. Please login or use different credentials.');
    });

});
