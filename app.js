// Mock dataset standing in for a real API response.
// TODO: replace with server-rendered or dynamically fetched shorts
const MOCK_SHORTS = [
  { id: 1, title: "Dreaming in Latent Space", views: "1.2M", tags: ["art", "diffusion"] },
  { id: 2, title: "Robot Learns to Dance", views: "843K", tags: ["robotics", "fun"] },
  { id: 3, title: "Prompt Engineering Tips", views: "620K", tags: ["tutorial", "llm"] },
  { id: 4, title: "AI Paints the Night Sky", views: "510K", tags: ["art", "space"] },
  { id: 5, title: "Voice Cloning in 60 Seconds", views: "490K", tags: ["audio", "tutorial"] },
  { id: 6, title: "Text to 3D Model Demo", views: "380K", tags: ["3d", "diffusion"] },
  { id: 7, title: "Infinite Zoom Timelapse", views: "310K", tags: ["art", "video"] },
  { id: 8, title: "GPT Writes a Haiku", views: "295K", tags: ["llm", "fun"] },
];

// Render a list of short objects into the grid element.
function renderShorts(shorts) {
  const grid = document.getElementById("shorts-grid");
  if (!shorts.length) {
    grid.innerHTML = '<p class="loading">No results found.</p>';
    return;
  }
  grid.innerHTML = shorts
    .map(
      (s) => `
      <div class="short-card" data-id="${s.id}">
        <div class="thumbnail">&#9654;</div>
        <div class="card-body">
          <div class="card-title">${s.title}</div>
          <div class="card-meta">${s.views} views &middot; ${s.tags.join(", ")}</div>
        </div>
      </div>`
    )
    .join("");
}

// Search implementation.
// TODO: wire up search to a real API endpoint — for now this filters MOCK_SHORTS client-side.
function handleSearch() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const resultsEl = document.getElementById("search-results");

  if (!query) {
    resultsEl.classList.add("hidden");
    renderShorts(MOCK_SHORTS);
    return;
  }

  const matched = MOCK_SHORTS.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      s.tags.some((t) => t.includes(query))
  );

  // Show inline dropdown of matches.
  if (matched.length) {
    resultsEl.innerHTML = matched
      .map(
        (s) =>
          `<div class="result-item" data-id="${s.id}">${s.title} <span style="color:#888;font-size:.8em">(${s.views} views)</span></div>`
      )
      .join("");
    resultsEl.classList.remove("hidden");

    resultsEl.querySelectorAll(".result-item").forEach((el) => {
      el.addEventListener("click", () => {
        const short = MOCK_SHORTS.find((s) => s.id === Number(el.dataset.id));
        if (short) {
          document.getElementById("search-input").value = short.title;
          resultsEl.classList.add("hidden");
          renderShorts([short]);
        }
      });
    });
  } else {
    resultsEl.innerHTML = '<div class="result-item" style="color:#888">No results for "' + query + '"</div>';
    resultsEl.classList.remove("hidden");
  }

  renderShorts(matched);
}

// Boot
document.addEventListener("DOMContentLoaded", () => {
  renderShorts(MOCK_SHORTS);

  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document.getElementById("search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Close dropdown when clicking outside.
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar") && !e.target.closest(".search-results")) {
      document.getElementById("search-results").classList.add("hidden");
    }
  });
});
