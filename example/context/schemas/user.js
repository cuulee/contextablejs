const {ObjectId} = require('mongodb');
const {Schema} = require('../../../dist');

module.exports = new Schema({ // exposing model schema instance
  types: { // custom data types
    ObjectId: (v) => new ObjectId(v)
  },
  fields: { // model fields
    _id: {
      type: 'ObjectId'
    },
    name: {
      type: 'String'
    },
    email: {
      type: 'String',
      handle: [
        {
          handler: 'mongoUniqueness',
          message: 'is already taken',
          indexName: 'uniqueEmail'
        }
      ]
    }
  },
  instanceMethods: { // model instance methods
    async insert () {
      await this.$context.mongo.collection('users').insertOne(this);
    }
  }
});
