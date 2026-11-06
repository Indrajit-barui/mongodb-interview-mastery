# MongoDB Query Operators --- Day 04

A practical guide to MongoDB query operators using a `User` collection
and Mongoose examples.

## Table of contents

1.  [What are query operators?](#1-what-are-query-operators)
2.  [Sample data](#2-sample-data)
3.  [Comparison operators](#3-comparison-operators)
4.  [Logical operators](#4-logical-operators)
5.  [Array membership operators](#5-array-membership-operators)
6.  [Element operators](#6-element-operators)
7.  [Array operators](#7-array-operators)
8.  [Evaluation operators](#8-evaluation-operators)
9.  [Combining operators](#9-combining-operators)
10. [Using operators with Mongoose](#10-using-operators-with-mongoose)
11. [Quick reference](#11-quick-reference)
12. [Practice questions](#12-practice-questions)
13. [Important notes](#13-important-notes)

------------------------------------------------------------------------

## 1. What are query operators?

Query operators let you find documents by applying conditions.

For example:

``` javascript
const users = await User.find({
  age: { $gt: 20 }
});
```

This finds users whose `age` is greater than `20`.

A normal filter can also be written without an operator:

``` javascript
const users = await User.find({
  course: "BCA"
});
```

This finds users whose course is exactly `"BCA"`.

## 2. Sample data

Use this sample collection for the examples:

``` javascript
db.users.insertMany([
  {
    name: "Rahul",
    age: 21,
    email: "rahul@gmail.com",
    course: "BCA",
    marks: 85,
    city: "Kolkata",
    skills: ["HTML", "CSS", "JavaScript", "React"]
  },
  {
    name: "Amit",
    age: 19,
    email: "amit@gmail.com",
    course: "BBA",
    marks: 65,
    city: "Delhi",
    skills: ["Excel", "PowerPoint"]
  },
  {
    name: "Priya",
    age: 22,
    email: "priya@gmail.com",
    course: "BCA",
    marks: 95,
    city: "Kolkata",
    skills: ["Python", "Java", "SQL"]
  },
  {
    name: "Rohit",
    age: 20,
    email: "rohit@gmail.com",
    course: "BBA",
    marks: 45,
    city: "Mumbai",
    skills: ["HTML", "CSS"]
  },
  {
    name: "Debraj",
    age: 23,
    email: "debraj@gmail.com",
    course: "BCA",
    marks: 75,
    city: "Delhi",
    skills: ["JavaScript", "React"]
  }
]);
```

The same filters work in Mongoose:

``` javascript
const users = await User.find({ marks: { $gt: 80 } });
```

> If you use the sample data more than once, clear the old test
> documents first or use a fresh collection. In Mongoose, a
> `unique: true` field has a database index; inserting the same email
> again can cause a duplicate-key error.

## 3. Comparison operators

Comparison operators compare a field with a value.

  Operator   Meaning
  ---------- --------------------------
  `$eq`      Equal to
  `$ne`      Not equal to
  `$gt`      Greater than
  `$gte`     Greater than or equal to
  `$lt`      Less than
  `$lte`     Less than or equal to

### `$eq` --- Equal

Find users aged exactly 21:

``` javascript
const users = await User.find({
  age: { $eq: 21 }
});
```

For equality, this shorter form is equivalent:

``` javascript
const users = await User.find({ age: 21 });
```

### `$ne` --- Not equal

Find users who are not studying BCA:

``` javascript
const users = await User.find({
  course: { $ne: "BCA" }
});
```

Note: `$ne` can also match documents where the field is missing.

### `$gt` --- Greater than

Find users with marks above 80:

``` javascript
const users = await User.find({
  marks: { $gt: 80 }
});
```

### `$gte` --- Greater than or equal to

Find users with marks of 75 or more:

``` javascript
const users = await User.find({
  marks: { $gte: 75 }
});
```

### `$lt` --- Less than

Find users younger than 21:

``` javascript
const users = await User.find({
  age: { $lt: 21 }
});
```

### `$lte` --- Less than or equal to

Find users aged 21 or younger:

``` javascript
const users = await User.find({
  age: { $lte: 21 }
});
```

### Range example

Find users with marks from 60 to 90, including both boundaries:

``` javascript
const users = await User.find({
  marks: {
    $gte: 60,
    $lte: 90
  }
});
```

## 4. Logical operators

Logical operators combine or negate conditions.

  Operator   Meaning
  ---------- -----------------------------------
  `$and`     Every condition must match
  `$or`      At least one condition must match
  `$nor`     None of the conditions may match
  `$not`     Negates a field condition

### `$and` --- All conditions must match

Find BCA users whose marks are above 80:

``` javascript
const users = await User.find({
  $and: [
    { course: "BCA" },
    { marks: { $gt: 80 } }
  ]
});
```

For different fields, implicit AND is usually shorter:

``` javascript
const users = await User.find({
  course: "BCA",
  marks: { $gt: 80 }
});
```

Both conditions must be true.

### `$or` --- At least one condition must match

Find users studying BCA or BBA:

``` javascript
const users = await User.find({
  $or: [
    { course: "BCA" },
    { course: "BBA" }
  ]
});
```

### `$nor` --- No condition may match

Find users who are neither from Kolkata nor Delhi:

``` javascript
const users = await User.find({
  $nor: [
    { city: "Kolkata" },
    { city: "Delhi" }
  ]
});
```

### `$not` --- Negate a field condition

Find users whose marks are not greater than 80:

``` javascript
const users = await User.find({
  marks: {
    $not: { $gt: 80 }
  }
});
```

`$not` is generally used with another operator on a field. It is not a
replacement for `$and`, `$or`, or `$nor`. It can also match documents
where the field is missing, so consider your data shape when using it.

## 5. Array membership operators

These operators check whether a field's value matches one or more values
from a list.

  Operator   Meaning
  ---------- -----------------------------------------------
  `$in`      Matches any value in the supplied list
  `$nin`     Does not match any value in the supplied list

### `$in`

Find users whose course is BCA or BBA:

``` javascript
const users = await User.find({
  course: { $in: ["BCA", "BBA"] }
});
```

This is often shorter than writing multiple `$or` conditions.

### `$nin`

Find users whose course is neither BCA nor BBA:

``` javascript
const users = await User.find({
  course: { $nin: ["BCA", "BBA"] }
});
```

Note: `$nin` also matches documents where the field is missing.

## 6. Element operators

Element operators check whether a field exists or has a particular BSON
type.

  Operator    Meaning
  ----------- -------------------------------
  `$exists`   Checks whether a field exists
  `$type`     Checks a field's BSON type

### `$exists`

Find documents that contain an `email` field:

``` javascript
const users = await User.find({
  email: { $exists: true }
});
```

Find documents where `email` is missing:

``` javascript
const users = await User.find({
  email: { $exists: false }
});
```

Important: `$exists: true` also matches a field whose value is `null`.
It checks field presence, not whether the value is non-null.

### `$type`

Find users whose `age` field has a numeric BSON type:

``` javascript
const users = await User.find({
  age: { $type: "number" }
});
```

Common BSON type aliases include:

  Alias          BSON type
  -------------- -----------------------
  `"string"`     String
  `"number"`     Any numeric BSON type
  `"bool"`       Boolean
  `"array"`      Array
  `"object"`     Embedded document
  `"date"`       Date
  `"objectId"`   ObjectId

## 7. Array operators

Assume a document contains:

``` javascript
{
  name: "Rahul",
  skills: ["HTML", "CSS", "JavaScript", "React"]
}
```

  -----------------------------------------------------------------------
  Operator                            Meaning
  ----------------------------------- -----------------------------------
  `$all`                              Array contains every specified
                                      value

  `$size`                             Array has an exact number of
                                      elements

  `$elemMatch`                        At least one array element matches
                                      all specified conditions
  -----------------------------------------------------------------------

### `$all`

Find users whose skills contain both HTML and CSS:

``` javascript
const users = await User.find({
  skills: { $all: ["HTML", "CSS"] }
});
```

The array may contain additional skills too.

### `$size`

Find users with exactly two skills:

``` javascript
const users = await User.find({
  skills: { $size: 2 }
});
```

`$size` checks an exact array length. It does not directly support a
range such as "at least two"; use an appropriate alternative, such as an
aggregation expression, for range-based array-length checks.

### `$elemMatch`

Suppose documents contain an array of scores:

``` javascript
{
  name: "Rahul",
  scores: [45, 65, 85, 95]
}
```

Find users who have at least one score greater than 80 and less than 90:

``` javascript
const users = await User.find({
  scores: {
    $elemMatch: {
      $gt: 80,
      $lt: 90
    }
  }
});
```

The same array element must satisfy both conditions. Here, `85` matches.

`$elemMatch` is especially useful for arrays of embedded objects:

``` javascript
{
  name: "Rahul",
  subjects: [
    { subject: "Math", marks: 85 },
    { subject: "English", marks: 65 }
  ]
}
```

Find users with a Math subject whose marks are above 80:

``` javascript
const users = await User.find({
  subjects: {
    $elemMatch: {
      subject: "Math",
      marks: { $gt: 80 }
    }
  }
});
```

## 8. Evaluation operators

### `$regex` --- Pattern-based string search

Find names that start with `R`:

``` javascript
const users = await User.find({
  name: { $regex: "^R" }
});
```

Find names containing `it`, without case sensitivity:

``` javascript
const users = await User.find({
  name: {
    $regex: "it",
    $options: "i"
  }
});
```

Useful regex patterns:

  Pattern           Meaning
  ----------------- ---------------------------
  `"^A"`            Starts with A
  `"a$"`            Ends with a
  `"rah"`           Contains rah
  `$options: "i"`   Case-insensitive matching

Be careful with user-provided regex patterns. Escape input when you
intend literal text search, and consider indexing/search-specific
solutions for large collections.

### `$expr` --- Compare fields or use expressions

Suppose a document contains:

``` javascript
{
  name: "Rahul",
  marks: 85,
  passingMarks: 40
}
```

Find documents where `marks` is greater than `passingMarks`:

``` javascript
const users = await User.find({
  $expr: {
    $gt: ["$marks", "$passingMarks"]
  }
});
```

Inside `$expr`, `"$marks"` and `"$passingMarks"` refer to fields in the
current document.

`$expr` is useful when a condition compares one field with another,
rather than comparing a field with a fixed value.

## 9. Combining operators

You can combine multiple operators in one query.

Example: Find BCA users from Kolkata with marks of at least 80:

``` javascript
const users = await User.find({
  course: "BCA",
  city: "Kolkata",
  marks: { $gte: 80 }
});
```

This uses implicit AND: all three conditions must match.

Example: Find users from Kolkata or Delhi whose marks are above 70:

``` javascript
const users = await User.find({
  city: { $in: ["Kolkata", "Delhi"] },
  marks: { $gt: 70 }
});
```

Example: Find users who are either BCA students with marks above 80, or
BBA students with marks above 60:

``` javascript
const users = await User.find({
  $or: [
    { course: "BCA", marks: { $gt: 80 } },
    { course: "BBA", marks: { $gt: 60 } }
  ]
});
```

## 10. Using operators with Mongoose

The query operators are MongoDB features. Mongoose lets you use them
through model methods such as `find()`.

``` javascript
const users = await User.find({
  marks: { $gt: 80 }
});
```

You can combine filtering, sorting, projection, pagination, and
limiting:

``` javascript
const page = 1;
const limit = 5;
const skip = (page - 1) * limit;

const users = await User.find({
  course: "BCA",
  marks: { $gte: 70 }
})
  .select("name age marks")
  .sort({ createdAt: -1, _id: -1 })
  .skip(skip)
  .limit(limit);
```

What each part does:

-   `find()` filters matching documents.
-   `select()` chooses which fields to return.
-   `sort()` orders the results.
-   `skip()` skips documents for pagination.
-   `limit()` caps the number of returned documents.

The `_id` sort field is a tie-breaker when multiple documents have the
same `createdAt`, helping make pagination order more consistent.

## 11. Quick reference

  -----------------------------------------------------------------------
  Category                Operator                Purpose
  ----------------------- ----------------------- -----------------------
  Comparison              `$eq`                   Equal

  Comparison              `$ne`                   Not equal

  Comparison              `$gt`                   Greater than

  Comparison              `$gte`                  Greater than or equal

  Comparison              `$lt`                   Less than

  Comparison              `$lte`                  Less than or equal

  Logical                 `$and`                  All conditions

  Logical                 `$or`                   At least one condition

  Logical                 `$nor`                  No conditions

  Logical                 `$not`                  Negates a field
                                                  condition

  Membership              `$in`                   Match any listed value

  Membership              `$nin`                  Exclude listed values

  Element                 `$exists`               Check field presence

  Element                 `$type`                 Check BSON type

  Array                   `$all`                  Match all specified
                                                  array values

  Array                   `$size`                 Exact array length

  Array                   `$elemMatch`            Match an array element
                                                  against conditions

  Evaluation              `$regex`                Pattern-based string
                                                  matching

  Evaluation              `$expr`                 Evaluate expressions,
                                                  including field
                                                  comparisons
  -----------------------------------------------------------------------

### Do not confuse query operators with update operators

  -----------------------------------------------------------------------
  Type                    Examples                Purpose
  ----------------------- ----------------------- -----------------------
  Query operators         `$gt`, `$in`, `$or`     Find documents

  Update operators        `$set`, `$inc`,         Modify documents
                          `$unset`, `$push`       

  Projection              `{ name: 1, age: 1 }`   Choose returned fields
  -----------------------------------------------------------------------

## 12. Practice questions

Use the `User` model and write a Mongoose query for each task.

1.  Find users whose marks are greater than 70 and age is less than 23.
2.  Find users who belong to either Kolkata or Delhi.
3.  Find users who do not belong to BCA.
4.  Find users who have both JavaScript and React in their skills array.
5.  Find users whose names start with A, case-insensitively.
6.  Find users whose marks are between 60 and 90, including both
    boundaries.
7.  Find users who have an email field.
8.  Find users who have exactly three skills.
9.  Find users who are neither from Kolkata nor Delhi.
10. Find users whose marks are greater than their passing marks using
    `$expr`.

Try writing each query yourself before checking documentation or notes.

## 13. Important notes

-   `$gt` means strictly greater than; `$gte` includes equality.
-   `$lt` means strictly less than; `$lte` includes equality.
-   Multiple conditions on different fields are combined with AND by
    default.
-   `$in` checks whether a field matches any value in a list.
-   `$all` checks whether an array contains every specified value.
-   `$size` matches an exact array length.
-   `$elemMatch` ensures one array element satisfies all conditions
    inside it.
-   `$exists: true` checks whether a field is present, even if its value
    is `null`.
-   `$ne` and `$nin` can match documents where the queried field is
    missing.
-   Query operators find documents; update operators modify them.

**Learning goal:** Be comfortable writing comparison, logical,
membership, element, array, and basic evaluation queries before moving
on to more advanced MongoDB topics.
