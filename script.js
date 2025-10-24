const playPauseBtn = document.getElementById('playPause');
const content = document.getElementById('content');
const cursor = document.getElementById('cursor');

const audio = new Audio('still_alive.mp3');
audio.preload = "auto";

const lyrics = [
  "This was a triumph.",
  "I'm making a note here: huge success.",
  "It's hard to overstate my satisfaction.",
  "Aperture Science.",
  "We do what we must because we can.",
  "For the good of all of us. Except the ones who are dead.",
  "But there's no sense crying over every mistake.",
  "You just keep on trying till you run out of cake.",
  "And the Science gets done.",
  "And you make a neat gun.",
  "For the people who are still alive.",
  "I'm not even angry.",
  "I'm being so sincere right now.",
  "Even though you broke my heart and killed me.",
  "And tore me to pieces.",
  "And threw every piece into a fire.",
  "As they burned it hurt because I was so happy for you!",
  "Now these points of data make a beautiful line.",
  "And we're out of beta. We're releasing on time.",
  "So I'm GLaD. I got burned. Think of all the things we learned",
  "For the people who are still alive.",
  "Go ahead and leave me.",
  "I think I prefer to stay inside.",
  "Maybe you'll find someone else to help you.",
  "Maybe Black Mesa... THAT WAS A JOKE, HA HA, FAT CHANCE.",
  "Anyway this cake is great. It's so delicious and moist.",
  "Look at me still talking when there's science to do.",
  "When I look out there it makes me GLaD I'm not you.",
  "I've experiments to run. There is research to be done.",
  "On the people who are still alive.",
  "And believe me I am still alive.",
  "I'm doing science and I'm still alive.",
  "I feel FANTASTIC and I'm still alive.",
  "While you're dying I'll be still alive.",
  "And when you're dead I will be still alive.",
  "Still alive.",
  "Still alive."
];

let playing = false;
let currentLine = 0;
let charIndex = 0;
let lineNode = null;
let typingInterval = null;
let deleteTimeout = 3000; // 3 seconds before untype

function typeLine(line){
  lineNode = document.createElement('div');
  lineNode.className = 'line current';
  content.appendChild(lineNode);
  charIndex = 0;

  typingInterval = setInterval(() => {
    if(charIndex <= line.length){
      lineNode.textContent = line.slice(0, charIndex++);
      content.scrollTop = content.scrollHeight;
    } else {
      clearInterval(typingInterval);
      lineNode.className = 'line past';
      setTimeout(() => untypeLine(lineNode), deleteTimeout);
      currentLine++;
      if(currentLine < lyrics.length) typeLine(lyrics[currentLine]);
    }
  }, 40);
}

function untypeLine(node){
  let i = node.textContent.length;
  const interval = setInterval(() => {
    if(i >= 0){
      node.textContent = node.textContent.slice(0, i--);
    } else {
      clearInterval(interval);
    }
  }, 80);
}

playPauseBtn.addEventListener('click', () => {
  if(!playing){
    audio.currentTime = 0;
    audio.play();
    playing = true;
    playPauseBtn.textContent = 'Pause';
    currentLine = 0;
    content.innerHTML = '';
    typeLine(lyrics[currentLine]);
  } else {
    audio.pause();
    playing = false;
    playPauseBtn.textContent = 'Play';
    clearInterval(typingInterval);
  }
});

// Pixel logo in bottom-right
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'orange';
const size = 10;

// simple approximation of Aperture logo
const positions = [
  [2,0],[3,0],[4,0],
  [5,1],[6,2],[6,3],
  [5,4],[4,5],[3,5],
  [2,4],[1,3],[1,2]
];

positions.forEach(pos => {
  ctx.fillRect(pos[0]*size, pos[1]*size, size, size);
});
