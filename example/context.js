import {MongoClient} from 'mongodb';
import {Context} from '../dist';
import {schema as userSchema} from './models/user';
/*
* Application context class.
*/

export class ApplicationContext extends Context {

  /*
  * Class constructor.
  */

  constructor (attrs) {
    super(attrs);

    // initializing variables
    this._mongo = null;
    // attaching models
    this.defineModel('User', userSchema);
  }

  /*
  * A getter which returns a MongoDB connection instance.
  */

  get mongo () {
    return this._mongo;
  }

  /*
  * Starts context services.
  */

  async start () {
    if (!this._mongo) {
      this._mongo = await MongoClient.connect('mongodb://localhost:27017/test');

      await this._mongo.collection('users').createIndex(
        {email: 1},
        {unique: 1, sparse: 1, name: 'uniqueEmail'}
      );
    }
    return this;
  }

  /*
  * Stops context services.
  */

  async stop () {
    if (this._mongo) {
      this._mongo.close();
      this._mongo = null;
    }
    return this;
  }

}
