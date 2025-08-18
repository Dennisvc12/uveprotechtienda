export const slugify = (s) =>
  s.toLowerCase()
   .normalize('NFD').replace(/\p{Diacritic}/gu,'')
   .replace(/[^a-z0-9]+/g,'-')
   .replace(/(^-|-$)/g,'');

// Try local image first; fallback to Unsplash Source with query = product name
export const productImage = (name) => {
  const slug = slugify(name)
  const local = `/images/${slug}.jpg`
  // We can't check existence directly; use onError to swap.
  const remote = `https://source.unsplash.com/featured/?${encodeURIComponent(name + ' smartphone')}`
  return { slug, local, remote }
}
