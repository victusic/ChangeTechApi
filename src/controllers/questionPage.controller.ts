import { Request, Response } from 'express';
import {
  AnswerDTO,
  AnswerResultDTO,
  Query,
  QuestionDTO,
  VectorElDTO,
} from '../types';

const db = require('../../dbconfig/pg');

class questionPageController {
  async getQuestion(req: Request, res: Response) {
    const number = req.params.number;
    const region = req.query.region;
    const category = req.query.category;
    let question: Query<QuestionDTO>;

    switch (region) {
      case 'RU':
        question = await db.query(
          'SELECT id, number, "textRu" AS "text" FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1) AND number = $2',
          [category, number]
        );
        break;
      case 'KZ':
        question = await db.query(
          'SELECT id, number, "textKz" AS "text" FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1) AND number = $2',
          [category, number]
        );
        break;
      default:
        question = await db.query(
          'SELECT id, number, "textEng" AS "text" FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1) AND number = $2',
          [category, number]
        );
        break;
    }

    if (number === '1') {
      const count = await db.query(
        'SELECT COUNT(*) FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1)',
        [category]
      );
      res.setHeader('x-total-count', count.rows[0].count);
    }

    res.json(question.rows);
  }
  async getAnswers(req: Request, res: Response) {
    const questionId = req.params.questionId;
    const region = req.query.region;
    let answers: Query<AnswerDTO[]>;

    switch (region) {
      case 'RU':
        answers = await db.query(
          'SELECT id, type, "textRu" AS "text", "rangeMin", "rangeMax" FROM "Answer" WHERE id IN (SELECT answer FROM "Survey" WHERE question=$1)',
          [questionId]
        );
        break;
      case 'KZ':
        answers = await db.query(
          'SELECT id, type, "textKz" AS "text", "rangeMin", "rangeMax" FROM "Answer" WHERE id IN (SELECT answer FROM "Survey" WHERE question=$1)',
          [questionId]
        );
        break;
      default:
        answers = await db.query(
          'SELECT id, type, "textEng" AS "text", "rangeMin", "rangeMax" FROM "Answer" WHERE id IN (SELECT answer FROM "Survey" WHERE question=$1)',
          [questionId]
        );
        break;
    }

    res.json(answers.rows);
  }

  async getVector(req: Request, res: Response) {
    const category = req.params.category;

    //convert { id: number; spoiling: string } to { id: number; spoiling: number }

    const vector: Query<{ id: number; spoiling: string }[]> = await db.query(
      'SELECT id, spoiling FROM "VectorParameters" WHERE category = $1',
      [category]
    );

    const result: VectorElDTO[] = vector.rows.map(
      (row: { id: number; spoiling: string }) => ({
        ...row,
        spoiling: parseFloat(row.spoiling),
      })
    );

    res.json(result);
  }

  async getAnswerResult(req: Request, res: Response) {
    const answer = req.params.id;

    //convert { vectorParameter: number; value: string } to { vectorParameter: number; value: number }

    const answerResult: Query<{ vectorParameter: number; value: string }[]> =
      await db.query(
        'SELECT "vectorParameter", value FROM "Survey" WHERE answer = $1',
        [answer]
      );

    const result: AnswerResultDTO[] = answerResult.rows.map(
      (row: { vectorParameter: number; value: string }) => ({
        ...row,
        value: parseFloat(row.value),
      })
    );

    res.json(result);
  }
}

module.exports = new questionPageController();
