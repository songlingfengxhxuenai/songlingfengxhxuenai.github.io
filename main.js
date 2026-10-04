const ARROW =
  '<svg class="arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function filled(value) {
  return String(value ?? "").trim();
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function safeUrl(url) {
  const value = filled(url);
  if (/^(https?:|mailto:)/i.test(value)) return value;
  return "";
}

function cleanEmail(value) {
  const email = filled(value);
  if (!/^[^\s<>"]+@[^\s<>"]+\.[^\s<>"]+$/.test(email)) return "";
  return email;
}

function setMeta(selector, content) {
  if (!filled(content)) return;
  const node = document.querySelector(selector);
  if (node) node.setAttribute("content", content);
}

function linkAttrs(url) {
  return /^https?:/i.test(url) ? ' target="_blank" rel="noreferrer"' : "";
}

function renderLinks(links, className) {
  const items = asList(links)
    .map((link) => {
      const url = safeUrl(link && link.url);
      const label = filled(link && link.label);
      if (!url || !label) return "";
      return `<li><a href="${escapeHtml(url)}"${linkAttrs(url)}>${escapeHtml(label)}</a></li>`;
    })
    .filter(Boolean);
  if (!items.length) return "";
  return `<ul class="${className}">${items.join("")}</ul>`;
}

function renderHero(data) {
  const parts = [];
  const location = filled(data.location);
  const name = filled(data.name) || "个人主页";
  const role = filled(data.role);
  const tagline = filled(data.tagline);

  if (location) parts.push(`<p class="kicker hero-line">${escapeHtml(location)}</p>`);
  parts.push(`<h1 class="hero-line">${escapeHtml(name)}</h1>`);
  if (role) parts.push(`<p class="role hero-line">${escapeHtml(role)}</p>`);
  if (tagline) parts.push(`<p class="tagline hero-line">${escapeHtml(tagline)}</p>`);
  return parts.join("");
}

function renderAbout(data) {
  const paragraphs = asList(data.about).map(filled).filter(Boolean);
  if (!paragraphs.length) return "";
  return `<div class="about">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>`;
}

function renderEducation(data) {
  const items = asList(data.education).filter((item) => item && filled(item.school));
  if (!items.length) return "";
  const rows = items
    .map((item) => {
      const program = filled(item.program);
      const period = filled(item.period);
      const detail = filled(item.detail);
      return `<li>
        ${period ? `<p class="period">${escapeHtml(period)}</p>` : ""}
        <h3 class="school">${escapeHtml(filled(item.school))}</h3>
        ${program ? `<p class="program">${escapeHtml(program)}</p>` : ""}
        ${detail ? `<p class="detail">${escapeHtml(detail)}</p>` : ""}
      </li>`;
    })
    .join("");
  return `<ol class="timeline">${rows}</ol>`;
}

function renderExperience(data) {
  const items = asList(data.experience).filter((item) => item && (filled(item.role) || filled(item.org)));
  if (!items.length) return "";
  const rows = items
    .map((item, index) => {
      const role = filled(item.role);
      const org = filled(item.org);
      const title = role || org;
      const subtitle = role ? org : "";
      const period = filled(item.period);
      const detail = filled(item.detail);
      return `<li class="exp-item tone-${index % 4}" tabindex="0">
        ${period ? `<p class="period">${escapeHtml(period)}</p>` : "<span></span>"}
        <div>
          <h3>${escapeHtml(title)}</h3>
          ${subtitle ? `<p class="org">${escapeHtml(subtitle)}</p>` : ""}
          ${detail ? `<p class="detail">${escapeHtml(detail)}</p>` : ""}
        </div>
      </li>`;
    })
    .join("");
  return `<ul class="exp">${rows}</ul>`;
}

function renderProject(item, index) {
  const name = filled(item.name);
  const summary = filled(item.summary);
  const url = safeUrl(item.url);
  const num = String(index + 1).padStart(2, "0");
  const tags = asList(item.tags)
    .map(filled)
    .filter(Boolean)
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");
  const inner = `
    <span class="project-num">${num}</span>
    <span class="project-main">
      <h3>${escapeHtml(name)}</h3>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ""}
      ${tags ? `<ul class="tags">${tags}</ul>` : ""}
    </span>
    <span class="more">${url ? ARROW : ""}</span>
  `;
  if (!url) return `<article class="project tone-${index % 4}">${inner}</article>`;
  return `<a class="project tone-${index % 4}" href="${escapeHtml(url)}"${linkAttrs(url)}>${inner}</a>`;
}

function renderProjects(data) {
  const items = asList(data.projects).filter((item) => item && filled(item.name));
  if (!items.length) return "";
  return `<div class="projects">${items.map((item, index) => renderProject(item, index)).join("")}</div>`;
}

function renderSkills(data) {
  const groups = asList(data.skills)
    .map((group) => {
      const name = filled(group && group.group);
      const items = asList(group && group.items)
        .map(filled)
        .filter(Boolean)
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      if (!name || !items) return "";
      return `<div class="skill-group"><h3>${escapeHtml(name)}</h3><ul>${items}</ul></div>`;
    })
    .filter(Boolean);
  if (!groups.length) return "";
  return `<div class="skill-groups">${groups.join("")}</div>`;
}

function renderContact(data) {
  const email = cleanEmail(data.email);
  const links = renderLinks(data.links, "contact-links");
  if (!email && !links) return "";
  const emailHtml = email
    ? `<a class="email" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`
    : "";
  return `${emailHtml}${links}`;
}

function renderRail(sections, data) {
  const nav = sections
    .map((section, index) => {
      const num = String(index + 1).padStart(2, "0");
      return `<a href="#${section.id}" data-spy-link="${section.id}"><span class="num">${num}</span>${escapeHtml(section.label)}</a>`;
    })
    .join("");
  const social = renderLinks(data.links, "social");
  return `<nav class="rail-nav" aria-label="章节">${nav}</nav>${social}`;
}

function mountMotion() {
  const sections = [...document.querySelectorAll("[data-spy]")];
  const links = [...document.querySelectorAll("[data-spy-link]")];

  const mark = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute("data-spy-link") === id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const updateSpy = () => {
    const marker = Math.min(window.innerHeight * 0.14, 130);
    let current = null;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });
    if (!current && sections[0] && sections[0].getBoundingClientRect().top < window.innerHeight * 0.75) {
      current = sections[0];
    }
    mark(current ? current.id : "");
  };

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        reveal.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal, .timeline").forEach((node) => reveal.observe(node));
  updateSpy();
  window.addEventListener("scroll", updateSpy, { passive: true });
  window.addEventListener("resize", updateSpy);
}

