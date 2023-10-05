const {MongoClient} = require('mongodb');
const mongoConnectionString = require('../dbconfig/mongo');

const client = new MongoClient(mongoConnectionString);

class selectionStatsController {
    async patchRecall(req, res){
        await client.connect()
        const db = client.db("ChangeTech");

        const collectionRecalls = db.collection("Recalls");
        const recallsCollection = await collectionRecalls.find().toArray();
        const recall = recallsCollection[0].count;
        const result = await collectionRecalls.findOneAndUpdate({count: recall}, { $set: {count: recall + 1}});

        res.json(result);
    }
    async patchLike(req, res){
        await client.connect()
        const db = client.db("ChangeTech");

        const collectionSelectionStats = db.collection("SelectionStats");
        const selectionStatsCollection = await collectionSelectionStats.find().toArray();
        const selectionStats = selectionStatsCollection[0].likes;
        const result = await collectionSelectionStats.findOneAndUpdate({likes: selectionStats}, { $set: {likes: selectionStats + 1}});

        res.json(result);
    }
    async patchDislike(req, res){
        await client.connect()
        const db = client.db("ChangeTech");

        const collectionSelectionStats = db.collection("SelectionStats");
        const selectionStatsCollection = await collectionSelectionStats.find().toArray();
        const selectionStats = selectionStatsCollection[0].dislikes;
        const result = await collectionSelectionStats.findOneAndUpdate({dislikes: selectionStats}, { $set: {dislikes: selectionStats + 1}});

        res.json(result);
    }
}

module.exports = new selectionStatsController()