import { QdrantList } from './utils/qdrantList';

async function main() {
  const qdrant = new QdrantList();
  await qdrant.generateQdrantList();
}

main().catch(console.error);