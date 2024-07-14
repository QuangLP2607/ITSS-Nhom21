export default class apiFeatures{
    constructor(query){
        this.query = query;
    }

    async search(){
        let query = `SELECT * FROM ${req.query.table}`;

        // Check if there are additional conditions to add to the query
        const keys = Object.keys(req.query);
        if (keys.length > 1) {
            query += ' WHERE ';
            for (const key in req.query) {
                if (key !== 'table') {
                    query += `${key} = '${req.query[key]}' AND `;
                }
            }
            // Remove the last 'AND' from the query string
            query = query.slice(0, -5);
        }

        // Add semicolon to end the query
        query += ';';
        // console.log(query);
        const result = await this.client.query(query);
        return result;
    }
}