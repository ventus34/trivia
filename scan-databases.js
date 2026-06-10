import fs from 'fs';
import path from 'path';

const dbDir = './databases';
const categoriesDir = path.join(dbDir, 'categories');

try {
  const dbList = [];

  // Helper to process a database file
  function processFile(filePath, isCategory) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Simple validation to ensure it's a trivia database
      if (!data.questions && !data.categories) {
        return; // Skip non-database files
      }

      const fileBasename = path.basename(filePath);
      const relPath = isCategory ? `databases/categories/${fileBasename}` : `databases/${fileBasename}`;

      dbList.push({
        id: data.id || fileBasename.replace('.json', ''),
        name: data.name || fileBasename.replace('.json', '').replace(/_/g, ' '),
        language: data.language || 'pl',
        description: data.description || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        question_count: data.question_count || (data.questions ? data.questions.length : 0),
        path: relPath
      });
    } catch (e) {
      console.error(`Failed to parse database file ${filePath}:`, e.message);
    }
  }

  // 1. Scan root databases directory
  if (fs.existsSync(dbDir)) {
    const rootFiles = fs.readdirSync(dbDir)
      .filter(file => file.endsWith('.json') && file !== 'list.json')
      .sort();
    for (const file of rootFiles) {
      processFile(path.join(dbDir, file), false);
    }
  }

  // 2. Scan categories directory
  if (fs.existsSync(categoriesDir)) {
    const categoryFiles = fs.readdirSync(categoriesDir)
      .filter(file => file.endsWith('.json'))
      .sort();
    for (const file of categoryFiles) {
      processFile(path.join(categoriesDir, file), true);
    }
  }

  fs.writeFileSync(path.join(dbDir, 'list.json'), JSON.stringify(dbList, null, 2), 'utf-8');
  console.log('Successfully updated databases/list.json with databases:', dbList.length);
} catch (error) {
  console.error('Failed to scan databases directory:', error);
  process.exit(1);
}

