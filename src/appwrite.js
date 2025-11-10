import { Client, Account, Databases, Storage, ID, Permission, Role, Query } from 'appwrite';

// Appwrite Configuration Constants
export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID';

// Database and Collection IDs
export const DB_ID = 'imobiliariaDB';
export const COLLECTION_IMOVEIS_ID = 'imoveis';
export const BUCKET_FOTOS_ID = 'fotos_imoveis';

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export utilities
export { ID, Permission, Role, Query };
