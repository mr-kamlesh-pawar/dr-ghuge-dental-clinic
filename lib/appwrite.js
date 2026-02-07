import { Client, Databases, Account, ID, Query } from 'node-appwrite';
import { createLogger } from './logger';

const logger = createLogger('Appwrite');

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const account = new Account(client);

// Helper function to create document
export const createDocument = async (collectionId, data, documentId = ID.unique()) => {
  const context = logger.start('createDocument', {
    collectionId,
    documentId,
    dataKeys: Object.keys(data)
  });

  try {
    logger.debug('Attempting to create document', {
      databaseId: process.env.APPWRITE_DATABASE_ID,
      collectionId,
      documentId
    });

    const result = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      collectionId,
      documentId,
      data
    );

    logger.end(context, {
      documentId: result.$id,
      created: result.$createdAt
    });
    
    return result;
  } catch (error) {
    logger.end(context, {}, error);
    console.error('Appwrite createDocument error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response
    });
    throw error;
  }
};

// Helper to list documents
export const listDocuments = async (collectionId, queries = []) => {
  const context = logger.start('listDocuments', {
    collectionId,
    queryCount: queries.length,
    queries: queries.map(q => q.toString())
  });

  try {
    logger.debug('Fetching documents', {
      databaseId: process.env.APPWRITE_DATABASE_ID,
      collectionId
    });

    const result = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      collectionId,
      queries
    );

    logger.end(context, {
      total: result.total,
      count: result.documents.length
    });
    
    return result;
  } catch (error) {
    logger.end(context, {}, error);
    console.error('Appwrite listDocuments error details:', {
      message: error.message,
      code: error.code,
      type: error.type
    });
    throw error;
  }
};

// Helper to get document
export const getDocument = async (collectionId, documentId) => {
  const context = logger.start('getDocument', {
    collectionId,
    documentId
  });

  try {
    const result = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      collectionId,
      documentId
    );

    logger.end(context, {
      documentId: result.$id
    });
    
    return result;
  } catch (error) {
    logger.end(context, {}, error);
    console.error('Appwrite getDocument error details:', error);
    throw error;
  }
}

// Helper to update document
export const updateDocument = async (collectionId, documentId, data) => {
  const context = logger.start('updateDocument', {
    collectionId,
    documentId,
    dataKeys: Object.keys(data)
  });

  try {
    const result = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      collectionId,
      documentId,
      data
    );

    logger.end(context, {
      documentId: result.$id,
      updated: result.$updatedAt
    });
    
    return result;
  } catch (error) {
    logger.end(context, {}, error);
    console.error('Appwrite updateDocument error details:', error);
    throw error;
  }
}

// Helper to delete document
export const deleteDocument = async (collectionId, documentId) => {
  const context = logger.start('deleteDocument', {
    collectionId,
    documentId
  });

  try {
    await databases.deleteDocument(
      process.env.APPWRITE_DATABASE_ID,
      collectionId,
      documentId
    );

    logger.end(context, {
      deleted: true
    });
    
    return { success: true };
  } catch (error) {
    logger.end(context, {}, error);
    console.error('Appwrite deleteDocument error details:', error);
    throw error;
  }
}

export { client, databases, account, ID, Query };