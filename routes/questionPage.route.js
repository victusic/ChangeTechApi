const Router = require('express');
const router = new Router()
const questionPageController = require('../controllers/questionPage.controller');

router.get('/question/:number', questionPageController.getQuestion);
router.get('/ansers/:questionId', questionPageController.getAnsers);
router.get('/vector/:category', questionPageController.getVector);
router.get('/anser_result/:id', questionPageController.getAnserResult);

module.exports = router
