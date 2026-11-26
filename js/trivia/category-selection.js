export function resolveCategoryIds(ids, categories) {
  if (!Array.isArray(ids) || !Array.isArray(categories)) return [];

  const canonicalIds = new Set(categories.map((category) => category.id));
  const aliasOwners = new Map();
  for (const category of categories) {
    if (Array.isArray(category.aliases)) {
      for (const alias of category.aliases) aliasOwners.set(alias, category.id);
    }
  }

  const resolved = ids.map((id) => (canonicalIds.has(id) ? id : aliasOwners.get(id)));
  return [...new Set(resolved.filter(Boolean))];
}
