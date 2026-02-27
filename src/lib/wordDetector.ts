function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .trim();
}

export function detectWords(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const normalizedTranscript = normalizeText(transcript);
  const detected: string[] = [];

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;

    const normalizedWord = normalizeText(word);

    if (normalizedWord.includes(' ')) {
      if (normalizedTranscript.includes(normalizedWord)) {
        detected.push(word);
      }
    } else {
      const regex = new RegExp(`\\b${escapeRegex(normalizedWord)}\\b`, 'i');
      if (regex.test(normalizedTranscript)) {
        detected.push(word);
      }
    }
  }

  return detected;
}

const WORD_ALIASES: Record<string, string[]> = {
  'ci/cd': ['ci cd', 'cicd', 'kontinuierliche integration'],
  'mvp': ['minimum viable product', 'minimalprodukt'],
  'roi': ['return on investment', 'rendite'],
  'api': ['a.p.i.', 'schnittstelle'],
  'devops': ['dev ops', 'dev-ops'],
  'überzahl': ['power play', 'powerplay'],
  'unterzahl': ['penalty kill'],
};

export function detectWordsWithAliases(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const detected = detectWords(transcript, cardWords, alreadyFilled);

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;
    if (detected.includes(word)) continue;

    const aliases = WORD_ALIASES[word.toLowerCase()];
    if (aliases) {
      for (const alias of aliases) {
        if (normalizeText(transcript).includes(alias)) {
          detected.push(word);
          break;
        }
      }
    }
  }

  return detected;
}
