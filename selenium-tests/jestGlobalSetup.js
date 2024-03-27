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

const localSetup = async () => {
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

// Helper function to check service availability
async function checkServiceHealth(url, timeout = 60000) {
    const startTime = Date.now();
    while (true) {
        try {
            await axios.get(url);
            console.log(`Service at ${url} is up.`);
            break; // Exit loop if request succeeds
        } catch (error) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`Timeout waiting for service at ${url} to be ready.`);
            }
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}


const dockerSetup = async () => {
    console.log('Waiting for backend and frontend services to be ready...');

    // Replace these URLs with the ones appropriate for setup
    await checkServiceHealth('http://backend:8080/users/find?name=Jane&email=jane@example.com'); // Assuming backend has a health check endpoint
    await checkServiceHealth('http://frontend/'); // Checking if the frontend service is up

    console.log('Services are ready. Running tests...');
};

module.exports = async () => {
    const testEnv = process.env.TEST_ENV || 'local'; // Default to 'local' if TEST_ENV is not set

    if (testEnv === 'docker') {
        await dockerSetup();
    } else {
        await localSetup();
    }
};