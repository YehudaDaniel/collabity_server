# Collabity Server
collabity server, a node-js application with:
 - jest (tests)
 - nodemon
 - mongodb (mongoose)
 - typescript
 
# Initialize
run `npm install`
## Initialize database
For using **mongodb** : create file on `./ENV/dev.env` and put `DATABASE_URL` field and fill it with your mongodb url.
make sure to also include `PORT` with a port number inside that file in order for it to run on the desired port.

Also you can include `JWT_SECRET` with your own secret for the jsonwebtoken.

Example (dev.env):

```
DATABASE_URL=mongodb://<ADDRESS>/<COLLECTION NAME>
PORT=3030
JWT_SECRET=<JSONWEBTOKEN CUSTOM SECRET>
```

## Debugging
This project is customized with easy to use debugging tests.
For using the tests, make sure to create file on `./ENV/test.env` and fill out the same variables as mentioned above, make sure to use 
a different databse url for testing.
for example:
```
DATABASE_URL=mongodb://<ADDRESS>/<TESTS COLLECTION NAME>
```
run `npm test` to run tests.

run `npm dev` to run developement mode.
