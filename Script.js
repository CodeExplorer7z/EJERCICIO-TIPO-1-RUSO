const vocabulary = [
  { ru: "Я бы хотел заказать столик на двоих.", es: "Me gustaría reservar una mesa para dos." },
  { ru: "К сожалению, я не смогу прийти на встречу.", es: "Lamentablemente, no podré ir a la reunión." },
  { ru: "Мы с друзьями собираемся поехать за город.", es: "Mis amigos y yo planeamos ir fuera de la ciudad." },
  { ru: "Вы не могли бы подсказать, как доехать до центра?", es: "¿Podría decirme cómo se va al centro?" },
  { ru: "Я занимаюсь русским языком уже два года.", es: "Estudio ruso desde hace ya dos años." }
];

let currentIdx = 0;
let score = 0;

function speakRussian(text, callback = null) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.75; 
    
    if (callback) {
      utterance.onend = () => setTimeout(callback, 600);
    }
    window.speechSynthesis.speak(utterance);
  }
}

document.getElementById('audio-btn').onclick = () => {
  speakRussian(document.getElementById('word-to-test').textContent);
};

function loadQuestion() {
  const item = vocabulary[currentIdx];
  document.getElementById('word-to-test').textContent = item.ru;
  document.getElementById('feedback').textContent = "";
  
  let options = [item.es];
  while(options.length < 4) {
    let rand = vocabulary[Math.floor(Math.random() * vocabulary.length)].es;
    if(!options.includes(rand)) options.push(rand);
  }
  
  options.sort(() => Math.random() - 0.5);
  const container = document.getElementById('options-container');
  container.innerHTML = ""; 
  
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = "opt-btn";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt, item.es, btn);
    container.appendChild(btn);
  });
}

function checkAnswer(selected, correct, btn) {
  const allButtons = document.querySelectorAll('.opt-btn');
  allButtons.forEach(b => b.disabled = true);

  if(selected === correct) {
    btn.classList.add('correct');
    score += 10;
    document.getElementById('points').textContent = score;
    speakRussian(vocabulary[currentIdx].ru, nextQuestion);
  } else {
    btn.classList.add('wrong');
    document.getElementById('feedback').textContent = `Correct: ${correct}`;
    setTimeout(nextQuestion, 2500);
  }
}

function nextQuestion() {
  currentIdx = (currentIdx + 1) % vocabulary.length;
  document.getElementById('progress').style.width = `${(currentIdx / vocabulary.length) * 100}%`;
  loadQuestion();
}

window.addEventListener('load', () => {
  window.speechSynthesis.getVoices();
  setTimeout(loadQuestion, 100);
});
