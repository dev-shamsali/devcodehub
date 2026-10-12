/**
 * Small abuse filter for names people can see: snippet names, share names and
 * account names. It is deliberately conservative. Long stems match anywhere
 * (so "motherfucker" is caught), short words only match as whole words (so
 * "class" and "assistant" are fine).
 *
 * It catches the obvious cases, not a determined attacker. Terms of Use are
 * the real enforcement; this keeps the common abuse off the screen.
 */

// Matched as substrings of the normalised text.
const STEMS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'whore',
  'nigger', 'nigga', 'faggot', 'retard', 'pussy', 'cocksucker',
  'bhosad', 'bhosd', 'madarchod', 'maderchod', 'behenchod', 'bhenchod',
  'chutiya', 'chutia', 'gandu', 'gaandu', 'harami', 'kutta',
  'kamina', 'lauda', 'lavda', 'betichod',
];

// Matched only as whole words, because they sit inside innocent words.
const WORDS = ['dick', 'cock', 'ass', 'cum', 'tits', 'cunt', 'slut', 'randi', 'lund', 'chut', 'gand', 'gaand', 'mkc', 'bsdk'];

const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's', '!': 'i' };

function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[0134579@$!]/g, (c) => LEET[c] ?? c)
    .replace(/(.)\1{2,}/g, '$1$1'); // "fuuuuck" -> "fuuck"
}

/** "f u c k" -> "fuck": joins runs of single letters separated by spaces or dots. */
function joinSpaced(text) {
  return text.replace(/\b(?:[a-z][\s.\-_]+){2,}[a-z]\b/gi, (run) => run.replace(/[\s.\-_]+/g, ''));
}

export function containsProfanity(text) {
  if (typeof text !== 'string' || !text.trim()) return false;
  const words = normalise(joinSpaced(text)).split(/[^a-z]+/).filter(Boolean);
  return words.some(
    (w) => WORDS.includes(w) || STEMS.some((stem) => w.replace(/(.)\1+/g, '$1').includes(stem.replace(/(.)\1+/g, '$1')))
  );
}

/** Display-only mask for text that is already stored: "Shit" -> "S***". */
export function maskProfanity(text) {
  if (!containsProfanity(text)) return text;
  return String(text)
    .split(/(\s+)/)
    .map((part) => {
      if (/^\s+$/.test(part) || !containsProfanity(part)) return part;
      return part[0] + '*'.repeat(Math.max(part.length - 1, 2));
    })
    .join('');
}

export const PROFANITY_MESSAGE = 'Please use a respectful name. Abusive words are not allowed.';
