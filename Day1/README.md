# Day 01 – MongoDB Data Modeling

> **Learning Goal:** Understand how to design, organize, and structure data in MongoDB for real-world applications.

## Table of Contents

1. [What is Data Modeling?](#1-what-is-data-modeling)
2. [MongoDB Basic Structure](#2-mongodb-basic-structure)
3. [Database Relationships](#3-database-relationships)
4. [Embedding vs Referencing](#4-embedding-vs-referencing)
5. [Cardinality](#5-cardinality)
6. [Bounded vs Unbounded Arrays](#6-bounded-vs-unbounded-arrays)
7. [MongoDB Document Size Limit](#7-mongodb-document-size-limit)
8. [Normalization vs Denormalization](#8-normalization-vs-denormalization)
9. [Query-Driven Data Modeling](#9-query-driven-data-modeling)
10. [MongoDB Schema Design Patterns](#10-mongodb-schema-design-patterns)
11. [Real-World Example: Expense Tracker](#11-real-world-example-expense-tracker)
12. [Important Database Design Rules](#12-important-database-design-rules)
13. [Interview Questions](#13-interview-questions)
14. [Practical Exercises](#14-practical-exercises)
15. [Key Takeaways](#15-key-takeaways)

---

## 1. What is Data Modeling?

Data modeling is the process of deciding how data will be organized, stored, and connected inside a database.

Before developing an application, we need to decide:

- What information should be stored?
- How many collections should we create?
- Which information belongs together?
- How should different collections communicate?
- Should we store related information together or separately?

These decisions are called **Data Modeling**.

### Example: Student Management System

Suppose we want to build a Student Management System.

We need to store:

- Student name
- Email
- Age
- Phone number
- Course
- Address

Example MongoDB document:

```json
{
  "_id": "S101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "age": 21,
  "phone": "9876543210",
  "course": "BCA",
  "address": {
    "city": "Kolkata",
    "state": "West Bengal"
  }
}
```

Here, we have stored student information in a structured document.

### Why is Data Modeling Important?

Good data modeling helps us:

1. Organize information properly.
2. Retrieve data efficiently.
3. Avoid unnecessary duplication.
4. Maintain data consistency.
5. Improve application performance.
6. Build scalable applications.
7. Make database maintenance easier.

---

## 2. MongoDB Basic Structure

MongoDB organizes information using the following hierarchy:

```text
Database
   |
   └── Collection
          |
          └── Document
                 |
                 └── Fields
```

### Database

A database is a container that holds collections.

Example: `StudentDB`

### Collection

A collection is a group of related documents.

Example: `students`

### Document

A document is an individual record stored inside a collection.

Example:

```json
{
  "name": "Rahul",
  "age": 21
}
```

### Fields

Fields represent individual pieces of information inside a document.

Example:

- name
- age
- email

### Summary

| Term | Meaning |
|---|---|
| Database | Container for collections |
| Collection | Group of documents |
| Document | Individual record |
| Field | Individual piece of information |

MongoDB stores documents in BSON (Binary JSON), which we will explore in Day 2.

---

## 3. Database Relationships

Relationships describe how documents are associated with each other.

There are three common types:

1. One-to-One (1:1)
2. One-to-Many (1:M)
3. Many-to-Many (M:M)

### A. One-to-One (1:1)

One document is associated with one other document.

**Example:** One user has one profile.

Users collection:

```json
{
  "_id": "U101",
  "name": "Rahul",
  "email": "rahul@gmail.com"
}
```

Profiles collection:

```json
{
  "_id": "P101",
  "userId": "U101",
  "dateOfBirth": "2005-05-10",
  "bio": "Software Developer"
}
```

Relationship:

```text
User 1 ───────── 1 Profile
```

Alternatively, we can embed the profile inside the user document.

```json
{
  "_id": "U101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "profile": {
    "dateOfBirth": "2005-05-10",
    "bio": "Software Developer"
  }
}
```

**When to use:**

- When related information is usually accessed together.
- When the related information belongs to the parent document.
- When the embedded information has a predictable size.

### B. One-to-Many (1:M)

One document is associated with multiple documents.

**Example:** One user has many orders.

Users collection:

```json
{
  "_id": "U101",
  "name": "Rahul"
}
```

Orders collection:

```json
[
  {
    "_id": "O101",
    "userId": "U101",
    "product": "Laptop",
    "price": 50000
  },
  {
    "_id": "O102",
    "userId": "U101",
    "product": "Mouse",
    "price": 500
  },
  {
    "_id": "O103",
    "userId": "U101",
    "product": "Keyboard",
    "price": 1000
  }
]
```

Relationship:

```text
User 1
   |
   |------ Order 1
   |------ Order 2
   |------ Order 3
   |
   └------ Order Many
```

Here, `userId` connects each order to its user.

**When to use:**

- One user has many transactions.
- One customer has many orders.
- One blog has many comments.

For continuously growing data, referencing is generally a good choice.

### C. Many-to-Many (M:M)

Multiple documents can be associated with multiple other documents.

**Example:** Students and Courses.

- One student can enroll in multiple courses.
- One course can have multiple students.

We can create three collections.

**Students:**

```json
{
  "_id": "S101",
  "name": "Rahul"
}
```

**Courses:**

```json
{
  "_id": "C101",
  "courseName": "MongoDB"
}
```

**Enrollments:**

```json
{
  "_id": "E101",
  "studentId": "S101",
  "courseId": "C101",
  "enrolledAt": "2026-10-31",
  "status": "active"
}
```

Relationship:

```text
Students             Enrollments             Courses

Rahul  ------------  MongoDB
   |                    |
   └----------------  Java

Priya  ------------  MongoDB
```

The Enrollments collection connects students and courses.

This collection is also called a **Junction Collection** or **Bridge Collection**.

It can store additional information such as:

- Enrollment date
- Course status
- Grade
- Completion date

**When to use:**

When multiple documents on both sides can be associated with each other.

---

## 4. Embedding vs Referencing

MongoDB provides two common approaches for representing relationships.

### A. Embedding

Embedding means storing related information inside the same document.

Example:

```json
{
  "_id": "U101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "address": {
    "city": "Kolkata",
    "state": "West Bengal",
    "pincode": "700001"
  }
}
```

Here, address information is stored inside the user document.

The address is an embedded document.

**Advantages:**

1. Related information can be retrieved in one query.
2. No separate lookup is required.
3. Updates to one document are atomic.
4. Application code can be simpler.

**Disadvantages:**

1. Documents can become large.
2. Data duplication can increase.
3. Unbounded arrays can create performance problems.
4. Large embedded structures can become difficult to maintain.

**When to use embedding:**

- Related data is frequently accessed together.
- Data has a predictable size.
- Data belongs to the parent document.
- You want to simplify common read operations.

Examples:

- User and address.
- Product and specifications.
- Order and purchased item snapshots.

### B. Referencing

Referencing means storing related information in separate documents and connecting them using identifiers.

Users collection:

```json
{
  "_id": "U101",
  "name": "Rahul"
}
```

Orders collection:

```json
{
  "_id": "O101",
  "userId": "U101",
  "totalAmount": 2500
}
```

Here, `userId` references the user document.

**Advantages:**

1. Reduces unnecessary duplication.
2. Better for independently growing data.
3. Multiple documents can reference the same record.
4. Related information can be managed independently.

**Disadvantages:**

1. Retrieving related information may require multiple queries.
2. Aggregation `$lookup` or Mongoose `populate()` may be needed.
3. Application logic can become more complicated.
4. Multi-document updates may require transactions.

**When to use referencing:**

- Related data is large.
- Related data grows continuously.
- Data is accessed independently.
- Multiple documents share the same information.

### Embedding vs Referencing Comparison

| Feature | Embedding | Referencing |
|---|---|---|
| Storage | Same document | Separate documents |
| Retrieval | Usually one query | May need multiple queries |
| Duplication | Can be higher | Usually lower |
| Growing data | Better for bounded data | Better for unbounded data |
| Atomicity | Single-document atomicity | Multi-document operations may need transactions |
| Example | User + Address | User + Transactions |

**Remember:**

Embed data when it belongs together and is usually accessed together.

Reference data when it needs to exist and grow independently.

Neither approach is always better. Real-world applications often combine both.

---

## 5. Cardinality

Cardinality describes how many documents are associated with each other.

Common relationship types:

- One-to-One
- One-to-Many
- Many-to-Many

### One-to-Few

One user has a few addresses.

```json
{
  "_id": "U101",
  "name": "Rahul",
  "addresses": [
    {
      "city": "Kolkata",
      "type": "Home"
    },
    {
      "city": "Delhi",
      "type": "Office"
    }
  ]
}
```

Embedding is often appropriate.

### One-to-Many

One user has hundreds of orders.

A separate orders collection with a `userId` reference is generally suitable.

### One-to-Very-Many

One user has millions of activity logs.

Store activity logs in a separate collection rather than continuously growing an array inside the user document.

**Important:** Cardinality helps us decide whether to embed or reference related information.

---

## 6. Bounded vs Unbounded Arrays

### Bounded Arrays

A bounded array has a predictable maximum size.

Example:

```json
{
  "name": "Rahul",
  "skills": [
    "JavaScript",
    "React",
    "MongoDB"
  ]
}
```

This is a good candidate for embedding.

### Unbounded Arrays

An unbounded array can grow indefinitely.

Example:

```json
{
  "_id": "U101",
  "name": "Rahul",
  "transactions": [
    "T101",
    "T102",
    "T103"
  ]
}
```

Imagine a user makes 10,000 transactions.

Continuously adding transaction IDs to this array is not a good database design.

Instead, create a separate Transactions collection.

```json
{
  "_id": "T101",
  "userId": "U101",
  "amount": 500,
  "type": "expense"
}
```

**Why avoid unbounded arrays?**

- Excessive document growth.
- Increased memory and processing overhead.
- More expensive document updates.
- Risk of exceeding the document size limit.

---

## 7. MongoDB Document Size Limit

MongoDB has a maximum BSON document size of **16 MiB**.

This means a single document cannot exceed 16 MiB.

Example of a potentially problematic design:

```json
{
  "_id": "U101",
  "name": "Rahul",
  "transactions": [
    // Thousands of transaction objects
  ]
}
```

If the document becomes larger than 16 MiB, MongoDB rejects the write.

**Solution:** Store independently growing information in separate collections and connect documents using references.

Note: GridFS is available for storing large files, but it is not a solution for oversized application documents.

---

## 8. Normalization vs Denormalization

### A. Normalization

Normalization means organizing information to reduce unnecessary duplication and improve consistency.

Example:

Products collection:

```json
{
  "_id": "P101",
  "name": "Laptop",
  "price": 50000
}
```

Orders collection:

```json
{
  "_id": "O101",
  "productId": "P101",
  "quantity": 1
}
```

Product details are stored separately.

**Advantages:**

- Less duplication.
- Easier to update shared information.
- Better consistency for independently managed data.

### B. Denormalization

Denormalization means deliberately duplicating information to improve read performance or preserve useful historical information.

Example:

An order stores a snapshot of the purchased product.

```json
{
  "_id": "O101",
  "items": [
    {
      "productId": "P101",
      "productName": "Laptop",
      "priceAtPurchase": 50000,
      "quantity": 1
    }
  ]
}
```

Why store the price again?

Suppose the current product price changes to ₹55,000.

The old order should still show the original purchase price of ₹50,000.

**Advantages:**

- Faster data retrieval in certain access patterns.
- Fewer joins.
- Preserves historical information.
- Simplifies some read operations.

**Disadvantages:**

- Duplicate information.
- Increased storage.
- More complicated updates when duplicated information must remain synchronized.

**Important Interview Question: Is data duplication always bad in MongoDB?**

No. Controlled duplication is useful when it improves read performance or preserves historical snapshots.

---

## 9. Query-Driven Data Modeling

Query-driven data modeling means designing your database based on how your application will read and write data.

Instead of creating collections randomly, first understand the application's requirements.

Example: Expense Tracker.

Common queries:

1. Retrieve all transactions belonging to a user.
2. Retrieve transactions for a particular month.
3. Calculate total income.
4. Calculate total expenses.
5. Find expenses by category.
6. Retrieve monthly budgets.

Based on these queries, we can design our collections and choose suitable fields.

Example query:

```javascript
db.transactions.find({
  userId: "U101"
});
```

Later, we can create an index on `userId` to improve query performance.

**Important:** Database design should consider actual application access patterns, not just relationships.

---

## 10. MongoDB Schema Design Patterns

MongoDB provides several schema design patterns for different application requirements.

| Pattern | Purpose | Example |
|---|---|---|
| Attribute Pattern | Organize similar but varying attributes | Products with different specifications |
| Bucket Pattern | Group large amounts of related data | Sensor readings by day |
| Subset Pattern | Keep frequently accessed data separately | Latest comments |
| Computed Pattern | Store precomputed values | Monthly expenses |
| Extended Reference Pattern | Duplicate frequently needed referenced fields | Product name in an order |
| Polymorphic Pattern | Store different document shapes in one collection | Different product types |
| Outlier Pattern | Handle documents with unusually large data | A post with millions of comments |

### A. Bucket Pattern

Group related records into buckets.

Example: Sensor readings grouped by date.

```json
{
  "sensorId": "S101",
  "date": "2026-10-31",
  "readings": [
    {
      "time": "10:00",
      "temperature": 28
    },
    {
      "time": "10:01",
      "temperature": 29
    }
  ]
}
```

### B. Computed Pattern

Store precomputed values instead of repeatedly calculating them.

Example:

```json
{
  "userId": "U101",
  "month": 10,
  "year": 2026,
  "totalExpense": 12500
}
```

This can improve dashboard performance.

The calculated value must be updated correctly when transactions change.

### C. Subset Pattern

Store a frequently accessed subset of a large collection.

Example:

A blog post has 50,000 comments.

You can store the latest few comments in the post document and keep all comments in a separate collection.

This makes it easier to display recent comments without retrieving all comments.

---

## 11. Real-World Example: Expense Tracker

Let's design a MongoDB database for an Expense Tracker application.

### Step 1: Identify Entities

Our application needs:

- Users
- Transactions
- Categories
- Budgets

### Step 2: Identify Relationships

| Entity 1 | Relationship | Entity 2 |
|---|---|---|
| User | One-to-Many | Transactions |
| User | One-to-Many | Budgets |
| Category | One-to-Many | Transactions |
| User | One-to-Many | Categories |

Each user manages their own categories in this example.

### Step 3: Create Collections

```text
SpendWise Database
│
├── users
│
├── transactions
│
├── categories
│
└── budgets
```

### Step 4: Design Documents

**Users Collection**

```json
{
  "_id": "U101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "passwordHash": "hashed_password",
  "createdAt": "2026-10-31T10:00:00Z"
}
```

**Categories Collection**

```json
{
  "_id": "C101",
  "userId": "U101",
  "name": "Food",
  "type": "expense",
  "color": "#FF5733"
}
```

**Transactions Collection**

```json
{
  "_id": "T101",
  "userId": "U101",
  "categoryId": "C101",
  "type": "expense",
  "amount": 500,
  "description": "Lunch",
  "date": "2026-10-31T12:00:00Z"
}
```

**Budgets Collection**

```json
{
  "_id": "B101",
  "userId": "U101",
  "categoryId": "C101",
  "monthlyLimit": 5000,
  "month": 10,
  "year": 2026
}
```

### Step 5: Understand Why We Chose This Structure

- Users have separate documents.
- Transactions are stored separately because they can grow continuously.
- Categories are stored separately because users can manage them independently.
- Budgets are stored separately because they have their own lifecycle.
- `userId` and `categoryId` connect related documents.

This design supports independent querying and future expansion.

---

## 12. Important Database Design Rules

1. Design your database around application access patterns.
2. Avoid embedding unlimited arrays.
3. Use references for independently growing data.
4. Embed frequently accessed related data when appropriate.
5. Avoid unnecessary duplication, but use controlled denormalization when useful.
6. Consider document size and update frequency.
7. Identify common queries before designing collections.
8. Use validation to protect data quality.
9. Consider indexing for frequently executed queries.
10. Think about scalability and maintainability.

---

## 13. Interview Questions

### Q1. What is MongoDB Data Modeling?

Data modeling is the process of designing how data is structured, stored, and related inside MongoDB.

### Q2. What is the difference between Embedding and Referencing?

Embedding stores related information inside one document, whereas referencing stores related information in separate documents connected through identifiers.

### Q3. When should we use Embedding?

When related data is frequently accessed together, has a predictable size, and belongs to the parent document.

### Q4. When should we use Referencing?

When related data grows independently, is accessed separately, or is shared across multiple documents.

### Q5. What is Cardinality?

Cardinality describes how many documents are associated with each other.

### Q6. Why should we avoid Unbounded Arrays?

Because they can increase document size, create performance problems, and exceed the 16 MiB document size limit.

### Q7. What is Denormalization?

Denormalization is the deliberate duplication of data to improve read performance or preserve historical information.

### Q8. Is data duplication always bad in MongoDB?

No. Controlled duplication can improve read efficiency and simplify certain application queries.

### Q9. What is Query-Driven Data Modeling?

It is designing database structures based on the application's actual read and write operations.

### Q10. What is the maximum MongoDB document size?

16 MiB.

### Q11. What is a Junction Collection?

A collection used to represent relationships between two entities, commonly in many-to-many relationships.

### Q12. What is the difference between Bounded and Unbounded Arrays?

Bounded arrays have a predictable maximum size, whereas unbounded arrays can grow indefinitely.

---

## 14. Practical Exercises

### Exercise 1: Identify Relationships

Identify whether each situation represents 1:1, 1:M, or M:M.

1. One person has one passport.
2. One user has multiple orders.
3. One student enrolls in multiple courses, and each course has multiple students.
4. One country has multiple cities.
5. One employee has one company ID card.

### Exercise 2: Embedding or Referencing?

Choose the appropriate design and explain why.

1. A user has two or three addresses.
2. A user has 50,000 transactions.
3. An order contains five purchased products, and you need to preserve their prices at purchase time.
4. A blog post has millions of comments.
5. A product has three or four fixed specifications.

### Exercise 3: Design a Library Management System

Your application needs:

- Users
- Books
- Authors
- Book borrowing records
- Return dates

Answer:

1. How many collections would you create?
2. What fields would each collection contain?
3. Which relationships would exist?
4. Where would you use embedding?
5. Where would you use referencing?

### Exercise 4: Find the Problem

Consider this document:

```json
{
  "_id": "U101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "transactions": [
    {
      "amount": 500,
      "type": "expense"
    },
    {
      "amount": 1000,
      "type": "income"
    }
  ]
}
```

Imagine Rahul makes 10,000 transactions.

Questions:

1. What problems might occur?
2. How would you redesign the database?
3. Which relationship would you use?
4. Why?

---

## 15. Key Takeaways

After completing Day 1, I should understand:

- What data modeling means.
- MongoDB database structure.
- One-to-One, One-to-Many, and Many-to-Many relationships.
- Embedding vs Referencing.
- Cardinality.
- Bounded vs Unbounded Arrays.
- MongoDB document size limit.
- Normalization vs Denormalization.
- Query-driven data modeling.
- Basic schema design patterns.
- How to design a database for a real-world project.

## Day 1 Completion Checklist

- [ ] Understand Data Modeling.
- [ ] Understand MongoDB basic structure.
- [ ] Understand database relationships.
- [ ] Understand Embedding vs Referencing.
- [ ] Understand Cardinality.
- [ ] Understand Bounded vs Unbounded Arrays.
- [ ] Understand the 16 MiB document limit.
- [ ] Understand Normalization vs Denormalization.
- [ ] Understand Query-Driven Data Modeling.
- [ ] Complete practical exercises.
- [ ] Complete the Expense Tracker database assignment.
- [ ] Revise interview questions.

---

**Next: Day 02 – MongoDB Introduction and Setup**

Topics:
- What is MongoDB?
- SQL vs NoSQL.
- MongoDB vs MySQL.
- JSON vs BSON.
- Database, Collection and Document revision.
- MongoDB Atlas.
- MongoDB Compass.
- MongoDB Shell (`mongosh`).
- ObjectId and `_id`.
- Creating your first database and collection.

**Learning one day at a time. Building skills through practice.** 🚀