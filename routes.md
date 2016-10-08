## Auth Routes:
- POST : /api/signup
- GET  : /api/lognin

---

## Profile Routes:
- POST :
  - /api/profile
- GET  :
  -  /api/profile/:id
- PUT  :
  - /api/profile/:profID

 ## Profile / Photo Routes:
 - POST :
   - /api/profile/:profID/photo
 - PUT  :
   -  /api/profile/:profID/photo/:photoID
 - DELETE  :
   -  /api/profile/:profID/photo/:photoID

  ---

  ## Residence Routes:
  - POST : /api/residence
  - GET  :  /api/residence/:id
  - DELETE  :  /api/residence/:id

  ## Residence / Bedroom Routes:
  - GET : /api/residence/:resID/bedroom/:bedID
  - POST : /api/residence/:resID/bedroom
  - PUT  : /api/residence/:resID/bedroom/:bedID
  - DELETE  : /api/residence/:resID/bedroom/:bedID

  ---
