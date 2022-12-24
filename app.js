const express =require('express') ;
const app = express() ;
const dotenv =require('dotenv')
const morgan =require('morgan')
const mongoose =require('mongoose')

const ApiErrors =require('./utils/ApiErrors')
dotenv.config({path:'config.env'})


const ErrormiddelWare =require('./middlewares/errormiddelware')



//DataBase Connection
mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`DataBase Is Connected: ${conn.Connection.host}`)
}).catch((err) => {
    console.error(`DataBase Error ${err}`)
    process.exit(1)
})


//middelware
app.use(express.json());
app.use(morgan('dev'));


//router
const globalError = require('./middlewares/errorMiddleware');
const mountRoutes = require('./routes');

mountRoutes(app);

//handel route erros 
app.use('*',(req,res,next) => {
next(new ApiErrors(`Can't Find This Route On ${req.originalUrl}`,400))
})

app.use(globalError);




//MiddelWare for Handling Error
app.use(ErrormiddelWare);




const PORT =process.env.port||8000 ;
const server=app.listen(PORT , () => {
    console.log("server done")
})

// to handle the errors from out side express by using on funcation in node to catch error like catch error from databse connection
process.on("unhandledRejection",(err) => {
    console.error(`unhandledRejection Error ${err.name}|${err.message}`) ;
    server.close(() => {
        console.log(`shutting down`)
        process.exit(1);
    })
})