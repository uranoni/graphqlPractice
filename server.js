import Express from 'express';
import GraphHTTP from 'express-graphql';
import Schema from './schema';
var cors = require('cors');
const APP_PORT = 8080;

const app = Express();
app.use(cors());

app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, () => {
  console.log(`APP listening on port ${APP_PORT}`);
})