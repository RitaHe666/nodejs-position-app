# Bench NodeJS training assignment

This repository contains codebase for nodeJS training assignment.

### USER
Add 2 project managers and 5 employees in the database. I don't add code to hash user password stored in database. You can find username and password in users collection in database to sign in. And you also can find all the inserted user in [`./__tests__/user.json`](./__tests__/user.json)

## APIs implemented in this project
- To test login API you can use postman to post the request to http://localhost:4000/api/user/login and pass `userName` and `password` parameters in request body

To test the following API you need to firstly logged in and get a token in the login API response. And then set `authorization` request header to the token with `Bear ` prefix to pass authentication. The `authorization` value should be like this one 'Bear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkZyYW5rIiwidXNlcklkIjoiNjM4ZWIzOGMxZWJkMDk3NjcxZDJlNzkzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwNDcwMDg1LCJleHAiOjE2NzA1NTY0ODV9.2-8OiCDU9b47Pdft-dmD7ghUl7Ahf04NynsEmHd4IHQ'

- api/position/summaries: See a list of available openings in the company

- api/position/getPositionById: check the details of an opening. The position id parameter `id` should be passed in request body

- api/position/apply: apply for the opening

- api/position: add an opening

- api/position/:id: delete an opening

- api/position/update: update an opening

- api/position/getAllApplicantIds: return the applicant information, return a list of userIds for the userIds which have applied

- api/getAll: get a list of all users

- api/user: add a user


### `npm install`
you should npm install, it is necessary to run the code

### `npm run start`
Runs the app in the development mode and start the local server [http://localhost:4000] (http://localhost:4000)
We can use postman to test all the implemented APIs.

### `npm run test`

Run `npm run test` to run the unit test cases. now, I have written test cases to test controller and middleware


