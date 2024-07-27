import { db } from "@/models/name";
import { createAnswerCollection } from "./answer.collections";
import { createQuestionCollection } from "./question.collections";
import { createCommentCollection } from "./comment.collections";
import { createVoteCollection } from "./vote.collections";
import { databases } from "./config";

const getOrCreateDb = async () => {
  try {
    await databases.get(db);
    console.log("db connected");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log(" db created");

      //! create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
       
      ]);

      console.log("collections created");
    } catch (error) {
      console.log("error creating db", error);
    }
  }
  return databases;
};

export { getOrCreateDb };
