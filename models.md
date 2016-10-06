Abba:

- Models:
  - User
  - Photo
  - Profile
  - Address
  - Residence
  - Bedroom
  - Estimate


User
-  email
-  password
-  findhash

Profile
-  First Name
-  Last Name
-  Phone #
-  Email
-  Status - validated string
-  userID  - reference
-  Residence - array pop

Photo
-  imageURI - passed back from AWS
-  Key - created by multer
-  UserID - reference

Address
-  zip
-  city
-  street
-  state
-  country
-  latLng
-  apt

Residence
-  dateBuilt
-  sqft - number
-  userID - reference
-  type - validated string
-  addressID - reference to address model
-  bedroomArray - array pop
-  Owner?

Bedroom
-  residenceID - reference to residence model
-  type - validated string
-  bedSize - validated string
-  privateBath - boolean
-  bedType - validated string
-  sleepNum - integer
-  estimateID - pop
-  photoArray - array pop

Estimate
-  monthlyEst - integer
-  nightlyEst - integer
-  occupancyRate - float between 0 and 1
-  bedroomID - reference to bedroom model

Build Sequence
-  User
-  Photo
-  Profile
-  Address
-  Residence
-  Bedroom
-  Estimate
