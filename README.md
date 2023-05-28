# garden-inventory

Express.js application with EJS template engine

## prepare deployment

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