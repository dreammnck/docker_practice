const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');
const { MONGO_PASSWORD,MONGO_USER, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const app = express();
const postRouter = require('./routes/postRoutes');
const userRouter = require("./routes/userRoute");

const port = process.env.port || 3000 ;

// @service name or ipAddres
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin` ;
const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify:false
    })
    .then(()=>{
        console.log('successfully connected the database')
    })
    .catch((err) => {
        console.log("Can't connect to the database");
        setTimeout(connectWithRetry,5000);
    })
}
connectWithRetry();

// set proxy (to enable every nginx request is a trust request ) 
app.enable("trust proxy")

//enable cors
app.use(cors());

//Middleware
app.use(express.json());
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie : {
        secure: false,
        resave: false,
        httpOnly:true,
        maxAge: 24*60*1000
    }
}));

// localhost3000/posts/
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/users",userRouter);

app.get('/api/v1',(req,res)=>{
    res.send('dream for development');
    console.log("yeah it ran");
})

app.listen(port , () => {
    console.log(`listening on port ${port}`);
})

