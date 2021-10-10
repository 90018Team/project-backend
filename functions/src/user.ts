import * as express from "express";
import * as corsMod from "cors";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();
const cors = corsMod(({origin: true}));
const app = express();
app.use(cors);

/*
Basic user database CURD action

@Description: this file is basic CURD actions of database by RESTapi endpoint.
@Author: Caleb Wang
@Note: no need to create table like SQL database.

@Usage:

let Caleb know your google account, Caleb will add you to the project. 
Or ask Caleb for his access token, you can skip below steps. The token has 3600 secs livetime.

Simply send request with endpoint in Postman, 
and remember to set Authentication with Bearer token before you send request (access token).

Install gcloud:
1. install gcloud first (look up google cloud cli)
2. log in by "gcloud auth login" (if has not logged in yet)
3. run "gcloud auth print-access-token" 
*/

// get all users
app.get("/", async (req, res)=>{
  const users:Array<any>= []; // TODO: will need to change type later
  const snapshot = await admin.firestore().
      collection("users").get(); // Get current users snapshot
  // the doc means the Json object
  // (because it is document-based database)
  snapshot.forEach((doc)=>{
    const id = doc.id;
    users.push({id, ...doc.data()});
  });
  functions.logger.info("all users: ", users);
  res.status(200).send(JSON.stringify(users));
});

// set user with Json
app.post("/", async (req, res)=>{
  const user = req.body; // The body here is the json file
  await admin.firestore().
      collection("users").add(user); // Simply put json into the collection.
  res.status(201).send();
  functions.logger.info("got add request: ", {"req body": user});
});

// equality search by given user id
app.get("/:id", async (req, res)=>{
  const snapshot = await admin.firestore().
      collection("users").doc(req.params.id).
      get(); // Get current users snapshot
  const userId = snapshot.id;
  const userData = snapshot.data();
  const response = {id: userId, ...userData};
  functions.logger.info("respond: ", response);
  res.status(200).send(JSON.stringify(response));
});

// equality search by given phoneNumber
app.get("/phone/:number", async (req, res)=>{
  const userRef = admin.firestore().
      collection("users");
  const queryRef = await userRef.
      where("phoneNumber", "==", req.params.number).get();
  if (queryRef.empty) {
    functions.logger.
        info("No matching documents. For phoneNumber:", req.params.number);
    res.status(404).send();
    return;
  }
  const response:Array<any> = [];
  queryRef.forEach((doc) => {
    const id = doc.id;
    response.push({id, ...doc.data()});
  });
  functions.logger.info("respond: ", response);
  res.status(200).send(JSON.stringify(response));
});

// update an user by given user id
app.put("/:id", async (req, res)=>{
  const body = req.body;
  functions.logger.info("got update request: ", body);
  functions.logger.info("on user id: ", req.params.id);
  await admin.firestore().
      collection("users").doc(req.params.id).
      update(body);
  res.status(200).send();
});

// delete an user by given user id
app.delete("/:id", async (req, res) => {
  await admin.firestore().collection("users").doc(req.params.id).delete();
  res.status(200).send();
});

export const user = functions.https.onRequest(app);
