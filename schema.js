import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} from 'graphql';

import Db from './db';

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'this represents a Person',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(person) {
          return person.id;
        }
      },
      firstName: {
        type: GraphQLString,
        resolve(person) {
          return person.firstName
        }
      },
      lastName: {
        type: GraphQLString,
        resolve(person) {
          return person.lastName
        }
      },
      email: {
        type: GraphQLString,
        resolve(person) {
          return person.email
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(person) {
          return person.getPosts();
        }
      }
    }
  }
})


const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'this is a Post',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(person) {
          return person.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve(post) {
          return post.title;
        }

      },
      content: {
        type: GraphQLString,
        resolve(post) {
          return post.content;
        }

      },
      person: {
        type: Person,
        resolve(post) {
          return post.getPerson();
        }
      }
    }
  }
});


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'this is a root query',
  fields: () => {
    return {
      people: {
        type: new GraphQLList(Person),
        args: {
          id: {
            type: GraphQLInt
          },
          email: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return Db.models.person.findAll({ where: args });
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve(root, args) {
          return Db.models.post.findAll({ where: args });
        }
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "functions to create stuff",
  fields() {
    return {
      addPerson: {
        type: Person,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args) {
          return Db.models.person.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase()
          });
        }
      },
      deletePerson: {
        type: Person,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async (_, { email }) => {
          try {
            const person = await Db.models.person.findOne({
              where: {
                email
              }
            })
            console.log(person)
            person.destroy()
            return person;
          } catch (err) {
            throw new Error(err)
          }

        }
      }
    }
  }
})

const Shema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Shema;