const connection = require("../config/connection");

class User {
    constructor() {
        this.connection = connection;
        this.tableName = 'users';
    }

    async getByEmail(email = '') {
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1`;
        const params = [email];

        try {
            const [response] = await this.connection.execute(sql, params);
            
            return Array.isArray(response) && response.length > 0
                ? response[0]
                : null;

        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async saveUser(email = '', username = '', password = '', id = null) {
        let sql = '';
        let params = [email, username, password]; 
        let successFlag = '';

        if (id != null) {
            sql = `UPDATE ${this.tableName} SET 
                email = ?, username = ?, password = ?
                WHERE id = ?`;

            params.push(id);

            successFlag = 'affectedRows';
        } else {
            sql = `INSERT INTO ${this.tableName} 
                (email, username, password) VALUES (?,?,?)`;

            successFlag = 'insertId';
        }

        try {
            const [response] = await this.connection.execute(sql, params);

            const success = response[successFlag] ?? null;
            if (!success || success <= 0) {
                return null;
            }

            return {
                id: id ? id : success,
                email: email,
                username: username
            }

        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

module.exports = new User();