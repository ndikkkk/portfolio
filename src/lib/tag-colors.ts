export const TAG_COLORS = [
  "bg-yellow",
  "bg-pink",
  "bg-blue",
  "bg-green",
  "bg-orange",
  "bg-lilac",
] as const;

// Warna badge dibuat konsisten per nama teknologi,
// supaya nama yang sama selalu berwarna sama di seluruh bagian situs.
export function tagColor(name: string): (typeof TAG_COLORS)[number] {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
}