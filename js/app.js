(function () {
  let projects = [];
  let currentList = [];
  let currentIndex = -1;

  const filters = {
    industry: new Set(),
    service: new Set(),
    tech: new Set(),
    search: ""
  };

  const grid = document.getElementById("projectsGrid");
  const emptyState = document.getElementById("emptyState");
  const loadingState = document.getElementById("loadingState");
  const resultsCount = document.getElementById("resultsCount");
  const clearBtn = document.getElementById("clearFilters");
  const searchInput = document.getElementById("searchInput");
  const modal = document.getElementById("projectModal");
  const modalContent = document.getElementById("modalContent");
  const featuredStrip = document.getElementById("featuredStrip");
  const featuredTrack = document.getElementById("featuredTrack");
  const prevBtn = document.getElementById("prevProject");
  const nextBtn = document.getElementById("nextProject");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const heroStats = document.getElementById("heroStats");

  function unique(key) {
    const set = new Set();
    projects.forEach((p) => {
      const v = p[key];
      if (Array.isArray(v)) v.forEach((x) => set.add(x));
      else if (v) set.add(v);
    });
    return Array.from(set).sort();
  }

  function matches(p) {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = [
        p.title,
        p.client,
        p.shortDescription,
        p.challenge,
        p.solution,
        p.results,
        p.industry,
        ...(p.services || []),
        ...(p.technologies || []),
        ...(p.features || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.industry.size && !filters.industry.has(p.industry)) return false;
    if (filters.service.size && !(p.services || []).some((s) => filters.service.has(s))) return false;
    if (filters.tech.size && !(p.technologies || []).some((t) => filters.tech.has(t))) return false;
    return true;
  }

  function chips(container, values, type) {
    container.innerHTML = "";
    values.forEach((val) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (filters[type].has(val) ? " active" : "");
      btn.textContent = val;
      btn.addEventListener("click", () => {
        if (filters[type].has(val)) filters[type].delete(val);
        else filters[type].add(val);
        btn.classList.toggle("active");
        render();
      });
      container.appendChild(btn);
    });
  }

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function updateStats() {
    const industries = unique("industry").length;
    const years = projects.map((p) => p.year).filter(Boolean);
    const span = years.length ? Math.max(...years) - Math.min(...years) + 1 : 0;
    document.getElementById("statProjects").textContent = projects.length;
    document.getElementById("statIndustries").textContent = industries;
    document.getElementById("statYears").textContent = span || projects.length;
    heroStats.hidden = false;
  }

  function renderFeatured() {
    const featured = projects.filter((p) => p.featured);
    if (!featured.length) {
      featuredStrip.hidden = true;
      return;
    }
    featuredStrip.hidden = false;
    featuredTrack.innerHTML = "";
    featured.forEach((p) => {
      const card = document.createElement("article");
      card.className = "featured-card";
      card.innerHTML =
        '<div class="thumb">' +
        (p.thumbnail
          ? '<img src="' + esc(p.thumbnail) + '" alt="' + esc(p.title) + '" loading="lazy" />'
          : "") +
        '</div><div class="body"><h3>' +
        esc(p.title) +
        "</h3><p>" +
        esc(p.shortDescription) +
        "</p></div>";
      card.addEventListener("click", () => openModal(p));
      featuredTrack.appendChild(card);
    });
  }

  function render() {
    currentList = projects.filter(matches);
    const hasFilters =
      filters.industry.size || filters.service.size || filters.tech.size || filters.search;
    resultsCount.textContent =
      currentList.length + " project" + (currentList.length === 1 ? "" : "s");
    clearBtn.hidden = !hasFilters;

    if (!currentList.length) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    grid.innerHTML = "";

    currentList.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("role", "button");
      card.tabIndex = 0;
      card.innerHTML =
        '<div class="thumb">' +
        (p.thumbnail
          ? '<img src="' + esc(p.thumbnail) + '" alt="' + esc(p.title) + '" loading="lazy" />'
          : "") +
        (p.industry ? '<span class="badge">' + esc(p.industry) + "</span>" : "") +
        '</div><div class="card-body"><div class="tags">' +
        (p.services || [])
          .slice(0, 2)
          .map((s) => '<span class="tag">' + esc(s) + "</span>")
          .join("") +
        "</div><h3>" +
        esc(p.title) +
        "</h3><p>" +
        esc(p.shortDescription) +
        '</p><div class="card-foot"><span class="tech-preview">' +
        esc((p.technologies || []).slice(0, 3).join(" · ")) +
        "</span><span>" +
        esc(p.year) +
        "</span></div></div>";
      const open = () => openModal(p);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
      grid.appendChild(card);
    });
  }

  function updateNavButtons() {
    if (currentIndex <= 0) {
      prevBtn.hidden = true;
    } else {
      prevBtn.hidden = false;
    }
    if (currentIndex < 0 || currentIndex >= currentList.length - 1) {
      nextBtn.hidden = true;
    } else {
      nextBtn.hidden = false;
    }
  }

  function openModal(p) {
    currentIndex = currentList.findIndex((x) => x.id === p.id);
    if (currentIndex < 0) currentIndex = projects.findIndex((x) => x.id === p.id);

    history.replaceState(null, "", "#project/" + encodeURIComponent(p.id));

    const metricsHtml =
      p.metrics && p.metrics.length
        ? '<div class="metrics">' +
          p.metrics
            .map(
              (m) =>
                '<div class="metric"><div class="value">' +
                esc(m.value) +
                '</div><div class="label">' +
                esc(m.label) +
                "</div></div>"
            )
            .join("") +
          "</div>"
        : "";

    const featuresHtml =
      p.features && p.features.length
        ? "<div class='case-block'><h3>Key features</h3><ul class='features'>" +
          p.features.map((f) => "<li>" + esc(f) + "</li>").join("") +
          "</ul></div>"
        : "";

    const techHtml =
      p.technologies && p.technologies.length
        ? "<div class='case-block'><h3>Technology</h3><div class='tech'>" +
          p.technologies.map((t) => "<span>" + esc(t) + "</span>").join("") +
          "</div></div>"
        : "";

    const gallerySources = p.gallery && p.gallery.length ? p.gallery : p.thumbnail ? [p.thumbnail] : [];
    const galleryHtml =
      gallerySources.length > 1
        ? '<div class="case-block"><h3>Screens</h3><div class="gallery">' +
          gallerySources
            .map(
              (src) =>
                '<img src="' +
                esc(src) +
                '" alt="" loading="lazy" data-full="' +
                esc(src) +
                '" />'
            )
            .join("") +
          "</div></div>"
        : "";

    const demoHtml = p.liveDemo
      ? '<div class="case-block"><h3>Live demo</h3><iframe src="' +
        esc(p.liveDemo) +
        '" title="Live demo" sandbox="allow-scripts allow-same-origin allow-forms"></iframe></div>'
      : "";

    const actions = [];
    if (p.liveUrl) {
      actions.push(
        '<a class="btn primary" href="' +
          esc(p.liveUrl) +
          '" target="_blank" rel="noopener">Visit live site</a>'
      );
    }
    actions.push('<button class="btn ghost" data-close>Close</button>');

    modalContent.innerHTML =
      '<div class="modal-hero">' +
      (p.thumbnail ? '<img src="' + esc(p.thumbnail) + '" alt="" />' : "") +
      '</div><div class="modal-body">' +
      '<div class="modal-meta"><span>' +
      esc(p.industry) +
      "</span><span>" +
      esc(p.year) +
      "</span><span>" +
      esc((p.services || []).join(" · ")) +
      "</span></div>" +
      '<h2 id="modalTitle">' +
      esc(p.title) +
      '</h2><p class="modal-client">' +
      esc(p.client) +
      "</p>" +
      metricsHtml +
      (p.challenge
        ? '<div class="case-block"><h3>The challenge</h3><p>' +
          esc(p.challenge) +
          "</p></div>"
        : "") +
      (p.solution
        ? '<div class="case-block"><h3>Our solution</h3><p>' +
          esc(p.solution) +
          "</p></div>"
        : "") +
      (p.results
        ? '<div class="case-block"><h3>Results</h3><p>' + esc(p.results) + "</p></div>"
        : "") +
      featuresHtml +
      techHtml +
      galleryHtml +
      demoHtml +
      '<div class="modal-actions">' +
      actions.join("") +
      "</div></div>";

    // Gallery lightbox
    modalContent.querySelectorAll(".gallery img").forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.dataset.full || img.src;
        lightbox.hidden = false;
      });
    });

    updateNavButtons();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    history.replaceState(null, "", window.location.pathname + window.location.search);
    const iframe = modalContent.querySelector("iframe");
    if (iframe) iframe.src = "";
    currentIndex = -1;
  }

  function goPrev() {
    if (currentIndex > 0) {
      openModal(currentList[currentIndex - 1]);
    }
  }

  function goNext() {
    if (currentIndex < currentList.length - 1) {
      openModal(currentList[currentIndex + 1]);
    }
  }

  function reset() {
    filters.industry.clear();
    filters.service.clear();
    filters.tech.clear();
    filters.search = "";
    searchInput.value = "";
    document.querySelectorAll(".chip.active").forEach((c) => c.classList.remove("active"));
    render();
  }

  function openFromHash() {
    const match = window.location.hash.match(/^#project\/(.+)$/);
    if (match) {
      const id = decodeURIComponent(match[1]);
      const p = projects.find((x) => x.id === id);
      if (p) openModal(p);
    }
  }

  // Events
  searchInput.addEventListener("input", () => {
    filters.search = searchInput.value.trim();
    render();
  });
  clearBtn.addEventListener("click", reset);
  document.getElementById("resetFilters").addEventListener("click", reset);

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) closeModal();
  });
  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  document.querySelectorAll("[data-lightbox-close]").forEach((el) => {
    el.addEventListener("click", () => {
      lightbox.hidden = true;
      lightboxImg.src = "";
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }
  });

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });

  document.getElementById("logoHome").addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!modal.hidden) closeModal();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Load data
  fetch("data/projects.json")
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load");
      return r.json();
    })
    .then((data) => {
      projects = Array.isArray(data)
        ? data.sort((a, b) => (b.year || 0) - (a.year || 0))
        : [];
      loadingState.hidden = true;
      chips(document.getElementById("industryFilters"), unique("industry"), "industry");
      chips(document.getElementById("serviceFilters"), unique("services"), "service");
      chips(document.getElementById("techFilters"), unique("technologies"), "tech");
      updateStats();
      renderFeatured();
      render();
      openFromHash();
    })
    .catch(() => {
      loadingState.hidden = true;
      grid.innerHTML =
        "<p style='color:var(--muted);padding:2rem 0'>Could not load data/projects.json. Serve this folder over HTTP (e.g. python -m http.server 8080).</p>";
    });

  window.addEventListener("hashchange", openFromHash);
})();
