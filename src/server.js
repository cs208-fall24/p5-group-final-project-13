import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE student1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

/////////////// 
// Student 1 //

app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/s1comments', function (req, res) {
  const local = { comments: [] }
  db.each('SELECT id, comment FROM student1', function (err, row) {
      if (err) {
          console.log(err)
      } else {
          local.comments.push({ id: row.id, comment: row.comment })
      }
  }, function (err, numrows) {
      if (!err) {
          res.render('s1comments', local)
      } else {
          console.log(err)
      }
  })
  console.log('GET called')
})

app.post('/s1add', function (req, res) {
  console.log('adding comment: ' + req.body.comment)
  const stmt = db.prepare('INSERT INTO student1 (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
})

app.post('/s1delete', function (req, res) {
  console.log('deleting comment')
  const stmt = db.prepare('DELETE FROM student1 where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  console.log('deleted comment')

})

///////////////
// Student 2 //

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})


///////////////
// Student 3 //


app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
