const content = document.getElementById("content");
const cursor = document.getElementById("cursor");
const playPauseBtn = document.getElementById("playPause");

const audio = new Audio("still_alive.mp3");
audio.crossOrigin = "anonymous";
let playing = false;

const lyrics = [
  {t:0.5,text:"This was a triumph."},
  {t:2.5,text:"I'm making a note here:"},
  {t:4.5,text:"huge success."},
  {t:7,text:"It's hard to overstate my satisfaction."},
  {t:10,text:"Aperture Science."},
  {t:12,text:"We do what we must because we can."},
  {t:15,text:"For the good of all of us, except the ones who are dead."},
  {t:19,text:"But there's no sense crying over every mistake."},
  {t:23,text:"You just keep on trying till you run out of cake."},
  {t:27,text:"And the science gets done, and you make a neat gun."},
  {t:32,text:"For the people who are still alive."},
  {t:36,text:"I'm not even angry."},
  {t:38,text:"I'm being so sincere right now."},
  {t:40,text:"Even though you broke my heart and killed me."},
  {t:44,text:"And tore me to pieces."},
  {t:47,text:"And threw every piece into a fire."},
  {t:50,text:"As they burned, it hurt because I was so happy for you."},
  {t:55,text:"Now these points of data make a beautiful line."},
  {t:60,text:"And we're out of beta, we're releasing on time."},
  {t:65,text:"So I'm glad I got burned, think of all the things we learned."},
  {t:70,text:"For the people who are still alive."},
  {t:75,text:"Go ahead and leave me."},
  {t:77,text:"I think I prefer to stay inside."},
  {t:80,text:"Maybe you'll find someone else to help you."},
  {t:83,text:"Maybe Black Mesa... THAT WAS A JOKE, HA HA, FAT CHANCE."},
  {t:88,text:"Anyway, this cake is great."},
  {t:90,text:"It's so delicious and moist."},
  {t:93,text:"Look at me still talking when there's science to do."},
  {t:98,text:"When I look out there, it makes me glad I'm not you."},
  {t:102,text:"I've experiments to run, there is research to be done."},
  {t:107,text:"On the people who are still alive."},
  {t:112,text:"And believe me I am still alive."},
  {t:115,text:"I'm doing science and I'm still alive."},
  {t:118,text:"I feel fantastic and I'm still alive."},
  {t:122,text:"While you're dying I'll be still alive."},
  {t:125,text:"And when you're dead I will be still alive."},
  {t:128,text:"Still alive."},
  {t:130,text:"Still alive."}
];

let scheduledIndex = 0;
let typingTask = null;
let allTasks = [];
let untypeSpeed = 40; // speed of deleting letters (ms)
let typeSpeed = 80;   // speed of typing letters (ms)

playPauseBtn.addEventListener("click", ()=>{
  if(!playing){
    audio.play();
    playing = true;
    playPauseBtn.textContent="Pause";
    startSync();
  } else {
    audio.pause();
    playing=false;
    playPauseBtn.textContent="Play";
    stopAllTasks();
  }
});

function startSync(){
  scheduledIndex = 0;
  content.innerHTML = "";
  processNextLine();
}

function processNextLine(){
  if(scheduledIndex >= lyrics.length) return;

  const line = lyrics[scheduledIndex];
  const node = document.createElement("div");
  node.className = "line current";
  content.appendChild(node);

  // type the line
  let i=0;
  const typeInterval = setInterval(()=>{
    if(i<=line.text.length){
      node.textContent = line.text.slice(0,i);
      content.scrollTop = content.scrollHeight;
      i++;
    } else {
      clearInterval(typeInterval);
      // schedule untyping when next line starts
      scheduledIndex++;
      if(scheduledIndex < lyrics.length){
        const nextLineTime = lyrics[scheduledIndex].t;
        const delay = (nextLineTime - audio.currentTime)*1000;
        allTasks.push(setTimeout(()=>{
          untypeLine(node);
          processNextLine(); // type next line after scheduling untype
        }, Math.max(0, delay)));
      } else {
        // last line: untype at end of song
        allTasks.push(setTimeout(()=>{
          untypeLine(node);
        }, (audio.duration - audio.currentTime)*1000));
      }
    }
  }, typeSpeed);
  allTasks.push(typeInterval);
}

function untypeLine(node){
  let j = node.textContent.length;
  const untype = setInterval(()=>{
    if(j>=0){
      node.textContent = node.textContent.slice(0,j);
      j--;
    } else {
      clearInterval(untype);
      node.remove();
    }
  }, untypeSpeed);
  allTasks.push(untype);
}

function stopAllTasks(){
  allTasks.forEach(t=>{
    clearInterval(t);
    clearTimeout(t);
  });
  allTasks=[];
}
