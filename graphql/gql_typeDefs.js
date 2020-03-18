// EnlFi tg-groups gql_typeDefs.js
// provides typedefs for apollo server in express

const { gql } = require('apollo-server-express');

// type defining for various data type used by application

const typeDefs = gql`
    type EnlUser {
        username: String!
        pwHash: String!
        role: String!
        active: Boolean!
        id: ID!
    }
    type TgGroup {
        name: String!
        sheriff: [String!]!
        link: String!
        info: String
        linkDateTime: Float
        linkExpDateTime: Float
        addedBy: EnlUser!
        id: ID!
        k18: Boolean!
        cf: Boolean!
        active: Boolean!
    }
    type News {
        content: String!
        category: String!
        author: EnlUser!
        id: ID!
    }
    type Token {
        value: String!
    }
    type Query {
        me(token: String!): EnlUser!
        userCount(token: String!): Int!
        users(token: String!): [EnlUser!]!
        groupCount: Int!
        groups: [TgGroup!]!
        news: [News!]!
    }
    type Mutation {
        addNews(token: String!, category: String!, content: String!): News!,
        editNews(token: String!, id: String!, content: String, category: String): News!,
        removeNews(token: String!, id: String!): News!,
        addUser(username: String!, password: String!): EnlUser!,
        updateUser(token: String!, password: String!,
            newUsername: String, newPassword: String): EnlUser!,
        promoteUser(token: String!, id: String!): EnlUser!,
        demoteUser(token: String!, id: String!): EnlUser!,
        removeUser(token: String!, id: String!, password: String): EnlUser!,
        activateUser(token: String!, id: String!): EnlUser!,
        deactivateUser(token: String!, id: String!): EnlUser!,
        addGroup(token: String!, name: String!, sheriff: [String], link: String!, info: String,
            linkDateTime: Int!, linkExpDateTime: Int!, k18: Boolean!, cf: Boolean!): TgGroup!,
        updateGroup(token: String!, id: String!, name: String!, sheriff: [String], link: String!, info: String,
            linkDateTime: Int, linkExpDateTime: Int, k18: Boolean!, cf: Boolean!): TgGroup!,
        removeGroup(token: String!, id: String!): TgGroup!,
        login(username: String!, password: String!): Token!
    }
    type Subscription {
        newsAdded: News!
        newsUpdated: News!
        newsRemoved: News!
        userAdded: EnlUser!
        userUpdated: EnlUser!
        userRemoved: EnlUser!
        groupAdded: TgGroup!
        groupUpdated: TgGroup!
        groupRemoved: TgGroup!
    }
`;

module.exports = { typeDefs };