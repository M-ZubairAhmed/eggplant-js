
const express = require('express')
const static = require('express').static
const path = require('path')

let app = express()

const port = process.env.PORT || 3232
app.set('port', port)


const clientPath = path.join(__dirname, 'client')
app.use(static(clientPath))

app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/')
})
