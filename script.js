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

//plays song at the given index
function playTrackAtIndex(index) {
  currentIndex = index;
  const song = currentPlaylist[index];
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
