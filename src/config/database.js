import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Function to detect if running inside Docker container
function isRunningInDocker() {
  // Check if we're in a Docker container by looking for Docker-specific indicators
  return (
    process.env.DOCKER_ENV === 'true' ||
    process.env.DATABASE_URL?.includes('neon-local') ||
    process.env.HOSTNAME?.includes('docker') ||
    process.env.CONTAINER_NAME
  );
}

// Configure database connection based on environment
if (process.env.NODE_ENV === 'development' && isRunningInDocker()) {
  // Docker environment - use local Neon proxy
  console.log('🐳 Detected Docker environment - using local Neon database');
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
} else {
  // Local development environment - use remote Neon database
  console.log('💻 Detected local environment - using remote Neon database');
  // Use default Neon configuration for remote database
}
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
