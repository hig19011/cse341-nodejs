const express = require('express');
const router = express.Router();

const searchController = require('../../controllers/prove/prove08/search');

router.get('/', searchController.getSearchProducts);
router.post('/', searchController.postSearchProducts);

module.exports = router;