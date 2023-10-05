const Router = require('express');
const router = new Router()
const visualPageController = require('../controllers/visualPage.controller');

router.get('/shops', visualPageController.getShops);
router.get('/stats', visualPageController.getStats);
router.patch('/visit', visualPageController.patchVisit);
router.patch('/selection', visualPageController.patchSelection);

module.exports = router
