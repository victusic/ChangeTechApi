const Router = require('express');
const router = new Router()
const selectionStatsController = require('../controllers/selectionStats.controller');

router.patch('/recall', selectionStatsController.patchRecall);
router.patch('/like', selectionStatsController.patchLike);
router.patch('/dislike', selectionStatsController.patchDislike);

module.exports = router
