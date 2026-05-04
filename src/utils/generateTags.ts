const TAG_DICTIONARY: Record<string, string[]> = {
  lavoro: ["lavoro", "meeting", "cliente", "ufficio", "progetto"],
  salute: ["dentista", "medico", "ansia", "stress", "stanco"],
  viaggi: ["viaggio", "treno", "giappone", "volo", "hotel"],
  finanze: ["bolletta", "pagare", "business", "budget"],
  famiglia: ["luca", "regalo", "famiglia"],
  idee: ["idea", "app", "creare", "potrei"],
};

export function generateTags(text: string): string[] {
  const normalized = text.toLowerCase();
  const tags = Object.entries(TAG_DICTIONARY)
    .filter(([, keywords]) =>
      keywords.some((keyword) => normalized.includes(keyword))
    )
    .map(([tag]) => tag);

  return tags.length > 0 ? tags : ["personale"];
}
