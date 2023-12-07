//Garrett Goodney & Ben Utter
//Database Systems G01
//12/7/23
//DBMS Final Project

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); //needed to work on firefox (says in console)

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());

//sql login info
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYsqlpass123*',
    database: 'dbms',
});

//connect to db
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

//register
app.post('/register', (req, res) => {
    const userData = req.body;
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const values = [userData.username, userData.password];

    db.query(insertUserQuery, values, (err, result) => {
        console.log('user registered');
        res.json({ message: 'user registered' });
    });
});


//login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const getUserQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const values = [username, password];

    db.query(getUserQuery, values, (err, results) => {
        if (results.length > 0) {
            const user = results[0];
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

//new task
app.post('/addTask', (req, res) => {
    const taskData = req.body;
    const userId = req.headers['user-id'];

    const insertTaskQuery = 'INSERT INTO tasks (taskText, taskTime, taskDay, userId) VALUES (?, ?, ?, ?)';
    const values = [taskData.taskText, taskData.taskTime, taskData.taskDay, userId];

    db.query(insertTaskQuery, values, (err, result) => {
        console.log('task saved');
        res.json({ message: 'task saved' });
    });
});

//get tasks
app.get('/getTasks', (req, res) => {
    const userId = req.query.userId;
    const getAllTasksQuery = 'SELECT * FROM tasks WHERE userId = ?';
    
    db.query(getAllTasksQuery, [userId], (err, results) => {
        res.json(results);
    });
});


//delete task
app.delete('/deleteTask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const deleteTaskQuery = 'DELETE FROM tasks WHERE id = ?';
    db.query(deleteTaskQuery, [taskId], (result) => {
        console.log('task deleted');
        res.json({ message: 'task deleted' });
    });
});

//edit task
app.put('/updateTask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const { taskText, taskTime, taskDay } = req.body;
    const updateTaskQuery = 'UPDATE tasks SET taskText = ?, taskTime = ?, taskDay = ? WHERE id = ?';
    const values = [taskText, taskTime, taskDay, taskId];

    db.query(updateTaskQuery, values, (err, result) => {
        console.log('task updated');
        res.json({ message: 'task updated' });
    });
});

app.listen(port, () => {
    console.log(`nodeJS running on port: ${port}`);
});