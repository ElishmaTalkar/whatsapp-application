import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'database.sqlite');
const OLD_DB_PATH = path.join(process.cwd(), 'oll-db.json');

let dbInstance: Database | null = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });

        // Initialize Schema
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS businesses (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                use_case TEXT,
                prompt_instruction TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS meta_connections (
                id TEXT PRIMARY KEY,
                business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
                platform TEXT NOT NULL,
                access_token TEXT NOT NULL,
                phone_number_id TEXT,
                waba_id TEXT,
                page_id TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
                customer_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                incoming_payload TEXT NOT NULL,
                ai_response TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS leads (
                id TEXT PRIMARY KEY,
                business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
                phone_number TEXT NOT NULL,
                name TEXT,
                last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(business_id, phone_number)
            );

            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Run Migration if old JSON exists
        await migrateFromJson(dbInstance);
    }
    return dbInstance;
}

async function migrateFromJson(sqliteDb: Database) {
    if (!fs.existsSync(OLD_DB_PATH)) return;

    try {
        const data = JSON.parse(fs.readFileSync(OLD_DB_PATH, 'utf-8'));

        // Check if already migrated
        const count = await sqliteDb.get('SELECT COUNT(*) as count FROM businesses');
        if (count.count > 0) return;

        console.log('[Migration] Moving data from JSON to SQLite...');

        for (const b of data.businesses || []) {
            await sqliteDb.run(
                'INSERT INTO businesses (id, name, use_case, prompt_instruction, created_at) VALUES (?, ?, ?, ?, ?)',
                [b.id, b.name, b.use_case, b.prompt_instruction, b.created_at]
            );
        }

        for (const c of data.meta_connections || []) {
            await sqliteDb.run(
                'INSERT INTO meta_connections (id, business_id, platform, access_token, phone_number_id, waba_id, page_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [c.id, c.business_id, c.platform, c.access_token, c.phone_number_id, c.waba_id, c.page_id]
            );
        }

        for (const m of data.messages || []) {
            await sqliteDb.run(
                'INSERT INTO messages (id, business_id, customer_id, platform, incoming_payload, ai_response, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [m.id, m.business_id, m.customer_id, m.platform, m.incoming_payload, m.ai_response, m.status, m.timestamp || m.created_at]
            );
        }

        console.log('[Migration] Success! Data safely moved to SQLite.');
    } catch (e) {
        console.error('[Migration] Failed:', e);
    }
}

export const db = {
    businesses: {
        insert: async (data: any) => {
            const sqlite = await getDb();
            const id = data.id || uuidv4();
            const created_at = new Date().toISOString();
            await sqlite.run(
                'INSERT INTO businesses (id, name, use_case, prompt_instruction, created_at) VALUES (?, ?, ?, ?, ?)',
                [id, data.name, data.use_case, data.prompt_instruction, created_at]
            );
            return { id, ...data, created_at };
        },
        find: async (id: string) => {
            const sqlite = await getDb();
            return await sqlite.get('SELECT * FROM businesses WHERE id = ?', [id]);
        },
        list: async () => {
            const sqlite = await getDb();
            return await sqlite.all('SELECT * FROM businesses ORDER BY created_at DESC');
        }
    },
    meta_connections: {
        insert: async (data: any) => {
            const sqlite = await getDb();
            const id = uuidv4();
            await sqlite.run(
                'INSERT INTO meta_connections (id, business_id, platform, access_token, phone_number_id, waba_id, page_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    data.businessId || data.business_id,
                    data.platform,
                    data.accessToken || data.access_token,
                    data.phone_number_id,
                    data.waba_id,
                    data.page_id
                ]
            );
            return { id, ...data };
        },
        findByPhone: async (phoneId: string) => {
            const sqlite = await getDb();
            return await sqlite.get('SELECT * FROM meta_connections WHERE phone_number_id = ?', [phoneId]);
        },
        findByBusinessId: async (bizId: string) => {
            const sqlite = await getDb();
            return await sqlite.get('SELECT * FROM meta_connections WHERE business_id = ?', [bizId]);
        },
        list: async () => {
            const sqlite = await getDb();
            return await sqlite.all('SELECT * FROM meta_connections');
        }
    },
    messages: {
        insert: async (data: any) => {
            const sqlite = await getDb();
            const id = uuidv4();
            const created_at = new Date().toISOString();
            await sqlite.run(
                'INSERT INTO messages (id, business_id, customer_id, platform, incoming_payload, ai_response, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id, data.business_id, data.customer_id, data.platform, data.incoming_payload, data.ai_response, data.status, created_at]
            );
            return { id, ...data, created_at };
        },
        listByBusinessId: async (bizId: string) => {
            const sqlite = await getDb();
            return await sqlite.all('SELECT * FROM messages WHERE business_id = ? ORDER BY created_at DESC', [bizId]);
        }
    },
    leads: {
        upsert: async (data: { business_id: string; phone_number: string; name?: string }) => {
            const sqlite = await getDb();
            const id = uuidv4();
            await sqlite.run(`
                INSERT INTO leads (id, business_id, phone_number, name, last_interaction)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(business_id, phone_number) DO UPDATE SET
                    name = COALESCE(excluded.name, leads.name),
                    last_interaction = CURRENT_TIMESTAMP
            `, [id, data.business_id, data.phone_number, data.name || null]);
        },
        listByBusinessId: async (bizId: string) => {
            const sqlite = await getDb();
            return await sqlite.all('SELECT * FROM leads WHERE business_id = ? ORDER BY last_interaction DESC', [bizId]);
        }
    },
    users: {
        create: async (data: { email: string; passwordHash: string; name?: string }) => {
            const sqlite = await getDb();
            const id = uuidv4();
            await sqlite.run(`
                INSERT INTO users (id, email, password, name)
                VALUES (?, ?, ?, ?)
            `, [id, data.email, data.passwordHash, data.name || null]);
            return id;
        },
        findByEmail: async (email: string) => {
            const sqlite = await getDb();
            return await sqlite.get('SELECT * FROM users WHERE email = ?', [email]);
        }
    }
};
