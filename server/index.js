import express from 'express';
import mysql2 from 'mysql2';
import cors from 'cors';
import jwt ,{decode } from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app=express();
app.use(express.json({limit:"30mb",extended:true}));
app.use(express.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use(cookieParser());


const db=mysql2.createConnection({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port:process.env.MYSQL_PORT,
    database:process.env.MYSQL_DATABASE
})


app.listen(5000,()=>{
    console.log("Server Listening to port 5000");
})


app.post('/auth', (req, res) => {
    const { name, email, password } = req.body;
    const values = [name, email, password].map(val => (val !== undefined ? val : null));

    

    db.execute(
        'INSERT INTO Auth (Name,Email,Password) VALUES (?, ?, ?)',
        values,
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(201).json({ Status: "Success" });
            
        }
    );
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
  console.log(email,password)
    db.query('SELECT * FROM Auth WHERE email = ?', [email], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ Error: 'Internal Login Error' });
      }
      
      if (data.length > 0) {
        const user = data[0];
        console.log(user);
        if (password === user.Password) {
          const token = jwt.sign({ email: user.Email, name: user.Name }, 'test', { expiresIn: '1h' });
          const { password, ...userData } = user;
          res
            .cookie('AccessToken', token, {
              httpOnly: true,
              secure: true,
            })
            .status(200)
            .json({ success: true, Status: 'Success', token, data: userData });
        } else {
          return res.json({ success: false, Error: 'Password not matched' });
        }
      } else {
        return res.json({ Error: 'Email Not Existed' });
      }
    });
  });
  


  app.get('/verifyToken', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'test', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json({ message: 'Token verified' });
    });

    
});
app.get("/singleUser", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);
    // console.log(decodedToken)
    const sql = 'SELECT * FROM Auth WHERE email = ?';
    db.query(sql, [decodedToken.email], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ Error: "Internal Login Error" });
        }
        if (data.length > 0) {
            res.send(data[0]);
        } else {
            res.status(404).json({ Error: "User Not Found" });
        }
    });
});


app.post('/task', (req, res) => {
    console.log(req.body)
    const { userID, title, desc } = req.body;
    console.log('Received data:', { userID, title, desc });

    // Check if userID is undefined or null
    if (userID === undefined || userID === null) {
        return res.status(400).json({ message: 'UserID cannot be null or undefined' });
    }

    const values = [userID, title, desc].map(val => (val !== undefined ? val : null));

    db.execute(
        'INSERT INTO Task (UserID, Title, `Desc`) VALUES (?, ?, ?)',
        values,
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.status(201).json({ status: 'Success' });
        }
    );
});


app.get('/claimedTask/:userId', (req, res) => {
    const userId = req.params.userId;
   
    
    const sql = `
    SELECT t.S_no, t.Title,t.Desc ,t.Status FROM Task t JOIN Auth a ON t.UserID = a.S_no WHERE a.S_no = ? ;
    `;

    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ Error: "Internal Login Error" });
        }
        if (data.length > 0) {
            res.send(data);
        } else {
            res.status(404).json({ Error: "User Not Found" });
        }
    });
});

app.put('/task/:taskId/complete', (req, res) => {
    const taskId = req.params.taskId;

    const sql = 'UPDATE Task SET `Status` = ? WHERE S_no = ?';
    db.query(sql, ['Complete', taskId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ Error: "Internal Server Error" });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ status: 'Success' });
        } else {
            res.status(404).json({ Error: "Task Not Found" });
        }
    });
});

app.delete('/Deletetask/:s_no', (req, res) => {
    const s_no = req.params.s_no;
    const sql = 'DELETE FROM Task WHERE S_no = ?';

    db.query(sql, [s_no], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ Error: "Internal Server Error" });
        }
        if (result.affectedRows > 0) {
            res.json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ Error: "Task not found" });
        }
    });
});

app.put('/task/:s_no', (req, res) => {
    const { s_no } = req.params;
    const { title, desc } = req.body;

    const sql = 'UPDATE Task SET Title = ?, `Desc` = ? WHERE S_no = ?';
    db.query(sql, [title, desc, s_no], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ status: 'Success' });
    });
});