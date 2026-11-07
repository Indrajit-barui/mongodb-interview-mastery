# MongoDB Day 05 — Arrays and Nested Documents

A beginner-friendly guide to **MongoDB arrays, nested documents, and arrays of objects** using **Mongoose**.

## What you'll learn

- Store arrays in MongoDB documents
- Query arrays with direct matches, `$all`, `$size`, and `$elemMatch`
- Update arrays with `$push`, `$addToSet`, `$pull`, and `$pop`
- Create and query nested documents using dot notation
- Update nested fields without replacing the whole object
- Work with arrays of nested documents
- Practise everything with exercises

## 1. Setup: Our Mongoose User model

We'll extend the existing `User` model rather than create a separate model.

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  course: {
    type: String,
    default: "BCA"
  },

  // An array of strings. A new user starts with an empty array.
  skills: {
    type: [String],
    default: []
  },

  // Group related address fields into one nested document.
  address: {
    city: String,
    state: String,
    country: String,
    pincode: Number
  },

  // An array of objects; each object describes one qualification.
  education: [{
    degree: String,
    college: String,
    year: Number
  }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;
```

> **Note:** `unique: true` creates a unique index; it is not a Mongoose validator. A duplicate email can trigger a MongoDB duplicate-key error.

## 2. What is an array?

An **array** stores multiple values in a single field.

```javascript
{
  name: "Rahul",
  skills: ["HTML", "CSS", "JavaScript"]
}
```

Create a document:

```javascript
// Store one user with three skills in the skills array.
await User.create({
  name: "Rahul",
  age: 21,
  email: "rahul@example.com",
  skills: ["HTML", "CSS", "JavaScript"]
});
```

## 3. Query arrays

### Find users with a particular skill

```javascript
// Matches users whose skills array contains "JavaScript".
const users = await User.find({ skills: "JavaScript" });
```

### `$all`: Require multiple array values

```javascript
// The user must have BOTH skills, but can also have other skills.
const users = await User.find({
  skills: { $all: ["HTML", "JavaScript"] }
});
```

### `$size`: Match exact array length

```javascript
// Only users with exactly three skills will match.
const users = await User.find({
  skills: { $size: 3 }
});
```

**Important:** `$size` matches an exact length. It does not directly support a range such as "more than three skills."

## 4. Update arrays

### `$push`: Add an element

```javascript
// Adds Python to the end of Rahul's skills array.
// Running it again can add another "Python" (duplicates are allowed).
await User.updateOne(
  { name: "Rahul" },
  { $push: { skills: "Python" } }
);
```

### `$addToSet`: Add only if absent

```javascript
// Adds Python only when the exact value is not already present.
await User.updateOne(
  { name: "Rahul" },
  { $addToSet: { skills: "Python" } }
);
```

### `$pull`: Remove matching elements

```javascript
// Removes every occurrence of "CSS" from Rahul's skills.
await User.updateOne(
  { name: "Rahul" },
  { $pull: { skills: "CSS" } }
);
```

### `$pop`: Remove from one end

```javascript
// Remove the last element from the array.
await User.updateOne(
  { name: "Rahul" },
  { $pop: { skills: 1 } }
);

// Remove the first element from the array.
await User.updateOne(
  { name: "Rahul" },
  { $pop: { skills: -1 } }
);
```

### Add multiple values with `$each`

```javascript
// Append two skills in one update operation.
await User.updateOne(
  { name: "Rahul" },
  { $push: { skills: { $each: ["Node.js", "MongoDB"] } } }
);

// Add two skills, skipping values that already exist.
await User.updateOne(
  { name: "Rahul" },
  { $addToSet: { skills: { $each: ["Node.js", "MongoDB"] } } }
);
```

### Array operator comparison

| Operator | Purpose | Duplicates? |
| --- | --- | --- |
| `$push` | Append value | Allowed |
| `$addToSet` | Add value only if absent | Avoids adding an existing exact value |
| `$pull` | Remove matching values | Removes all matches |
| `$pop: 1` | Remove last value | Not applicable |
| `$pop: -1` | Remove first value | Not applicable |

## 5. Nested documents

A **nested document** groups related fields inside an object.

```javascript
{
  name: "Rahul",
  address: {
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    pincode: 700001
  }
}
```

### Create a user with a nested address

```javascript
// The address fields belong to the same nested object.
await User.create({
  name: "Amit",
  age: 22,
  email: "amit@example.com",
  skills: ["HTML", "JavaScript"],
  address: {
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    pincode: 700001
  }
});
```

## 6. Query nested documents with dot notation

Use a quoted path such as `"address.city"` to access a nested field.

```javascript
// Find users whose address.city equals Kolkata.
const users = await User.find({
  "address.city": "Kolkata"
});
```

```javascript
// Compare the numeric pincode stored inside address.
const users = await User.find({
  "address.pincode": { $gte: 700000 }
});
```

```javascript
// Require both city and state to match.
const users = await User.find({
  "address.city": "Kolkata",
  "address.state": "West Bengal"
});
```

## 7. Update nested fields safely

### Update only the city

```javascript
// Dot notation updates just the city field.
// Other address fields remain unchanged.
await User.updateOne(
  { name: "Rahul" },
  { $set: { "address.city": "Delhi" } }
);
```

### Avoid replacing the whole address accidentally

```javascript
// CAUTION: This sets the entire address value to a new object.
// Previously stored fields such as state, country, and pincode
// can be lost because they are not included in the replacement.
await User.updateOne(
  { name: "Rahul" },
  { $set: { address: { city: "Delhi" } } }
);
```

**Rule:** Use dot notation when you want to change only one nested field.

## 8. Arrays of nested documents

MongoDB can store **objects inside arrays**.

```javascript
{
  name: "Rahul",
  education: [
    { degree: "BCA", college: "ABC College", year: 2027 },
    { degree: "12th", college: "XYZ School", year: 2023 }
  ]
}
```

### Query an array of objects

```javascript
// Matches a user if at least one education entry has degree "BCA".
const users = await User.find({
  "education.degree": "BCA"
});
```

### `$elemMatch`: Multiple conditions on the same array element

```javascript
// Both conditions must match the SAME education object.
const users = await User.find({
  education: {
    $elemMatch: {
      degree: "BCA",
      year: 2027
    }
  }
});
```

Why `$elemMatch` matters:

```javascript
{
  education: [
    { degree: "BCA", year: 2026 },
    { degree: "MCA", year: 2027 }
  ]
}
```

A query with separate conditions on `"education.degree"` and `"education.year"` can match this document because different array elements satisfy the conditions. `$elemMatch` prevents that by requiring both conditions on **one element**.

### Add an education record

```javascript
// Append one new object to the education array.
await User.updateOne(
  { name: "Rahul" },
  {
    $push: {
      education: {
        degree: "MCA",
        college: "Example University",
        year: 2029
      }
    }
  }
);
```

### Update a matching education record

```javascript
// The positional $ refers to the first matching education array element.
await User.updateOne(
  { name: "Rahul", "education.degree": "BCA" },
  { $set: { "education.$.year": 2027 } }
);
```

## 9. Quick reference

| Task | Mongoose query |
| --- | --- |
| Has JavaScript skill | `User.find({ skills: "JavaScript" })` |
| Has both HTML and JS | `User.find({ skills: { $all: ["HTML", "JavaScript"] } })` |
| Exactly 3 skills | `User.find({ skills: { $size: 3 } })` |
| Add Python | `User.updateOne(filter, { $push: { skills: "Python" } })` |
| Add Python without duplicate | `User.updateOne(filter, { $addToSet: { skills: "Python" } })` |
| Remove CSS | `User.updateOne(filter, { $pull: { skills: "CSS" } })` |
| Lives in Kolkata | `User.find({ "address.city": "Kolkata" })` |
| Change city | `User.updateOne(filter, { $set: { "address.city": "Delhi" } })` |
| BCA completed in 2027 | `User.find({ education: { $elemMatch: { degree: "BCA", year: 2027 } } })` |

`filter` in the table is a placeholder such as `{ name: "Rahul" }`.

## 10. Practice questions

Try solving these yourself before looking at the examples above.

1. Create a user named Amit with skills HTML, CSS, and JavaScript.
2. Find all users who have JavaScript in their skills.
3. Add Python to Rahul's skills **without duplicates**.
4. Remove CSS from Rahul's skills.
5. Find all users living in Kolkata.
6. Change Rahul's city to Delhi **without changing other address fields**.
7. Find users who know **both** HTML and JavaScript.
8. Find users who have **exactly three skills**.
9. Find users whose education array contains a **BCA** entry with year **2027**.

### Bonus challenges

10. Add both React and Node.js to a user's skills without adding duplicate values.
11. Find users with a nested address pincode greater than or equal to 700000.
12. Add an MCA education object to a user's education array.
13. Update the year of Rahul's BCA education entry.

## 11. Common mistakes

- **Using `$push` to prevent duplicates:** use `$addToSet` instead.
- **Expecting `$size: 3` to mean "at least 3":** it means **exactly 3**.
- **Writing `address.city` as an unquoted JavaScript key:** use `"address.city"`.
- **Replacing `address` instead of one field:** use `$set` with `"address.city"` to preserve other fields.
- **Using separate dot-notation conditions on an array of objects when they must match the same object:** use `$elemMatch`.
- **Forgetting `await`:** Mongoose operations are asynchronous; `await` ensures you receive the resolved result.

---

## Day 05 completion checklist

- [ ] I can create an array field in a Mongoose schema.
- [ ] I understand `$all` and `$size`.
- [ ] I can use `$push`, `$addToSet`, `$pull`, and `$pop`.
- [ ] I can query nested fields using dot notation.
- [ ] I can update a nested field without replacing its parent object.
- [ ] I understand when to use `$elemMatch`.
- [ ] I solved the nine practice questions.

**Next:** Continue the MongoDB roadmap after completing the exercises.
