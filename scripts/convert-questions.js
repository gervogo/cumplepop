import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const preguntasDir = join(__dirname, '..', 'preguntas');
const outputFile = join(__dirname, '..', 'public', 'data', 'preguntas.json');

const files = readdirSync(preguntasDir)
  .filter(f => f.endsWith('.md'))
  .sort();

let allQuestions = [];

for (const file of files) {
  const content = readFileSync(join(preguntasDir, file), 'utf-8');
  const jsonStart = content.indexOf('[');
  const jsonEnd = content.lastIndexOf(']') + 1;
  if (jsonStart === -1 || jsonEnd <= jsonStart) {
    console.warn(`SKIP ${file}: no JSON array found`);
    continue;
  }
  try {
    const json = content.slice(jsonStart, jsonEnd);
    const questions = JSON.parse(json);
    allQuestions = allQuestions.concat(questions);
    console.log(`OK   ${file}: ${questions.length} preguntas`);
  } catch (e) {
    console.warn(`FAIL ${file}: ${e.message}`);
  }
}

allQuestions.sort((a, b) => a.id - b.id);

writeFileSync(outputFile, JSON.stringify(allQuestions, null, 2) + '\n', 'utf-8');
console.log(`\nTotal: ${allQuestions.length} preguntas → ${outputFile}`);
