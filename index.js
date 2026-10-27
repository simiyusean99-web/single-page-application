const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const searchButton = document.getElementById("searchButton");

const message = document.getElementById("message");
const wordResult = document.getElementById("wordResult");

const wordElement = document.getElementById("word");
const phoneticElement = document.getElementById("phonetic");
const meaningsElement = document.getElementById("meanings");

const audioButton = document.getElementById("audioButton");

let audioUrl = "";


searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchedWord = wordInput.value.trim();

  if (searchedWord === "") {
    showMessage("Please enter a word to search.");
    wordResult.style.display = "none";
    return;
  }

  searchWord(searchedWord);
});


/* =========================
   FETCH WORD
========================= */

async function searchWord(word) {

  showMessage("Searching...");
  wordResult.style.display = "none";

  try {

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();

    displayWord(data[0]);

  } catch (error) {

    wordResult.style.display = "none";

    showMessage(
      "Sorry, we could not find that word. Please try another word."
    );

  }
}


/* =========================
   DISPLAY WORD
========================= */

function displayWord(data) {

  message.textContent = "";

  wordResult.style.display = "block";

  wordElement.textContent = data.word;

  phoneticElement.textContent =
    data.phonetic || findPhonetic(data.phonetics);

  meaningsElement.innerHTML = "";

  audioUrl = findAudio(data.phonetics);

  if (audioUrl) {
    audioButton.hidden = false;
  } else {
    audioButton.hidden = true;
  }


  data.meanings.forEach(function (meaning) {

    const meaningDiv = document.createElement("div");

    meaningDiv.classList.add("meaning");

    const partOfSpeech = document.createElement("h3");

    partOfSpeech.classList.add("part-of-speech");

    partOfSpeech.textContent = meaning.partOfSpeech;

    meaningDiv.appendChild(partOfSpeech);


    meaning.definitions.forEach(function (definition, index) {

      const definitionDiv = document.createElement("div");

      definitionDiv.classList.add("definition");


      const definitionText = document.createElement("p");

      definitionText.textContent =
        `${index + 1}. ${definition.definition}`;

      definitionDiv.appendChild(definitionText);


      if (definition.example) {

        const exampleText = document.createElement("p");

        exampleText.classList.add("example");

        exampleText.textContent =
          `Example: "${definition.example}"`;

        definitionDiv.appendChild(exampleText);
      }


      if (
        definition.synonyms &&
        definition.synonyms.length > 0
      ) {

        const synonymsDiv = document.createElement("div");

        synonymsDiv.classList.add("synonyms");

        const synonymsTitle = document.createElement("strong");

        synonymsTitle.textContent = "Synonyms: ";

        synonymsDiv.appendChild(synonymsTitle);


        definition.synonyms.forEach(function (synonym) {

          const synonymSpan = document.createElement("span");

          synonymSpan.textContent = synonym;

          synonymsDiv.appendChild(synonymSpan);

        });


        definitionDiv.appendChild(synonymsDiv);
      }


      meaningDiv.appendChild(definitionDiv);

    });


    meaningsElement.appendChild(meaningDiv);

  });

}


/* =========================
   FIND PHONETIC
========================= */

function findPhonetic(phonetics) {

  if (!phonetics) {
    return "";
  }

  const phonetic = phonetics.find(function (item) {
    return item.text;
  });

  return phonetic ? phonetic.text : "";
}


/* =========================
   FIND AUDIO
========================= */

function findAudio(phonetics) {

  if (!phonetics) {
    return "";
  }

  const audio = phonetics.find(function (item) {
    return item.audio;
  });

  return audio ? audio.audio : "";
}


/* =========================
   AUDIO BUTTON
========================= */

audioButton.addEventListener("click", function () {

  if (audioUrl) {

    const audio = new Audio(audioUrl);

    audio.play();

  }

});


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

  message.textContent = text;

}