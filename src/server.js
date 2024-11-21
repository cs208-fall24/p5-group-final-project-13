import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE student1 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`)

  db.run(`CREATE TABLE student2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

// Seed some initial comments into the database (for testing)
db.serialize(() => {
  const stmt = db.prepare("INSERT INTO student2 (comment) VALUES (?)")
  stmt.run('This is an amazing program!')
  stmt.run('I love learning about basket weaving underwater.')
  stmt.run('The best major ever!')
  stmt.run('I can\'t wait to dive in and start weaving.')
  stmt.run('This is a unique and challenging field of study.')
  stmt.finalize()
})

// Route for the main index page
app.get('/', function (req, res) {
  console.log('GET called for index')
  res.render('index')
})

/////////////// 
// Student 1 //

app.get('/student1', function (req, res) {
  const local = { comments: [] }
  db.each('SELECT * FROM student1 ORDER BY id LIMIT 5;', function (err, row) {
      if (err) {
          console.log(err)
      } else {
          local.comments.push({ id: row.id, comment: row.comment })
      }
  }, function (err, numrows) {
      if (!err) {
          res.render('student1', local)
      } else {
          console.log(err)
      }
  })
  console.log('GET called for student1')
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
  console.log('Comments page GET called for student1')
})

app.post('/s1add', function (req, res) {
  console.log('adding comment: ' + req.body.id)
  const stmt = db.prepare('INSERT INTO student1 (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
})

app.post('/s1edit', function (req, res) {
  console.log('editing comment: ' + req.body.id)
  const stmt = db.prepare('UPDATE student1 SET comment = (?) WHERE id = (?)')
  stmt.run(req.body.comment, req.body.id)
  stmt.finalize()
  console.log('edited comment')
})

app.post('/s1delete', function (req, res) {
  console.log('deleting comment')
  const stmt = db.prepare('DELETE FROM student1 where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  console.log('deleted comment')
})

    ////////////////////
    //   student 2    //

    app.get('/student2', function (req, res) {
      console.log('GET called for student2')
      res.render('student2')
    })
    
    app.get('/s2comments', function (req, res) {
      const local = { comments: [] }
      db.each('SELECT id, comment FROM student2', function (err, row) {
          if (err) {
              console.log(err)
          } else {
              local.comments.push({ id: row.id, comment: row.comment })
          }
      }, function (err, numrows) {
          if (!err) {
              res.render('s2comments', local)
          } else {
              console.log(err)
          }
      })
      console.log('GET called')
    })
    
    app.post('/s2add', function (req, res) {
      console.log('adding comment: ' + req.body.comment)
      const stmt = db.prepare('INSERT INTO student2 (comment) VALUES (?)')
      stmt.run(req.body.comment)
      stmt.finalize()
    })
    
    app.post('/s2delete', function (req, res) {
      console.log('deleting comment')
      const stmt = db.prepare('DELETE FROM student2 where id = (?)')
      stmt.run(req.body.id)
      stmt.finalize()
      console.log('deleted comment')
    
    })


///////////////
// Student 3 //


app.get('/student3', function (req, res) {
  console.log('GET called for student3')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
