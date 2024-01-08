console.log('Java Script for page');

let currentSong = new Audio()
let songs
let currentFolder
function secondsToMinutesSeconds(input) {
    const totalSeconds = Math.floor(input);
    const milliseconds = Math.round((input - totalSeconds) * 1000);

    // Convert total seconds to minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Use template literals to format the result with leading zeros
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    return formattedTime;
}

async function getSongs(folder) {
    currentFolder=folder
    let fetch_song = await fetch(`http://127.0.0.1:5500/spotify%20clone/${folder}/`);
    let response = await fetch_song.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    //display all the song in playlist 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML += `
        <li>
                    <img class="invert" src="resourceSvg/music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("_", " ")}</div>
                        <div>Siva</div>
                    </div>
                    <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="resourceSvg/play.svg" alt="">
                    </div>
                    
                </li> `;

    }

    // Attach Event Listiner to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener('click', element => {
            //console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })


    });


    


}

//play music function 
const playMusic = (track, pause = false) => {
    // let audio= new Audio("songs/" + track)
    currentSong.src = `${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "resourceSvg/pause.svg"

    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbum()
{
    let fetch_song = await fetch(`http://127.0.0.1:5500/spotify%20clone/songs/`);
    let response = await fetch_song.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;

    let anchor= div.getElementsByTagName("a")
    let cardContainer= document.querySelector(".cardContainer")
    
    let array= Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        //console.log(e);

        if (e.href.includes("/songs/")) {
            //console.log(e.href.split("/").slice(-1)[0]);

            let folder= e.href.split("/").slice(-1)[0]
            //console.log(typeof(folder));
            
            //console.log("folder name: "+folder);
            
            //get metadata for folder

            let fetch_song = await fetch(`http://127.0.0.1:5500/spotify%20clone/songs/${folder}/info.json`);
            let response = await fetch_song.json();
            console.log('',response);

                        //appending new cards based on folder response
                        cardContainer.innerHTML= cardContainer.innerHTML+ `
                        <div data-folder="${folder}" class="card">
                          <button class="circular-button">
                            <div class="svg-container">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                  stroke="#141B34"
                                  stroke-width="1.5"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                          </button>
                          <div class="img-holder">
                            <img
                              aria-hidden="false"
                              draggable="false"
                              loading="lazy"
                              src="http://127.0.0.1:5500/spotify%20clone/songs/${folder}/cover.jpg"
                              alt=""
                            />
                          </div>
                          <div class="text-holder">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                          </div>
                        </div>
                        `
            
        }

        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            console.log(e);
            
            e.addEventListener("click", async item=>{
                console.log(item.target);
                
                songs= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                
            })
        })
        
    }
    
}

async function main() {

    //list of songs
    await getSongs("songs/ncs");
    playMusic(songs[0], true)
    
    //display all the album and load the playlist on click of card
    displayAlbum()

    //attach event litiner to play next previous

    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "resourceSvg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "resourceSvg/play.svg"
        }
    })

    //event listiner that listn to time update of song

    currentSong.addEventListener("timeupdate", () => {
        //console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = ` ${secondsToMinutesSeconds(currentSong.currentTime)} /
        ${secondsToMinutesSeconds(currentSong.duration)} `

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    //Add event Listiner to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = (percent) + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //event listiner to circle and drag listiner where 
    document.querySelector(".circle").addEventListener("drag", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = (percent) + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //event listiner for ham burger click and display left side 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //event listiner for cancle button

    document.querySelector(".close").addEventListener("click", e =>{
        // console.log(e)
        document.querySelector(".left").style.left ="-120%"
        document.querySelector(".left").style.transition ="1s"
    })
    
    //event listiner to play previous song
    previous.addEventListener("click", ()=>{
        console.log('Previous clicked');
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0)
        {
            playMusic(songs[index-1])
        }
        else{
            playMusic(songs[index])
        }
    })
    
    next.addEventListener("click", ()=>{
        console.log('next clicked');
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(index);
        console.log(currentSong.src.split("/").slice(-1)[0]);
        if((index+1)< songs.length)
        {
            playMusic(songs[index+1])
        }
        else{
            playMusic(songs[index])
        }
        
    })

    //add eventlistiner to volume

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e, e.target, e.target.value);
        volRange= parseInt((e.target.value))/100
        currentSong.volume= volRange
        if(volRange==0)
        {
            volumeLevel.src="resourceSvg/volume1.svg"
        }
        else if(volRange<=0.5)
        {
            volumeLevel.src="resourceSvg/volume2.svg"
        }
        else
        {
            volumeLevel.src="resourceSvg/volume3.svg"
        }
    })

    //load the playlist when card is loaded

    

}

main()
