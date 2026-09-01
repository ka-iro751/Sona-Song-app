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

  const percentage = (player.currentTime / player.duration) *100
  document.getElementById("progressFill").style.width =`${percentage}%`;
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
