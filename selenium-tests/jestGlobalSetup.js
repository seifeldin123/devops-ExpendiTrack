// jestGlobalSetup.js
const { exec } = require('child_process');
const axios = require('axios');

function startSpringBootApplication() {
    return new Promise((resolve, reject) => {
        const mvn = exec("mvn spring-boot:run -Dspring-boot.run.profiles=test", { cwd: "../backend" });

        mvn.stdout.on('data', (data) => {
            console.log(data); // Optionally log output for debugging
            if (data.includes("Started TrackerApplication")) {
                console.log('Spring Boot application has started.');
                resolve();
            }
        });

        mvn.stderr.on('data', (data) => {
            console.error(data);
            reject(new Error('Error starting Spring Boot application'));
        });
    });
}

async function isReactAppReady() {
    try {
        await axios.get('http://localhost:3000');
        return true;
    } catch {
        return false;
    }
}

async function startReactFrontend() {
    // Set BROWSER environment variable to 'none' to prevent opening the browser
    const env = { ...process.env, BROWSER: 'none' };
    exec("npm run start:selenium", { cwd: "../frontend", env });
    console.log('Waiting for React frontend to be ready...');
    const startTime = Date.now();
    const timeout = 60000; // 60 seconds

    return new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
            if (await isReactAppReady()) {
                console.log('React frontend is ready.');
                clearInterval(checkInterval);
                resolve();
            } else if (Date.now() - startTime > timeout) {
                console.error('Timeout waiting for React frontend to be ready.');
                clearInterval(checkInterval);
                reject(new Error('Timeout waiting for React frontend'));
            }
        }, 1000); // Check every second
    });
}

module.exports = async () => {
    console.log('Ensuring ports 8080 and 3000 are free...');
    await Promise.all([
        exec('npx kill-port 8080'),
        exec('npx kill-port 3000')
    ]);

    console.log('Starting Spring Boot application...');
    await startSpringBootApplication();

    console.log('Starting React frontend...');
    await startReactFrontend();
};
