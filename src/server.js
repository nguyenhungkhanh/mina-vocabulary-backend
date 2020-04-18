const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

class Server {
  constructor(port, mongoURI) {
    this.server = express()

    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));

    this.config = {
      port, mongoURI
    }
  }

  useRouters(routers = []) {
    for (let router of routers) {
      this.server.use('/', router)
    }
  };

  async run() {
    try {      
      await mongoose.connect(this.config.mongoURI, mongooseOptions)
      
      this.server.listen(
        this.config.port, 
        () => console.log('Server is running on port', this.config.port)
      )
    } catch(error) {
      console.log(error)
    }
  }
}

module.exports = Server;