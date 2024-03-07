const { By, until } = require('selenium-webdriver');
const buildDriver = require('../configs/webdriverSetup');

describe('TestCreateExpenses', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await driver.manage().window().maximize();
        await driver.manage().setTimeouts({ implicit: 5000 });
    });

    afterAll(async () => {
        await driver.quit();
    });

    async function loginAndNavigateToExpenses() {
        await driver.get('http://localhost:3000/');
        await (await driver.findElement(By.xpath("//li[1]//button[1]"))).click();
        const nameField = await driver.findElement(By.xpath("//input[@id='username']"));
        const emailField = await driver.findElement(By.xpath("//input[@id='email']"));
        await nameField.sendKeys("saifayman");
        await emailField.sendKeys("saifayman@hotmail.com");
        await (await driver.findElement(By.xpath("//button[normalize-space()='Login']"))).click();
        await driver.sleep(3000);
    }

    test('A: Create expenses with valid data', async () => {
        await driver.get('http://localhost:3000/');
        await (await driver.findElement(By.xpath("//li[2]//button[1]"))).click();
        const nameField = await driver.findElement(By.xpath("//input[@id='username']"));
        const emailField = await driver.findElement(By.xpath("//input[@id='email']"));
        await nameField.sendKeys("saifayman");
        await emailField.sendKeys("saifayman@hotmail.com");
        await (await driver.findElement(By.xpath("//button[normalize-space()='Sign Up']"))).click();
        await driver.sleep(3000);
        const budgetNameField = await driver.findElement(By.xpath("//input[@id='budget-description']"));
        await budgetNameField.sendKeys("school");
        const budgetAmountField = await driver.findElement(By.xpath("//input[@id='budget-amount']"));
        await budgetAmountField.sendKeys("500");
        await (await driver.findElement(By.xpath("//div[contains(@class,'dashboard-budget-form')]//button[@type='submit']"))).click();
        await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Budget successfully added!']")));
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("books");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("250");
        const budgetCategoryField = await driver.findElement(By.xpath("//select[@id='budget-category']"));
        await budgetCategoryField.findElement(By.xpath("//option[normalize-space()='school']")).click();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Expense successfully added!']")));
    });

    test('B: Create expenses with invalid name', async () => {
        await loginAndNavigateToExpenses();
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("1234");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("250");
        const budgetCategoryField = await driver.findElement(By.xpath("//select[@id='budget-category']"));
        await budgetCategoryField.findElement(By.xpath("//option[normalize-space()='school']")).click();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        const errorElement = await driver.findElement(By.xpath("//div[@class='alert alert-danger']"));
        const errorMessage = await errorElement.getText();
        expect(errorMessage).toContain("Invalid input: ExpensesDescription must be alphanumeric");
    });

    test('C: Create expenses with negative amount', async () => {
        await loginAndNavigateToExpenses();
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("books");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("-250");
        const budgetCategoryField = await driver.findElement(By.xpath("//select[@id='budget-category']"));
        await budgetCategoryField.findElement(By.xpath("//option[normalize-space()='school']")).click();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        const errorElement = await driver.findElement(By.xpath("//div[@class='alert alert-danger']"));
        const errorMessage = await errorElement.getText();
        expect(errorMessage).toContain("Invalid input: expenses amount cannot be negative.");
    });

    test('D: Create expenses with existing name', async () => {
        await loginAndNavigateToExpenses();
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("books");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("20");
        const budgetCategoryField = await driver.findElement(By.xpath("//select[@id='budget-category']"));
        await budgetCategoryField.findElement(By.xpath("//option[normalize-space()='school']")).click();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        const errorMessageElement = await driver.findElement(By.xpath("//li[contains(text(),'An expense with the name \"books\" already exists fo')]"));
        const errorMessage = await errorMessageElement.getText();
        expect(errorMessage).toMatch(/An expense with the name ["']books["'] already exists/);
    });

//
//    test('E: Edit an expense', async () => {
//        await loginAndNavigateToExpenses();
//        await driver.sleep(3000);
//
//
//});
    test('E: Delete an expense', async () => {
        await loginAndNavigateToExpenses();
        await driver.sleep(3000);
    // Locate and click the delete button
        const deleteButton = await driver.findElement(By.xpath("//div[@class='col-lg-4 col-md-6 mb-4']//button[@class='btn btn-danger']"));
        await deleteButton.click();
    // Wait for the confirmation modal to appear
        const confirmButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Confirm Delete']")), 5000);
    // Click the confirmation button
        await confirmButton.click();
});

});
