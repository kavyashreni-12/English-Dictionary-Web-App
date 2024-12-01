const inputEl = document.getElementById("input");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const speechEl = document.getElementById("speech");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const audioEl = document.getElementById("audio");
const loadingEl = document.getElementById("loading");

async function fetchAPI(word) {
  try {
    loadingEl.style.display = "block";
    infoTextEl.style.display = "block";
    meaningContainerEl.style.display = "none";
    infoTextEl.innerText = `Searching the meaning of "${word}"...`;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const result = await fetch(url).then((res) => res.json());

    loadingEl.style.display = "none";

    if (result.title) {
      infoTextEl.innerText = `No results found for "${word}"`;
    } else {
      infoTextEl.style.display = "none";
      meaningContainerEl.style.display = "block";
      titleEl.innerText = result[0].word;

      // Find the first valid definition
      const definitions = result[0].meanings.flatMap((meaning) => meaning.definitions);
      const validDefinition = definitions.find((def) => def.definition) || {};
      const example = validDefinition.example || "No example available";
      const partOfSpeech = result[0].meanings[0]?.partOfSpeech || "N/A";

      speechEl.innerText = partOfSpeech;
      meaningEl.innerText = validDefinition.definition || "N/A";

      // Simplify example if too complex
      exampleEl.innerText = simplifyExample(example);
      if (result[0].phonetics[0]?.audio) {
        audioEl.style.display = "block";
        audioEl.src = result[0].phonetics[0].audio;
      } else {
        audioEl.style.display = "none";
      }
    }
  } catch (error) {
    console.error(error);
    loadingEl.style.display = "none";
    infoTextEl.innerText = `An error occurred. Please try again later.`;
  }
}

function simplifyExample(example) {
  // Simplify the example sentence if necessary
  if (example.length > 100) {
    return `${example.slice(0, 100)}...`;
  }
  return example;
}

inputEl.addEventListener("keyup", (e) => {
  if (e.target.value && e.key === "Enter") {
    fetchAPI(e.target.value.trim());
  }
});
