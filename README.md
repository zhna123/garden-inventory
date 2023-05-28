# garden-inventory

Express.js application with EJS template engine

Users can view, create, edit, and delete(with secret password) both inventory categories and items.

## prepare deployment - deployment branch

1. set node version in `package.json` eg:
```
"engines": {
    "node": ">=16.17.1"
  },
```

2. database configuration
```
const mongoDB = process.env.MONGODB_URI || dev_db_url;
```

3. install dependencies and test
`npm install`

4. save changes to github

5. start deploying from railway(deploy directly from git repo branch)

6. connect a mongo db instead of using dev one
