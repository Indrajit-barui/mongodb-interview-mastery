# Day 03 – MongoDB Insert and Read Operations

> **Learning goal:** Learn how to insert documents into MongoDB and retrieve them using queries, projections, sorting, limits, skipping, and pagination.

## Table of Contents

1. [CRUD Overview](#1-crud-overview)
2. [Prepare the Practice Collection](#2-prepare-the-practice-collection)
3. [Insert Operations](#3-insert-operations)
   - [`insertOne()`](#31-insertone)
   - [`insertMany()`](#32-insertmany)
   - [Ordered vs Unordered Insertion](#33-ordered-vs-unordered-insertion)
4. [Read Operations](#4-read-operations)
   - [`find()`](#41-find)
   - [`findOne()`](#42-findone)
   - [Cursor](#43-cursor)
5. [Projection](#5-projection)
6. [Sorting](#6-sorting)
7. [Limit and Skip](#7-limit-and-skip)
   - [`limit()`](#71-limit)
   - [`skip()`](#72-skip)
8. [Pagination](#8-pagination)
9. [Counting Documents](#9-counting-documents)
10. [Combining Read Methods](#10-combining-read-methods)
11. [Common Mistakes and Important Notes](#11-common-mistakes-and-important-notes)
12. [Interview Questions](#12-interview-questions)
13. [Practical Assignment](#13-practical-assignment)
14. [Day 3 Checklist](#14-day-3-checklist)

---

## 1. CRUD Overview

CRUD represents the four basic operations performed on stored data:

| Operation | Meaning | Common MongoDB methods |
|---|---|---|
| **C – Create** | Insert new documents | `insertOne()`, `insertMany()` |
| **R – Read** | Retrieve documents | `find()`, `findOne()` |
| **U – Update** | Modify existing documents | `updateOne()`, `updateMany()` |
| **D – Delete** | Remove documents | `deleteOne()`, `deleteMany()` |

This lesson focuses on **Create** and **Read**. Update and Delete operations are covered on Day 4.

## 2. Prepare the Practice Collection

Connect to your local MongoDB server or MongoDB Atlas using `mongosh` or Compass.

Select the practice database:

```javascript
use StudentDB
```

Create a separate collection for this lesson:

```javascript
db.createCollection("students_day3")
```

Check that it exists:

```javascript
show collections
```

> **Note:** If the collection already exists, MongoDB will report that it exists. You can continue using it. The examples below assume you are working with a fresh practice collection. Avoid dropping collections that contain data you need.

## 3. Insert Operations

MongoDB provides two common methods for inserting documents: `insertOne()` and `insertMany()`.

### 3.1 `insertOne()`

`insertOne()` inserts one document into a collection.

**Syntax:**

```javascript
db.collectionName.insertOne(document)
```

**Example:**

```javascript
db.students_day3.insertOne({
  name: "Rahul",
  age: 21,
  email: "rahul@gmail.com",
  course: "BCA",
  city: "Kolkata"
})
```

A successful insertion returns a result similar to:

```javascript
{
  acknowledged: true,
  insertedId: ObjectId("...")
}
```

- `acknowledged` indicates whether the write was acknowledged according to the write concern.
- `insertedId` contains the `_id` of the inserted document.

**What happens if `_id` is not provided?**

MongoDB's driver or shell generates an ObjectId for the document automatically.

**Can we provide our own `_id`?**

Yes. The `_id` value can be a supported BSON value, such as a string or number, as long as it is unique within that collection.

```javascript
db.students_day3.insertOne({
  _id: "STU101",
  name: "Priya",
  age: 22,
  email: "priya@example.com",
  course: "BCA"
})
```

If another document is inserted with the same `_id`, MongoDB returns a duplicate-key error.

**Documents can contain different BSON data types**, including strings, numbers, arrays, embedded documents, booleans, and dates:

```javascript
db.students_day3.insertOne({
  name: "Amit",
  age: 20,
  email: "amit@example.com",
  course: "BCA",
  skills: ["JavaScript", "React", "MongoDB"],
  address: {
    city: "Kolkata",
    state: "West Bengal",
    pincode: 700001
  },
  isActive: true,
  admissionDate: new Date()
})
```

### 3.2 `insertMany()`

`insertMany()` inserts multiple documents in one operation.

**Syntax:**

```javascript
db.collectionName.insertMany([
  { document1 },
  { document2 },
  { document3 }
])
```

**Example:**

```javascript
db.students_day3.insertMany([
  {
    name: "Sourav",
    age: 21,
    email: "sourav@example.com",
    course: "BCA",
    marks: 85
  },
  {
    name: "Ananya",
    age: 20,
    email: "ananya@example.com",
    course: "BBA",
    marks: 78
  },
  {
    name: "Rohit",
    age: 23,
    email: "rohit@example.com",
    course: "MCA",
    marks: 88
  },
  {
    name: "Meera",
    age: 22,
    email: "meera@example.com",
    course: "BCA",
    marks: 92
  },
  {
    name: "Arjun",
    age: 21,
    email: "arjun@example.com",
    course: "BCA",
    marks: 75
  }
])
```

A successful insertion returns a result similar to:

```javascript
{
  acknowledged: true,
  insertedIds: {
    0: ObjectId("..."),
    1: ObjectId("..."),
    2: ObjectId("...")
  }
}
```

Each inserted document receives its own `_id` if one was not supplied.

### 3.3 Ordered vs Unordered Insertion

By default, `insertMany()` uses **ordered insertion** (`ordered: true`). MongoDB attempts documents in order and stops attempting later documents after a write error. Documents successfully inserted before the error are not automatically rolled back.

With **unordered insertion** (`ordered: false`), MongoDB attempts the remaining documents even if one document fails.

```javascript
db.students_day3.insertMany(
  [
    { _id: 101, name: "Amit" },
    { _id: 102, name: "Priya" },
    { _id: 101, name: "Rahul" }, // Duplicate _id: this document fails
    { _id: 103, name: "Ananya" }
  ],
  { ordered: false }
)
```

In this example, the third document fails because `_id: 101` is already used by the first document. MongoDB still attempts the fourth document.

| Feature | Ordered (`true`, default) | Unordered (`false`) |
|---|---|---|
| Processing | In order | May be processed in a different order |
| On a write error | Stops attempting later documents | Continues attempting remaining documents |
| Earlier successful writes | Remain inserted | Remain inserted |
| Typical use | When insertion order matters | When attempting as many valid writes as possible matters |

## 4. Read Operations

MongoDB commonly uses `find()` and `findOne()` to retrieve documents.

### 4.1 `find()`

`find()` returns a cursor for documents matching a query. If no query condition is supplied, it matches all documents in the collection.

**Syntax:**

```javascript
db.collectionName.find(query, projection)
```

The query and projection arguments are optional.

**Retrieve all students:**

```javascript
db.students_day3.find()
```

This is equivalent to:

```javascript
db.students_day3.find({})
```

An empty query document `{}` matches every document.

**Retrieve students enrolled in BCA:**

```javascript
db.students_day3.find({
  course: "BCA"
})
```

**Retrieve students from Kolkata:**

```javascript
db.students_day3.find({
  city: "Kolkata"
})
```

**Use multiple conditions:**

```javascript
db.students_day3.find({
  course: "BCA",
  age: 21
})
```

When multiple field conditions are placed in the same query document, MongoDB treats them as an implicit **AND**. The document must match both conditions.

> Comparison operators such as `$gt`, `$lt`, `$in`, and logical operators such as `$or` are covered on Day 5.

### 4.2 `findOne()`

`findOne()` returns one document matching the query, or `null` if no document matches.

**Syntax:**

```javascript
db.collectionName.findOne(query, projection)
```

**Find a student by name:**

```javascript
db.students_day3.findOne({
  name: "Rahul"
})
```

**Find a student by email:**

```javascript
db.students_day3.findOne({
  email: "ananya@example.com"
})
```

**Find using multiple conditions:**

```javascript
db.students_day3.findOne({
  course: "BCA",
  age: 22
})
```

If no document matches, the result is:

```javascript
null
```

### 4.3 Cursor

A **cursor** is an object that lets you access the documents returned by a query. It can retrieve results incrementally rather than requiring every matching document to be loaded into application memory at once.

```javascript
const cursor = db.students_day3.find()
```

In `mongosh`, a cursor's results are automatically displayed in batches. You can also convert the results to an array:

```javascript
db.students_day3.find().toArray()
```

Use `toArray()` carefully for very large result sets because it loads all returned documents into memory in the shell.

**Cursor vs Document:**

- A **document** is one record stored in a collection.
- A **cursor** is a mechanism for iterating through the documents returned by a query.

## 5. Projection

**Projection** controls which fields are included in or excluded from query results. Filtering decides *which documents* match; projection decides *which fields* are returned from those documents.

**Include selected fields:**

```javascript
db.students_day3.find(
  {},
  {
    name: 1,
    email: 1
  }
)
```

This returns `name` and `email`. The `_id` field is included by default unless explicitly excluded.

**Exclude `_id`:**

```javascript
db.students_day3.find(
  {},
  {
    name: 1,
    email: 1,
    _id: 0
  }
)
```

**Exclude a field:**

```javascript
db.students_day3.find(
  {},
  {
    email: 0
  }
)
```

This returns the other fields but leaves out `email`.

| Projection value | Meaning |
|---|---|
| `name: 1` | Include `name` |
| `email: 1` | Include `email` |
| `email: 0` | Exclude `email` |
| `_id: 0` | Exclude `_id` |

**Important projection rule:** In a normal projection, you cannot mix inclusion and exclusion fields in the same projection. The exception is `_id`, which can be excluded while other fields are included.

**Projection with a nested field:**

Given a document with an embedded address:

```javascript
{
  name: "Amit",
  address: {
    city: "Kolkata",
    state: "West Bengal",
    pincode: 700001
  }
}
```

Retrieve only the student's name and address city:

```javascript
db.students_day3.find(
  {},
  {
    name: 1,
    "address.city": 1,
    _id: 0
  }
)
```

Dot notation is used to refer to a nested field.

## 6. Sorting

Sorting arranges the matching documents in a specified order. MongoDB uses the `sort()` method.

**Syntax:**

```javascript
db.collectionName.find(query).sort({
  fieldName: 1
})
```

| Value | Meaning |
|---|---|
| `1` | Ascending order |
| `-1` | Descending order |

**Sort students by age in ascending order:**

```javascript
db.students_day3.find().sort({
  age: 1
})
```

**Sort students by age in descending order:**

```javascript
db.students_day3.find().sort({
  age: -1
})
```

**Sort students by marks, highest first:**

```javascript
db.students_day3.find().sort({
  marks: -1
})
```

**Sort using multiple fields:**

```javascript
db.students_day3.find().sort({
  marks: -1,
  age: 1
})
```

MongoDB sorts first by `marks` in descending order. If two documents have equal marks, it uses `age` in ascending order as the next sort key.

**Common use cases:**

- E-commerce: highest-rated products first.
- Banking: newest transactions first.
- Student portal: highest examination scores first.
- Social media: newest posts first.

> For repeatable ordering, especially during pagination, include a unique tie-breaker such as `_id` in the sort. For example: `.sort({ name: 1, _id: 1 })`.

## 7. Limit and Skip

`limit()` and `skip()` control how many matching documents are returned and where the returned results begin.

### 7.1 `limit()`

`limit()` restricts the maximum number of documents returned by a query.

**Syntax:**

```javascript
db.collectionName.find(query).limit(number)
```

**Retrieve at most three students:**

```javascript
db.students_day3.find().limit(3)
```

**Example: Get the five latest transactions:**

```javascript
db.transactions.find()
  .sort({ date: -1, _id: -1 })
  .limit(5)
```

The sort makes the newest transactions appear first; the limit returns at most five matching documents.

### 7.2 `skip()`

`skip()` skips a specified number of matching documents before returning the remaining results.

**Syntax:**

```javascript
db.collectionName.find(query).skip(number)
```

**Skip the first two students:**

```javascript
db.students_day3.find().skip(2)
```

The operation skips the first two documents in the query result and returns the rest. To make the order predictable, combine `skip()` with `sort()`:

```javascript
db.students_day3.find()
  .sort({ name: 1, _id: 1 })
  .skip(2)
```

**Remember:**

- `limit(5)` returns at most five matching documents.
- `skip(5)` skips the first five matching documents.

## 8. Pagination

**Pagination** divides a large result set into smaller pages. Instead of displaying all records at once, an application returns a manageable number of records per page.

For example, if there are 100 students and the page size is 10:

| Page | Records | Skip value | Limit |
|---|---|---:|---:|
| 1 | 1–10 | 0 | 10 |
| 2 | 11–20 | 10 | 10 |
| 3 | 21–30 | 20 | 10 |
| 4 | 31–40 | 30 | 10 |

### Pagination formula

```text
skip = (page - 1) * pageSize
```

Where:

- `page` is the current page number, starting at 1.
- `pageSize` is the maximum number of documents displayed per page.
- `skip` is the number of matching documents to skip.

### Example: Page 1

```javascript
const page = 1;
const pageSize = 2;
const skipValue = (page - 1) * pageSize;

db.students_day3.find()
  .sort({ name: 1, _id: 1 })
  .skip(skipValue)
  .limit(pageSize);
```

### Example: Page 2

```javascript
const page = 2;
const pageSize = 2;
const skipValue = (page - 1) * pageSize;

db.students_day3.find()
  .sort({ name: 1, _id: 1 })
  .skip(skipValue)
  .limit(pageSize);
```

### Example: Page 3

```javascript
const page = 3;
const pageSize = 2;
const skipValue = (page - 1) * pageSize;

db.students_day3.find()
  .sort({ name: 1, _id: 1 })
  .skip(skipValue)
  .limit(pageSize);
```

With a page size of 2:

- Page 1 skips 0 documents and returns up to 2.
- Page 2 skips 2 documents and returns up to 2.
- Page 3 skips 4 documents and returns up to 2.

### Why is sorting important for pagination?

Without a defined sort order, the order of query results is not guaranteed. Adding a unique tie-breaker such as `_id` gives the query a deterministic order for a given dataset.

### Is `skip()` always efficient?

No. For deep pages in a very large collection, MongoDB may need to scan through many documents before reaching the requested offset. **Range-based (cursor-based) pagination** using an indexed field can be more efficient for deep pagination. This is an advanced topic to revisit during query optimization.

## 9. Counting Documents

`countDocuments()` returns the number of documents matching a query.

**Count all students:**

```javascript
db.students_day3.countDocuments({})
```

**Count BCA students:**

```javascript
db.students_day3.countDocuments({
  course: "BCA"
})
```

This is useful when an application needs to display the total number of matching records or calculate the total number of pages.

## 10. Combining Read Methods

In real applications, query methods are often combined.

**Example 1: Find BCA students and sort by marks:**

```javascript
db.students_day3.find({
  course: "BCA"
}).sort({
  marks: -1
})
```

**Example 2: Find BCA students, return selected fields, and sort by age:**

```javascript
db.students_day3.find(
  { course: "BCA" },
  { name: 1, age: 1, _id: 0 }
).sort({
  age: 1
})
```

**Example 3: Retrieve the top three BCA students by marks:**

```javascript
db.students_day3.find({
  course: "BCA"
}).sort({
  marks: -1,
  _id: 1
}).limit(3)
```

**Example 4: Retrieve page 2 of BCA students, with three students per page:**

```javascript
const page = 2;
const pageSize = 3;
const skipValue = (page - 1) * pageSize;

db.students_day3.find({
  course: "BCA"
})
.sort({ name: 1, _id: 1 })
.skip(skipValue)
.limit(pageSize);
```

**Example 5: Count BCA students:**

```javascript
db.students_day3.countDocuments({
  course: "BCA"
})
```

## 11. Common Mistakes and Important Notes

### 1. `find()` vs `findOne()`

- `find()` returns a cursor for all matching documents.
- `findOne()` returns one matching document or `null`.

### 2. Filtering vs Projection

- **Filtering** decides which documents match the query.
- **Projection** decides which fields are returned from those documents.

```javascript
// Filter: only BCA students
db.students_day3.find({ course: "BCA" })

// Projection: only name and email, excluding _id
db.students_day3.find({}, { name: 1, email: 1, _id: 0 })
```

### 3. Sorting vs Limiting

- Sorting changes the order of matching documents.
- Limiting controls the maximum number of returned documents.

### 4. `limit()` vs `skip()`

- `limit()` controls how many documents are returned.
- `skip()` controls how many matching documents are skipped first.

### 5. Data types matter

These values are different:

```javascript
{ studentId: "101" } // String
{ studentId: 101 }   // Number
```

A query for the string `"101"` does not match a numeric `101` value. Keep field types consistent in your application.

### 6. Use deterministic sorting for pagination

Sort by the field you want to order by and add a unique tie-breaker, often `_id`:

```javascript
.sort({ name: 1, _id: 1 })
```

### 7. Be careful with `toArray()`

`toArray()` loads all matching results into an array in the shell. Avoid using it for very large result sets.

## 12. Interview Questions

### Q1. What is CRUD?

CRUD stands for Create, Read, Update, and Delete. These are the four basic database operations.

### Q2. What is the difference between `insertOne()` and `insertMany()`?

`insertOne()` inserts one document, while `insertMany()` inserts multiple documents using an array of documents.

### Q3. What happens if `_id` is not provided during insertion?

MongoDB's driver or shell generates an ObjectId for the document automatically.

### Q4. What happens if we insert a duplicate `_id`?

MongoDB returns a duplicate-key error because `_id` must be unique within a collection.

### Q5. What is the difference between `find()` and `findOne()`?

`find()` returns a cursor for matching documents, while `findOne()` returns one matching document or `null`.

### Q6. What is a cursor?

A cursor is an iterable mechanism for accessing the documents returned by a query.

### Q7. What is projection?

Projection specifies which fields should be included in or excluded from query results.

### Q8. Can inclusion and exclusion be mixed in a projection?

Generally no. The exception is `_id`, which can be excluded while other fields are included.

### Q9. What does `sort({ age: 1 })` mean?

It sorts matching documents by age in ascending order.

### Q10. What does `sort({ salary: -1 })` mean?

It sorts matching documents by salary in descending order.

### Q11. What does `limit(5)` do?

It returns at most five matching documents.

### Q12. What does `skip(5)` do?

It skips the first five matching documents before returning results.

### Q13. What is pagination?

Pagination divides a large result set into smaller pages for easier retrieval and display.

### Q14. What is the pagination formula?

`skip = (page - 1) * pageSize`.

### Q15. Is `skip()` efficient for deep pagination?

It can become inefficient for large offsets because MongoDB may need to scan past many documents. Range-based pagination can be more efficient for deep pages.

### Q16. What is the difference between ordered and unordered `insertMany()`?

Ordered insertion stops attempting later documents after a write error. Unordered insertion continues attempting the remaining documents.

## 13. Practical Assignment

Create a collection named `employees_day3`:

```javascript
db.createCollection("employees_day3")
```

### Step 1: Insert at least 8 employees

Each employee should have fields like:

```javascript
{
  name: "Employee Name",
  age: 25,
  department: "IT",
  salary: 30000,
  city: "Kolkata",
  isActive: true,
  joiningDate: new Date()
}
```

Use both `insertOne()` and `insertMany()`.

### Step 2: Solve these queries

| No. | Task |
|---:|---|
| 1 | Retrieve all employees. |
| 2 | Find one employee by name. |
| 3 | Retrieve all employees from the IT department. |
| 4 | Display only name and salary. |
| 5 | Hide the `_id` field. |
| 6 | Sort employees by salary in ascending order. |
| 7 | Sort employees by salary in descending order. |
| 8 | Retrieve at most the first three employees. |
| 9 | Skip the first three employees. |
| 10 | Retrieve page 2 with three employees per page. |
| 11 | Count all employees. |
| 12 | Find one employee using both name and department. |

### Step 3: Explain your queries

For every query, write a short explanation describing what it does. This helps build the ability to explain code during technical interviews.

## 14. Day 3 Checklist

- [ ] Practised `insertOne()`.
- [ ] Practised `insertMany()`.
- [ ] Understood ordered and unordered insertion.
- [ ] Practised `find()`.
- [ ] Practised `findOne()`.
- [ ] Understood MongoDB cursors.
- [ ] Practised projection.
- [ ] Practised sorting.
- [ ] Practised `limit()` and `skip()`.
- [ ] Understood pagination and its formula.
- [ ] Practised `countDocuments()`.
- [ ] Completed the employee assignment.
- [ ] Revised interview questions.
- [ ] Pushed Day 3 notes to GitHub.

---

## Next: Day 04 – Update and Delete Operations

Topics:

- `updateOne()`
- `updateMany()`
- `replaceOne()`
- `deleteOne()`
- `deleteMany()`
- `$set`, `$unset`, `$inc`
- `$push`, `$pull`, `$addToSet`
- Upsert
- `findOneAndUpdate()`

**Learning one day at a time. Building skills through practice.** 🚀
