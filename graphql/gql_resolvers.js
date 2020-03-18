// EnlFi tg-groups gql_resolvers.js
// provides resolvers for apollo server in express

const { UserInputError, AuthenticationError, PubSub } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pubsub = new PubSub();

const config = require('../utils/config');
const EnlUser = require('../models/enlUser');
const TgGroup = require('../models/tgGroup');
const News = require('../models/listNews');

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
  EnlUser: {
    username: (root) => root.username,
    pwHash: (root) => root.pwHash,
    active: (root) => root.active,
    role: (root) => root.role,
    id: (root) => root._id
  },
  News: {
    content: (root) => root.content,
    category: (root) => root.category,
    id: (root) => root._id,
    author: (root) => root.author
  },
  // GraphQL queries
  Query: {
    me: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      return EnlUser.findById(decodedToken.id);
    },
    userCount: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user.role === 'admin' || user.role === 'owner') {
        return EnlUser.collection.countDocuments();
      } else {
        await authError('CLEARANCE');
      }
    },
    users: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user.role === 'admin' || user.role === 'owner') {
        return await EnlUser.find({});
      } else {
        await authError('CLEARANCE');
      }
    },
    groupCount: async () => await TgGroup.collection.countDocuments(),
    groups: async (root, args) => await TgGroup.find({}).populate('addedBy'),
    news: async () => await News.find({}).populate('author')
  },
  // GraphQL mutations
  Mutation: {
    addNews: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user.role === 'admin' || user.role === 'owner') {
        let news = new News({
          content: args.content,
          category: args.category,
          author: user._id.toString()
        });
        try {
          await news.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        news = await News.findOne({content: args.content});
        await pubsub.publish('NEWS_ADDED', { newsAdded: news });
        return news;
      } else {
        await authError('CLEARANCE');
      }
    },
    editNews: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user.role === 'admin' || user.role === 'owner') {
        let news = await News.findById(args.id);
        news.content = args.content;
        news.category = args.category;
        try {
          await news.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        news = await News.findById(args.id);
        await pubsub.publish('NEWS_UPDATED', { newsUpdated: news });
        return news;
      } else {
        await authError('CLEARANCE');
      }
    },
    removeNews: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user.role === 'admin' || user.role === 'owner') {
        const news = await News.findById(args.id);
        try {
          await news.remove();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        await pubsub.publish('NEWS_REMOVED', { newsRemoved: news });
        return news;
      } else {
        await authError('CLEARANCE');
      }
    },
    addUser: async (root, args) => {
      let newUser = new EnlUser({
        username: args.username,
        pwHash: await hash(args.password),
        active: false,
        role: 'user'
      });
      try {
        await newUser.save();
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: args });
      }
      newUser = await EnlUser.findOne({username: args.username});
      await pubsub.publish('USER_ADDED', { userAdded: newUser });
      return newUser;
    },
    updateUser: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      let user = await EnlUser.findById(decodedToken.id);
      const correctPassword = await bcrypt.compare(args.password, user.pwHash);
      if (user && correctPassword) {
        if (args.newPassword) {
          user.pwHash = await hash(args.newPassword);
        }
        if (args.newUsername) {
          user.username = args.newUsername;
        }
        try {
          await user.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        user = await EnlUser.findById(decodedToken.id);
        await pubsub.publish('USER_UPDATED', { userUpdated: user });
        return user;
      } else {
        await authError('default');
      }
    },
    demoteUser: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      let target = await EnlUser.findById(args.id);
      if (user && (user.role === 'admin' || user.role === 'owner')
        && (target.role !== 'owner' && args.id !== decodedToken.id)) {
        target.role = 'user';
        try {
          await target.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        target = await EnlUser.findById(args.id);
        await pubsub.publish('USER_UPDATED', { userUpdated: target });
        return target;
      } else {
        await authError('CLEARANCE');
      }
    },
    promoteUser: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      let target = await EnlUser.findById(args.id);
      if (user && (user.role === 'admin' || user.role === 'owner')
        && (target.role !== 'owner' && args.id !== decodedToken.id)) {
        target.role = 'admin';
        try {
          await target.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        target = await EnlUser.findById(args.id);
        await pubsub.publish('USER_UPDATED', { userUpdated: target });
        return target;
      } else {
        await authError('CLEARANCE');
      }
    },
    removeUser: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      const target = await EnlUser.findById(args.id);
      const correctPassword = !target
        ? false
        : args.password !== null ? await bcrypt.compare(args.password, target.pwHash) : false;
      if (user && (args.password === null ? (user.role === 'owner' || user.role === 'admin') : correctPassword)) {
        try {
          await target.remove();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        await pubsub.publish('USER_REMOVED', { userRemoved: target });
        return target;
      } else {
        await authError('default');
      }
    },
    activateUser: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if ((user.role === 'owner' || user.role === 'admin') && args.id !== user._id.toString()) {
        let userToActivate = await EnlUser.findById(args.id);
        try {
          userToActivate.active = true;
          await userToActivate.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        userToActivate = await EnlUser.findById(args.id);
        return userToActivate;
      } else {
        await authError('LOGIN');
      }
    },
    deactivateUser: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if ((user.role === 'owner' || user.role === 'admin') && args.id !== user._id.toString()) {
        let userToDeactivate = await EnlUser.findById(args.id);
        try {
          userToDeactivate.active = false;
          await userToDeactivate.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        userToDeactivate = await EnlUser.findById(args.id);
        return userToDeactivate;
      } else {
        await authError('LOGIN');
      }
    },
    addGroup: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user) {
        let newGroup = new TgGroup({
          name: args.name,
          sheriff: args.sheriff,
          link: args.link,
          info: args.info,
          linkDateTime: args.linkDateTime,
          linkExpDateTime: args.linkExpDateTime,
          addedBy: user._id.toString()
        });
        try {
          await newGroup.save();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        newGroup = await TgGroup.findOne({ name: args.name }).populate('addedBy');
        await pubsub.publish('GROUP_ADDED', { groupAdded: newGroup });
        return newGroup;
      } else {
        await authError('LOGIN');
      }
    },
    updateGroup: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user) {
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
        group = await TgGroup.findById(args.id).populate('addedBy');
        await pubsub.publish('GROUP_UPDATED', { groupUpdated: group });
        return group;
      } else {
        await authError('LOGIN');
      }
    },
    removeGroup: async (root, args) => {
      const decodedToken = await jwt.verify(args.token, config.secret);
      const user = await EnlUser.findById(decodedToken.id);
      if (user.role === 'admin' || user.role === 'owner') {
        const group = await TgGroup.findById(args.id).populate('addedBy');
        try {
          await group.remove();
        } catch (e) {
          throw new UserInputError(e.message, { invalidArgs: args });
        }
        await pubsub.publish('GROUP_REMOVED', { groupRemoved: group });
        return group;
      } else {
        await authError('CLEARANCE');
      }
    },
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
  },
  // GraphQL subscriptions
  Subscription: {
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
  }
};

module.exports = { resolvers };
