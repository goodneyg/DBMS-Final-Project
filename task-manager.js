const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); //cors is needed to work on firefox
app.use(bodyParser.json());

//SQL LOG ON INFO
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MYsqlpass123*',
    database: 'dbms',
});

db.connect((err) => {
    console.log('Connected to MySQL');
});

//ADD A TASK
app.post('/addTask', (req, res) => {
    const taskData = req.body;
    console.log('new task:', taskData);
    const insertTaskQuery = 'INSERT INTO tasks (taskText, taskTime, taskDay) VALUES (?, ?, ?)';
    const values = [taskData.taskText, taskData.taskTime, taskData.taskDay];
    db.query(insertTaskQuery, values, (result) => {
        console.log('Task inserted into database with ID:', result.insertId);
        res.json({message: 'recieved'});
    });
});

//GET ALL TASKS
app.get('/getTasks', (req, res) => {
    const getAllTasksQuery = 'SELECT * FROM tasks';
    db.query(getAllTasksQuery, (results) => {
        res.json(results);
    });
});

//DELETE A TASK
app.delete('/deleteTask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const deleteTaskQuery = 'DELETE FROM tasks WHERE id = ?';
    db.query(deleteTaskQuery, [taskId], (result) => {
        console.log('task deleted:', taskId);
        res.json({message: 'Task deleted successfully'});
    });
});

app.listen(port, () => {
    console.log(`Server is running: ${port}`);
});
