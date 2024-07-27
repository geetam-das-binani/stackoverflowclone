import env from "@/app/env";

import { Client, Avatars, Storage, Databases, Users } from "node-appwrite";

 const  client = new Client();


client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apiKey);


  
export const users: Users = new Users(client);
export const avatars: Avatars = new Avatars(client);
export const databases: Databases = new Databases(client);
export const storage: Storage = new Storage(client);

export {client}