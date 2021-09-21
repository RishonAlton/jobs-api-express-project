require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDB = require('./DB/connect')

const errorHandler = require('./Middleware/error-handler')
const notFoundRoute = require('./Middleware/not-found')

const authRouter = require('./Routes/auth')
const jobsRouter = require('./Routes/jobs')

const authenticateUser = require('./Middleware/authentication')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')


const swaggerDocument = YAML.load('./swagger.yaml')


app.use(express.json())

app.set('trust proxy', 1)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use(helmet())
app.use(cors())
app.use(xss())

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})

app.use('/api/auth', authRouter)
app.use('/api/jobs', authenticateUser, jobsRouter)

app.use(notFoundRoute)
app.use(errorHandler)


const port = process.env.PORT || 3000

const start = async () => {

    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on Port ${port}...`))
    } 
    
    catch (error) {
        console.log(error)
    }

}


start()