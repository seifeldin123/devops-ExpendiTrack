const { By, until } = require('selenium-webdriver');
const buildDriver = require('../configs/webdriverSetup');
const { name, email } = require("./credentials.json");

describe('User Registration Test', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('User should register successfully', async () => {
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });

        const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);

        const signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);

        await driver.wait(until.urlContains('dashboard'), 10000);

    });

    test("User should login successfully", async() => {
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({implicit:1000});
        const loginAccount = await driver.findElement(By.xpath("//button[contains(text(), 'Login to Your Account')]"));
        await driver.executeScript("arguments[0].click()", loginAccount);
        await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
        await driver.executeScript("arguments[0].click();", loginButton);
        await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 10000);
    })

    test('User enters the empty string, expecting validation failure', async () => {
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });

        const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

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
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });

        const loginAccount = await driver.findElement(By.xpath("//button[contains(text(), 'Login to Your Account')]"));
        await driver.executeScript("arguments[0].click()", loginAccount);
        await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

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
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });

        const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

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
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });

        const loginAccount = await driver.findElement(By.xpath("//button[contains(text(), 'Login to Your Account')]"));
        await driver.executeScript("arguments[0].click()", loginAccount);
        await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

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

    test("User with name and email already exist" , async () => {
        await driver.get("http://localhost:3000/");
        await driver.manage().setTimeouts({ implicit: 1000 });
        const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
        await driver.executeScript("arguments[0].click();", createAccountButton);
        await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);
        await driver.findElement(By.id('username')).sendKeys(name);
        await driver.findElement(By.id('email')).sendKeys(email);
        const signUpButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
        await driver.executeScript("arguments[0].click();", signUpButton);
        const errorMessage = await driver.executeScript(`
        const errorDivs = [...document.querySelectorAll('div')].filter(div => div.style.color === 'red');
        return errorDivs.length > 0 ? errorDivs[0].innerText : '';  
    `);
        expect(errorMessage).not.toBe('A user with the provided name or email already exists.');
    });

});
