import { Request, Response } from 'express';
import { DislikeDTO, LikeDTO, Query, RecallDTO } from '../types';

const { MongoClient } = require('mongodb');
const mongoConnectionString = require('../../dbconfig/mongo');

const client = new MongoClient(mongoConnectionString);

class selectionStatsController {
  async patchRecall(req: Request, res: Response) {
    await client.connect();
    const db = client.db('ChangeTech');

    const collectionRecalls = db.collection('Recalls');
    const recallsCollection = await collectionRecalls.find().toArray();
    const recall = recallsCollection[0].count;
    const result: Query<RecallDTO> = await collectionRecalls.findOneAndUpdate(
      { count: recall },
      { $set: { count: recall + 1 } }
    );

    res.json(result);
  }
  async patchLike(req: Request, res: Response) {
    await client.connect();
    const db = client.db('ChangeTech');

    const collectionSelectionStats = db.collection('SelectionStats');
    const selectionStatsCollection = await collectionSelectionStats
      .find()
      .toArray();
    const selectionStats = selectionStatsCollection[0].likes;
    const result: Query<LikeDTO> =
      await collectionSelectionStats.findOneAndUpdate(
        { likes: selectionStats },
        { $set: { likes: selectionStats + 1 } }
      );

    res.json(result);
  }
  async patchDislike(req: Request, res: Response) {
    await client.connect();
    const db = client.db('ChangeTech');

    const collectionSelectionStats = db.collection('SelectionStats');
    const selectionStatsCollection = await collectionSelectionStats
      .find()
      .toArray();
    const selectionStats = selectionStatsCollection[0].dislikes;
    const result: Query<DislikeDTO> =
      await collectionSelectionStats.findOneAndUpdate(
        { dislikes: selectionStats },
        { $set: { dislikes: selectionStats + 1 } }
      );

    res.json(result);
  }
}

module.exports = new selectionStatsController();
