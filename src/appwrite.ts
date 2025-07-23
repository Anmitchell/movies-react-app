import { Client, Databases, ID, Query } from 'appwrite';
import type { Movie } from './types/movie';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
    // 1. Use Appwrite SDK to check if the search term already exists in the database
    try {
        const searchResult = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)]);

        if (searchResult.documents.length > 0) {
            // 2. If the search term already exists, increment the count by 1
            const existingDoc = searchResult.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingDoc.$id, { count: existingDoc.count + 1 });
        } else {
            // 3. If it doesn't, create a new document with the search term and count 1
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { searchTerm, count: 1, movie_id: movie.id, poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
    // 3. If it doesn't, create a new document with the search term and count 1
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('count'), Query.limit(5)]);

        return result.documents;
    } catch (error) {
        console.error('Error getting trending movies:', error);
        return [];
    }
};