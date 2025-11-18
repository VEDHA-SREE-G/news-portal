const express = require('express')
const cors = require('cors')
const db = require('./models')
const app = express()
const router = require('./routes/newsRouter')
const userRouter = require('./routes/userRouter')
var corOptions = {
    origin : 'http://localhost:3000'
}

app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/api/news',router)
app.use('/',userRouter)
const PORT = process.env.PORT || 8082

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
