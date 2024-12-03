const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
const uuid = require("uuid")
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let users = []
let excercises = [
]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/excerciseTracker.html')
});


app.post("/api/users", (req, res) => {
  const new_user = { _id: uuid.v4(length = 24), username: req.body.username }
  users.push(new_user)
  res.json(new_user)
})

app.get("/api/users", (req, res) => {
  res.send(users)
})

app.post("/api/users/:id/exercises", (req, res) => {
  let user = users.filter(value => value._id === req.params.id)
  if (user.length === 0) {
    return res.json({ error: "Cannot Find User" })
  }
  let date;
  if (!req.body.date) {
    date = new Date(Date.now())
  } else {
    date = new Date(req.body.date)
  }

  const new_exercise = {
    _id: user[0]._id,
    username: user[0].username,
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: date.toDateString()
  }
  excercises.push(new_exercise)
  res.send(new_exercise)
})

app.get("/api/users/:id/logs", (req, res) => {
  const limit = parseInt(req.query.limit) || 0

  let data = excercises.filter(value => value._id === req.params.id)
  if (data.length === 0) {
    return res.json({ error: "Cannot find data with that ID" })
  }
  
  let response = {}
  response["_id"] = data[0]._id
  response["username"] = data[0].username

  // Filter using to and from query
  if (req.query.to && req.query.from) {
    const to = new Date(new Date(req.query.to).toDateString())
    const from = new Date(new Date(req.query.from).toDateString())
    data = data.filter(val => from.getTime() <= new Date(val.date).getTime() && new Date(val.date).getTime() <= to.getTime())
    response['from'] = from.toDateString()
    response['to'] = to.toDateString()
  }

  // Splice Array based on limit 
  if (limit > 0) {
    data = data.slice(0, limit)
  }

  response["count"] = data.length
  response["log"] = data.map((val) => {
    return {
      description: val.description,
      duration: val.duration,
      date: val.date
    }
  })
  res.send(response)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
