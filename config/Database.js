import { Sequelize} from "sequelize";

const db = new Sequelize('ternak_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


export default db;