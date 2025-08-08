import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

// Types
interface Block {
  id: number;
  vector: number[];
  payload: {
    name: string;
    description: string;
    tags: string[];
    category: string;
    path: string;
    imports: string[];
    export: string;
  };
}

async function generateEmbeddings() {
  try {
    // Get API key from command line arguments
    const apiKey = process.argv.find(arg => arg.startsWith('--apiKey'))?.split('=')[1];
    
    if (!apiKey) {
      throw new Error('API key is required. Use: bun run vector --apiKey=your-key');
    }

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api.aitunnel.ru/v1/',
    });

    // Read input file
    const inputPath = path.join(process.cwd(), 'qdrant-example', 'qdrantblocks-descriptions.json');
    const blocks: Block[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

    console.log(`Processing ${blocks.length} blocks...`);

    // Process each block
    const processedBlocks = await Promise.all(
      blocks.map(async (block) => {
        try {
          // Generate embedding for description
          const response = await client.embeddings.create({
            input: block.payload.description,
            model: 'text-embedding-3-small',
          });

          // Update block with embedding vector
          return {
            ...block,
            vector: response.data[0].embedding,
          };
        } catch (error) {
          console.error(`Error processing block ${block.id}:`, error);
          return block; // Return original block if embedding fails
        }
      })
    );

    // Write output file
    const outputPath = path.join(process.cwd(), 'qdrant-example', 'qdrantblocks-vector.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedBlocks, null, 2));

    console.log(`Successfully generated embeddings and saved to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
generateEmbeddings(); 