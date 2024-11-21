import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE student3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL)`)

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})


// Student 1 //
app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

// Student 2 //

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})


// Student 3 //

// get
app.get('/student3', function (req, res) {
  const local = { comments: [] };
  db.each('SELECT * FROM student1', function (err, row) {
      if (err) {
          console.log('Error fetching comments:', err);
      } else {
          local.comments.push({ id: row.id, comment: row.comment });
      }
  }, function (err) {
      if (!err) {
          res.render('student1', local);
      } else {
          console.log('Error in callback:', err);
      }
  })
})
// getcomments

app.get('/s3comments', function (req, res) {
  const local = { comments: [] };
  db.each('SELECT id, comment FROM student3', function (err, row) {
      if (err) {
          console.log('Error fetching tasks:', err);
      } else {
          local.comments.push({ id: row.id, comment: row.comment });
      }
  }, function (err) {
      if (!err) {
          res.render('s3comments', local);
      } else {
          console.log('Error in callback:', err);
      }
  })
})

app.post('/s3add', function (req, res) {
  const task = req.body.comment;
  const intoTask = db.prepare('INSERT INTO todo (comment) VALUES (?)');
  intoTask.run(task);
  intoTask.finalize();
  res.redirect('/');
})

app.post('/s3edit', function (req, res) {
  const task = req.body.task;
  const task1 = req.body.id;
  console.log('editing comment: ' + task1);
  const intoTask = db.prepare('INSERT INTO todo (task) VALUES (?)');
  intoTask.run(task, task1);
  intoTask.finalize();
  console.log('edited comment : ' + task);
  res.redirect('/');
})


// deleting
app.post('/s3delete', function (req, res) {
  console.log('deleting: '+ req.body.comment);
  const taskId = req.body.id;
  const intoTask = db.prepare('DELETE FROM student3 WHERE id = ?');
  intoTask.run(taskId);
  intoTask.finalize();
  console.log('Comment deleted');
  res.redirect('/');
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
