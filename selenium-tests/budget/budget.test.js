const { By, until } = require('selenium-webdriver');
const buildDriver = require('../configs/webdriverSetup');

// Helper function to sign up and log in a user
async function signupAndLogin(driver) {
    // Navigate to the main/welcome page
    await driver.get('http://localhost:3000/');

    // Click on the "Create a New Account" button to navigate to the signup page
    const createAccountButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create a New Account')]"));
    await driver.executeScript("arguments[0].click();", createAccountButton);

    // Wait for navigation to the signup page
    await driver.wait(until.urlIs('http://localhost:3000/signup'), 5000);

    // Fill in the signup form
    await driver.findElement(By.id('username')).sendKeys('testUser');
    await driver.findElement(By.id('email')).sendKeys('testuser@example.com');

    // Submit the signup form by clicking the submit button
    const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
    await driver.executeScript("arguments[0].click();", submitButton);

    // Wait for navigation to the dashboard
    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
}

// Helper function to log in a user
async function loginUser(driver) {
    // Navigate to the login page
    await driver.get('http://localhost:3000/login');

    // Fill in the login form
    await driver.findElement(By.id('username')).sendKeys('testUser');
    await driver.findElement(By.id('email')).sendKeys('testuser@example.com');

    // Submit the login form
    const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
    await driver.executeScript("arguments[0].click();", loginButton);

    // Wait for navigation to the dashboard or another indicator of successful login
    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
}


// Helper function to fill in the budget form
async function fillBudgetForm(driver, name, amount) {
    const budgetNameInput = await driver.findElement(By.id('budget-description'));
    await budgetNameInput.clear();
    await budgetNameInput.sendKeys(name);

    const budgetAmountInput = await driver.findElement(By.id('budget-amount'));
    await budgetAmountInput.clear();
    await budgetAmountInput.sendKeys(amount);
}

// Helper function to fill in the budget form within a modal
async function fillBudgetFormInModal(driver, name, amount) {
    const modal = await driver.findElement(By.css('.modal'));

    const budgetNameInput = await modal.findElement(By.id('budget-description'));
    await budgetNameInput.clear();
    await budgetNameInput.sendKeys(name);

    const budgetAmountInput = await modal.findElement(By.id('budget-amount'));
    await budgetAmountInput.clear();
    await budgetAmountInput.sendKeys(amount);
}


// Helper function to submit the create budget form and check for an error message
async function submitFormAndCheckError(driver, expectedError) {
    const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create Budget')]"));
    await submitButton.click();

    await driver.wait(until.elementLocated(By.css('.alert.alert-danger')), 5000);
    const errorMessageElement = await driver.findElement(By.css('.alert.alert-danger'));
    const errorMessageText = await errorMessageElement.getText();

    expect(errorMessageText).toContain(expectedError);
}

// Helper function to submit the update budget form and check for an error message
async function submitUpdateFormAndCheckError(driver, expectedError) {
    const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Update Budget')]"));
    await updateButton.click();

    await driver.wait(until.elementLocated(By.css('.alert.alert-danger')), 5000);
    const errorMessageElement = await driver.findElement(By.css('.alert.alert-danger'));
    const errorMessageText = await errorMessageElement.getText();

    expect(errorMessageText).toContain(expectedError);
}

// Helper Function to click on "Edit" button for a specific budget item
async function clickEditButtonForBudget(driver, budgetName) {
    // Find all budget item containers.
    const budgetItems = await driver.findElements(By.css('.card-container'));

    for (let budgetItem of budgetItems) {
        // Find the title of a budget
        const budgetTitle = await budgetItem.findElement(By.css('.card-title')).getText();

        if (budgetTitle.includes(budgetName)) {
            // Found the budget item. Now click its "Edit" button.
            const editButton = await budgetItem.findElement(By.css('#edit-budget-btn'));
            await editButton.click();
            return; // Exit the function after clicking the button for the matching budget
        }
    }

    throw new Error(`Budget item with name '${budgetName}' not found.`);
}

