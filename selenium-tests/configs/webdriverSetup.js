const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver(locale = 'en-US', headlessMode = 'new') {
    let options = new chrome.Options();
    options.addArguments(`--lang=${locale}`);

    // Check the headless mode to apply the correct argument
    if (headlessMode === 'new') {
        options.addArguments('--headless=new'); // For Chrome version 109 and later
    } else {
        options.addArguments('--headless'); // For traditional headless mode
    }

    // Initialize the WebDriver Builder
    let builder = new Builder().forBrowser('chrome').setChromeOptions(options);

    // Use the Selenium Standalone Server if SELENIUM_REMOTE_URL is specified
    if (process.env.SELENIUM_REMOTE_URL) {
        builder = builder.usingServer(process.env.SELENIUM_REMOTE_URL);
    }

    return await builder.build();
}

module.exports = buildDriver;