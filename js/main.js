/* =========================================================
   TROPIKAL HEAT · LOGIQUE DU SITE
   Remplit les pages à partir de content.js, gère le menu,
   le choix des variantes et la précommande.
   ========================================================= */
(function () {
  const C = window.CONTENT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), C);
  const page = document.body.dataset.page;

  /* ---------- Mot-symbole : T et H mis en avant ---------- */
  const wordmark = () =>
    '<span class="wm"><b>T</b>ropikal <b>H</b>eat</span>';

  /* ---------- En-tête et pied de page communs ---------- */
  const nav = [
    ["index.html", "Accueil", "accueil"],
    ["karukera.html", "Karukera", "edition"],
    ["lookbook.html", "Lookbook", "lookbook"],
    ["univers.html", "Univers", "univers"],
    ["contact.html", "Contact", "contact"]
  ];
  $("#header").innerHTML = `
    <a class="brand" href="index.html" aria-label="Tropikal Heat, accueil">
      <img src="assets/embleme.svg" alt="" width="44" height="37">${wordmark()}
    </a>
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
    <nav aria-label="Navigation principale"><ul>
      ${nav.map(([h, l, p]) => `<li><a href="${h}" ${p === page ? 'aria-current="page"' : ""}>${l}</a></li>`).join("")}
    </ul></nav>`;
  $(".burger").addEventListener("click", (e) => {
    const open = document.body.classList.toggle("menu-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });

  $("#footer").innerHTML = `
    <div class="foot-top">
      <img src="assets/monogramme.svg" alt="" width="72" height="72">
      <p class="foot-slogan">${C.marque.slogan}</p>
      <p class="foot-base">${C.marque.baseline}</p>
    </div>
    <div class="foot-row">
      <span>© ${new Date().getFullYear()} ${C.marque.nom} · ${C.marque.ville}</span>
      <span class="foot-links">
        <a href="${C.marque.instagram}" target="_blank" rel="noopener">Instagram</a>
        <a href="${C.marque.tiktok}" target="_blank" rel="noopener">TikTok</a>
        <a href="mailto:${C.marque.email}">${C.marque.email}</a>
      </span>
    </div>`;

  /* ---------- Textes simples : data-c="chemin.dans.content" ---------- */
  $$("[data-c]").forEach((el) => {
    const v = get(el.dataset.c);
    if (v !== undefined) el.textContent = v;
  });

  /* ---------- Listes : data-list="chemin" + <template> ---------- */
  $$("[data-list]").forEach((el) => {
    const items = get(el.dataset.list) || [];
    const tpl = el.querySelector("template");
    items.forEach((item) => {
      const node = tpl.content.cloneNode(true);
      $$("[data-f]", node).forEach((f) => {
        const k = f.dataset.f;
        f.textContent = typeof item === "string" ? item : item[k];
      });
      el.appendChild(node);
    });
  });

  /* ---------- Bandeau défilant ---------- */
  const marquee = $(".marquee-track");
  if (marquee) {
    const words = C.accueil.bandeau.map((w) => `<span>${w}</span><i>✦</i>`).join("");
    marquee.innerHTML = words.repeat(6);
  }

  /* ---------- Page édition : variantes, tailles, précommande ---------- */
  if (page === "edition") {
    const E = C.edition;
    const img = $("#variant-img");
    const stage = $(".product-stage");
    const vWrap = $("#variants");
    const sWrap = $("#sizes");
    let variant = E.variantes[0];
    let size = E.tailles[1] || E.tailles[0];

    const pick = (v) => {
      variant = v;
      img.src = v.image;
      img.alt = `Dos KARUKERA, ${v.nom}`;
      stage.style.background = v.fond;
      stage.classList.toggle("light", v.id === "blanc");
      $$("button", vWrap).forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === v.id));
    };
    E.variantes.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.id = v.id;
      b.className = "swatch";
      b.innerHTML = `<span style="background:${v.fond}"></span>${v.nom}`;
      b.addEventListener("click", () => pick(v));
      vWrap.appendChild(b);
    });
    E.tailles.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = t;
      b.setAttribute("aria-pressed", t === size);
      b.addEventListener("click", () => {
        size = t;
        $$("button", sWrap).forEach((x) => x.setAttribute("aria-pressed", x === b));
      });
      sWrap.appendChild(b);
    });
    pick(variant);

    $("#precommande").addEventListener("click", () => {
      if (E.precommande.lienPaiement) {
        window.open(E.precommande.lienPaiement, "_blank", "noopener");
        return;
      }
      const sujet = `Précommande ${E.nom} · ${variant.nom} · taille ${size}`;
      const corps = `Bonjour,\n\nJe souhaite précommander :\n- ${E.nom} (${E.numero})\n- ${variant.nom}\n- Taille ${size}\n- Prix ${E.prix}\n\nMon prénom et nom :\nMon téléphone :\nRemise en main propre ou envoi :\n\nMerci !`;
      location.href = `mailto:${C.marque.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
    });
  }

  /* ---------- Formulaire de contact (ouvre l'email) ---------- */
  const form = $("#contact-form");
  if (form) {
    const sel = $("#sujet");
    C.contact.sujets.forEach((s) => sel.add(new Option(s, s)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const corps = `${d.get("message")}\n\n${d.get("nom")}\n${d.get("email")}`;
      location.href = `mailto:${C.marque.email}?subject=${encodeURIComponent(d.get("sujet") + " · " + d.get("nom"))}&body=${encodeURIComponent(corps)}`;
    });
  }

  /* ---------- Apparition douce au défilement ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 })
    : null;
  $$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
})();
