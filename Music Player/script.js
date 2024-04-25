
let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    if (isNaN(seconds)|| seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =  Math.floor(seconds % 60);
  
    // Add leading zero if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  
    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
  }
async function getSong() {

    let a = await fetch("http://127.0.0.1:5500/songs");
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
   
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        } 
        
    }
    return songs
}

   const PlayMusic = (track, pause = false)=> {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
   }

async function main() {
    songs  = await getSong()
    PlayMusic(songs[0], true)
   
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="" />
        <div class="info">
          <div class="songName">${song.replaceAll("%20", " ")} </div>
          <div class="songName">Song Artist</div>
        </div>
        <div class="playnow">
          <span>PLay Now</span>
          <img class="invert" src="play.svg" alt="" />
        </div>
      </li>`;
    }
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element=>{

        PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })
   });
    play.addEventListener("click", ()=>{
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg";
        }
        else {
        currentSong.pause()
        play.src = "play.svg"
        }
    }) 
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
        
    })
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = ( e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"

    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-110%"

    })
    previous.addEventListener("click", ()=>{
       let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
       if ((index - 1) >= 0) {
        PlayMusic(songs[index - 1])
       }
    })
    next.addEventListener("click", ()=>{
       let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
       if ((index + 1) < songs.length ) {
        PlayMusic(songs[index+1])
       }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
      
        currentSong.volume = parseInt(e.target.value)/100;
    })
}
main();