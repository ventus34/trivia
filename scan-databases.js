import fs from 'fs';
import path from 'path';

const dbDir = './databases';
const categoriesDir = path.join(dbDir, 'categories');

try {
  const dbList = [];

  function formatDescription(subcategories, lang) {
    let fullDesc = '';
    if (lang === 'pl') {
      fullDesc = `Pytania z zakresu: ${subcategories.join(', ')}. Sprawdź swoją wiedzę w tej kategorii.`;
    } else {
      fullDesc = `Questions covering: ${subcategories.join(', ')}. Test your knowledge in this category.`;
    }

    if (fullDesc.length <= 100) {
      return fullDesc;
    }

    // If it's too long, build a truncated version:
    // "Pytania z zakresu: Sub1, Sub2, Sub3..."
    const prefix = lang === 'pl' ? 'Pytania z zakresu: ' : 'Questions covering: ';
    const maxSubcategoriesLen = 100 - prefix.length - 3; // 3 characters for '...'
    
    const currentList = [];
    let currentLen = 0;
    for (const sub of subcategories) {
      const addition = currentList.length > 0 ? `, ${sub}` : sub;
      if (currentLen + addition.length > maxSubcategoriesLen) {
        break;
      }
      currentList.push(sub);
      currentLen += addition.length;
    }
    
    if (currentList.length === 0 && subcategories.length > 0) {
      const sub = subcategories[0];
      const truncatedSub = sub.slice(0, maxSubcategoriesLen);
      return `${prefix}${truncatedSub}...`;
    }
    
    return `${prefix}${currentList.join(', ')}...`;
  }

  // Helper to process a database file
  function processFile(filePath, isCategory) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Simple validation to ensure it's a trivia database
      if (!data.questions && !data.categories) {
        return; // Skip non-database files
      }

      let description = data.description || '';
      let fileChanged = false;

      // If the description is generic, empty, or previously generated, regenerate it with the new limit
      const shouldRegenerate = !description || 
                               description === 'Baza wyeksportowana z edytora' ||
                               description.startsWith('Pytania z zakresu:') ||
                               description.startsWith('Questions covering:');

      if (shouldRegenerate) {
        const subcategoriesSet = new Set();
        if (data.questions && Array.isArray(data.questions)) {
          for (const q of data.questions) {
            if (q.subcategory) {
              subcategoriesSet.add(q.subcategory);
            }
          }
        }
        const subcategories = Array.from(subcategoriesSet);
        if (subcategories.length > 0) {
          const lang = data.language || 'pl';
          const newDesc = formatDescription(subcategories, lang);
          if (newDesc !== description) {
            description = newDesc;
            data.description = description;
            fileChanged = true;
          }
        }
      }

      if (fileChanged) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      }

      const fileBasename = path.basename(filePath);
      const relPath = isCategory ? `databases/categories/${fileBasename}` : `databases/${fileBasename}`;

      dbList.push({
        id: data.id || fileBasename.replace('.json', ''),
        name: data.name || fileBasename.replace('.json', '').replace(/_/g, ' '),
        language: data.language || 'pl',
        description: description,
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

