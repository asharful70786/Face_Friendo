import mongoose from "mongoose";
import { connectDB } from "./db.js";

await connectDB();
const db = mongoose.connection.db;
let client = mongoose.connection.getClient();

try {


  const command = "collMod";

  await db.command({
    [command]: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "email",],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          name: {
            bsonType: "string",
            minLength: 3,
            description:
              "name field should a string with at least three characters",
          },
          email: {
            bsonType: "string",
            description: "please enter a valid email",
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          },
          password: {
            bsonType: "string",
            minLength: 4,
          },
          role: {
            bsonType: "string",
            enum: ["user", "admin", "manager"],
          },
          picture: {
            bsonType: "string",
          },
          phoneNumber: {
            bsonType: "number"
          } , 
          isDeleted: {
            bsonType: "bool"
          },
          "__v": {
            "bsonType": "int"
          }
        },
        additionalProperties: false,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });
} catch (error) {
  console.log(error);
}

