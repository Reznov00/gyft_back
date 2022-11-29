const express = require('express');
const {
  getQueries,
  getQuery,
  createQuery,
  updateQuery,
  addAnswer,
  getQueriesByUser,
} = require('../controllers/queryController');
const router = express.Router({ mergeParams: true });

router.route('/').post(createQuery);

router.route('/:user').get(getQueries);
router.route('/posted/:user').get(getQueriesByUser);

router.route('/answer/:id').put(addAnswer);

router.route('/:id').get(getQuery).put(updateQuery);

module.exports = router;
