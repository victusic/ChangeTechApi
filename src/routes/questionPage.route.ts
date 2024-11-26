import { Router } from 'express';
const router = Router();
const questionPageController = require('../controllers/questionPage.controller');

router.get('/question/:number', questionPageController.getQuestion);
router.get('/answers/:questionId', questionPageController.getAnswers);
router.get('/vector/:category', questionPageController.getVector);
router.get('/answer/result/:id', questionPageController.getAnswerResult);

module.exports = router;