function render(data) {
  const title = [filled(data.name), filled(data.role)].filter(Boolean).join(" · ") || "个人主页";
  document.title = title;
  setMeta('meta[name="description"]', data.tagline);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', data.tagline);

  document.getElementById("top").innerHTML = renderHero(data);

  const sections = [
    { id: "about", label: "关于", body: renderAbout(data) },
    { id: "education", label: "教育", body: renderEducation(data) },
    { id: "experience", label: "经历", body: renderExperience(data) },
    { id: "projects", label: "项目", body: renderProjects(data) },
    { id: "skills", label: "技能", body: renderSkills(data) },
    { id: "contact", label: "联系", body: renderContact(data) },
  ].filter((section) => section.body);

  document.getElementById("content").innerHTML = sections
    .map((section, index) => {
      const num = String(index + 1).padStart(2, "0");
      return `<section id="${section.id}" class="block reveal tone-${index % 4}" data-spy>
        <h2 class="eyebrow"><span class="num">${num}</span><span>${escapeHtml(section.label)}</span></h2>
        <div class="block-body">${section.body}</div>
      </section>`;
    })
    .join("");

  document.getElementById("rail").innerHTML = renderRail(sections, data);
  document.getElementById("foot").innerHTML =
    '<p>改 content.json 即可更新。版式参考 <a href="https://github.com/bchiang7/v4" target="_blank" rel="noreferrer">bchiang7/v4</a>。</p>';
  mountMotion();
}

async function main() {
  const root = document.getElementById("content");
  try {
    const response = await fetch("./content.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("read");
    const data = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("shape");
    render(data);
  } catch {
    root.innerHTML =
      '<p class="error">没有读到 content.json。请在这个文件夹里启动本地服务器后再打开，不要直接双击 HTML 文件。</p>';
  }
}

main();
