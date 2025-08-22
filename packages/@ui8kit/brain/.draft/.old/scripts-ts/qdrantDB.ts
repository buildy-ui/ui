import {QdrantClient} from '@qdrant/qdrant-js';
import {readFileSync} from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables with fallbacks
const collectionName = process.env.QDRANT_COLLECTION || 'buildy_collection';
const URL_QDRANT = process.env.QDRANT_URL || 'https://qdrant-buildy.app';
const JSON_PATH = process.env.QDRANT_JSON_PATH || '../../qdrant-example/qdrantblocks-vector.json';

// Parse command line arguments
const args = process.argv.slice(2);
const apiKeyArg = args.find(arg => arg.startsWith('--apiKey='));

if (!apiKeyArg) {
    console.error('Error: API key is required. Use --apiKey=YOUR_API_KEY');
    process.exit(1);
}

const API_KEY_QDRANT = apiKeyArg.split('=')[1];

if (!API_KEY_QDRANT) {
    console.error('Error: API key cannot be empty');
    process.exit(1);
}

const client = new QdrantClient({
    url: URL_QDRANT,
    apiKey: API_KEY_QDRANT,
    port: 443
});

async function initializeCollection() {
    try {
        // Check if collection exists
        const collections = await client.getCollections();
        const exists = collections.collections.some(c => c.name === collectionName);

        if (!exists) {
            // Create collection only if it doesn't exist
            await client.createCollection(collectionName, {
                vectors: {
                    size: 1536,
                    distance: 'Cosine',
                },
                optimizers_config: {
                    default_segment_number: 2,
                    indexing_threshold: 20000
                },
                hnsw_config: {
                    m: 16,
                    ef_construct: 100,
                    ef_search: 128
                }
            });
            console.log(`Collection ${collectionName} created successfully`);
        } else {
            console.log(`Collection ${collectionName} already exists, skipping creation`);
        }
    } catch (error) {
        console.error('Error initializing collection:', error);
        process.exit(1);
    }
}

async function uploadVectors() {
    try {
        // Read JSON file
        const jsonPath = path.join(__dirname, JSON_PATH);
        const jsonData = JSON.parse(readFileSync(jsonPath, 'utf-8'));

        // Prepare points for upload
        const points = jsonData.map(item => ({
            id: item.id,
            vector: item.vector,
            payload: {
                name: item.payload.name,
                description: item.payload.description,
                tags: item.payload.tags,
                category: item.payload.category,
                path: item.payload.path,
                imports: item.payload.imports,
                export: item.payload.export
            }
        }));

        // Upload points in batches of 100
        const batchSize = 100;
        for (let i = 0; i < points.length; i += batchSize) {
            const batch = points.slice(i, i + batchSize);
            await client.upsert(collectionName, {
                points: batch
            });
            console.log(`Uploaded batch ${i / batchSize + 1}, points ${i} to ${i + batch.length}`);
        }

        console.log('All vectors uploaded successfully');
    } catch (error) {
        console.error('Error uploading vectors:', error);
    }
}

// Execute initialization before uploading vectors
await initializeCollection();
await uploadVectors();

console.log(`Operation completed. See ${URL_QDRANT}/dashboard#/collections`);
