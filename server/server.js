const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const fs = require("fs");

const port = 9000;
const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const app = express();
app.use(
  cors(),
  bodyParser.json(),
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
  })
);

const typeDefs = gql(fs.readFileSync("./schema.graphql", { encoding: "utf8" }));

const resolvers = require("./resolvers.js");

const context = ({ req }) => {
  if (req.headers.authorization)
    return { user: db.users && db.users.get(req.user.sub) };
  else return "";
};

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });
}
startServer();

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

app.listen(port, () => console.info(`Server started on port ${port}`));
