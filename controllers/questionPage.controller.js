const db = require('../dbConfig/pg');

class questionPageController {
    async getQuestion(req, res){
        const number = req.params.number;
        const region = req.query.region;
        const category = req.query.category;
        let question;

        switch (region) {
            case 'Ru':
                question = await db.query('SELECT id, number, "textRu" AS "text" FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1) AND number = $2', [category, number]);
                break;
            case 'Kz':
                question = await db.query('SELECT id, number, "textKz" AS "text" FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1) AND number = $2', [category, number]);
                break;
            default:
                question = await db.query('SELECT id, number, "textEng" AS "text" FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1) AND number = $2', [category, number]);
                break;
        }

        if (number == 1){
            const count = await db.query('SELECT COUNT(*) FROM "Question" WHERE id IN (SELECT question FROM "Survey" WHERE category=$1)', [category]);
            res.setHeader('x-total-count', count.rows[0].count);
        }

        res.json(question.rows);
    }
    async getAnsers(req, res){
        const questionId = req.params.questionId;
        const region = req.query.region;
        let ansers;

        switch (region) {
            case 'Ru':
                ansers = await db.query('SELECT id, type, "textRu" AS "text", "rangeMin", "rangeMax" FROM "Anser" WHERE id IN (SELECT anser FROM "Survey" WHERE question=$1)', [questionId]);
                break;
            case 'Kz':
                ansers = await db.query('SELECT id, type, "textKz" AS "text", "rangeMin", "rangeMax" FROM "Anser" WHERE id IN (SELECT anser FROM "Survey" WHERE question=$1)', [questionId]);
                break;
            default:
                ansers = await db.query('SELECT id, type, "textEng" AS "text", "rangeMin", "rangeMax" FROM "Anser" WHERE id IN (SELECT anser FROM "Survey" WHERE question=$1)', [questionId]);
                break;
        }

        res.json(ansers.rows);
    }

    async getVector(req, res){
        const category = req.params.category;

        const vector = await db.query('SELECT id, spoiling FROM "VectorParameters" WHERE category = $1', [category]);

        res.json(vector.rows);
    }

    async getAnserResult(req, res){
        const anser = req.params.id;

        const result = await db.query('SELECT "vectorParameter", value FROM "Survey" WHERE anser = $1', [anser]);

        res.json(result.rows);
    }
}

module.exports = new questionPageController()