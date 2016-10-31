import {Schema} from '../../dist';

/*
* Model's fields.
*/

export const fields = {
  _id: {
    type: 'BSONObjectId'
  },
  name: {
    type: 'String',
    validate: {
      presence: {
        message: 'is required'
      }
    }
  },
  email: {
    type: 'String',
    validate: {
      presence: {
        message: 'is required'
      },
      stringEmail: {
        message: 'is not an email'
      }
    },
    handle: {
      mongoUniqueness: {
        message: 'is already taken',
        indexName: 'uniqueEmail'
      }
    }
  },
};

/*
* Model's class methods.
*/

export const classMethods = {

  /*
  * Inserts a new user to a database.
  */

  async create (input={}) {
    let model = new this(input);
    try {
      await model.approve();
      await this.$ctx.mongo.collection('users').insertOne(model);
    } catch(e) {
      throw await model.handle(e);
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
    try {
      await this.approve();
      await this.$ctx.mongo.collection('users').updateOne({_id: this._id}, this, {upsert: true});
    } catch(e) {
      throw await this.handle(e);
    }
    return this;
  }
};

/*
* Model's schema.
*/

export const schema = new Schema({
  fields,
  classMethods,
  instanceMethods
});
