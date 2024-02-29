const { By, until } = require('selenium-webdriver');
const buildDriver = require('../configs/webdriverSetup'); // Adjust this path

describe('User Signup', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('Sign up a new user and navigate to dashboard', async () => {
        await driver.get('http://localhost:3000/signup'); // Directly navigate to the signup page

        // Fill in the signup form
        await driver.findElement(By.id('username')).sendKeys('testUser');
        await driver.findElement(By.id('email')).sendKeys('testuser@example.com');

        // Submit the form
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for navigation to the dashboard
        await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 10000);

        // Validation to ensure the test has successfully navigated to the dashboard
        let dashboardIndicator = await driver.findElement(By.css('.dashboard-indicator'));
        expect(dashboardIndicator).toBeDefined();
    }, 30000);
});
