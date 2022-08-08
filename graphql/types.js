// EnlFi tg-groups gql_typeDefs.js
// provides typedefs for apollo server in express

const { gql } = require('apollo-server-express');

// type defining for various data type used by application

const typeDefs = gql`
    type TgGroup {
        name: String!
        sheriff: [String!]!
        link: String!
        info: String
        linkDateTime: Float
        linkExpDateTime: Float
        addedBy: String!
        id: ID!
        k18: Boolean!
        cf: Boolean!
        active: Boolean!
    }
    type Query {
        groupCount: Int!
        groups: [TgGroup!]!
    }
    type Mutation {
        addGroup(token: String!, name: String!, sheriff: [String], link: String!, info: String,
            linkDateTime: Int!, linkExpDateTime: Int!, k18: Boolean!, cf: Boolean!): TgGroup!,
        updateGroup(token: String!, id: String!, name: String!, sheriff: [String], link: String!, info: String,
            linkDateTime: Int, linkExpDateTime: Int, k18: Boolean!, cf: Boolean!): TgGroup!,
        removeGroup(token: String!, id: String!): TgGroup!
    }
`;

module.exports = { typeDefs };