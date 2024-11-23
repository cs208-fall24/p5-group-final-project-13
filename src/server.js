import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

db.run(`CREATE TABLE student3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`)


db.run('DELETE FROM student3', (err) => {
  if (err) {
    console.log(err);
  }
});

const app = express();
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  console.log('GET called on /')
  res.render('index');
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
app.get('/student3', function (req, res) {
  const local = { comments: [] };
  db.all('SELECT * FROM student3 LIMIT 5', function (err, rows) {
    if (err) {
      console.log('Error fetching comments:', err);
      return res.status(500).send('Error fetching comments');
    }

    rows.forEach(row => {
      local.comments.push({ id: row.id, comment: row.comment });
    });

    res.render('student3/index', local);
  });
});

app.get('/s3comments', function (req, res) {
  const local = { comments: [] };
  db.all('SELECT * FROM student3 LIMIT 5', function (err, rows) {
    if (err) {
      console.log('Error fetching comments:', err);
      return res.status(500).send('Error fetching comments');
    }
    rows.forEach(row => {
      local.comments.push({ id: row.id, comment: row.comment });
    });
    
    res.render('s3comments/index', local);
  });
});

app.post('/s3add', function (req, res) {
  const task = req.body.comment;
  const intoTask = db.prepare('INSERT INTO student3 (comment) VALUES (?)');
  intoTask.run(task);
  intoTask.finalize();
  res.redirect('/s3comments');
});

app.post('/s3edit', function (req, res) {
  const taskId = req.body.id;
  const taskComment = req.body.comment;
  
  console.log(`Editing comment with ID ${taskId}: ${taskComment}`);
  
  const stmt = db.prepare('UPDATE student3 SET comment = ? WHERE id = ?');
  stmt.run(taskComment, taskId, function (err) {
    if (err) {
      console.log('Error updating comment:', err);
      return res.status(500).send('Error updating comment');
    }
    res.redirect('/s3comments');
  });
  stmt.finalize();
});

app.post('/s3delete', function (req, res) {
  const taskCmt = req.body.comment;
  const taskId = req.body.id;
  console.log('Deleting comment ID: ', taskId);
  const intoTask = db.prepare('DELETE FROM student3 WHERE id = ?');
  intoTask.run(taskId);
  intoTask.finalize();
  console.log('Comment deleted: ', taskCmt);
  res.redirect('/s3comments');
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
