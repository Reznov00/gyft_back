const express = require('express');
const { getRequests, getRequest, createRequest, updateRequest, deleteRequest } = require('../controllers/requestController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getRequests)
  .post(createRequest);

router
  .route('/:id')
  .get(getRequest)
  .put(updateRequest)
  .delete(deleteRequest);

module.exports = router;