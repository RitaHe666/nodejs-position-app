# Bench NodeJS training assignment

This repository contains codebase for nodeJS training assignment.
### `USER`
Add 2 project managers and 5 employees in the database and give all password '123456' for easily to remember.
You can find all the inserted user in [`./__tests__/user.json`](./__tests__/user.json)
## Functionalities implemented in this project
- To test login API you can post the request to http://localhost:4000/api/user/login and pass `userName` and `password` parameters in request body in postman
- To test the following API you need to firstly logged in and get a token in the login API response. Set `authorization` request header to be the token with `Bear ` prefix.
- api/position/summaries: See a list of available openings in the company
- api/position/getPositionById: check the details of an opening. The position id parameter `id` should be passed in request body
- api/position/apply: apply for the opening
- api/position: add an opening. 
- api/position/:id: delete an opening
- api/position/update: update an opening
- api/position/getAllApplicantIds: return the applicant information, return a list of userIds for the userIds which have applied

### `npm install`
you should npm install, it is necessary to run the code

### `npm run start`
Runs the app in the development mode and start the local server [http://localhost:4000] (http://localhost:5000)
We can open postman to test the APIs as no UI implemented.

### `npm run test`

Run `npm run test` to run the unit test cases. now, I have written test cases to test controller and middleware


