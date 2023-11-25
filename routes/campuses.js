/*==================================================
/routes/campuses.js

It defines all the campuses-related routes.
==================================================*/
// Import Express module
const express = require('express');
// Create an Express router function called "router"
const router = express.Router();
// Import database models
const { Student, Campus } = require('../database/models');

// Import a middleware to replace "try and catch" for request handler, for a concise coding (fewer lines of code)
const ash = require('express-async-handler');

/* GET ALL CAMPUSES: async/await using "try-catch" */
// router.get('/', async (req, res, next) => {
//   try {
//     let campuses = await Campus.findAll({include: [Student]});
//     res.status(200).json(campuses);
//   } 
//   catch(err) {
//     next(err);
//   }
// });


/*Beginning of project edits*/
router.get('/campus/:id', async (req, res) => {
  try {
    const { id } = req.params;//get the id from the res
    let single_campus = await Campus.findOne(
      {
        where: {//gets the campus
          id: id
        },
        include: [Student]//get the student
      }
    );
    res.status(200).json({
      success: single_campus
    });//return a error if app crashs
  }
  catch (error) {
    res.status(400).json(error);//return a error if app crashs
  }
});

router.get('/student/:id', async (req, res) => {
  try {
    const { id } = req.params;//get the id from the res
    let student_info = await Student.findOne(
      {
        where: {//gets the student
          id: id
        },
        include: [Campus]//get the campus
      }
    );
    res.status(200).json({
      success: student_info
    });//return a error if app crashs
  }
  catch (error) {
    res.status(400).json(error);//return a error if app crashs
  }
});
/*End of project edits*/

/* GET ALL CAMPUSES */
router.get('/', ash(async (req, res) => {
  let campuses = await Campus.findAll({ include: [Student] });  // Get all campuses and their associated students
  res.status(200).json(campuses);  // Status code 200 OK - request succeeded
}));

/* GET CAMPUS BY ID */
router.get('/:id', ash(async (req, res) => {
  // Find campus by Primary Key
  let campus = await Campus.findByPk(req.params.id, { include: [Student] });  // Get the campus and its associated students
  res.status(200).json(campus);  // Status code 200 OK - request succeeded
}));

/* DELETE CAMPUS */
router.delete('/:id', ash(async (req, res) => {
  await Campus.destroy({
    where: {
      id: req.params.id
    }
  });
  res.status(200).json("Deleted a campus!");
}));

/* ADD NEW CAMPUS */
router.post('/', ash(async (req, res) => {
  let newCampus = await Campus.create(req.body);
  res.status(200).json(newCampus);  // Status code 200 OK - request succeeded
}));

/* EDIT CAMPUS */
router.put('/:id', ash(async (req, res) => {
  await Campus.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  // Find campus by Primary Key
  let campus = await Campus.findByPk(req.params.id, { include: [Student] });  // Get the campus and its associated students
  res.status(201).json(campus);  // Status code 201 Created - successful creation of a resource
}))

// Export router, so that it can be imported to construct the apiRouter (app.js)
module.exports = router;