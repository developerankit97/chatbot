const path = require('node:path');
const fs = require('node:fs/promises');
const mongoose =require('mongoose');
const { Schema } = mongoose;

const querySchema = new Schema({
    query: { type: String, required: true }, 
    reply: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now } 
});

const Query = mongoose.model('Query', querySchema);

const DB_PATH = path.join(__dirname, 'db.json');

const getDB = async (filename) => {
    const db = await fs.readFile(path.join(__dirname, `${filename}.json`), 'utf-8')
    return JSON.parse(db)
}

const getFileData = async (fileName) => {
    try {
        // Attempt to read the file
        const db = await fs.readFile(path.join(__dirname, `${fileName}.json`), 'utf-8');
        return JSON.parse(db);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found: ${fileName}. Creating a new one.`);

            // Create the file with an empty object or any default content
            const defaultContent = {queries: []};
            await fs.writeFile(path.join(__dirname, `${fileName}.json`), JSON.stringify(defaultContent, null, 2), 'utf-8');

            // Return the default content
            return defaultContent;
        } else {
            // Handle other types of errors (e.g., parsing errors)
            console.error(`Error reading file: ${error.message}`);
            throw error; // Re-throw the error if it's not file-not-found
        }
    }
};
const saveFileData = async (fileName, data) => {
    try {
        // Convert the data to JSON string format
        const jsonData = JSON.stringify(data, null, 2);

        // Write the JSON data to the specified file
        await fs.writeFile(path.join(__dirname, `${fileName}.json`), jsonData, 'utf-8');

        console.log(`Data saved successfully to ${fileName}`);
    } catch (error) {
        console.error(`Error saving data to file: ${error.message}`);
        throw error; // Re-throw the error to handle it in the calling function if needed
    }
};

const updateFileData = async (fileName, newData) => {
    try {
        let data = {};

        // Check if file exists and read the existing data
        try {
            data = await getFileData(fileName); // Read existing file data
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log(`File not found. Creating a new one: ${fileName}`);
            } else {
                throw err; // If another error occurs, throw it
            }
        }

        // Merge or update the existing data with newData
        const updatedData = { ...data, ...newData };

        // Save the updated data back to the file
        await saveFileData(fileName, updatedData);

        console.log(`Data successfully updated in ${fileName}`);
    } catch (error) {
        console.error(`Error updating file: ${error.message}`);
        throw error;
    }
};



const saveDB = async (db, filename) => {
    await fs.writeFile(path.join(__dirname, `${filename}.json`), JSON.stringify(db, null, 2))
    return db
}

const insert = async (data, filename) => {
    const db = await getDB(filename);
    if (!db.queries) {
        db['queries'] = [];
    }
    db.queries.push(data);
    await saveDB(db, filename)
    return data
}



module.exports = { insert, getFileData, saveFileData, updateFileData, Query }