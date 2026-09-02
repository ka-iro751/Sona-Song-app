const queuePanel = document.getElementById("queuePanel");

let currentPlaylist = [];
let currentIndex = 0;
const player = new Audio();

//controls for the right side bar
document.getElementById("closeQueueBtn").addEventListener("click", () => {
  queuePanel.classList.add("hidden");
  queuePanel.classList.remove("flex");
});

//makes the cards a button
document.getElementById("quickPicks").addEventListener("click", (e) => {
  const card = e.target.closest(".quick-pick-card");
  queuePanel.classList.remove("hidden");
  queuePanel.classList.add("flex");

  if (!card) {
    return;
  }
  const term = card.dataset.term;
  loadQueue(term);
});

//plays song when the song row is clicked
document.getElementById("queueList").addEventListener("click", (e) => {
  const card = e.target.closest(".queue-row");

  if (!card) return;

  const songIndex = Number(card.dataset.index);
  playTrackAtIndex(songIndex);
});

//wires of next btn
document.getElementById("nextBtn").addEventListener("click", () => {
  let nextIndex = currentIndex + 1;
  if (nextIndex >= currentPlaylist.length) {
    nextIndex = 0;
  }
  playTrackAtIndex(nextIndex);
});

//wires previous btn
document.getElementById("prevBtn").addEventListener("click", () => {
  let prevIndex = currentIndex - 1;
  if (prevIndex < 0) {
    prevIndex = currentPlaylist.length - 1;
  }
  playTrackAtIndex(prevIndex);
});

//fetches data form api
async function loadQueue(term) {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&limit=10`,
  );
  const data = await res.json();
  console.log(data);
  currentPlaylist = data.results;
  renderQueue(data.results);
  playTrackAtIndex(0);
}

//render the songs in the sidebar
function renderQueue(songs) {
  const container = document.getElementById("queueList");
  container.innerHTML = "";

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.dataset.index = index;
    card.className =
      "queue-row flex cursor-pointer items-center gap-3 px-5 py-3 transition hover:bg-surface";

    card.innerHTML = `
        <span class="w-5 shrink-0 text-[13px] text-text-muted">${index + 1}</span>
          <img
            src="${song.artworkUrl100}"
            alt=""
            class="h-12 w-12 shrink-0 rounded-md bg-surface object-cover"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-[15px] font-semibold text-textColor">
              ${song.trackName}
            </p>
            <p class="truncate text-[13px] text-text-muted">${song.artistName}</p>
          </div>
    `;
    container.appendChild(card);
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

player.addEventListener("timeupdate", () => {
  document.getElementById("currentTime").textContent =
    `${formatTime(player.currentTime)}`;
  document.getElementById("duration").textContent =
    `${formatTime(player.duration)}`;

  const percentage = (player.currentTime / player.duration) * 100;
  document.getElementById("progressFill").style.width = `${percentage}%`;
});

//plays song at the given index
function playTrackAtIndex(index) {
  currentIndex = index;
  document.querySelectorAll(".queue-row").forEach((row) => {
    row.classList.remove("bg-surface-muted");
  });

  const activeRow = document.querySelector(`.queue-row[data-index="${index}"]`);
  if (activeRow) {
    activeRow.classList.add("bg-surface-muted");
  }
  const song = currentPlaylist[index];

  document.querySelector("#playerBar h3").textContent = song.trackName;
  document.querySelector("#playerBar p").textContent = song.artistName;
  document.querySelector("#playerBar img").src = song.artworkUrl100;

  player.src = song.previewUrl;
  player.play();
}

//play button controls
document.getElementById("playBtn").addEventListener("click", () => {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
});

const volumeTrack = document.getElementById("volumeTrack");
volumeTrack.addEventListener("click", (e) => {
  const rect = volumeTrack.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const percentage = clickPosition / rect.width;
  console.log(percentage);
  player.volume = percentage;
  document.getElementById("volumeFill").style.width = `${percentage * 100}%`;
});

//new release section
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const artistPool = [
  "The Beatles",
  "Michael Jackson",
  "Elvis Presley",
  "Madonna",
  "Eminem",
  "Rihanna",
  "Led Zeppelin",
  "Pink Floyd",
  "Queen",
  "Taylor Swift",
  "Drake",
  "Beyoncé",
  "Justin Bieber",
  "Elton John",
  "Mariah Carey",
  "Stevie Wonder",
  "Prince",
  "David Bowie",
  "Whitney Houston",
  "Celine Dion",
  "Bob Dylan",
  "The Rolling Stones",
  "U2",
  "Bruce Springsteen",
  "Billy Joel",
  "Phil Collins",
  "Paul McCartney",
  "Janet Jackson",
  "Jay-Z",
  "Kanye West",
  "Kendrick Lamar",
  "Tupac Shakur",
  "The Notorious B.I.G.",
  "Lil Wayne",
  "Snoop Dogg",
  "Dr. Dre",
  "Outkast",
  "Post Malone",
  "The Weeknd",
  "Bruno Mars",
  "Ed Sheeran",
  "Adele",
  "Lady Gaga",
  "Katy Perry",
  "Justin Timberlake",
  "Britney Spears",
  "Christina Aguilera",
  "Ariana Grande",
  "Billie Eilish",
  "Olivia Rodrigo",
  "Dua Lipa",
  "Harry Styles",
  "Shawn Mendes",
  "Coldplay",
  "Radiohead",
  "Nirvana",
  "Pearl Jam",
  "Red Hot Chili Peppers",
  "Green Day",
  "Linkin Park",
  "Foo Fighters",
  "Metallica",
  "AC/DC",
  "Guns N' Roses",
  "Aerosmith",
  "Van Halen",
  "Def Leppard",
  "Bon Jovi",
  "Fleetwood Mac",
  "The Eagles",
  "Bee Gees",
  "ABBA",
  "Earth, Wind & Fire",
  "Marvin Gaye",
  "Aretha Franklin",
  "James Brown",
  "Ray Charles",
  "Sam Cooke",
  "Bob Marley",
  "Jimmy Buffett",
  "Johnny Cash",
  "Dolly Parton",
  "Willie Nelson",
  "Garth Brooks",
  "Shania Twain",
  "George Strait",
  "Tim McGraw",
  "Kenny Chesney",
  "Luke Bryan",
  "Chris Stapleton",
  "Carrie Underwood",
  "Miranda Lambert",
  "Miles Davis",
  "John Coltrane",
  "Louis Armstrong",
  "Duke Ellington",
  "Frank Sinatra",
  "Dean Martin",
  "Nat King Cole",
  "Ella Fitzgerald",
];

//gets random artist from the array
function getRandomArtists(count) {
  return shuffle(artistPool).slice(0, count);
}

let newReleaseSongs = [];
let batchIndex = -1;
let releasedBatch = [];

//fetches the songs
async function loadNewReleases() {
  const artists = getRandomArtists(4);
  const promises = artists.map((artist) => {
    return fetch(
      `https://itunes.apple.com/search?term=${artist}&media=music&limit=5`,
    ).then((res) => res.json());
  });
  const results = await Promise.all(promises);
  const songs = results.flatMap((response) => response.results);
  songs.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  const topRelease = songs.slice(0, 9);
  return topRelease;
}

