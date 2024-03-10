const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver(locale = 'en-US') { // Default locale is set to French (France)
    let options = new chrome.Options();
    options.addArguments(`--lang=${locale}`);

    return await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

module.exports = buildDriver;
