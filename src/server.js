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

// student3 table 
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

// Route for the main index page
app.get('/', function (req, res) {
  console.log('GET called on /')
  res.render('index');
})


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

// Student 2 //

app.get('/student2', function (req, res) {
  const local = { comments: [] }
  db.each('SELECT * FROM student2 ORDER BY id LIMIT 5;', function (err, row) {
      if (err) {
          console.log(err)
      } else {
          local.comments.push({ id: row.id, comment: row.comment })
      }
  }, function (err, numrows) {
      if (!err) {
          res.render('student2', local)
      } else {
          console.log(err)
      }
  })
  console.log('GET called for student2')
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
  console.log('Comments page GET called for student2')
})

app.post('/s2add', function (req, res) {
  console.log('adding comment: ' + req.body.id)
  const stmt = db.prepare('INSERT INTO student2 (comment) VALUES (?)')
  stmt.run(req.body.comment)
  stmt.finalize()
})

app.post('/s2edit', function (req, res) {
  console.log('editing comment: ' + req.body.id)
  const stmt = db.prepare('UPDATE student2 SET comment = (?) WHERE id = (?)')
  stmt.run(req.body.comment, req.body.id)
  stmt.finalize()
  console.log('edited comment')
})

app.post('/s2delete', function (req, res) {
  console.log('deleting comment')
  const stmt = db.prepare('DELETE FROM student2 where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  console.log('deleted comment')
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
