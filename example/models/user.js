import {ObjectId} from 'mongodb';
import {Schema} from '../../dist';

/*
* Typeable.js options.
*/

export const typeOptions = {
  ObjectId (value) { return ObjectId(value) } // custom type ObjectId
};

/*
* Model's fields.
*/

export const fields = {
  _id: {
    type: 'ObjectId'
  },
  name: {
    type: 'String',
    validate: [
      {
        validator: 'presence',
        message: 'is required'
      }
    ]
  },
  email: {
    type: 'String',
    validate: [
      {
        validator: 'presence',
        message: 'is required'
      },
      {
        validator: 'stringEmail',
        message: 'is not an email'
      }
    ],
    handle: [
      {
        handler: 'mongoUniqueness',
        message: 'is already taken',
        indexName: 'uniqueEmail'
      }
    ]
  }
};

/*
* Model's class methods.
*/

export const classMethods = {

  /*
  * Inserts a new user to a database.
  */

  async create (input={}) {
    let collection = this.$context.mongo.collection('users');

    let model = new this(input);
    try {
      await model.validate();
      await collection.insertOne(model);
    }
    catch (e) {
      await model.handle(e);
    }
    return model;
  }

};

/*
* Model's instance methods.
*/

export const instanceMethods = {

  /*
  * Saves changes to a database.
  */

  async save () {
    let collection = this.$context.mongo.collection('users');

    try {
      await this.validate();
      await collection.updateOne({_id: this._id}, this, {upsert: true});
    }
    catch (e) {
      await this.handle(e);
      return false;
    }
    return true;
  }
};

/*
* Model's schema.
*/

export const schema = new Schema({
  typeOptions,
  fields,
  classMethods,
  instanceMethods
});