// Helper function to create a budget
async function createBudget(driver, budgetName, budgetAmount) {

    // Fill in the budget form
    await fillBudgetForm(driver, budgetName, budgetAmount);

    // Submit the budget form
    const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create Budget')]"));
    await submitButton.click();

    // Wait for and verify the success message
    let successMessageElement = await driver.wait(until.elementLocated(By.css('.alert.alert-success')), 5000);
    const successMessage = await successMessageElement.getText();
    expect(successMessage).toContain('Budget successfully added');
}

// Helper function to add a new expense
async function createExpense(driver, description, amount, budgetName) {

    // Wait for the Add Expense form to load
    await driver.wait(until.elementLocated(By.id('expense-description')), 5000);

    // Fill in the expense form
    await driver.findElement(By.id('expense-description')).sendKeys(description);
    await driver.findElement(By.id('expense-amount')).sendKeys(amount);

    // Select the appropriate budget for the expense
    // Assuming that the select dropdown can be interacted with by typing the budget name
    await driver.findElement(By.id('budget-category')).sendKeys(budgetName);

    // Submit the expense form
    const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create Expense')]"));
    await submitButton.click();

    // Wait for and verify the success message
    let successMessageElement = await driver.wait(until.elementLocated(By.css('.expense-message')), 5000);
    const successMessage = await successMessageElement.getText();
    expect(successMessage).toContain('Expense successfully added');
}

describe('Budget Creation Tests - Invalid Data Scenarios', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await signupAndLogin(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Create Budget with Negative Amount', async () => {
        await fillBudgetForm(driver, 'Groceries', '-100');
        await submitFormAndCheckError(driver, 'Invalid input: Budget amount cannot be negative or zero.');
    });

    it('Create Budget with Non-Alphanumeric Name', async () => {
        await fillBudgetForm(driver, '$$$ Party Funds $$$', '500');
        await submitFormAndCheckError(driver, 'BudgetDescription must be alphanumeric');
    });

    it('Create Budget with Duplicate Name for the Same User', async () => {
        // First, create a budget with valid data to ensure there's a budget to duplicate
        await fillBudgetForm(driver, 'Groceries', '300');

        // Submit form
        const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create Budget')]"));
        await submitButton.click();

        // Then, attempt to create another budget with the same name
        await fillBudgetForm(driver, 'Groceries', '300');
        await submitFormAndCheckError(driver, 'A budget with the name "Groceries" already exists for this user');
    });
});

describe('Budget Creation Tests - Valid Data Scenarios', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await loginUser(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Create Budget with Valid Data', async () => {
        // Use the helper function to create a budget
        await createBudget(driver, 'Housing', '1500');

        // Verify success message
        let successMessageElement;
        try {
            successMessageElement = await driver.wait(until.elementLocated(By.css('.alert.alert-success')), 5000);
        } catch (error) {
            throw new Error('Budget creation with valid data failed or success message not found.');
        }
        const successMessage = await successMessageElement.getText();
        expect(successMessage).toContain('Budget successfully added');

    });

});

describe('Budget Editing Tests - Invalid Data Scenarios', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await loginUser(driver);

        // Use the helper function to create a budget
        await createBudget(driver, 'Utilities', '500');
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Edit Budget with Negative Amount', async () => {

        // Click on an "Edit" button next to the 'UTILITIES' budget that already exists
        await clickEditButtonForBudget(driver, 'UTILITIES');

        // Fill in the form within the modal
        await fillBudgetFormInModal(driver, 'Utilities', '-100');

        // Submit the form and check for error
        await submitUpdateFormAndCheckError(driver, 'Invalid input: Budget amount cannot be negative or zero.');

        // Close the edit budget modal
        const closeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Close')]"));
        await closeButton.click();

    });

    it('Edit Budget with Non-Alphanumeric Name', async () => {

        // Click on an "Edit" button next to the 'UTILITIES' budget that already exists
        await clickEditButtonForBudget(driver, 'UTILITIES');

        // Fill in the form within the modal
        await fillBudgetFormInModal(driver, '$$$ Party Funds $$$', '500');

        // Submit the form and check for error
        await submitUpdateFormAndCheckError(driver, 'BudgetDescription must be alphanumeric');

        // Close the edit budget modal
        const closeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Close')]"));
        await closeButton.click();

    });
});

