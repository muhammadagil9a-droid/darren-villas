/* Site logic: language, shared header/footer, and page rendering.
   You normally don't need to edit this file — edit config.js, projects.js and i18n.js instead. */
(function () {
  const C = window.CONFIG, P = window.PROJECTS, LANGS = window.LANGS, DICT = window.I18N;
  const page = document.body.dataset.page;
  const SINCE = new Date().getFullYear() - C.years;

  /* ---------- language ---------- */
  function store(k, v) { try { v === undefined ? (v = localStorage.getItem(k)) : localStorage.setItem(k, v); } catch (e) { v = null; } return v; }
  function pickLang() {
    const q = new URLSearchParams(location.search).get("lang");
    const saved = store("daj-lang");
    const nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return [q, saved, nav, C.defaultLang].find(c => c && DICT[c]) || "en";
  }
  let lang = pickLang();
  function t(key, vars) {
    let s = (DICT[lang] && DICT[lang][key]) ?? DICT.en[key] ?? key;
    const v = Object.assign({ years: C.years, since: SINCE }, vars || {});
    return s.replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ""));
  }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- helpers ---------- */
  const imgPath = (p, file) => `assets/img/projects/${p.id}/${file}`;
  const waLink = () => C.whatsapp ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Hello PT Darren Adhi Jaya, I would like to discuss building a villa.")}` : "#contact";
  window.__imgFail = function (img, mode) {
    // WebP version missing (photo added without running tools/optimize-images.sh)? fall back to the JPG first
    const pic = img.parentNode;
    if (pic.tagName === "PICTURE" && pic.querySelector("source")) {
      pic.querySelectorAll("source").forEach(s => s.remove()); img.removeAttribute("data-full");
      img.src = img.getAttribute("src"); return;
    }
    const f = img.closest(".frame");
    if (mode === "drop") {
      const btn = f.closest(".pj-shot"); const gal = (btn || f).parentNode; (btn || f).remove();
      if (gal && !gal.querySelector(".frame")) gal.innerHTML = `<div class="frame empty" data-label="${t("photos.soon")}"></div>`;
    } else f.classList.add("empty");
  };
  // Each photo is served as WebP (800px + 1920px, made by tools/optimize-images.sh) with the JPG as fallback.
  function frame(src, label, alt, mode, opt = {}) {
    const base = esc(src.replace(/\.jpe?g$/i, ""));
    const sizes = opt.sizes || "(max-width: 760px) 100vw, 50vw";
    return `<div class="frame" data-label="${esc(label)}"><picture>
      <source type="image/webp" srcset="${base}-800.webp 800w, ${base}.webp 1920w" sizes="${sizes}">
      <img src="${esc(src)}" data-full="${base}.webp" alt="${esc(alt || label)}" decoding="async" ${opt.eager ? 'fetchpriority="high"' : 'loading="lazy"'} onerror="__imgFail(this,'${mode || "ph"}')"></picture></div>`;
  }
  // status label: completed = a check that draws itself, ongoing = a softly pulsing "live" dot
  const badge = p => `<span class="badge ${p.status}">${p.status === "completed"
    ? `<svg class="b-check" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.6"/><path d="M5.1 8.3l2 1.9 3.8-4.1"/></svg>`
    : `<i class="b-live" aria-hidden="true"></i>`}<span>${esc(t("status." + p.status))}</span></span>`;
  const ICON = {
    wa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`
  };

  ICON.pin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>`;
  ICON.mail = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.8 6.5l8.2 6.2 8.2-6.2"/></svg>`;
  ICON.ig = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>`;
  /* ---------- language picker ---------- */
  ICON.globe = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>`;
  ICON.chev = `<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg>`;
  ICON.check = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>`;
  // Flags drawn as inline SVG (emoji flags show as letters on Windows). 3:2 ratio.
  const FLAG = {
    en: `<svg viewBox="0 0 60 40" aria-hidden="true"><clipPath id="fgb"><rect width="60" height="40"/></clipPath><g clip-path="url(#fgb)"><rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="12"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="7"/></g></svg>`,
    ru: `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><rect y="13.33" width="60" height="13.34" fill="#0039A6"/><rect y="26.67" width="60" height="13.33" fill="#D52B1E"/></svg>`,
    nl: `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#fff"/><rect width="60" height="13.33" fill="#AE1C28"/><rect y="26.67" width="60" height="13.33" fill="#21468B"/></svg>`,
    pt: `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#009C3B"/><path d="M30 5L54 20L30 35L6 20Z" fill="#FFDF00"/><circle cx="30" cy="20" r="8.5" fill="#002776"/><path d="M21.8 18.2c5.5-1 11.3-.2 16.3 2.4" stroke="#fff" stroke-width="1.6" fill="none"/></svg>`,
    id: `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="20" fill="#CE1126"/><rect y="20" width="60" height="20" fill="#fff"/></svg>`
  };
  const flag = code => `<span class="flag">${FLAG[code] || ""}</span>`;
  function langPicker() {
    const cur = LANGS.find(l => l.code === lang) || LANGS[0];
    return `<div class="lang" id="lang">
      <button type="button" class="lang-btn" id="langBtn" aria-haspopup="listbox" aria-expanded="false" aria-controls="langMenu" aria-label="Language: ${esc(cur.name)}">
        ${flag(cur.code)}<span class="lang-chev">${ICON.chev}</span>
      </button>
      <div class="lang-menu" id="langMenu" role="listbox" aria-label="Language" hidden>
        ${LANGS.map(l => `<button type="button" role="option" class="lang-opt" data-code="${l.code}" lang="${l.code}" aria-selected="${l.code === lang}">
          ${flag(l.code)}<span class="lang-opt-name"><b>${esc(l.name)}</b>${l.code !== "en" ? `<small>${esc(l.en)}</small>` : ""}</span>
          <span class="lang-opt-check">${ICON.check}</span></button>`).join("")}
      </div>
    </div>`;
  }
  let langOutside = null;
  function bindLangPicker(focusBtn) {
    const wrap = document.getElementById("lang"), btn = document.getElementById("langBtn"), menu = document.getElementById("langMenu");
    const opts = [...menu.querySelectorAll(".lang-opt")];
    const open = (kbd) => {
      document.getElementById("navLinks")?.classList.remove("open");
      menu.hidden = false; requestAnimationFrame(() => wrap.classList.add("open"));
      btn.setAttribute("aria-expanded", "true");
      // keyboard users get focus on the current language; mouse users get no focus ring
      const curOpt = opts.find(o => o.getAttribute("aria-selected") === "true") || opts[0];
      if (kbd) curOpt.focus(); else menu.focus({ preventScroll: true });
    };
    const close = (refocus) => {
      wrap.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
      setTimeout(() => { if (!wrap.classList.contains("open")) menu.hidden = true; }, 160);
      if (refocus) btn.focus();
    };
    const pick = code => {
      if (code !== lang) { lang = code; store("daj-lang", lang); renderAll(); document.getElementById("langBtn")?.focus(); }
      else close(true);
    };
    btn.addEventListener("click", e => (wrap.classList.contains("open") ? close() : open(e.detail === 0)));
    btn.addEventListener("keydown", e => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(true); } });
    menu.tabIndex = -1;
    menu.addEventListener("keydown", e => {
      if (e.target !== menu) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); (opts.find(o => o.getAttribute("aria-selected") === "true") || opts[0]).focus(); }
      if (e.key === "Escape") close(true);
    });
    opts.forEach((o, i) => {
      o.addEventListener("click", () => pick(o.dataset.code));
      o.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
        else if (e.key === "Home") { e.preventDefault(); opts[0].focus(); }
        else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1].focus(); }
        else if (e.key === "Escape") { e.preventDefault(); close(true); }
        else if (e.key === "Tab") close();
      });
    });
    if (langOutside) document.removeEventListener("click", langOutside);
    langOutside = e => { if (!wrap.contains(e.target) && wrap.classList.contains("open")) close(); };
    document.addEventListener("click", langOutside);
  }

  /* ---------- header & footer ---------- */
  function header() {
    const link = (href, key, id) => `<a href="${href}"${page === id ? ' aria-current="page"' : ""}>${esc(t(key))}</a>`;
    document.getElementById("header").innerHTML = `
      <header class="site-header"><div class="wrap nav">
        <a class="brand" href="index.html" aria-label="${esc(C.company)} home">
          <img src="assets/img/logo-mark.jpg" alt=""><span>DARREN ADHI JAYA<small>${esc(t("brand.tag"))}</small></span>
        </a>
        <nav class="nav-links" id="navLinks">
          ${link("projects.html", "nav.projects", "projects")}
          ${link("index.html#services", "nav.services")}
          ${link("index.html#process", "nav.process")}
          ${link("index.html#about", "nav.about")}
          ${link("#contact", "nav.contact")}
        </nav>
        ${langPicker()}
        <button class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false">${ICON.menu}</button>
      </div></header>`;
    bindLangPicker();
    const btn = document.getElementById("menuBtn"), links = document.getElementById("navLinks");
    btn.addEventListener("click", () => { const o = links.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
    links.addEventListener("click", e => { if (e.target.tagName === "A") links.classList.remove("open"); });
  }

  function footer() {
    document.getElementById("footer").innerHTML = `
      <section class="section cta" id="contact"><div class="wrap cta-inner">
        <div class="cta-intro">
          <span class="eyebrow">${esc(t("nav.contact"))}</span>
          <h2>${esc(t("cta.title"))}</h2>
          <p>${esc(t("form.intro"))}</p>
          <ol class="cta-next" aria-label="${esc(t("form.next"))}">
            <li style="--i:0"><span>01</span><p>${esc(t("form.next.1"))}</p></li>
            <li style="--i:1"><span>02</span><p>${esc(t("form.next.2"))}</p></li>
            <li style="--i:2"><span>03</span><p>${esc(t("form.next.3"))}</p></li>
          </ol>
          <div class="cta-direct">
            ${C.whatsapp ? `<a class="link-arrow" href="${waLink()}" target="_blank" rel="noopener">${esc(t("cta.wa"))} ↗</a>` : ""}
            ${C.email ? `<a class="link-arrow" href="mailto:${esc(C.email)}">${esc(t("cta.email"))} ↗</a>` : ""}
          </div>
        </div>
        ${inquiryForm()}
      </div></section>
      <footer class="site-footer"><div class="wrap">
        <div class="footer-grid">
          <div style="display:grid;gap:14px;align-content:start">
            <a class="brand" href="index.html"><img src="assets/img/logo-mark.jpg" alt=""><span>${esc(C.company.toUpperCase())}</span></a>
            <p style="max-width:36ch">${esc(t("footer.tag"))}</p>
            <p class="footer-motto">“${esc(t("motto.short"))}”</p>
          </div>
          <div><h4>${esc(t("footer.pages"))}</h4><ul>
            <li><a href="projects.html">${esc(t("nav.projects"))}</a></li>
            <li><a href="index.html#services">${esc(t("nav.services"))}</a></li>
            <li><a href="index.html#process">${esc(t("nav.process"))}</a></li>
            <li><a href="index.html#about">${esc(t("nav.about"))}</a></li></ul></div>
          <div><h4>${esc(t("footer.contact"))}</h4>
            <ul class="foot-links">
              <li><a href="${C.whatsapp ? waLink() : "#contact"}"${C.whatsapp ? ' target="_blank" rel="noopener"' : ""}>${ICON.wa}<span>${C.whatsapp ? "+" + esc(C.whatsapp) : "WhatsApp"}</span></a></li>
              <li><a href="${C.email ? `mailto:${esc(C.email)}` : "#contact"}">${ICON.mail}<span>${esc(C.email || "Email")}</span></a></li>
              ${C.instagram ? `<li><a href="https://www.instagram.com/${esc(C.instagram)}" target="_blank" rel="noopener">${ICON.ig}<span>@${esc(C.instagram)}</span></a></li>` : ""}
              <li class="foot-addr">${ICON.pin}<span>${esc(C.address)}</span></li>
            </ul></div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(C.company)}. ${esc(t("footer.rights"))}</span>
          ${L.nib || L.npwp ? `<span class="foot-legal">${[L.nib && "NIB " + esc(L.nib), L.npwp && "NPWP " + esc(L.npwp)].filter(Boolean).join(" · ")}</span>` : ""}</div>
      </div></footer>
      ${waFloat()}`;
  }

  /* ---------- floating WhatsApp button (phones + tablets) ---------- */
  // Appears after the visitor scrolls past the top, hides while the contact form is on screen,
  // and briefly shows a "Chat on WhatsApp" label the first time it appears.
  // On a villa page the pre-filled message names that villa.
  function waFloat() {
    const pj = page === "project" && P.find(x => x.id === new URLSearchParams(location.search).get("id"));
    const msg = pj ? `Hello PT Darren Adhi Jaya, I saw ${pj.name} on your website and would like to discuss building a villa.`
                   : "Hello PT Darren Adhi Jaya, I would like to discuss building a villa.";
    const href = C.whatsapp ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}` : "#contact"; // no number yet → jump to the form
    return `<a class="wa-float" id="waFloat" href="${href}"${C.whatsapp ? ' target="_blank" rel="noopener"' : ""} aria-label="${esc(t("cta.wa"))}">
      <span class="wa-ico">${ICON.wa}</span><span class="wa-label">${esc(t("cta.wa"))}</span></a>`;
  }
  let waBound = false, waHinted = false;
  function bindWaFloat() {
    const update = () => {
      const b = document.getElementById("waFloat"); if (!b) return;
      const c = document.getElementById("contact")?.getBoundingClientRect();
      const formOnScreen = c && c.top < innerHeight * 0.8 && c.bottom > 0;
      const menuOpen = document.getElementById("navLinks")?.classList.contains("open");
      const lbOpen = document.getElementById("lb") && !document.getElementById("lb").hidden;
      const show = scrollY > innerHeight * 0.5 && !formOnScreen && !menuOpen && !lbOpen;
      b.classList.toggle("show", show);
      if (show && !waHinted) { waHinted = true; b.classList.add("hint"); setTimeout(() => document.getElementById("waFloat")?.classList.remove("hint"), 4200); }
    };
    if (!waBound) { waBound = true; addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); setInterval(update, 800); }
    update();
  }

  /* ---------- inquiry form ---------- */
  // Answers are always sent to the team in English (fixed labels), whatever language the visitor uses.
  const FORM = {
    land: ["uluwatu", "canggu", "ubud", "other", "none"],
    size: ["s1", "s2", "s3", "s4"],
    need: ["db", "build", "mat", "unsure"],
    time: ["t1", "t2", "t3", "t4"]
  };
  function inquiryForm() {
    const sel = name => `<label class="f-field"><span>${esc(t("form." + name))}</span>
      <div class="f-select"><select name="${name}"><option value="">${esc(t("form.select"))}</option>
      ${FORM[name].map(v => `<option value="${v}">${esc(t(`form.${name}.${v}`))}</option>`).join("")}</select></div></label>`;
    const how = C.formEndpoint ? "" : C.whatsapp ? t("form.note.wa") : C.email ? t("form.note.mail") : "";
    return `<form class="inquiry" id="inquiry" novalidate>
      <div class="f-row">
        <label class="f-field"><span>${esc(t("form.name"))} <i>*</i></span><input name="name" required autocomplete="name"></label>
        <label class="f-field"><span>${esc(t("form.country"))}</span><input name="country" autocomplete="country-name"></label>
      </div>
      <label class="f-field"><span>${esc(t("form.contact"))} <i>*</i></span><input name="contact" required autocomplete="email" placeholder="+62… / name@email.com"></label>
      <div class="f-row">${sel("land")}${sel("size")}</div>
      <div class="f-row">${sel("need")}${sel("time")}</div>
      <label class="f-field"><span>${esc(t("form.msg"))}</span><textarea name="msg" rows="3"></textarea></label>
      <input name="_gotcha" tabindex="-1" autocomplete="off" class="f-trap" aria-hidden="true">
      <div class="f-foot">
        <button class="btn f-send" type="submit">${C.whatsapp && !C.formEndpoint ? ICON.wa : ""}${esc(t("form.send"))} <span aria-hidden="true">→</span></button>
        <p class="f-note" id="formNote" role="status">${esc(how)}</p>
      </div>
    </form>`;
  }
  function bindInquiry() {
    const f = document.getElementById("inquiry"); if (!f) return;
    const note = document.getElementById("formNote");
    f.querySelectorAll("select").forEach(s => { const upd = () => s.classList.toggle("empty", !s.value); upd(); s.addEventListener("change", upd); });
    const EN = DICT.en;
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      if (d._gotcha) return;                                   // spam bot
      if (!d.name.trim() || !d.contact.trim()) { note.textContent = t("form.required"); note.className = "f-note err"; f.elements[d.name.trim() ? "contact" : "name"].focus(); return; }
      const rows = [
        ["Name", d.name], ["Country", d.country], ["Contact", d.contact],
        ["Land", d.land && EN["form.land." + d.land]], ["Size", d.size && EN["form.size." + d.size]],
        ["Need", d.need && EN["form.need." + d.need]], ["Start", d.time && EN["form.time." + d.time]],
        ["Message", d.msg], ["Website language", lang.toUpperCase()]
      ].filter(r => r[1] && String(r[1]).trim());
      const text = "New villa inquiry (website)\n\n" + rows.map(([k, v]) => `${k}: ${String(v).trim()}`).join("\n");

      if (C.formEndpoint) {
        const btn = f.querySelector("button"); btn.disabled = true;
        try {
          const r = await fetch(C.formEndpoint, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(Object.assign(Object.fromEntries(rows), { _subject: `Villa inquiry — ${d.name}`, _replyto: d.contact })) });
          if (!r.ok) throw new Error(r.status);
          f.innerHTML = `<div class="f-done"><h3>${esc(t("form.ok"))}</h3></div>`;
        } catch (err) { note.textContent = t("form.err"); note.className = "f-note err"; btn.disabled = false; }
      } else if (C.whatsapp) {
        window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      } else if (C.email) {
        location.href = `mailto:${C.email}?subject=${encodeURIComponent("Villa inquiry — " + d.name)}&body=${encodeURIComponent(text)}`;
      } else { note.textContent = t("form.nocontact"); note.className = "f-note err"; }
    });
  }

  /* ---------- shared blocks ---------- */
  function card(p) {
    const facts = [p.location, p.bedrooms && `${p.bedrooms}\u00a0BR`, p.buildingArea && `${Number(p.buildingArea).toLocaleString("en")}\u00a0m²`].filter(Boolean).join(" · ");
    return `<a class="card" href="project.html?id=${encodeURIComponent(p.id)}">
      <div class="media">${frame(imgPath(p, "cover.jpg"), p.name, p.name)}</div>
      <div class="card-meta"><div><h3>${esc(p.name)}</h3><p>${esc(facts)}</p></div>${badge(p)}</div></a>`;
  }
  // Home "Selected projects": staggered editorial layout; hovering shows a second photo of the villa.
  function featuredCard(p, i) {
    const alt = (p.photos || [])[0];
    const facts = [p.location, p.bedrooms && `${p.bedrooms}\u00a0BR`, p.buildingArea && `${Number(p.buildingArea).toLocaleString("en")}\u00a0m²`].filter(Boolean).join(" · ");
    return `<a class="fx" style="order:${i}" href="project.html?id=${encodeURIComponent(p.id)}">
      <div class="fx-media">
        ${frame(imgPath(p, "cover.jpg"), p.name, p.name, "ph", { sizes: "(max-width: 760px) 100vw, 50vw" })}
        ${alt ? `<div class="fx-alt">${frame(imgPath(p, alt), "", p.name, "drop", { sizes: "(max-width: 760px) 100vw, 50vw" })}</div>` : ""}
        <span class="fx-view">${esc(t("projects.view"))} <span aria-hidden="true">→</span></span>
      </div>
      <div class="fx-meta">
        <span class="fx-n">${String(i + 1).padStart(2, "0")}</span>
        <div class="fx-text"><h3>${esc(p.name)}</h3><p>${esc(facts)}</p></div>
      </div>
    </a>`;
  }
  function ongoingItem(p) {
    return `<a class="ongoing-item" href="project.html?id=${encodeURIComponent(p.id)}">
      <div class="media">${frame(imgPath(p, "cover.jpg"), "", p.name, "ph", { sizes: "240px" })}</div>
      <div><strong>${esc(p.name)}</strong><small>${esc(p.location)}${p.stage ? " · " + esc(t("stage." + p.stage)) : ""}</small></div>
      <div class="progress"><span>${esc(t("progress", { n: p.progress || 0 }))}</span><div class="track"><div class="fill" style="width:${Math.max(0, Math.min(100, p.progress || 0))}%"></div></div></div></a>`;
  }

  /* ---------- home hero: full-screen slideshow of random villa photos ---------- */
  const SLIDE_MS = 6500;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function heroSlides(list, max = 12) {
    // round-robin over the villas (random order) so the same villa never shows twice in a row;
    // the first round uses each villa's cover photo for a strong first impression
    const queues = shuffle(list).map(p => [{ p, f: "cover.jpg" }, ...shuffle(p.photos || []).map(f => ({ p, f }))]);
    const out = [];
    while (out.length < max && queues.some(q => q.length)) queues.forEach(q => { if (q.length && out.length < max) out.push(q.shift()); });
    return out;
  }
  function heroShow(list) {
    const slides = heroSlides(list);
    const origins = ["50% 50%", "30% 40%", "70% 40%", "40% 70%", "60% 60%", "50% 30%"];
    const slideHtml = (s, i) => {
      const jpg = imgPath(s.p, s.f), base = esc(jpg.replace(/\.jpe?g$/i, ""));
      const set = `${base}-800.webp 800w, ${base}.webp 1920w`;
      // only the first two slides load right away; the rest load just before they appear
      const a = i < 2 ? `srcset="${set}"` : `data-srcset="${set}"`, b = i < 2 ? `src="${esc(jpg)}"` : `data-src="${esc(jpg)}"`;
      return `<figure class="hs-slide${i ? "" : " on"}" style="--o:${origins[i % origins.length]}">
        <picture><source type="image/webp" ${a} sizes="100vw"><img ${b} alt="${esc(s.p.name)}" decoding="async"${i ? "" : ' fetchpriority="high"'}></picture></figure>`;
    };
    const first = slides[0];
    return `<section class="hero-show" id="heroShow" data-n="${slides.length}">
      <div class="hs-slides">${slides.map(slideHtml).join("")}</div>
      <div class="hs-shade"></div>
      <div class="wrap hs-content">
        <span class="hs-eyebrow">${esc(t("hero.eyebrow"))}</span>
        <h1>${esc(t("hero.title"))}</h1>
        <p class="hs-lead">${esc(t("hero.lead"))}</p>
        <div class="hs-ctas">
          <a class="btn btn-light" href="projects.html">${esc(t("hero.cta.projects"))}</a>
          <a class="btn btn-line" href="#contact">${esc(t("hero.cta.start"))}</a>
        </div>
      </div>
      <div class="wrap hs-bar">
        ${first ? `<a class="hs-cap" id="hsCap" href="project.html?id=${encodeURIComponent(first.p.id)}"><span class="hs-name">${esc(first.p.name)}</span><span class="hs-loc">${esc(first.p.location)}</span><span class="hs-go">→</span></a>` : "<span></span>"}
        <div class="hs-ctrl">
          <span class="hs-count"><b id="hsNow">01</b> / ${String(slides.length).padStart(2, "0")}</span>
          <div class="hs-dots">${slides.map((_, i) => `<button type="button" class="hs-dot${i ? "" : " on"}" aria-label="${i + 1}"><i></i></button>`).join("")}</div>
        </div>
      </div>
    </section>`;
  }
  let heroTimer = null;
  // Fit the headline to its language: largest size (max 3 lines) that still leaves the
  // text block fully inside the photo, for any language and screen size.
  function fitHero() {
    const root = document.getElementById("heroShow"); if (!root) return;
    const h1 = root.querySelector("h1"), box = root.querySelector(".hs-content");
    const max = Math.min(124, Math.max(innerWidth * 0.12, innerWidth * 0.085)), min = 30, gap = 28;
    let size = max;
    const fits = () => {
      const lines = Math.round(h1.offsetHeight / (size * 1.0));
      const top = box.getBoundingClientRect().top - root.getBoundingClientRect().top;
      return lines <= 3 && top >= gap && h1.scrollWidth <= h1.clientWidth + 1;
    };
    h1.style.fontSize = size + "px";
    while (size > min && !fits()) { size -= 2; h1.style.fontSize = size + "px"; }
    root.classList.add("fitted");
  }
  let fitRaf = 0;
  addEventListener("resize", () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitHero); });
  if (document.fonts) document.fonts.ready.then(fitHero);
  function bindHeroShow() {
    const root = document.getElementById("heroShow"); if (!root) return;
    const slides = [...root.querySelectorAll(".hs-slide")], dots = [...root.querySelectorAll(".hs-dot")];
    const cap = document.getElementById("hsCap"), now = document.getElementById("hsNow");
    const info = slides.map(s => { const img = s.querySelector("img"); const m = (img.getAttribute("src") || img.dataset.src).match(/projects\/([^/]+)\//); return P.find(p => p.id === m[1]); });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, paused = reduce, hover = false;
    root.style.setProperty("--dur", SLIDE_MS + "ms");

    const hydrate = i => {
      const s = slides[i]; if (!s) return; const src = s.querySelector("source"), img = s.querySelector("img");
      if (src.dataset.srcset) { src.srcset = src.dataset.srcset; delete src.dataset.srcset; }
      if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    };
    slides.forEach(s => { const img = s.querySelector("img"); img.onerror = () => {
      const src = s.querySelector("source"); if (src) { src.remove(); img.src = img.getAttribute("src"); } else s.dataset.bad = "1"; }; });

    let pending = 0;
    const go = n => {
      let next = (n + slides.length) % slides.length, guard = 0;
      while (slides[next].dataset.bad && guard++ < slides.length) next = (next + 1) % slides.length;
      if (next === cur && slides[cur].classList.contains("on")) { restart(); return; }
      hydrate(next); hydrate(next + 1);
      // wait until the photo has loaded so we never fade to an empty frame (give up after 5s and skip it)
      const img = slides[next].querySelector("img"), ticket = ++pending;
      if (!(img.complete && img.naturalWidth)) {
        clearTimeout(heroTimer);
        const done = () => { if (ticket === pending) show(next); };
        img.addEventListener("load", done, { once: true });
        heroTimer = setTimeout(() => { if (ticket === pending) { slides[next].dataset.bad = "1"; go(next + 1); } }, 5000);
        return;
      }
      show(next);
    };
    const show = next => {
      slides[cur].classList.remove("on"); dots[cur].classList.remove("on");
      cur = next;
      // restart the zoom + progress animations
      [slides[cur], dots[cur]].forEach(el => { el.classList.remove("on"); void el.offsetWidth; el.classList.add("on"); });
      const p = info[cur];
      if (cap && p) { cap.classList.add("swap"); setTimeout(() => {
        cap.href = `project.html?id=${encodeURIComponent(p.id)}`;
        cap.querySelector(".hs-name").textContent = p.name; cap.querySelector(".hs-loc").textContent = p.location;
        cap.classList.remove("swap"); }, 350); }
      now.textContent = String(cur + 1).padStart(2, "0");
      restart();
    };
    function restart() { clearTimeout(heroTimer); if (!paused && !hover && !document.hidden) heroTimer = setTimeout(() => go(cur + 1), SLIDE_MS); }

    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    root.addEventListener("mouseenter", () => { hover = true; root.classList.add("hold"); clearTimeout(heroTimer); });
    root.addEventListener("mouseleave", () => { hover = false; root.classList.remove("hold"); if (!paused) go(cur + 1); });
    document.onvisibilitychange = () => document.hidden ? clearTimeout(heroTimer) : restart();
    // swipe on phones
    let x0 = null;
    root.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); x0 = null; });

    fitHero();
    hydrate(1); hydrate(2);
    if (reduce) root.classList.add("paused");
    restart();
  }

  // "How we build" staircase: steps rise one by one when the section scrolls into view
  function animateProcess() {
    const el = document.querySelector(".process"); if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    el.classList.add("anim");
    let started = false;
    const start = () => {
      if (started) return; started = true;
      el.classList.add("in"); io.disconnect(); removeEventListener("scroll", check);
      setTimeout(() => el.classList.add("done"), 160 * 5 + 1500);
    };
    // IntersectionObserver plus a plain scroll check as a safety net, so the steps can never stay hidden
    const check = () => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.85 && r.bottom > 0) start(); };
    const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) start(); }, { threshold: 0.25 });
    io.observe(el);
    addEventListener("scroll", check, { passive: true });
    requestAnimationFrame(check);
  }

  // thin line icons for the services
  const SVC_ICON = {
    db: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/><path d="M15 4.5l4.5-1.5-1.5 4.5"/></svg>`,
    c:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19"/></svg>`,
    m:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8.5 4.5L12 12 3.5 7.5z"/><path d="M3.5 12L12 16.5 20.5 12"/><path d="M3.5 16.5L12 21l8.5-4.5"/></svg>`,
    r:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5l3 3"/><path d="M4 20l9.2-9.2"/><path d="M12.5 4.5a4 4 0 0 1 5.6 0l1.4 1.4-2.8 2.8-1.4-1.4-1.4 1.4-1.4-1.4 1.4-1.4z"/></svg>`
  };

  /* ---------- trust: client quotes, team, licences (data in trust.js) ---------- */
  const T = window.TRUST || {}, L = T.legal || {};
  const sampleTag = () => T.sample ? `<span class="sample-tag">${esc(t("tr.sample"))}</span>` : "";
  const quoteText = q => typeof q.quote === "string" ? q.quote : (q.quote[lang] || q.quote.en);
  const CRED_ICON = {
    reg: `<path d="M4 21V8l8-5 8 5v13"/><path d="M2.5 21h19"/><path d="M8 21v-7h8v7"/><path d="M8 10.5h8"/>`,
    nib: `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M5.8 16c.6-1.4 1.6-2 2.7-2s2.1.6 2.7 2"/><path d="M14 10h4M14 13.5h3"/>`,
    sbu: `<path d="M2.5 18h19"/><path d="M4.5 18v-2.5a7.5 7.5 0 0 1 15 0V18"/><path d="M9.5 8.6V5.5h5v3.1"/><path d="M12 5.5V11"/>`,
    skk: `<circle cx="12" cy="9" r="5.5"/><path d="M9.6 9.2l1.6 1.6 3.2-3.3"/><path d="M8.5 13.8L7 21l5-2.6 5 2.6-1.5-7.2"/>`,
    ins: `<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.1-7.5 9.5-4.3-1.4-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>`,
    war: `<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 11h6M9 14.5h6M9 18h3.5"/>`
  };
  const svgI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  function quoteCard(q, i) {
    const p = P.find(x => x.id === q.project);
    return `<figure class="tq rv" style="--i:${i}">
      <svg class="tq-mark" viewBox="0 0 40 30" aria-hidden="true"><path d="M0 30V17C0 7.6 5 1.7 14 0l1.6 4C10.4 5.6 8 9 7.8 13H15v17zm22 0V17C22 7.6 27 1.7 36 0l1.6 4c-5.2 1.6-7.6 5-7.8 9H37v17z"/></svg>
      <blockquote><p>${esc(quoteText(q))}</p></blockquote>
      <figcaption>
        ${p ? `<a class="tq-thumb" href="project.html?id=${encodeURIComponent(p.id)}" aria-label="${esc(p.name)}">${frame(imgPath(p, "cover.jpg"), "", p.name, "ph", { sizes: "64px" })}</a>` : ""}
        <div class="tq-who">
          <b>${esc(q.name)}${q.country ? flag(q.country) : ""}</b>
          ${p ? `<a href="project.html?id=${encodeURIComponent(p.id)}">${esc(p.name)} · ${esc(p.location)}</a>` : ""}
        </div>
      </figcaption>
    </figure>`;
  }
  function quotesSection() {
    const list = T.testimonials || []; if (!list.length) return "";
    return `<section class="section tquotes"><div class="wrap">
      <div class="section-head"><div style="display:grid;gap:14px"><span class="eyebrow">${esc(t("quotes.eyebrow"))}${sampleTag()}</span><h2>${esc(t("quotes.title"))}</h2></div></div>
      <div class="tq-row">${list.map(quoteCard).join("")}</div>
    </div></section>`;
  }
  function credSection() {
    const items = [
      ["reg", L.ahu], ["nib", L.nib && "NIB " + L.nib], ["sbu", L.sbu && "SBU " + L.sbu],
      ["skk", "", { n: L.engineers || "" }], ["ins", ""], ["war", "", { a: L.warrantyStructure, b: L.warrantyFinish }]
    ].filter(([k]) => k !== "skk" || L.engineers).filter(([k]) => k !== "war" || L.warrantyStructure);
    return `<section class="section creds"><div class="wrap">
      <div class="section-head"><div style="display:grid;gap:14px"><span class="eyebrow">${esc(t("cred.eyebrow"))}${sampleTag()}</span><h2>${esc(t("cred.title"))}</h2><p class="lead">${esc(t("cred.lead"))}</p></div></div>
      <ul class="cred-grid">${items.map(([k, v, vars], i) => `<li class="cred rv" style="--i:${i}">
        <span class="cred-ico">${svgI(CRED_ICON[k])}</span>
        <div class="cred-body"><h3>${esc(t(`c.${k}.t`))}</h3><p>${esc(t(`c.${k}.d`, vars))}</p>${v ? `<span class="cred-id">${esc(v)}</span>` : ""}</div>
      </li>`).join("")}</ul>
      ${L.nib ? `<a class="link-arrow cred-verify" href="https://oss.go.id" target="_blank" rel="noopener">${esc(t("cred.verify"))} ↗</a>` : ""}
    </div></section>`;
  }
  // fade-up for .rv blocks as they scroll into view (staggered by --i)
  function reveal() {
    const els = [...document.querySelectorAll(".rv:not(.in)")];
    if (!els.length || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("rv-on");
    const show = el => el.classList.add("in");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    const check = () => els.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.92 && r.bottom > 0) show(el); });
    addEventListener("scroll", check, { passive: true }); requestAnimationFrame(check);
  }

  // Contact "What happens next": steps appear one by one, the line draws between them,
  // then a highlight walks 01 → 02 → 03 on a loop.
  let nextTimer = null;
  function animateNextSteps() {
    clearInterval(nextTimer);
    const el = document.querySelector(".cta-next"); if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const items = [...el.children];
    el.classList.add("anim");
    let started = false;
    const start = () => {
      if (started) return; started = true; io.disconnect(); removeEventListener("scroll", check);
      el.classList.add("in");
      let k = 0;
      setTimeout(() => {
        const tick = () => { items.forEach((li, i) => li.classList.toggle("on", i === k)); k = (k + 1) % items.length; };
        tick(); nextTimer = setInterval(tick, 2200);
      }, items.length * 380 + 600);
    };
    const check = () => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * 0.85 && r.bottom > 0) start(); };
    const io = new IntersectionObserver(e => { if (e.some(x => x.isIntersecting)) start(); }, { threshold: 0.3 });
    io.observe(el); addEventListener("scroll", check, { passive: true }); requestAnimationFrame(check);
  }

  /* ---------- pages ---------- */
  function home() {
    const completed = P.filter(p => p.status === "completed");
    const ongoing = P.filter(p => p.status === "ongoing");
    const featured = (completed.filter(p => p.featured).length ? completed.filter(p => p.featured) : completed).slice(0, 4);
    // [number, unit, label, description]
    const stats = [
      [C.years, t("stats.years.unit"), t("stats.k.years"), t("stats.years")],
      C.stats.villasBuilt && [C.stats.villasBuilt + "+", "", t("stats.k.villas"), t("stats.villas")],
      C.stats.areaBuilt && [Number(C.stats.areaBuilt).toLocaleString(), "", t("stats.k.area"), t("stats.area")],
      ["1", t("stats.scope.value"), t("stats.k.scope"), t("stats.scope")],
      ["12", t("stats.care.value"), t("stats.k.care"), t("stats.care")]
    ].filter(Boolean);
    const steps = [1, 2, 3, 4, 5];

    document.getElementById("app").innerHTML = `
      ${heroShow(completed.length ? completed : P)}

      <section class="stats-band"><div class="wrap">
        <div class="stats" style="--n:${stats.length}">${stats.map(([n, u, k, d]) => `<div class="stat">
          <span class="stat-k">${esc(k)}</span>
          <b class="stat-n">${esc(n)}${u ? `<small>${esc(u)}</small>` : ""}</b>
          <p class="stat-d">${esc(d)}</p>
        </div>`).join("")}</div>
      </div></section>

      <section class="motto"><div class="wrap motto-inner">
        <img class="motto-mark" src="assets/img/logo-mark.jpg" alt="">
        <span class="eyebrow">${esc(t("motto.eyebrow"))}</span>
        <h2>${esc(t("motto.pre"))} <em>${esc(t("motto.em"))}</em>.</h2>
        <p>${esc(t("motto.sub"))}</p>
      </div></section>

      <section class="section" id="about"><div class="wrap about">
        <div style="display:grid;gap:16px;align-content:start"><span class="eyebrow">${esc(t("about.eyebrow"))}</span><h2>${esc(t("about.title"))}</h2></div>
        <div class="about-body"><p>${esc(t("about.p1"))}</p><p>${esc(t("about.p2"))}</p></div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap">
        <div class="section-head"><div style="display:grid;gap:14px"><span class="eyebrow">${esc(t("projects.eyebrow"))}</span><h2>${esc(t("projects.title"))}</h2></div>
          <a class="link-arrow" href="projects.html">${esc(t("projects.all"))} →</a></div>
        <div class="fx-grid">
          <div class="fx-col">${featured.map(featuredCard).filter((_, i) => i % 2 === 0).join("")}</div>
          <div class="fx-col">${featured.map(featuredCard).filter((_, i) => i % 2 === 1).join("")}</div>
        </div>
      </div></section>

      ${quotesSection()}

      <section class="section ongoing"><div class="wrap">
        <div class="section-head"><div style="display:grid;gap:14px"><span class="eyebrow">${esc(t("ongoing.eyebrow"))}</span><h2>${esc(t("ongoing.title"))}</h2><p class="lead">${esc(t("ongoing.lead"))}</p></div>
          ${ongoing.length ? `<a class="link-arrow" href="projects.html#ongoing">${esc(t("projects.all"))} →</a>` : ""}</div>
        ${ongoing.length ? `<div class="ongoing-list">${ongoing.map(ongoingItem).join("")}</div>`
          : `<div class="ongoing-empty"><p class="lead" style="color:#DCE4F2">${esc(t("ongoing.empty"))}</p>
             <a class="btn btn-ghost" href="${waLink()}" target="_blank" rel="noopener">${ICON.wa}${esc(t("ongoing.cta"))}</a></div>`}
      </div></section>

      <section class="section" id="services"><div class="wrap">
        <div class="section-head"><div style="display:grid;gap:14px"><span class="eyebrow">${esc(t("services.eyebrow"))}</span><h2>${esc(t("services.title"))}</h2></div></div>
        <div class="services">${["db", "c", "m", "r"].map((k, i) => `<article class="service">
          <div class="svc-top"><span class="svc-ico">${SVC_ICON[k]}</span><span class="svc-n">0${i + 1}</span></div>
          <h3>${esc(t(`svc.${k}.t`))}</h3><p>${esc(t(`svc.${k}.d`))}</p></article>`).join("")}</div>
      </div></section>

      <section class="section" id="process" style="padding-top:0"><div class="wrap">
        <div class="section-head"><div style="display:grid;gap:14px"><span class="eyebrow">${esc(t("process.eyebrow"))}</span><h2>${esc(t("process.title"))}</h2></div></div>
        <ol class="process">${steps.map((n, i) => `<li class="step" style="--i:${i}"><span class="step-n">0${n}</span><h3>${esc(t(`p${n}.t`))}</h3><p>${esc(t(`p${n}.d`))}</p></li>`).join("")}</ol>
      </div></section>

      ${credSection()}`;
    bindHeroShow();
    animateProcess();
    reveal();
  }

  function projects() {
    const counts = { all: P.length, completed: P.filter(p => p.status === "completed").length, ongoing: P.filter(p => p.status === "ongoing").length };
    let f = ["completed", "ongoing"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "all";
    document.getElementById("app").innerHTML = `
      <div class="wrap">
        <div class="page-head"><span class="eyebrow">PT Darren Adhi Jaya</span><h1>${esc(t("page.projects.title"))}</h1><p class="lead">${esc(t("page.projects.lead"))}</p></div>
        <div class="filters" role="group">${["all", "completed", "ongoing"].map(k =>
          `<button class="filter" data-f="${k}" aria-pressed="${k === f}">${esc(t("filter." + k))}<span class="count">${counts[k]}</span></button>`).join("")}</div>
        <div id="list"></div>
      </div><div style="height:clamp(64px,8vw,112px)"></div>`;
    const draw = () => {
      const items = P.filter(p => f === "all" || p.status === f);
      document.getElementById("list").innerHTML = items.length ? `<div class="grid-projects">${items.map(card).join("")}</div>` : `<div class="empty-state">${esc(t("filter.empty"))}</div>`;
      document.querySelectorAll(".filter").forEach(b => b.setAttribute("aria-pressed", b.dataset.f === f));
    };
    document.querySelectorAll(".filter").forEach(b => b.addEventListener("click", () => { f = b.dataset.f; history.replaceState(null, "", f === "all" ? location.pathname + location.search : "#" + f); draw(); }));
    draw();
  }

  function project() {
    const id = new URLSearchParams(location.search).get("id");
    const idx = P.findIndex(x => x.id === id), p = P[idx];
    const app = document.getElementById("app");
    if (!p) { app.innerHTML = `<div class="wrap page-head"><h1>${esc(t("notfound"))}</h1><a class="link-arrow" href="projects.html">← ${esc(t("d.back"))}</a></div>`; return; }
    document.title = `${p.name} · ${C.company}`;
    const ongoing = p.status === "ongoing";

    const facts = [
      p.type && [t("d.type"), t("type." + p.type)],
      p.scope && [t("d.scope"), t("scope." + p.scope)],
      ongoing && p.stage && [t("d.stage"), t("stage." + p.stage)]
    ].filter(Boolean);
    // key numbers panel (villas, areas, bedrooms, year, build time)
    const num = v => typeof v === "number" ? v.toLocaleString(lang === "pt" ? "pt-BR" : lang) : v;
    const keyStats = [
      p.units && [num(p.units), "", t("d.k.units")],
      p.buildingArea && [num(p.buildingArea), "m²", t("d.k.area")],
      p.landArea && [num(p.landArea), "m²", t("d.k.land")],
      p.bedrooms && [num(p.bedrooms), "", t("d.k.beds")],
      p.year && [p.year, "", t("d.k.year")],
      p.duration && [num(p.duration), t("d.k.months"), t("d.k.dur")]
    ].filter(Boolean);
    const pq = (T.testimonials || []).find(q => q.project === p.id);
    const statusLine = ongoing ? t("progress", { n: p.progress || 0 }) : "";

    const raw = p.description && (typeof p.description === "string" ? p.description : (p.description[lang] || p.description.en));
    const paras = raw ? raw.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean) : [t("d.intro." + p.status, { name: p.name, location: p.location })];

    const credits = [[t("d.cr.arch"), p.architect], [t("d.cr.photo"), p.photographer]].filter(c => c[1]);
    const shots = ["cover.jpg", ...(p.photos || [])];
    const next = P.length > 1 ? P[(idx + 1) % P.length] : null;
    const prev = P.length > 2 ? P[(idx - 1 + P.length) % P.length] : null;
    const navTile = (q, dir) => `<a class="pjn pjn-${dir}" href="project.html?id=${encodeURIComponent(q.id)}">
        <div class="pjn-bg">${frame(imgPath(q, "cover.jpg"), "", q.name, "ph", { sizes: "(max-width: 760px) 100vw, 50vw" })}</div>
        <div class="pjn-body">
          <span class="pjn-k">${dir === "prev" ? '<span class="pjn-ar">←</span>' : ""}${esc(t(dir === "prev" ? "d.prev" : "d.next"))}${dir === "next" ? '<span class="pjn-ar">→</span>' : ""}</span>
          <span class="pjn-name">${esc(q.name)}</span>
          <span class="pjn-loc">${esc(q.location)}${q.status === "ongoing" ? ` · ${esc(t("progress", { n: q.progress || 0 }))}` : ""}</span>
        </div></a>`;

    app.innerHTML = `
      <article class="pj"><div class="wrap pj-grid">
        <aside class="pj-info">
          <a class="pj-back" href="projects.html">← ${esc(t("d.backshort"))}</a>
          <div class="pj-title"><h1>${esc(p.name)}</h1><p class="pj-loc">${esc(p.location)}</p></div>
          <ul class="pj-facts">
            ${facts.map(([k, v]) => `<li><span>${esc(k)}:</span> ${esc(v)}</li>`).join("")}
            <li class="pj-status">${badge(p)}${statusLine ? ` <span>${esc(statusLine)}</span>` : ""}</li>
          </ul>
          ${ongoing ? `<div class="pj-progress"><div class="fill" style="width:${Math.max(0, Math.min(100, p.progress || 0))}%"></div></div>` : ""}
          ${keyStats.length ? `<dl class="pj-stats">${keyStats.map(([v, u, k]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}${u ? `<small>${esc(u)}</small>` : ""}</dd></div>`).join("")}</dl>` : ""}
          <div class="pj-desc${paras.length > 1 ? " collapsed" : ""}" id="pjDesc">
            ${paras.map((x, i) => `<p${i ? ' class="more"' : ""}>${esc(x)}</p>`).join("")}
          </div>
          ${paras.length > 1 ? `<button class="pj-more" id="pjMore" aria-expanded="false" aria-controls="pjDesc">${esc(t("d.readmore"))}</button>` : ""}
          <div class="pj-side">
            <div class="pj-builder">
              <img src="assets/img/logo-mark.jpg" alt="">
              <div><span>${esc(t("d.cr.build"))}</span><b>${esc(C.company)}</b></div>
            </div>
            ${credits.length ? `<dl class="pj-credits">${credits.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
            ${p.instagram ? `<a class="pj-ig" href="https://www.instagram.com/${esc(p.instagram)}" target="_blank" rel="noopener">
              <span class="pj-ig-ico">${ICON.ig}</span>
              <span class="pj-ig-txt"><small>${esc(t("d.instagram"))}</small><b>@${esc(p.instagram)}</b></span>
              <span class="pj-ig-arr" aria-hidden="true">↗</span></a>` : ""}
            <div class="pj-cta">
              <p>${esc(t("d.cta"))}</p>
              <a class="btn btn-light" href="#contact">${esc(t("hero.cta.start"))} <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </aside>
        <div class="pj-stream" id="pjStream">
          ${shots.map((f, i) => `<button class="pj-shot" type="button" aria-label="${esc(p.name)} ${i + 1}">${frame(imgPath(p, f), i ? "" : p.name, `${p.name} ${i + 1}`, i ? "drop" : "ph", { sizes: "(max-width: 900px) 100vw, 60vw", eager: i === 0 })}</button>`).join("")}
        </div>
      </div>
      ${pq ? `<section class="wrap"><div class="pj-quote rv">
        <svg class="tq-mark" viewBox="0 0 40 30" aria-hidden="true"><path d="M0 30V17C0 7.6 5 1.7 14 0l1.6 4C10.4 5.6 8 9 7.8 13H15v17zm22 0V17C22 7.6 27 1.7 36 0l1.6 4c-5.2 1.6-7.6 5-7.8 9H37v17z"/></svg>
        <div><span class="eyebrow">${esc(t("d.quote"))}${sampleTag()}</span>
        <blockquote><p>${esc(quoteText(pq))}</p></blockquote>
        <p class="pj-quote-who"><b>${esc(pq.name)}</b>${pq.country ? flag(pq.country) : ""}</p></div>
      </div></section>` : ""}
      ${next ? `<nav class="pjn-wrap wrap" aria-label="${esc(t("d.more"))}">${prev ? navTile(prev, "prev") : ""}${navTile(next, "next")}</nav>` : ""}
      </article>
      <div class="lb" id="lb" hidden><button class="lb-x" aria-label="Close">×</button><button class="lb-prev" aria-label="Previous">‹</button><img alt=""><button class="lb-next" aria-label="Next">›</button></div>`;

    // keep the whole sidebar reachable: stick at the top if it fits, otherwise stick by its bottom edge
    const info = document.querySelector(".pj-info");
    const fitSide = () => { if (!info) return; const room = innerHeight - 24;
      info.style.setProperty("--pj-top", Math.min(104, room - info.offsetHeight) + "px"); };
    fitSide(); addEventListener("resize", fitSide);
    if (document.fonts) document.fonts.ready.then(fitSide);
    const more = document.getElementById("pjMore");
    if (more) more.addEventListener("click", () => {
      const d = document.getElementById("pjDesc"), open = d.classList.toggle("collapsed") === false;
      more.textContent = t(open ? "d.readless" : "d.readmore"); more.setAttribute("aria-expanded", open); fitSide();
    });

    // simple lightbox over the photos that actually loaded
    const lb = document.getElementById("lb"), lbImg = lb.querySelector("img"); let cur = 0;
    const loaded = () => [...document.querySelectorAll("#pjStream .frame:not(.empty) img")].filter(i => i.complete && i.naturalWidth);
    const show = n => { const L = loaded(); if (!L.length) return; cur = (n + L.length) % L.length; lbImg.src = L[cur].dataset.full || L[cur].currentSrc || L[cur].src; lbImg.alt = L[cur].alt; lb.hidden = false; };
    document.getElementById("pjStream").addEventListener("click", e => {
      const img = e.target.closest(".pj-shot")?.querySelector(".frame:not(.empty) img"); if (!img) return;
      show(loaded().indexOf(img));
    });
    lb.querySelector(".lb-x").onclick = () => (lb.hidden = true);
    lb.querySelector(".lb-prev").onclick = () => show(cur - 1);
    lb.querySelector(".lb-next").onclick = () => show(cur + 1);
    lb.addEventListener("click", e => { if (e.target === lb) lb.hidden = true; });
    reveal();
    document.onkeydown = e => { if (lb.hidden) return; if (e.key === "Escape") lb.hidden = true; if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); };
  }

  function renderAll() {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    header(); footer(); bindInquiry(); animateNextSteps(); bindWaFloat();
    ({ home, projects, project })[page]?.();
  }
  renderAll();

  const onScroll = () => document.querySelector(".site-header")?.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
