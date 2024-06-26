const { By, until } = require('selenium-webdriver');
const buildDriver = require('../configs/webdriverSetup');

// Determine the base URL dynamically
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

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
//        await driver.get('http://localhost:3000/');
        await driver.get(`${APP_BASE_URL}/`);

        await (await driver.findElement(By.xpath("//li[1]//button[1]"))).click();
        // Fill in the login form
        const nameField = await driver.findElement(By.xpath("//input[@id='username']"));
        const emailField = await driver.findElement(By.xpath("//input[@id='email']"));
        await nameField.sendKeys("saifayman");
        await emailField.sendKeys("saifayman@hotmail.com");
        // Click the login button
        await (await driver.findElement(By.xpath("//button[normalize-space()='Login']"))).click();
        await driver.sleep(3000);
    }

    test('A: Create expenses with valid data', async () => {
//        await driver.get('http://localhost:3000/');
        await driver.get(`${APP_BASE_URL}/`);

        await (await driver.findElement(By.xpath("//li[2]//button[1]"))).click();
        // Fill in the signup form
        const nameField = await driver.findElement(By.xpath("//input[@id='username']"));
        const emailField = await driver.findElement(By.xpath("//input[@id='email']"));
        await nameField.sendKeys("saifayman");
        await emailField.sendKeys("saifayman@hotmail.com");
        // Click the signup button
        await (await driver.findElement(By.xpath("//button[normalize-space()='Sign Up']"))).click();
        // Wait for signup process to complete
        await driver.sleep(3000);
        // Fill in the budget creation form
        const budgetNameField = await driver.findElement(By.xpath("//input[@id='budget-description']"));
        await budgetNameField.sendKeys("school");
        const budgetAmountField = await driver.findElement(By.xpath("//input[@id='budget-amount']"));
        await budgetAmountField.sendKeys("500");
        await (await driver.findElement(By.xpath("//button[@type='submit']"))).click();
        await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Budget successfully added!']")));
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense-btn']"))).click();
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("books");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("250");
        // Click the create expense button
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        // Wait for expense creation success message
        await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Expense successfully added!']")));
    });
    test('B: Create expenses with invalid name', async () => {
        await loginAndNavigateToExpenses();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense-btn']"))).click();
         // Find and fill in the expenses name field with an invalid name
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("1234");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("250");

        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        // Find and get the error message element
        const errorElement = await driver.findElement(By.xpath("//div[@class='alert alert-danger']"));
        // Get the text of the error message
        const errorMessage = await errorElement.getText();
        // Check if the error message contains the expected text
        expect(errorMessage).toContain("Invalid input: Expense description should be alphanumeric.");
    });

    test('C: Create expenses with negative amount', async () => {
        await loginAndNavigateToExpenses();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense-btn']"))).click();
        // Find and fill in the expenses name field
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("books");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("-250");
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        // Find and get the error message element
        const errorElement = await driver.findElement(By.xpath("//div[@class='alert alert-danger']"));
        // Get the text of the error message
        const errorMessage = await errorElement.getText();
        // Check if the error message contains the expected text
        expect(errorMessage).toContain("Invalid input: expenses amount cannot be negative.");
    });

    test('D: Create expenses with existing name', async () => {
        await loginAndNavigateToExpenses();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense-btn']"))).click();
        // Find and fill in the expenses name field
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("books");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("20");
        await (await driver.findElement(By.css("button[data-testid='create-expense']"))).click();
        // Find and get the error message element
        const liElements = await driver.findElements(By.css("li"));
        for (const liElement of liElements) {
            const text = await liElement.getText();
            if (text.includes("An expense with the name \"books\" already exists")) {
                const errorMessageElement = liElement;
                const errorMessage = text;
           // Perform further actions with errorMessageElement and errorMessage
                expect(errorMessage).toMatch(/An expense with the name ["']books["'] already exists/);
                break;
    }
    }
 });
    test('E: Edit an expense with valid data', async () => {
     // Perform login and navigate to expenses
         await loginAndNavigateToExpenses();
         await (await driver.findElement(By.xpath("//button[@data-testid='view-expenses-btn']"))).click();
     // Perform actions to create expenses
         await (await driver.findElement(By.xpath("//button[@data-testid='edit-expense']"))).click();
         const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
         await expensesNameField.clear();
         await expensesNameField.sendKeys("seka");
         const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
         await expensesAmountField.clear();
         await expensesAmountField.sendKeys(20);
     // Click on the button to save changes
         const updateExpenseButton = await driver.findElement(By.xpath("//button[@data-testid='updateExpenseButton']"));
         await updateExpenseButton.click();

     // Wait until the success message element is visible
        await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Expense successfully updated!']")), 10000);
     // Get the actual text of the success message
         const successMessage = await driver.findElement(By.xpath("//p[normalize-space()='Expense successfully updated!']")).getText();
         console.log("Actual success message:", successMessage);
     // Check if the success message is present on the page
         const expectedSuccessMessage = "Expense successfully updated!";
         if (successMessage.includes(expectedSuccessMessage)) {
             console.log(`Success message '${expectedSuccessMessage}' appeared.`);
         } else {
             console.log("Success message did not appear or is incorrect.");
         }
 });
  test('F: Edit an expense to exceed the budget amount', async () => {
      // Perform login and navigate to expenses
          await loginAndNavigateToExpenses();
          await (await driver.findElement(By.xpath("//button[@data-testid='view-expenses-btn']"))).click();
      // Perform actions to create expenses
          await (await driver.findElement(By.xpath("//button[@data-testid='edit-expense']"))).click();
          const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
          await expensesNameField.clear();
          await expensesNameField.sendKeys("seka");
          const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
          await expensesAmountField.clear();
          await expensesAmountField.sendKeys(510);
      // Click on the button to save changes
         const updateExpenseButton = await driver.findElement(By.xpath("//button[@data-testid='updateExpenseButton']"));
         await updateExpenseButton.click();
      // Wait for the modal to appear
          await driver.wait(until.elementLocated(By.className('modal')), 5000);
      // Click the "Proceed" button in the modal
          const proceedButton = await driver.findElement(By.xpath("//button[text()='Proceed']"));
          await proceedButton.click();
      // Wait until the success message element is visible
         await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Expense successfully updated!']")), 10000);
      // Get the actual text of the success message
          const successMessage = await driver.findElement(By.xpath("//p[normalize-space()='Expense successfully updated!']")).getText();
          console.log("Actual success message:", successMessage);
      // Check if the success message is present on the page
          const expectedSuccessMessage = "Expense successfully updated!";
          if (successMessage.includes(expectedSuccessMessage)) {
              console.log(`Success message '${expectedSuccessMessage}' appeared.`);
          } else {
              console.log("Success message did not appear or is incorrect.");
          }
  });

     test('G: Edit an expense with invalid name', async () => {
     // Perform login and navigate to expenses
         await loginAndNavigateToExpenses();
         await (await driver.findElement(By.xpath("//button[@data-testid='view-expenses-btn']"))).click();
     // Perform actions to create expenses
         await (await driver.findElement(By.xpath("//button[@data-testid='edit-expense']"))).click();
         const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
         await expensesNameField.clear();
         await expensesNameField.sendKeys(1234);
         const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
         await expensesAmountField.clear();
         await expensesAmountField.sendKeys(20);
     // Click on the button to save changes
         const updateExpenseButton = await driver.findElement(By.xpath("//button[@data-testid='updateExpenseButton']"));
         await updateExpenseButton.click();

        // Wait for the error message element to become visible
         await driver.wait(until.elementLocated(By.css("div.modal-body.modal-body-custom li")), 10000);

        // Get the actual text of the error message
         const errorMessageElement = await driver.findElement(By.css("div.modal-body.modal-body-custom li"));
         const errorMessage = await errorMessageElement.getText();
         console.log("Actual error message:", errorMessage);

        // Check if the error message is present on the page
         const expectedErrorMessage = "Invalid input: Expense description should be alphanumeric.";
         if (errorMessage.toLowerCase().includes(expectedErrorMessage.toLowerCase())) {
            console.log(`Error message '${expectedErrorMessage}' appeared.`);
         } else {
            console.log("Error message did not appear or is incorrect.");
         }
 });

     test('H: Edit an expense with negative amount', async () => {
      // Perform login and navigate to expenses
          await loginAndNavigateToExpenses();
          await (await driver.findElement(By.xpath("//button[@data-testid='view-expenses-btn']"))).click();
      // Perform actions to create expenses
          await (await driver.findElement(By.xpath("//button[@data-testid='edit-expense']"))).click();
          const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
          await expensesNameField.clear();
          await expensesNameField.sendKeys("calculator");
          const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
          await expensesAmountField.clear();
          await expensesAmountField.sendKeys(-20);
      // Click on the button to save changes
         const updateExpenseButton = await driver.findElement(By.xpath("//button[@data-testid='updateExpenseButton']"));
         await updateExpenseButton.click();
        // Wait for the error message element to become visible
          await driver.wait(until.elementLocated(By.css("div.modal-body.modal-body-custom li")), 10000);

        // Get the actual text of the error message
          const errorMessageElement = await driver.findElement(By.css("div.modal-body.modal-body-custom li"));
          const errorMessage = await errorMessageElement.getText();
          console.log("Actual error message:", errorMessage);

        // Check if the error message is present on the page
          const expectedErrorMessage = "Invalid input: expenses amount cannot be negative.";
          if (errorMessage.toLowerCase().includes(expectedErrorMessage.toLowerCase())) {
            console.log(`Error message '${expectedErrorMessage}' appeared.`);
          } else {
            console.log("Error message did not appear or is incorrect.");
          }
  });

    test('I: Delete an expense', async () => {
        try {
            // Perform login and navigate to expenses
            await loginAndNavigateToExpenses();
            await (await driver.findElement(By.xpath("//button[@data-testid='view-expenses-btn']"))).click();
           await (await driver.findElement(By.xpath("//div[@class='expense-item']//button[@class='btn btn-sm btn-danger']"))).click();

            // Wait for the confirmation modal to appear
            const confirmButton = await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='Confirm Delete']")), 5000);

            // Click the confirmation button
            await confirmButton.click();

            // Wait for the item to be deleted (e.g., item no longer present on the page)
            await driver.wait(until.stalenessOf(deleteButton), 10000);

            // Check if the item is deleted successfully
            const expenses = await driver.findElements(By.xpath("//div[@class='col-lg-4 col-md-6 mb-4']"));
            if (expenses.length === 0) {
                console.log("Expense deleted successfully.");
            } else {
                console.log("Expense deletion failed.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
});
    test('J: Create expense to exceed the budget amount', async () => {
        await loginAndNavigateToExpenses();
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense-btn']"))).click();
         // Find and fill in the expenses name field with an invalid name
        const expensesNameField = await driver.findElement(By.xpath("//input[@id='expense-description']"));
        await expensesNameField.sendKeys("Groceries");
        const expensesAmountField = await driver.findElement(By.xpath("//input[@id='expense-amount']"));
        await expensesAmountField.sendKeys("600");
        await (await driver.findElement(By.xpath("//button[@data-testid='create-expense']"))).click();
        // Wait for the modal to appear
        await driver.wait(until.elementLocated(By.className('modal')), 5000);
        // Click the "Proceed" button in the modal
        const proceedButton = await driver.findElement(By.xpath("//button[text()='Proceed']"));
        await proceedButton.click();
        // Wait for expense creation success message
        await driver.wait(until.elementLocated(By.xpath("//p[normalize-space()='Expense successfully added!']")));
    });
});
