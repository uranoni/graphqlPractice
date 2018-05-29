import Express from 'express';
import GraphHTTP from 'express-graphql';
import Schema from './schema';

const APP_PORT = 8080;

const app = Express();

app.use('/graphql',GraphHTTP({
  schema:Schema,
  pretty:true,
  graphiql:true
}));

app.listen(APP_PORT,()=>{
  console.log(`APP listening on port ${APP_PORT}`);
})