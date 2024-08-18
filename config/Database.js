import { Sequelize} from "sequelize";

const db = new Sequelize('ternak_db', 'root', 'root12345', {
    host: 'localhost',
    dialect: 'mysql'
});


export default db;