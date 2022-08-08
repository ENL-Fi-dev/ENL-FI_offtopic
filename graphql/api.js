const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./types');

const schema = makeExecutableSchema({ typeDefs, resolvers });

const createAPI = (httpServer) => {
  return new ApolloServer({
    schema,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
  });
};

/**
 * ,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), config.secret);
        const user = await EnlUser.findById(decodedToken.id);
        return { user };
      }
      return null;
    }
 * 
 */

module.exports = { createAPI };