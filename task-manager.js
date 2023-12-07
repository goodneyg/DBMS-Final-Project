//Garrett Goodney & Ben Utter
//Database Systems G01
//12/7/23
//DBMS Final Project


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); //required to work on firefox (not sure why but shows in console if not required)

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());

//sql info goes here
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYsqlpass123*',
    database: 'dbms',
});

db.connect(() => {
    console.log('Connected to MySQL');
});

// Register a new user (INSERT INTO)
app.post('/register', (req, res) => {
    const userData = req.body;
    const insertUser = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [userData.username, userData.password];
    db.query(insertUser, values, () => {
        res.json({ message: 'registration complete' });
    });
});


// Login (SELECT)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const getUserQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const values = [username, password];

    db.query(getUserQuery, values, (err, results) => {
        if (err) {
            console.error('Error logging in', err);
            res.status(500).json({ error: 'Error logging in' });
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});


// Add a task (SELECT)
app.post('/addTask', (req, res) => {
    const taskData = req.body;
    const userId = req.headers['user-id'];
    const insertTask = 'INSERT INTO tasks (taskText, taskTime, taskDay, userId) VALUES (?, ?, ?, ?)';
    const values = [taskData.taskText, taskData.taskTime, taskData.taskDay, userId];
    db.query(insertTask, values, () => {
        res.json({ message: 'task added' });
    });
});


// Get all tasks for a specific user (SELECT)
app.get('/getTasks', (req, res) => {
    const userId = req.query.userId;
    const getAllTasks = 'SELECT * FROM tasks WHERE userId = ?';
    db.query(getAllTasks, [userId], () => {
        res.json({ message: 'tasks recieved successfully' });
    });
});


// Delete a task (DELETE)
app.delete('/deleteTask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const deleteTask = 'DELETE FROM tasks WHERE id = ?';
    db.query(deleteTask, [taskId], () => {
        res.json({ message: 'task deleted successfully' });
    });
});

// Edit a task (UPDATE)



app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});
