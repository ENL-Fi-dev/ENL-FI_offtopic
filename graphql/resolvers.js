// EnlFi tg-groups gql_resolvers.js
// provides resolvers for apollo server in express

const { UserInputError, AuthenticationError, PubSub } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const TgGroup = require('../models/tgGroup');

// helper functions and constants for resolvers

// user creation - password hashing
const hash = (password) => {
  return bcrypt.hash(password, 10);
};

// helper functions: errors
const authError = (type) => {
  switch (type) {
    case 'CLEARANCE': throw new AuthenticationError('Insufficient clearance!');
    case 'LOGIN': throw new AuthenticationError('You must be logged in!');
    default: throw new AuthenticationError('Invalid credentials!');
  }
};

// resolvers for application, first custom type, then Query, Mutation, Subscription
const resolvers = {
  TgGroup: {
    name: (root) => root.name,
    sheriff: (root) => root.sheriff,
    link: (root) => root.link,
    info: (root) => root.info,
    linkDateTime: (root) => root.linkDateTime,
    linkExpDateTime: (root) => root.linkExpDateTime,
    addedBy: (root) => root.addedBy,
    id: (root) => root._id,
    cf: (root) => root.cf,
    k18: (root) => root.k18,
    active: (root) => root.active
  },
  // GraphQL queries
  Query: {
    groupCount: async () => await TgGroup.collection.countDocuments(),
    groups: async (root, args) => await TgGroup.find({}),
  },
  // GraphQL mutations
  Mutation: {
    addGroup: async (root, args) => {
      let newGroup = new TgGroup({
        name: args.name,
        sheriff: args.sheriff,
        link: args.link,
        info: args.info,
        linkDateTime: args.linkDateTime,
        linkExpDateTime: args.linkExpDateTime,
        addedBy: 'admin'
      });
      try {
        await newGroup.save();
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: args });
      }
      newGroup = await TgGroup.findOne({ name: args.name });
      return newGroup;
    },
    updateGroup: async (root, args) => {
      let group = await TgGroup.findById(args.id);
        if (args.name) group.name = args.name;
        if (args.info) group.info = args.info;
        if (args.link) group.link = args.link;
        if (args.sheriff) group.sheriff = args.sheriff;
        if (args.linkDateTime) group.linkDateTime = args.linkDateTime;
        if (args.linkExpDateTime) group.linkExpDateTime = args.linkExpDateTime;
        try {
          await group.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        group = await TgGroup.findById(args.id);
        return group;
    },
    removeGroup: async (root, args) => {
      const group = await TgGroup.findById(args.id);
        try {
          await group.remove();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        return group;
    },
    /*
    login: async (root, args) => {
      const user = await EnlUser.findOne({ username: args.username });
      const correctPassword = !user
        ? false
        : await bcrypt.compare(args.password, user.pwHash);
      if (user && correctPassword) {
        return { value: `Bearer ${jwt.sign({ username: user.username, id: user._id.toString() }, config.secret)}` };
      } else {
        await authError('default');
      }
    }
    */
  },
  // GraphQL subscriptions
  /*Subscription: {
    newsAdded: {
      subscribe: () => pubsub.asyncIterator('NEWS_ADDED')
    },
    newsUpdated: {
      subscribe: () => pubsub.asyncIterator('NEWS_UPDATED')
    },
    newsRemoved: {
      subscribe: () => pubsub.asyncIterator('NEWS_REMOVED')
    },
    userAdded: {
      subscribe: () => pubsub.asyncIterator('USER_ADDED')
    },
    userUpdated: {
      subscribe: () => pubsub.asyncIterator('USER_UPDATED')
    },
    userRemoved: {
      subscribe: () => pubsub.asyncIterator('USER_REMOVED')
    },
    groupAdded: {
      subscribe: () => pubsub.asyncIterator('GROUP_ADDED')
    },
    groupUpdated: {
      subscribe: () => pubsub.asyncIterator('GROUP_UPDATED')
    },
    groupRemoved: {
      subscribe: () => pubsub.asyncIterator('GROUP_REMOVED')
    }
  }*/
};

module.exports = { resolvers };