async function showFirstBatch() {
  newReleaseSongs = await loadNewReleases();
  releasedBatch.push(newReleaseSongs);
  batchIndex = 0;
  renderNewRelease(newReleaseSongs);
}
showFirstBatch();

//loads the songs into the div
function renderNewRelease(songs) {
  const newRelease = document.getElementById("newReleases");
  newRelease.innerHTML = "";

  songs.forEach((song, index) => {
    const newReleaseClass =
      "release-card flex items-center gap-3 rounded-lg p-2 transition hover:bg-surface";
    const container = document.createElement("article");
    container.classList = newReleaseClass;
    container.dataset.index = index;

    const card = ` <img
                    src="${song.artworkUrl100}"
                    alt=""
                    class="h-14 w-14 shrink-0 rounded-md bg-surface object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <h3 class="truncate text-[15px] font-semibold">
                      ${song.trackName}
                    </h3>
                    <p class="truncate text-[13px] text-text-muted">
                      ${song.artistName}
                    </p>
                  </div>
                  <button
                    aria-label="${song.trackName}"
                    class="shrink-0 text-textColor transition hover:text-primary"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="h-8 w-8"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="12" r="11" fill-opacity="0.12" />
                      <path d="M10 8.5v7l6-3.5z" />
                    </svg>
                  </button>`;
    container.innerHTML = card;
    newRelease.appendChild(container);
  });
}
//makes the songs playable button
document.getElementById("newReleases").addEventListener("click", (e) => {
  const card = e.target.closest(".release-card");

  if (!card) return;

  const clickIndex = Number(card.dataset.index);
  const songIndex = releasedBatch[batchIndex][clickIndex];
  playSongs(songIndex);
});

document.getElementById("newNext").addEventListener("click", async () => {
  if (batchIndex === releasedBatch.length - 1) {
    const newBatch = await loadNewReleases();
    releasedBatch.push(newBatch);
    batchIndex++;
  } else {
    batchIndex++;
  }
  renderNewRelease(releasedBatch[batchIndex]);
});

document.getElementById("newPrev").addEventListener("click", () => {
  if (batchIndex > 0) {
    batchIndex--;
    renderNewRelease(releasedBatch[batchIndex]);
  }
});

function playSongs(song) {
  document.querySelector("#playerBar h3").textContent = song.trackName;
  document.querySelector("#playerBar p").textContent = song.artistName;
  document.querySelector("#playerBar img").src = song.artworkUrl100;

  player.src = song.previewUrl;
  player.play();
}

//search bar
let debounceTimer;
document.getElementById("search-input").addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  const input = e.target.value;
  debounceTimer = setTimeout(() => {
    if (!input) return;
    loadQueue(input);
  }, 400);
});
