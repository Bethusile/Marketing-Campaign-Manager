import fs from 'fs';
import path from 'path';

const createMigration = () => {
    const sourceFile = path.join(__dirname, '../../database.sql');
    const migrationsDir = path.join(__dirname, '../../migrations');

    if (!fs.existsSync(migrationsDir)){
        fs.mkdirSync(migrationsDir, { recursive: true });
    }

    try {
        if (!fs.existsSync(sourceFile)) {
            console.error(`Source file not found: ${sourceFile}`);
            process.exit(1);
        }

        const sqlContent = fs.readFileSync(sourceFile, 'utf8');
        
        // Generate timestamp YYYYMMDDHHMMSS
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
        
        const migrationName = `${timestamp}_init.sql`;
        const targetFile = path.join(migrationsDir, migrationName);

        fs.writeFileSync(targetFile, sqlContent);
        console.log(`Migration created: ${migrationName}`);
    } catch (err) {
        console.error('Error creating migration:', err);
        process.exit(1);
    }
};

createMigration();
