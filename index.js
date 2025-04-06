const express = require('express');
const cors = require('cors')
const app= express()
const port = process.env.PORT || 5000

// midlewere
app.use(cors());
app.use(express.json())



app.get('/', (req, res)=>{
    res.send('everything is okey')
})

app.listen(port, ()=>{
    console.log(`coffee-shop is running from: ${port}`);
})