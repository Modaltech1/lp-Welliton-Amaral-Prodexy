
const header = document.getElementById("header");
const btn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function closeMenu() {
  document.body.classList.remove("open");
  btn?.setAttribute("aria-expanded", "false");
}

function setHeader() {
  const y = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle("scrolled", y > 24);
  const light = [...document.querySelectorAll("[data-header='light']")].some(section => {
    const r = section.getBoundingClientRect();
    return r.top <= 90 && r.bottom >= 90;
  });
  header.classList.toggle("light", light && y < 80);
  header.classList.toggle("dark", !light || y >= 80);
}
window.addEventListener("scroll", setHeader, { passive: true });
window.addEventListener("resize", () => {
  setHeader();
  if (window.innerWidth > 1020) closeMenu();
});
setHeader();
closeMenu();

btn?.addEventListener("click", () => {
  const open = document.body.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    closeMenu();
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .14 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const story = document.querySelector(".story");
const lines = [...document.querySelectorAll(".story-line")];
const counter = document.getElementById("counter");
const bars = [...document.querySelectorAll(".progress i")];

function updateStory() {
  if (!story || !lines.length) return;
  const rect = story.getBoundingClientRect();
  const total = story.offsetHeight - window.innerHeight;
  const passed = Math.min(Math.max(-rect.top, 0), total);
  const progress = total > 0 ? passed / total : 0;
  const index = Math.min(lines.length - 1, Math.floor(progress * lines.length));
  lines.forEach((line, i) => line.classList.toggle("active", i === index));
  if (counter) counter.textContent = String(index + 1);
  bars.forEach((bar, i) => {
    const start = i / lines.length, end = (i + 1) / lines.length;
    let fill = 0;
    if (progress >= end) fill = 1;
    else if (progress > start) fill = (progress - start) / (end - start);
    bar.style.setProperty("--fill", fill.toFixed(3));
  });
}
window.addEventListener("scroll", updateStory, { passive: true });
window.addEventListener("resize", updateStory);
updateStory();

document.querySelectorAll("details").forEach(detail => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    detail.parentElement?.querySelectorAll("details").forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});

document.querySelectorAll("video").forEach(video => {
  video.addEventListener("error", () => { video.style.display = "none" });
});

document.querySelectorAll("[data-instagram-link]").forEach((link) => {
  link.href = "https://www.instagram.com/welligton.psicologo/";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});