describe('Budget Editing Tests - Valid Data Scenarios', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await loginUser(driver);

        // Use the helper function to create a budget
        await createBudget(driver, 'Transportation', '300');
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Edit Budget with Valid Data Successfully', async () => {
        // Wait for the success message to ensure the budget is created
        let successMessageElement = await driver.wait(until.elementLocated(By.css('.alert.alert-success')), 5000);

        // Close the success alert by clicking the 'x' button
        const closeButtonOnAlert = await successMessageElement.findElement(By.css('.close'));
        await closeButtonOnAlert.click();

        // Click on an "Edit" button next to the 'TRANSPORTATION' budget that already exists
        await clickEditButtonForBudget(driver, 'TRANSPORTATION');

        // Fill in the form within the modal
        await fillBudgetFormInModal(driver, 'Updated Transportation', '400');

        // Submit the update budget form
        const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Update Budget')]"));
        await updateButton.click();

        // Verify success message for the updated budget
        successMessageElement = await driver.wait(until.elementLocated(By.css('.alert.alert-success')), 5000);
        const successMessage = await successMessageElement.getText();
        expect(successMessage).toContain('Budget successfully updated!');

        // Close the edit budget modal
        const closeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Close')]"));
        await closeButton.click();
    });
});

describe('Budget Calculation Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await loginUser(driver);

        // Create a budget first, since an expense needs a budget to be associated with
        await createBudget(driver, 'Food', '750');

        // Then, add an expense to the budget
        await createExpense(driver, 'Restaurant Meals', '250', 'Food');
    });

    afterAll(async () => {
        await driver.quit();
    });


    // Revised part of the test case for verifying budget calculations
    it('Verify budget calculations after adding an expense', async function () {

        // Wait for the budget items to be loaded
        const budgetItems = await driver.wait(until.elementsLocated(By.css('.card-container')), 5000);

        for (let budgetItem of budgetItems) {
            // Find the title of the budget
            const budgetTitle = await budgetItem.findElement(By.css('.card-title')).getText();

            if (budgetTitle.includes('FOOD')) {

                // Fetch the displayed values for total spent, remaining, and percent spent
                const totalSpent = await budgetItem.findElement(By.css('.total-spent')).getText();
                const remaining = await budgetItem.findElement(By.css('.remaining')).getText();
                const percentSpentElement = await budgetItem.findElement(By.css('.progress-bar.percent-spent'));
                const percentSpent = await percentSpentElement.getAttribute('aria-valuenow');

                // Assert that the displayed values match expected calculations
                expect(totalSpent).toContain('$250');
                expect(remaining).toContain('$500');
                expect(percentSpent).toContain('33');
            }
        }
    });

    it('Try to Edit Budget to Amount Less Than Expense and Verify Warning Modal Shows Up', async () => {
        // Navigate to and trigger the edit form for the 'Utilities' budget
        await clickEditButtonForBudget(driver, 'FOOD');

        // Attempt to edit the budget to an amount less than total expenses
        await fillBudgetFormInModal(driver, 'Updated Food', '100'); // Setting budget amount less than existing expenses

        // Submit the form
        const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Update Budget')]"));
        await updateButton.click();

        // Wait for the warning modal to appear
        const warningModal = await driver.wait(until.elementLocated(By.css('.modal')), 5000);
        expect(warningModal).toBeDefined();

        // Verify the text/content within the warning modal
        const modalText = await warningModal.getText();
        expect(modalText).toContain('Updating this budget to $100.00 is less than the total expenses of $250.00. Do you want to proceed?');

        // Click the proceed button and edit budget
        const proceedButton = await driver.findElement(By.xpath("//button[contains(text(), 'Proceed')]"));
        await proceedButton.click();

        // Wait for the budget items to be loaded
        const budgetItems = await driver.wait(until.elementsLocated(By.css('.card-container')), 5000);

        for (let budgetItem of budgetItems) {
            // Find the title of the budget
            const budgetTitle = await budgetItem.findElement(By.css('.card-title')).getText();

            if (budgetTitle.includes('FOOD')) {

                // Fetch the displayed values for total spent, remaining, and percent spent
                const totalSpent = await budgetItem.findElement(By.css('.total-spent')).getText();
                const overspent = await budgetItem.findElement(By.css('.remaining')).getText();
                const percentSpentElement = await budgetItem.findElement(By.css('.progress-bar.percent-spent'));
                const percentSpent = await percentSpentElement.getAttribute('aria-valuenow');

                // Assert that the displayed values match expected calculations
                expect(totalSpent).toContain('$250');
                expect(overspent).toContain('Overspent: $150.00');
                expect(percentSpent).toContain('100');
            }
        }
    });
});

