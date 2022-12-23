const express = require('express');
const {
  getVolunteers,
  approveVolunteer,
} = require('../controllers/volunteerController');

const router = express.Router({ mergeParams: true });

router.route('/volunteers').get(getVolunteers);
router.route('/volunteers/approve/:id').patch(approveVolunteer);

module.exports = router;
