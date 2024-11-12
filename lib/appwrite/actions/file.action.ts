"use server";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const UploadFile = async ({
  ownerId,
  accountId,
  file,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketid,
      ID.unique(),
      inputFile
    );
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseid,
        appwriteConfig.filescollectionid,
        ID.unique(),
        fileDocument
      )
      .catch(async (err) => {
        await storage.deleteFile(appwriteConfig.bucketid, bucketFile.$id);
        handleError(err, "Failed to upload File document");
      });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to create file document!");
  }
};
const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.$id),
    ]),
  ];
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }
  return queries;
};
export const getFiles = async ({
  types = [],
  limit,
  searchText = "",
  sort = "$createdAt-desc",
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found!");
    // console.log()
    const queries = createQueries(currentUser, types, searchText, sort, limit);
    const files = await databases.listDocuments(
      appwriteConfig.databaseid,
      appwriteConfig.filescollectionid,
      queries
    );

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to fetch files");
  }
};
export const renameFile = async ({
  extension,
  fileId,
  name,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseid,
      appwriteConfig.filescollectionid,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file!");
  }
};

export const updateFileUser = async ({
  emails,
  fileId,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseid,
      appwriteConfig.filescollectionid,
      fileId,
      {
        users: emails,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file user");
  }
};
export const deleteFile = async ({
  fileId,
  path,
  bucketFileId,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseid,
      appwriteConfig.filescollectionid,
      fileId
    );
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketid, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify(deletedFile);
  } catch (error) {
    handleError(error, "Failed to delete files");
  }
};
