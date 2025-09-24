const express = require('express');
const app = express();

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const path = require('path');
const { request } = require('http');
const { error } = require('console');
app.use(express.json());
let db;

let dbPath = path.join(__dirname, 'users.db');

const dbConnectionServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log('Server Running at local host 3000');
    });
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

dbConnectionServer();
//New User
app.post('/users', async (request, response) => {
  const { first_name, last_name, email, department } = request.body;
  if (!first_name || !last_name || !email || !department) {
    return response.status(400).send('All Fields are requierd');
  }
  try {
    const emailExistQuery = `SELECT * FROM Users where email=?;`;
    const emailExists = await db.get(emailExistQuery, [email]);
    if (emailExists) {
      return response.status(400).json({ error: 'User already Exists' });
    }
    const insertQuery = `INSERT INTO Users (first_name, last_name, email, department) VALUES (?, ?, ?, ?);
  `;
    const dbResponse = await db.run(insertQuery, [
      first_name,
      last_name,
      email,
      department,
    ]);
    return response.status(200).send('New User Inserted');
  } catch (err) {
    return response.status(400).json({ error: `${err.message}` });
  }
});

//View all Users
app.get('/users', async (request, response) => {
  const getAllUsersQuery = `SELECT * FROM Users;`;
  const dbResponse = await db.all(getAllUsersQuery);
  if (!dbResponse) {
    return response.status(200).send('No User Exist');
  }
  return response.status(200).send(dbResponse);
});

//View One user

app.get('/users/:id', async (request, response) => {
  const { id } = request.params;
  const idExistsQuery = `SELECT * FROM Users WHERE id=?;`;
  const idExists = await db.get(idExistsQuery, [id]);
  if (!idExists) {
    return response.status(400).json({ error: 'User does not exist' });
  }
  return response.send(idExists);
});

//Edit User

app.put('/users/:id', async (request, response) => {
  const { id } = request.params;
  const { first_name, last_name, department } = request.body;
  const idExistsQuery = `SELECT * FROM Users WHERE id=?;`;
  const idExists = await db.get(idExistsQuery, [id]);
  if (!idExists) {
    return response.status(400).json({ error: 'User Doesnot Exist' });
  }
  try {
    const updateQuery = `
  UPDATE Users SET first_name =?, last_name=?, department =? WHERE id=?;`;
    const updateResponse = await db.run(updateQuery, [
      first_name,
      last_name,
      department,
      id,
    ]);
    return response.status(200).json({ success: true, id: id });
  } catch (err) {
    return response.status(400).json(`Error: ${err.message}`);
  }
});

//DELETE

app.delete('/users/:id', async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const userExistsQueries = `SELECT * FROM Users where id=?;`;
  const userExists = await db.get(userExistsQueries, [id]);
  if (!userExists) {
    return response.status(400).json({ error: 'User not Exists' });
  }
  try {
    const deleteQuery = `DELETE FROM Users WHERE id=?;`;
    const dbResponse = await db.run(deleteQuery, [id]);
    return response.status(200).send('Deleted sucessfully');
  } catch (err) {
    return response.status(400).json({ error: `${err.message}` });
  }
});
