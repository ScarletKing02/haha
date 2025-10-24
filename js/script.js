const content = document.getElementById("content");
const cursor = document.getElementById("cursor");
const playPauseBtn = document.getElementById("playPause");

const audio = new Audio("audio/still_alive.mp3");
let playing = false;

// Lyrics with timestamps (seconds)
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
let allTasks = [];
const typeSpeed = 80;      // ms per char
const deleteDelay = 80;    // wait 80ms after line finishes typing before untyping
const untypeSpeed = 50;    // ms per char

playPauseBtn.addEventListener("click", ()=>{
  if(!playing){
    audio.play();
    playing = true;
    playPauseBtn.textContent="Pause";
    startSync();
  } else {
    audio.pause();
    playing=false;
    stopAllTasks();
    playPauseBtn.textContent="Play";
  }
});

function startSync(){
  scheduledIndex = 0;
  content.innerHTML = "";
  const interval = setInterval(()=>{
    if(!playing || audio.paused){ clearInterval(interval); return; }
    const t = audio.currentTime;
    while(scheduledIndex < lyrics.length && lyrics[scheduledIndex].t <= t){
      typeAndDelete(lyrics[scheduledIndex].text);
      scheduledIndex++;
    }
  }, 30);
  allTasks.push(interval);
}

function typeAndDelete(text){
  const node = document.createElement("div");
  node.className = "line current";
  content.appendChild(node);
  let i = 0;

  // Type
  const typeInterval = setInterval(()=>{
    if(i <= text.length){
      node.textContent = text.slice(0,i);
      content.scrollTop = content.scrollHeight;
      i++;
    } else {
      clearInterval(typeInterval);

      // Delete after fixed delay
      setTimeout(()=>{
        let j = text.length;
        const deleteInterval = setInterval(()=>{
          if(j >= 0){
            node.textContent = text.slice(0,j);
            j--;
          } else {
            clearInterval(deleteInterval);
            node.remove();
          }
        }, untypeSpeed);
        allTasks.push(deleteInterval);
      }, deleteDelay);
    }
  }, typeSpeed);

  allTasks.push(typeInterval);
}

function stopAllTasks(){
  allTasks.forEach(t=>{
    clearInterval(t);
    clearTimeout(t);
  });
  allTasks = [];
}