describe('Budget Deletion Tests', () => {
    let driver;

    beforeAll(async () => {
        driver = await buildDriver();
        await loginUser(driver);

        // Create a budget first, since an expense needs a budget to be associated with
        await createBudget(driver, 'Insurance', '650');

        // Then, add an expense to the budget
        await createExpense(driver, 'Auto insurance', '200', 'Insurance');

        // Create another budget without an expense associated with it
        await createBudget(driver, 'Medical', '150');
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Attempt to Delete Budget with Existing Expenses and Delete Warning Modal shows', async () => {

        // Wait for the budget items to be loaded
        const budgetItems = await driver.wait(until.elementsLocated(By.css('.card-container')), 5000);

        for (let budgetItem of budgetItems) {
            // Find the title of the budget
            const budgetTitle = await budgetItem.findElement(By.css('.card-title')).getText();

            if (budgetTitle.includes('INSURANCE')) {

                // Click on delete budget button
                const deleteButton = await budgetItem.findElement(By.css('#delete-budget-btn'));
                await deleteButton.click();
            }
        }

        // await driver.sleep(10000); // Pauses for 10,000 milliseconds (10 seconds)


        // Wait for the delete warning modal to appear
        const deleteWarningModal = await driver.wait(until.elementLocated(By.css('.modal')), 5000);
        expect(deleteWarningModal).toBeDefined();

        // Verify the title within the delete warning modal
        const deleteModalTitle = await deleteWarningModal.getText();
        expect(deleteModalTitle).toContain('Cannot Delete Budget');

        // Verify the body within the delete warning modal
        const deleteModalBody = await deleteWarningModal.getText();
        expect(deleteModalBody).toContain('This budget cannot be deleted because it has associated expenses. Please remove these expenses before attempting to delete the budget.');

        // Close the delete warning modal
        const closeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Close')]"));
        await closeButton.click();
    });

    it('Successfully Delete Budget and Verify Deletion', async () => {
        // Wait for the budget items to be loaded
        const budgetItems = await driver.wait(until.elementsLocated(By.css('.card-container')), 5000);

        for (let budgetItem of budgetItems) {
            // Find the title of the budget
            const budgetTitle = await budgetItem.findElement(By.css('.card-title')).getText();

            if (budgetTitle.includes('MEDICAL')) {

                // Click on delete budget button
                const deleteButton = await budgetItem.findElement(By.css('#delete-budget-btn'));
                await deleteButton.click();
            }
        }

        // Wait for the delete modal to appear
        const deleteModal = await driver.wait(until.elementLocated(By.css('.modal')), 5000);
        expect(deleteModal).toBeDefined();

        // Verify the title within the delete modal
        const deleteModalTitle = await deleteModal.getText();
        expect(deleteModalTitle).toContain('Confirm Deletion');

        // Verify the body within the delete modal
        const deleteModalBody = await deleteModal.getText();
        expect(deleteModalBody).toContain('Are you sure you want to delete this budget?');

        // Click on Confirm Delete button within the delete modal
        const confirmDeleteButton = await driver.findElement(By.xpath("//button[contains(text(), 'Confirm Delete')]"));
        await confirmDeleteButton.click();

        // Verify budget is actually deleted
        const budgetItemsAfterDeletion = await driver.findElements(By.css('.card-container'));
        let medicalBudgetExistsPostDeletion = false;

        for (let budgetItem of budgetItemsAfterDeletion) {
            const budgetTitle = await budgetItem.findElement(By.css('.card-title')).getText();
            if (budgetTitle.includes('MEDICAL')) {
                medicalBudgetExistsPostDeletion = true;
                break;
            }
        }

        expect(medicalBudgetExistsPostDeletion).toBe(false); // Expect the Medical budget to no longer exist after deletion
    });
});
