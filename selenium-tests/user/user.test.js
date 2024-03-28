const { By, until } = require('selenium-webdriver');
const buildDriver = require('../configs/webdriverSetup');
const { name, email } = require("./credentials.json");

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';


describe('User Registration Test', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('User should register successfully', async () => {
        // await driver.get("http://localhost:3000/");
        await driver.get(`${APP_BASE_URL}/`);


        await driver.manage().setTimeouts({ implicit: 1000 });

        // const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        const createAccountButton = await driver.findElement(By.css('[data-testid="createAccountButton"]'));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/signup`), 5000);


        // await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);

        const signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);

        // await driver.wait(until.urlContains('dashboard'), 10000);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/dashboard`), 5000);

    });

    test("User should login successfully", async() => {
        await driver.get(`${APP_BASE_URL}/`);

        // await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({implicit:1000});
        // const loginAccount = await driver.findElement(By.xpath("//button[contains(text(), 'Login to Your Account')]"));
        const loginAccount = await driver.findElement(By.css('[data-testid="loginButton"]'));
        await driver.executeScript("arguments[0].click()", loginAccount);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/login`), 5000);


        // await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        await driver.executeScript("arguments[0].click();", loginButton);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/dashboard`), 5000);

        // await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 10000);
    })

    test('User enters the empty string, expecting validation failure', async () => {

        await driver.get(`${APP_BASE_URL}/`);


        // await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });

        // const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        const createAccountButton = await driver.findElement(By.css('[data-testid="createAccountButton"]'));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/signup`), 5000);

        // await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

        await driver.findElement(By.id('username')).sendKeys("");
        await driver.findElement(By.id('email')).sendKeys("");

        const signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);
        const isEmailValid = await driver.executeScript("return document.getElementById('email').validity.valid;");

        expect(isEmailValid).toBeFalsy();

        const isUsernameValid = await driver.executeScript("return document.getElementById('username').validity.valid;");
        expect(isUsernameValid).toBeFalsy();
    });

    test('User enters the incorect email, expecting validation failure', async () => {
        await driver.get(`${APP_BASE_URL}/`);

        // await driver.get("http://localhost:3000/");

        await driver.manage().setTimeouts({ implicit: 1000 });

        // const loginAccount = await driver.findElement(By.xpath("//button[contains(text(), 'Login to Your Account')]"));
        const loginAccount = await driver.findElement(By.css('[data-testid="loginButton"]'));
        await driver.executeScript("arguments[0].click()", loginAccount);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/login`), 5000);

        // await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

        await driver.findElement(By.id('username')).sendKeys("");
        await driver.findElement(By.id('email')).sendKeys("");
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));

        await driver.executeScript("arguments[0].click();", loginButton);
        const isEmailValid = await driver.executeScript("return document.getElementById('email').validity.valid;");

        expect(isEmailValid).toBeFalsy();

        const isUsernameValid = await driver.executeScript("return document.getElementById('username').validity.valid;");
        expect(isUsernameValid).toBeFalsy();
    });

    test('User enters the empty string, expecting validation failure', async () => {
        // await driver.get("http://localhost:3000/");
        await driver.get(`${APP_BASE_URL}/`);


        await driver.manage().setTimeouts({ implicit: 1000 });

        // const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        const createAccountButton = await driver.findElement(By.css('[data-testid="createAccountButton"]'));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        // await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);
        await driver.wait(until.urlIs(`${APP_BASE_URL}/signup`), 5000);


        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys("test");

        const signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);
        const errorMessage = await driver.executeScript(`
        const errorDivs = [...document.querySelectorAll('div')].filter(div => div.style.color === 'red');
        return errorDivs.length > 0 ? errorDivs[0].innerText : '';  
    `);
        expect(errorMessage).not.toBe('Invalid input: Invalid email format');
    });

    test('User enters the incorect email, expecting validation failure', async () => {
        // await driver.get("http://localhost:3000/");
        await driver.get(`${APP_BASE_URL}/`);


        await driver.manage().setTimeouts({ implicit: 1000 });

        // const loginAccount = await driver.findElement(By.xpath("//button[contains(text(), 'Login to Your Account')]"));
        const loginAccount = await driver.findElement(By.css('[data-testid="loginButton"]'));
        await driver.executeScript("arguments[0].click()", loginAccount);
        // await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

        await driver.wait(until.urlIs(`${APP_BASE_URL}/login`), 5000);


        await driver.findElement(By.id('username')).sendKeys("as");
        await driver.findElement(By.id('email')).sendKeys("as@gmail.com");
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));

        await driver.executeScript("arguments[0].click();", loginButton);
        const errorMessage = await driver.executeScript(`
        const errorDivs = [...document.querySelectorAll('div')].filter(div => div.style.color === 'red');
        return errorDivs.length > 0 ? errorDivs[0].innerText : '';  
    `);
        expect(errorMessage).not.toBe('Invalid input: Invalid email format');
    });

    test("User with name and email already exist", async () => {
        // await driver.get("http://localhost:3000/signup");

        // console.log(await driver.getPageSource());


        let signUpHereButton= await driver.findElement(By.xpath("//button[contains(text(), 'Sign up here')]"));
        await driver.executeScript("arguments[0].click();", signUpHereButton);

        //
        // let currentUrl = await driver.getCurrentUrl();
        //
        // // Print the current URL
        // console.log(currentUrl);

        await driver.wait(until.urlIs(`${APP_BASE_URL}/signup`), 5000);

        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);
        let signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);
        // await driver.get("http://localhost:3000/");

        await driver.get(`${APP_BASE_URL}/`);

        // const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        const createAccountButton = await driver.findElement(By.css('[data-testid="createAccountButton"]'));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        // await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

        await driver.wait(until.urlIs(`${APP_BASE_URL}/signup`), 5000);

        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);
        signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);

        await driver.wait(until.elementLocated(By.id('error-message')), 10000); // Adjust the timeout as necessary
        const errorMessageElement = await driver.findElement(By.id('error-message'));
        const errorMessage = await errorMessageElement.getText();

        expect(errorMessage).toBe('An account with these credentials already exists.');
        // console.log(errorMessageElement, errorMessage);
    });

});
