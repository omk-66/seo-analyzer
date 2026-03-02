import { drizzle } from 'drizzle-orm/neon-http';
import { emailSubscribers } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

export { db, emailSubscribers };