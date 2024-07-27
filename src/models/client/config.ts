import { Client, Avatars, Account, Databases, Storage} from "appwrite";
import env from "@/app/env";

 const client: Client = new Client();

client.setEndpoint(env.appwrite.endpoint).setProject(env.appwrite.projectId);

export const account: Account = new Account(client);
export const avatars: Avatars = new Avatars(client);
export const databases: Databases = new Databases(client);
export const storage: Storage = new Storage(client);

export {client}