const express = require('express');
const {
  getVolunteers,
  approveVolunteer,
} = require('../controllers/volunteerController');

const router = express.Router({ mergeParams: true });

router.route('/').get(getVolunteers);
router.route('/approve/:id').patch(approveVolunteer);

module.exports = router;
