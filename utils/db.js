const path = require('node:path');
const fs = require('node:fs/promises');

const DB_PATH = path.join(__dirname, 'db.json');

const getDB = async () => {
    const db = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(db)
}

const saveDB = async (db) => {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
    return db
}

const insert = async (data) => {
    const db = await getDB()
    db.query.push(data)
    await saveDB(db)
    return data
}

module.exports = {insert}