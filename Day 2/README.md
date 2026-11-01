# Day 02 – MongoDB Introduction and Setup

> **Learning Goal:** Understand MongoDB fundamentals, architecture, database tools, BSON, ObjectId, and learn how to create your first database and collection.

---

## 📚 Table of Contents

1. [What is MongoDB?](#1-what-is-mongodb)
2. [SQL vs NoSQL](#2-sql-vs-nosql)
3. [MongoDB vs MySQL](#3-mongodb-vs-mysql)
4. [MongoDB Architecture](#4-mongodb-architecture)
5. [JSON vs BSON](#5-json-vs-bson)
6. [MongoDB Atlas](#6-mongodb-atlas)
7. [MongoDB Compass](#7-mongodb-compass)
8. [MongoDB Shell (mongosh)](#8-mongodb-shell-mongosh)
9. [Creating Database and Collection](#9-creating-database-and-collection)
10. [ObjectId and _id](#10-objectid-and-_id)
11. [Important MongoDB Commands](#11-important-mongodb-commands)
12. [Interview Questions](#12-interview-questions)
13. [Practical Exercises](#13-practical-exercises)
14. [Key Takeaways](#14-key-takeaways)

---

## 1. What is MongoDB?

MongoDB is an open-source, document-oriented NoSQL database that stores information in BSON (Binary JSON) documents.

### Important Characteristics

- Document-oriented database.
- Flexible document structure.
- Stores data in BSON format.
- Supports embedded documents and arrays.
- Supports indexing and aggregation.
- Supports replication and sharding.
- Supports transactions.

### Example

```json
{
  "_id": "U101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "age": 21,
  "skills": [
    "JavaScript",
    "React",
    "MongoDB"
  ],
  "address": {
    "city": "Kolkata",
    "state": "West Bengal"
  }
}
```

### Where is MongoDB Used?

- E-commerce applications.
- Social media platforms.
- Content management systems.
- Real-time analytics.
- Product catalogs.
- Expense tracking applications.
- Applications with evolving data structures.

**Interview Answer:**

MongoDB is an open-source, document-oriented NoSQL database that stores data in BSON documents and supports flexible data models.

---

## 2. SQL vs NoSQL

### What is SQL?

SQL stands for Structured Query Language.

SQL databases generally store information in tables consisting of rows and columns.

**Examples:**

- MySQL
- PostgreSQL
- Microsoft SQL Server
- Oracle Database

Example of a SQL table:

| id | name | email |
|---|---|---|
| 1 | Rahul | rahul@gmail.com |
| 2 | Priya | priya@gmail.com |
| 3 | Amit | amit@gmail.com |

### What is NoSQL?

NoSQL databases use data models other than the traditional relational table model.

MongoDB is a document-oriented NoSQL database.

Example:

```json
{
  "_id": 1,
  "name": "Rahul",
  "email": "rahul@gmail.com"
}
```

Another document can have additional fields:

```json
{
  "_id": 2,
  "name": "Priya",
  "email": "priya@gmail.com",
  "skills": [
    "JavaScript",
    "Python"
  ]
}
```

### SQL vs NoSQL Comparison

| Feature | SQL | NoSQL |
|---|---|---|
| Structure | Tables | Depends on database type |
| Data storage | Rows and columns | Documents in MongoDB |
| Schema | Usually predefined | Often flexible |
| Relationships | Foreign keys and joins | Embedding and referencing |
| Scaling | Vertical and horizontal approaches | Horizontal scaling is common |
| Examples | MySQL, PostgreSQL | MongoDB, Cassandra |

### When to Use SQL?

- Banking systems.
- Financial applications.
- Complex relational data.
- Applications requiring relational constraints.

### When to Use MongoDB?

- Product catalogs.
- Applications with nested data.
- Applications with evolving data structures.
- Applications that benefit from document-based storage.

**Important:** NoSQL does not mean there is no schema. MongoDB supports flexible schemas and validation rules.

---

## 3. MongoDB vs MySQL

| Feature | MongoDB | MySQL |
|---|---|---|
| Database type | NoSQL | SQL |
| Storage | BSON documents | Tables |
| Schema | Flexible | Defined relational schema |
| Relationships | Embedding and referencing | Foreign keys |
| Query language | MongoDB Query API | SQL |
| Joins | `$lookup` | `JOIN` |
| Transactions | Supported | Supported |
| Scaling | Supports sharding | Multiple scaling approaches |

### Example: Creating a Users Table

**MySQL:**

```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);
```

**MongoDB document:**

```json
{
  "_id": 1,
  "name": "Rahul",
  "email": "rahul@gmail.com"
}
```

### Why Choose MongoDB Instead of MySQL?

MongoDB is useful when an application benefits from flexible document structures, nested data, or evolving data models.

MySQL is useful when relational data, constraints, and complex relational queries are central to the application.

**Important:** Neither database is universally better. The choice depends on application requirements.

---

## 4. MongoDB Architecture

MongoDB follows a client-server architecture.

### A. MongoDB Server (mongod)

`mongod` is the main MongoDB database server process.

Responsibilities:

- Accepting database connections.
- Processing database operations.
- Managing collections and documents.
- Handling queries.
- Managing data storage.
- Enforcing database permissions.

### B. MongoDB Shell (mongosh)

`mongosh` is an interactive JavaScript-based command-line interface used to communicate with MongoDB.

Example:

```javascript
show dbs
```

This displays the databases available to your connected account.

### How MongoDB Works

```text
Developer
    |
    v
MongoDB Shell (mongosh)
    |
    v
MongoDB Server (mongod)
    |
    v
Database
    |
    v
Collections
    |
    v
Documents
```

### MongoDB Architecture in MERN Stack

```text
React Frontend
      |
      v
Express + Node.js Backend
      |
      v
MongoDB Driver / Mongoose
      |
      v
MongoDB Server
      |
      v
Database
```

The frontend normally communicates with the backend API, not directly with MongoDB.

### Important Architecture Concepts

**Replica Set:**

A group of MongoDB servers that maintain copies of the same data to provide redundancy and high availability.

**Sharding:**

A technique used to distribute data across multiple servers to support horizontal scaling.

---

## 5. JSON vs BSON

### What is JSON?

JSON stands for JavaScript Object Notation.

It is a text-based format used for representing and exchanging structured data.

Example:

```json
{
  "name": "Rahul",
  "age": 21,
  "isStudent": true
}
```

### What is BSON?

BSON stands for Binary JSON.

It is a binary-encoded serialization format used by MongoDB to represent and store documents.

MongoDB uses BSON because it supports additional data types and useful encoding characteristics.

### JSON vs BSON Comparison

| Feature | JSON | BSON |
|---|---|---|
| Format | Text-based | Binary-encoded |
| Readability | Human-readable | Not directly human-readable |
| Data types | Limited | Richer data types |
| Date | No native date type | Native Date type |
| ObjectId | No native ObjectId type | ObjectId supported |
| Binary data | Limited representation | Binary type supported |
| Usage | Data exchange | MongoDB document representation |

### Example of JSON

```json
{
  "name": "Rahul",
  "age": 21
}
```

### Example of BSON-Supported Values

```javascript
{
  name: "Rahul",
  age: 21,
  createdAt: new Date(),
  userId: ObjectId("507f1f77bcf86cd799439011")
}
```

### Important BSON Data Types

| Type | Example |
|---|---|
| String | `"Rahul"` |
| Int32 | `21` |
| Int64 | `NumberLong("9000000000")` |
| Double | `99.5` |
| Boolean | `true` |
| Date | `new Date()` |
| ObjectId | `ObjectId()` |
| Array | `["React", "Node.js"]` |
| Embedded Document | `{ city: "Kolkata" }` |
| Decimal128 | `NumberDecimal("99.99")` |
| Null | `null` |
| Binary | Binary data |

**Interview Question: Why does MongoDB use BSON instead of JSON?**

BSON supports additional data types such as ObjectId, Date, and binary data. It also provides a binary encoding format suitable for MongoDB document operations.

---

## 6. MongoDB Atlas

MongoDB Atlas is a managed cloud database platform that allows developers to create and manage MongoDB databases without maintaining the database server themselves.

Official Website: https://www.mongodb.com/products/platform/atlas-database

### Important Concepts

**Cluster:**

A MongoDB deployment that hosts databases and provides database services.

**Database User:**

A separate account used by applications or database clients to authenticate with MongoDB.

**IP Access List:**

Controls which IP addresses can connect to your Atlas deployment.

**Connection String:**

A URL-like string used by applications and tools to connect to MongoDB.

### MongoDB Atlas Setup

1. Create an account on MongoDB Atlas.
2. Create a database deployment.
3. Create a database user.
4. Configure network access.
5. Get the connection string.
6. Connect using MongoDB Compass or mongosh.

### Example Connection String

```text
mongodb+srv://username:password@cluster0.example.mongodb.net/myDatabase
```

### Connection String Components

| Component | Meaning |
|---|---|
| `mongodb+srv://` | MongoDB connection protocol using DNS SRV |
| `username` | Database username |
| `password` | Database password |
| `cluster0...` | Cluster address |
| `myDatabase` | Database name |

### Security Rules

- Never upload your real database password to GitHub.
- Store connection strings in environment variables.
- Add `.env` to `.gitignore`.
- Use appropriate database permissions.
- Restrict network access.

---

## 7. MongoDB Compass

MongoDB Compass is a graphical user interface (GUI) that allows developers to interact with MongoDB databases visually.

Official Website: https://www.mongodb.com/products/tools/compass

### Features

- View databases.
- Create collections.
- View documents.
- Insert documents.
- Update documents.
- Delete documents.
- Run queries.
- Build aggregation pipelines.
- Inspect indexes.
- Explore document structures.

### When to Use Compass?

Use MongoDB Compass when:

- You want to inspect your database visually.
- You want to understand document structures.
- You want to debug database records.
- You want to test queries.
- You want to explore collections.

**Recommendation:** Use both MongoDB Compass and mongosh. Compass helps visualize data, while mongosh helps you become comfortable writing database commands.

---

## 8. MongoDB Shell (mongosh)

`mongosh` is an interactive JavaScript-based command-line tool used to communicate with MongoDB.

Official Documentation: https://www.mongodb.com/docs/mongodb-shell/

### Starting MongoDB Shell

For a local MongoDB server:

```bash
mongosh
```

For MongoDB Atlas:

```bash
mongosh "YOUR_MONGODB_CONNECTION_STRING"
```

### Important mongosh Commands

| Command | Purpose |
|---|---|
| `show dbs` | Display available databases |
| `show collections` | Display collections in current database |
| `use databaseName` | Switch database |
| `db` | Display current database |
| `db.stats()` | Display database statistics |
| `db.createCollection()` | Create a collection |
| `db.dropDatabase()` | Delete current database |

---

## 9. Creating Database and Collection

Let's create our first MongoDB database.

### Step 1: Open MongoDB Shell

```bash
mongosh
```

### Step 2: Check Available Databases

```javascript
show dbs
```

### Step 3: Create or Switch Database

```javascript
use StudentDB
```

This switches the current database context to `StudentDB`.

**Important:** This does not necessarily create a database on the server immediately.

### Step 4: Create Collection

```javascript
db.createCollection("students")
```

Expected result:

```javascript
{ ok: 1 }
```

### Step 5: Display Collections

```javascript
show collections
```

Expected output:

```text
students
```

### Step 6: Check Current Database

```javascript
db
```

Expected output:

```text
StudentDB
```

### Step 7: Check Database Statistics

```javascript
db.stats()
```

This displays database information such as collection count, object count, and storage statistics.

### Step 8: Delete a Collection

```javascript
db.students.drop()
```

This removes the `students` collection.

### Step 9: Delete a Database

```javascript
db.dropDatabase()
```

This deletes the current database.

**Warning:** These are destructive operations. Never execute them on a database containing important data.

### Important Concept: Does MongoDB Create Databases Automatically?

Yes. MongoDB can create a database and collection automatically when you first insert data into a previously nonexistent collection.

Example:

```javascript
use CollegeDB

db.students.insertOne({
  name: "Rahul",
  age: 21
})
```

The database and collection are created when the write succeeds.

---

## 10. ObjectId and _id

Every MongoDB document normally has a unique `_id` field.

If we don't provide an `_id` ourselves, MongoDB automatically generates one when inserting a document.

Example:

```javascript
{
  _id: ObjectId("6905a1b2c3d4e5f678901234"),
  name: "Rahul",
  age: 21
}
```

Here:

- `_id` is the field name.
- `ObjectId()` is the BSON data type.
- The value uniquely identifies the document.

### What is ObjectId?

ObjectId is a 12-byte BSON identifier commonly used as the default `_id` value in MongoDB.

### ObjectId Structure

| Component | Size |
|---|---|
| Timestamp | 4 bytes |
| Random value | 5 bytes |
| Counter | 3 bytes |
| **Total** | **12 bytes** |

### Why Does MongoDB Use ObjectId?

- Provides a convenient unique identifier.
- Can be generated without asking the database to allocate an ID first.
- Contains a timestamp component.
- Supports efficient document identification.

### Can We Use Our Own _id?

Yes.

Example:

```javascript
{
  _id: 101,
  name: "Rahul",
  age: 21
}
```

You can use strings, numbers, ObjectIds, and other supported BSON types as `_id` values.

However, `_id` must be unique within its collection.

### Generate ObjectId Manually

```javascript
new ObjectId()
```

### Get Timestamp from ObjectId

```javascript
const id = new ObjectId();

id.getTimestamp();
```

This returns the timestamp embedded in the ObjectId.

**Important:** ObjectIds are approximately time-ordered, but they should not be treated as a perfect global chronological sequence. Use an explicit date field when your application needs reliable timestamps.

### _id vs ObjectId

| _id | ObjectId |
|---|---|
| Field name | BSON data type |
| Identifies a document | One common value used for `_id` |
| Required in standard MongoDB documents | Automatically generated by default if omitted |

---

## 11. Important MongoDB Commands

### Database Commands

```javascript
// Show all databases
show dbs

// Switch database
use StudentDB

// Show current database
db

// Show collections
show collections

// Database statistics
db.stats()
```

### Collection Commands

```javascript
// Create collection
db.createCollection("students")

// Drop collection
db.students.drop()

// Show collections
show collections
```

### ObjectId Commands

```javascript
// Generate ObjectId
new ObjectId()

// Store ObjectId
const myId = new ObjectId()

// Get timestamp
myId.getTimestamp()
```

### Database Deletion

```javascript
// Delete current database
db.dropDatabase()
```

**Remember:** `drop()` and `dropDatabase()` permanently remove the targeted database objects. Use them only in a safe practice environment.

---

## 12. Interview Questions

### Q1. What is MongoDB?

MongoDB is an open-source, document-oriented NoSQL database that stores data in BSON documents.

### Q2. What is the difference between SQL and NoSQL?

SQL databases generally use relational tables, whereas NoSQL databases support different data models, such as documents, key-value pairs, and graphs.

### Q3. What is BSON?

BSON is a binary-encoded serialization format used by MongoDB to represent documents.

### Q4. Why does MongoDB use BSON?

BSON supports additional data types such as ObjectId, Date, and Decimal128 and provides a binary encoding format suitable for MongoDB operations.

### Q5. What is MongoDB Atlas?

MongoDB Atlas is a managed cloud database platform used to deploy and manage MongoDB databases.

### Q6. What is MongoDB Compass?

MongoDB Compass is a graphical interface that allows developers to explore and manage MongoDB databases.

### Q7. What is mongosh?

It is an interactive JavaScript-based command-line shell used to communicate with MongoDB.

### Q8. What is the difference between mongod and mongosh?

- `mongod` is the MongoDB database server process.
- `mongosh` is the command-line client used to interact with the server.

### Q9. What is ObjectId?

ObjectId is a 12-byte BSON identifier commonly used as the default `_id` value in MongoDB documents.

### Q10. Can we create our own _id?

Yes. We can provide our own unique `_id` value when inserting a document.

### Q11. What is a Replica Set?

A Replica Set is a group of MongoDB servers that maintain copies of the same data to provide redundancy and high availability.

### Q12. What is Sharding?

Sharding is a technique used to distribute data across multiple servers to support horizontal scaling.

### Q13. Does MongoDB support transactions?

Yes. MongoDB supports multi-document transactions across supported deployment configurations.

### Q14. Is MongoDB schema-less?

MongoDB supports flexible schemas, but developers can enforce document validation rules.

### Q15. What happens when we execute `use StudentDB`?

It switches the current database context. It does not necessarily persist a new database immediately.

---

## 13. Practical Exercises

### Exercise 1: Explain in Your Own Words

Write short answers for the following:

1. What is MongoDB?
2. What is the difference between SQL and NoSQL?
3. Why does MongoDB use BSON?
4. What is MongoDB Atlas?
5. What is the difference between MongoDB Compass and mongosh?
6. What is the difference between mongod and mongosh?
7. What is ObjectId?
8. What is a Replica Set?
9. What is Sharding?
10. Is MongoDB completely schema-less?

### Exercise 2: Practical MongoDB Commands

Try these commands in mongosh:

```javascript
// 1. Show all databases
show dbs

// 2. Create or switch to database
use PracticeDB

// 3. Check current database
db

// 4. Create a collection
db.createCollection("users")

// 5. Show collections
show collections

// 6. Check database statistics
db.stats()

// 7. Generate a new ObjectId
new ObjectId()

// 8. Generate ObjectId and inspect timestamp
const myId = new ObjectId()

myId.getTimestamp()
```

### Exercise 3: Understand This Code

```javascript
use CollegeDB

db.createCollection("students")

db.students.insertOne({
  name: "Rahul",
  age: 21,
  course: "BCA"
})
```

Explain:

1. What does `use CollegeDB` do?
2. What does `db.createCollection()` do?
3. What does `db.students` represent?
4. What does `insertOne()` do?
5. What happens if we don't provide `_id`?

We will learn `insertOne()` properly on Day 3.

---

## 14. Key Takeaways

After completing Day 2, I should understand:

- What MongoDB is.
- SQL vs NoSQL.
- MongoDB vs MySQL.
- MongoDB architecture.
- Difference between mongod and mongosh.
- JSON vs BSON.
- MongoDB Atlas.
- MongoDB Compass.
- MongoDB Shell.
- Creating databases and collections.
- ObjectId and `_id`.
- Basic MongoDB commands.
- Replica Sets and Sharding.

## Day 2 Completion Checklist

- [ ] Understand what MongoDB is.
- [ ] Understand SQL vs NoSQL.
- [ ] Understand MongoDB vs MySQL.
- [ ] Understand mongod and mongosh.
- [ ] Understand Replica Sets and Sharding.
- [ ] Understand JSON vs BSON.
- [ ] Understand MongoDB Atlas.
- [ ] Understand MongoDB Compass.
- [ ] Practice mongosh commands.
- [ ] Understand ObjectId and _id.
- [ ] Create a database and collection.
- [ ] Complete practical exercises.
- [ ] Revise interview questions.
- [ ] Push Day 2 notes to GitHub.

---

## Next: Day 03 – Insert and Read Operations

Topics:

- `insertOne()`
- `insertMany()`
- `find()`
- `findOne()`
- Projection
- Sorting
- Limiting and skipping
- Understanding query results

**Learning one day at a time. Building skills through practice.** 🚀