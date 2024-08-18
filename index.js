import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import SapiRoute from "./routes/SapiRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import BlockchainRoute from "./routes/BlockchainRoute.js";
dotenv.config();


const app = express();

const sessionStorage = SequelizeStore(session.Store);
const store = new sessionStorage({
  db: db,
});
(async () => {
    await db.sync();
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: ["http://fabric-ternak.my.to"]
}));
app.use(express.json());
app.use(UserRoute);
app.use(SapiRoute);
app.use(AuthRoute);
app.use(BlockchainRoute);


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
  
store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log(`server berjalan dengan aman`);
});