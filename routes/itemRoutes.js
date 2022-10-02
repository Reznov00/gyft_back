const express = require('express');
const { getItems, getItem, createItem, updateItem, deleteItem } = require('../controllers/itemController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getItems)
  .post(createItem);

router
  .route('/:id')
  .get(getItem)
  .put(updateItem)
  .delete(deleteItem);

module.exports = router;