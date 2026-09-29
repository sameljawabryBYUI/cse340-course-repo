import db from './db.js'; 

export async function createUser(name, email, password_hash) {
    // The role_id is hardcoded to 1 to assign the new user to the "user" role
    const sql = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, 1) 
        RETURNING *;
    `;
    const result = await db.query(sql, [name, email, password_hash]);
    return result.rows[0];
}