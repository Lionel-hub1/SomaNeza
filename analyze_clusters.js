
const fs = require('fs');
const path = require('path');

// Mock the exports since we can't import typescript directly in node easily without compilation
const content = fs.readFileSync('/Users/lionel/Documents/Private/Projects/SomaNeza/src/lib/kinyarwanda.ts', 'utf8');

// Extract SIMPLE_WORDS and DEFAULT_CONSONANT_CLUSTERS using regex
const wordsMatch = content.match(/export const SIMPLE_WORDS:.*?= (\[[\s\S]*?\]);/);
const clustersMatch = content.match(/export const DEFAULT_CONSONANT_CLUSTERS = (\[[\s\S]*?\]) as const;/);

if (!wordsMatch || !clustersMatch) {
    console.error("Could not find data");
    process.exit(1);
}

// dangerously eval the data (it's just arrays)
const SIMPLE_WORDS = eval(wordsMatch[1]);
const DEFAULT_CONSONANT_CLUSTERS = eval(clustersMatch[1]);

console.log("Total clusters:", DEFAULT_CONSONANT_CLUSTERS.length);
console.log("Total words:", SIMPLE_WORDS.length);

const clusterCounts = {};
DEFAULT_CONSONANT_CLUSTERS.forEach(c => clusterCounts[c] = 0);

SIMPLE_WORDS.forEach(wordObj => {
    const word = wordObj.word.toLowerCase();
    DEFAULT_CONSONANT_CLUSTERS.forEach(cluster => {
        if (word.includes(cluster)) {
            clusterCounts[cluster]++;
        }
    });
});

const zeroWords = [];
const oneWord = [];
const manyWords = [];

DEFAULT_CONSONANT_CLUSTERS.forEach(c => {
    const count = clusterCounts[c];
    if (count === 0) zeroWords.push(c);
    else if (count === 1) oneWord.push(c);
    else manyWords.push({ cluster: c, count });
});

console.log("\n--- JSON OUTPUT ---");
console.log(JSON.stringify({
    zeroWords,
    oneWord,
    manyWords: manyWords.sort((a, b) => b.count - a.count)
}, null, 2));
