const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver(locale = 'en-US', headlessMode = 'new') { // Default locale is set to English US, and default headless mode is set to 'new'
    let options = new chrome.Options();
    options.addArguments(`--lang=${locale}`);

    // Check the headless mode to apply the correct argument
    if (headlessMode === 'new') {
        options.addArguments('--headless=new'); // For Chrome version 109 and later
    } else {
        options.addArguments('--headless'); // For traditional headless mode
    }

    return await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

module.exports = buildDriver;
