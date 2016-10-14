Standup - Morning Monday Oct 10th

Current status
Finished:
- Auth: all routes working
- Auth middleware working
- All mocks done (photo/profile/residence/user)
- 'Clean up' mock
- All v0.1 models done
- Profile Route: GET / POST / PUT tests working

Currently In Progress:
- Working on routes and tests concurrently for both Profile / Residence
- Profile DELETE route
- Profile tests (75% done)
- Photo Middleware (10% done)
- AWS MOCKS

Goals for morning:
- Finish writing tests for Residence routes: GET / POST / DELETE
- Finish testing for Profile GET / POST / PUT / DELETE
- Photo middleware (aws) 25% done - single test

Review - Night Monday Oct 10th
To Dos

BUGS (5)
- Debug photo delete mongoose error
- POST api/profile route error
- GET api/profile route error

Broader To-Dos

## Standup - Morning Tuesday October 11th

Accomplished yesterday
- Logan: wrote residence tests, debugging, 90% done
- Sarah: worked with logan on above
- Adam: 60-70% done on photo routing, photo middleware. Finished bedroom mock. Merged everything, debugged, merge conflicts, got all tests passing, added all routes to server.js

Today
Logan and Sarah
- 50% CRUD on estimate-router
- 100% done with residence tests

Adam
- Finish all photo routes and tests
- General cleanup and refactor
- More tests out of existing routes
- General application tests

Current status
- All mocks working
- at least one CRUD on all routes

## Afternoon Tuesday October 11th

Accomplished

Logan and Sarah

DONE
- 100% done with residence tests
- Estimate model, estimate router, estimate-mock
- Started estimate-tests
- Finish estimate-tests

TODO:
- Refactor residence tests with var key in ObjectId

Razi

DONE
- Bedroom Routes and tests - POST / GET / PUT / DELETE


Adam

DONE
- uploading multiple photos to AWS
- photo routing is finished
- set up coveralls for code coverage

TODO:
- photo tests





Goals for morning:
-  by deleting a residence remove all bedrooms
-  by deleting bedroom remove all photos and estimate
-  add populate to all model static methods
-  check for if user adding or defining residence with same authorization / check if user is associate with resource
-  refactoring all tests

- afternoon :
  - scratch Goals
  - pagination
  - validation on user inputs
    - residence
    - bedroom
  - using google API for validation address / auto Complete
  -
