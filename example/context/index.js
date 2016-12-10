const {MongoClient} = require('mongodb');
const contextable = require('../../dist');
const userSchema = require('./schemas/user');

exports.Context = class Context extends contextable.Context {

  constructor (attrs) {
    super(attrs);

    this.mongo = null; // initializing variables
    this.defineModel('User', userSchema); // attaching models
  }

  async start () {
    if (!this.mongo) {
      this.mongo = await MongoClient.connect('mongodb://localhost:27017/test'); // starting MongoDB connection

      await this.mongo.collection('users').createIndex( // setting unique index
        {email: 1},
        {unique: 1, sparse: 1, name: 'uniqueEmail'}
      );
    }
  }

  async stop () {
    if (this.mongo) {
      this.mongo.close(); // closing MongoDB connection
      this.mongo = null;
    }
  }

};
