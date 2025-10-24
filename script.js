const audioFileInput = document.getElementById('audioFile');
const audioUrlInput = document.getElementById('audioUrl');
const loadUrlBtn = document.getElementById('loadUrl');
const playPauseBtn = document.getElementById('playPause');
const terminal = document.getElementById('terminal');
const content = document.getElementById('content');
const cursor = document.getElementById('cursor');

let audio = new Audio();
audio.crossOrigin = "anonymous";

let lyrics = [
  {t:0.5, text:"This was a triumph."},
  {t:2.5, text:"I'm making a note here:"},
  {t:4.5, text:"huge success."},
  {t:6.5, text:"It's hard to overstate"},
  {t:8.5, text:"My satisfaction."},
  {t:10.5, text:"Aperture Science."},
  {t:12.0, text:"We do what we must"},
  {t:13.5, text:"Because we can."},
  {t:15.0, text:"For the good of all of us."},
  {t:17.0, text:"Except the ones who are dead."},
  {t:19.0, text:"But there's no sense crying"},
  {t:21.0, text:"Over every mistake."},
  {t:23.0, text:"You just keep on trying"},
  {t:25.0, text:"Till you run out of cake."},
  {t:27.0, text:"And the Science gets done."},
  {t:29.0, text:"And you make a neat gun."},
  {t:31.0, text:"For the people who are"},
  {t:32.5, text:"Still alive."},
  {t:34.0, text:"I'm not even angry."},
  {t:36.0, text:"I'm being so sincere right now."},
  {t:38.0, text:"Even though you broke my heart."},
  {t:40.0, text:"And killed me."},
  {t:42.0, text:"And tore me to pieces."},
  {t:44.0, text:"And threw every piece into a fire."},
  {t:46.5, text:"As they burned it hurt because"},
  {t:48.5, text:"I was so happy for you!"},
  {t:51.0, text:"Now these points of data"},
  {t:53.0, text:"Make a beautiful line."},
  {t:55.0, text:"And we're out of beta."},
  {t:57.0, text:"We're releasing on time."},
  {t:59.0, text:"So I'm GLaD. I got burned."},
  {t:61.0, text:"Think of all the things we learned"},
  {t:63.0, text:"For the people who are"},
  {t:64.5, text:"Still alive."},
  {t:66.5, text:"Go ahead and leave me."},
  {t:68.5, text:"I think I prefer to stay inside."},
  {t:70.5, text:"Maybe you'll find someone else"},
  {t:72.5, text:"To help you."},
  {t:74.0, text:"Maybe Black Mesa..."},
  {t:76.0, text:"THAT WAS A JOKE, HA HA, FAT CHANCE."},
  {t:78.0, text:"Anyway this cake is great"},
  {t:80.0, text:"It's so delicious and moist"},
  {t:82.0, text:"Look at me still talking when there's science to do"},
  {t:85.0, text:"When I look out there"},
  {t:87.0, text:"It makes me GLaD I'm not you."},
  {t:89.0, text:"I've experiments to run"},
  {t:91.0, text:"There is research to be done"},
  {t:93.0, text:"On the people who are"},
  {t:94.5, text:"Still alive."},
  {t:96.0, text:"And believe me I am still alive"},
  {t:98.0, text:"I'm doing science and I'm still alive"},
  {t:100.0, text:"I feel FANTASTIC and I'm still alive"},
  {t:102.5, text:"While you're dying I'll be still alive"},
  {t:104.5, text:"And when you're dead I will be still alive"},
  {t:106.5, text:"Still alive"},
  {t:108.0, text:"Still alive."}
];

let playing = false;
let scheduledIndex = 0;
let typingTask = null;

function createLineEl(text, cls='future'){
  const d = document.createElement('div');
  d.className = 'line ' + cls;
  d.textContent = text;
  return d;
}

function typeLine(text){
  const node = createLineEl('', 'current');
  content.appendChild(node);
  terminal.scrollTop = terminal.scrollHeight;
  const baseMs = 28;
  let i = 0;
  stopTyping();
  typingTask = setInterval(() => {
    if(i <= text.length){
      node.textContent = text.slice(0,i);
      terminal.scrollTop = terminal.scrollHeight;
      i++;
    } else {
      clearInterval(typingTask);
      typingTask = null;
    }
  }, baseMs);
  const others = content.querySelectorAll('.line.current');
  others.forEach((el, idx) => {
    if(el !== node && idx < content.children.length - 1) el.className = 'line past';
  });
}

function stopTyping(){ if(typingTask){ clearInterval(typingTask); typingTask=null; } }

function startSync(){
  scheduledIndex = 0;
  content.innerHTML = '';
  cursor.style.display = 'inline-block';
  const runner = setInterval(()=>{
    if(audio.paused || !playing){ clearInterval(runner); return; }
    const t = audio.currentTime;
    while(scheduledIndex < lyrics.length && lyrics[scheduledIndex].t <= t + 0.05){
      typeLine(lyrics[scheduledIndex].text);
      scheduledIndex++;
    }
    if(scheduledIndex >= lyrics.length) clearInterval(runner);
  }, 50);
}

playPauseBtn.addEventListener('click', async ()=>{
  if(!audio.src) return alert('Load an audio file first.');
  if(!playing){
    await audio.play().catch(()=>alert('Press Play again after interaction.'));
    playing = true;
    playPauseBtn.textContent = 'Pause';
    startSync();
  } else {
    audio.pause();
    playing = false;
    playPauseBtn.textContent = 'Play';
    stopTyping();
  }
});

audioFileInput.addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f) return;
  audio.src = URL.createObjectURL(f);
  audio.load();
  playing = false;
  playPauseBtn.textContent='Play';
});

loadUrlBtn.addEventListener('click', ()=>{
  const url = audioUrlInput.value.trim();
  if(!url) return alert('Paste a direct audio URL.');
  audio.src = url;
  audio.load();
  playing=false;
  playPauseBtn.textContent='Play';
});
