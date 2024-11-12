"use server";

import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

export const createSessionClient = async () => {
  try {
    const client = new Client()
      .setEndpoint(appwriteConfig.endpointurl)
      .setProject(appwriteConfig.projectid);

    const session = (await cookies()).get("appwrite-session");

    if (!session || !session.value) {
      throw new Error("No session");
    }

    client.setSession(session.value);

    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
    };
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error instead of silently returning undefined
  }
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointurl)
    .setProject(appwriteConfig.projectid)
    .setKey(appwriteConfig.secretkey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
