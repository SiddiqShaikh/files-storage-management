export const appwriteConfig = {
  endpointurl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectid: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseid: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usercollectionid: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  filescollectionid: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucketid: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretkey: process.env.NEXT_APPWRITE_KEY!,
};
