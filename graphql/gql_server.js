// EnlFi tg-groups gql_server.js
// project backend - apollo server
// responsible of connecting to database

// imports
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./types');
const EnlUser = require('../models/enlUser');

// initializing Apollo Server for Express
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      return { user };
    }
    return null;
  }
});

module.exports = apolloServer;