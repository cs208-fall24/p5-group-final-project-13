import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in-memory SQLite database
const db = new sqlite3.Database(':memory:')

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

// Create the comments table
db.serialize(() => {
  db.run("CREATE TABLE comments (id INTEGER PRIMARY KEY, text TEXT)")
})

// Seed some initial comments into the database (for testing)
db.serialize(() => {
  const stmt = db.prepare("INSERT INTO comments (text) VALUES (?)")
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

// Route for student1 page
app.get('/student1', function (req, res) {
  console.log('GET called for student1')
  res.render('student1')
})

// Route for student2 page (updated to fetch comments)
app.get('/student2', function (req, res) {
  console.log('GET called for student2')

  // Fetch up to 5 random comments from the database for student2
  db.all("SELECT text FROM comments ORDER BY RANDOM() LIMIT 5", function(err, rows) {
    if (err) {
      console.error(err)
      res.status(500).send("Error retrieving comments.")
    } else {
      // Pass the comments to the student2 Pug template
      res.render('student2', { comments: rows })
    }
  })
})

// Route for student3 page
app.get('/student3', function (req, res) {
  console.log('GET called for student3')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
