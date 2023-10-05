const db = require('../dbConfig/pg');

const {MongoClient} = require('mongodb');
const mongoConnectionString = require('../dbConfig/mongo');

const client = new MongoClient(mongoConnectionString);

class visualPageController {
    async getShops(req, res){
        const region = req.query.region;
        const shops = await db.query('SELECT id, image, "officialLink" AS link  FROM "Shop" WHERE region = $1', [region]);
        res.json(shops.rows);
    }

    async getStats(req, res){
        await client.connect()
        const db = client.db("ChangeTech");

        //count visits
        const collectionVisits = db.collection("Visits");
        const visitsCollection = await collectionVisits.find().toArray();
        const visit = visitsCollection[0].count;

        //count selections
        const collectionSelections = db.collection("Selections");
        const selectionsCollection = await collectionSelections.find().toArray();
        const selection = selectionsCollection[0].count;

        //likes stats
        const collectionSelectionStats = db.collection("SelectionStats");
        const selectionStatsCollection = await collectionSelectionStats.find().toArray();
        const selectionStats = (selectionStatsCollection[0].likes * 100) / (selectionStatsCollection[0].likes + selectionStatsCollection[0].dislikes);

        //recalls stats
        const collectionRecalls = db.collection("Recalls");
        const recallsCollection = await collectionRecalls.find().toArray();
        const recalls = (recallsCollection[0].count*100) / visit;

        const result = {
            'visits': visit,
            'selections': selection,
            'stats': Math.round(selectionStats)+'%',
            'recalls': Math.round(recalls)+'%'
        }

        res.json(result);
    }

    async patchVisit(req, res){
        await client.connect()
        const db = client.db("ChangeTech");

        const collectionVisits = db.collection("Visits");
        const visitsCollection = await collectionVisits.find().toArray();
        const visit = visitsCollection[0].count;
        const result = await collectionVisits.findOneAndUpdate({count: visit}, { $set: {count: visit + 1}});

        res.json(result);
    }

    async patchSelection(req, res){
        await client.connect()
        const db = client.db("ChangeTech");
        
        const collectionSelections = db.collection("Selections");
        const selectionsCollection = await collectionSelections.find().toArray();
        const selection = selectionsCollection[0].count;
        const result = await collectionSelections.findOneAndUpdate({count: selection}, { $set: {count: selection + 1}});

        res.json(result);
    }
}

module.exports = new visualPageController()