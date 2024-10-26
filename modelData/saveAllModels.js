const { readdirSync, statSync } = require('fs');
const { resolve, join } = require('path');

function save_All_Models(manager) {
    try {
        const baseFolder = resolve('modelData');

        // Function to recursively traverse directories and require JavaScript files
        function loadFiles(dir) {
            // Read the directory contents
            const folderContents = readdirSync(dir);
            // Iterate through each file/folder in the directory
            folderContents.forEach(item => {
                const fullPath = join(dir, item); // Get the full path to the file/folder

                // Check if it's a directory or a file
                if (statSync(fullPath).isDirectory()) {
                    // If it's a directory, recursively load files from that directory
                    loadFiles(fullPath);
                } else if (item.endsWith('.js') && item !== 'saveAllModels.js') {
                    // If it's a JavaScript file (but not 'saveAllModels.js'), require it
                    require(fullPath)(manager); // Execute the required module function with the manager
                }
            });
        }

        // Start loading files from the base 'models' folder
        loadFiles(baseFolder);

    } catch (error) {
        console.error('Error loading models:', error);
    }
}

module.exports = save_All_Models
