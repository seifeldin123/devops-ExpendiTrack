// jestGlobalTeardown.js
const { exec } = require('child_process');

function killPort(port) {
    return new Promise((resolve, reject) => {
        exec(`npx kill-port ${port}`, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                console.error(`Error releasing port ${port}:`, stderr);
                return reject(new Error(stderr));
            }
            console.log(`Port ${port} has been successfully released.`);
            resolve(stdout);
        });
    });
}

module.exports = async () => {
    console.log('Releasing ports 8080 and 3000...');
    try {
        await Promise.all([
            killPort(8080),
            killPort(3000),
        ]);
        console.log('Ports 8080 and 3000 have been successfully released.');
    } catch (error) {
        console.error('Failed to release ports:', error);
    }
};
