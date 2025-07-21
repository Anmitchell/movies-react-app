const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const updateSearchCount = async () => {
    console.log('Environment variables:', { DATABASE_ID, COLLECTION_ID, PROJECT_ID });
};