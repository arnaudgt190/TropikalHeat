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


  /* ---------- Envoi d'un formulaire vers le Google Apps Script (arrive dans ta boîte mail) ---------- */
  async function envoyer(f, extra, merci) {
    const msg = $(".form-msg", f), btn = $('button[type="submit"]', f);
    if (!f.checkValidity()) { msg.textContent = "Il manque une info : vérifie les champs."; f.reportValidity(); return false; }
    const d = new FormData(f);
    if (d.get("_gotcha")) return false;
    d.delete("_gotcha");
    Object.entries(extra).forEach(([k, v]) => d.append(k, v));
    d.append("page", location.pathname);
    btn.disabled = true;
    msg.textContent = "Envoi en cours…";
    try {
      const r = await fetch(C.marque.formulaire, { method: "POST", body: new URLSearchParams(d) });
      if (!r.ok) throw new Error();
      const rep = await r.json().catch(() => ({}));
      if (rep.ok === false) throw new Error();
      f.reset();
      f.classList.add("sent");
      msg.textContent = merci;
      return true;
    } catch (err) {
      btn.disabled = false;
      msg.innerHTML = `Oups, l'envoi n'est pas passé. Réessaie, ou écris-moi à <a href="mailto:${C.marque.email}">${C.marque.email}</a>.`;
      return false;
    }
  }

  /* ---------- Mot-symbole : T et H mis en avant ---------- */
  const wordmark = () =>
    '<span class="wm"><b>T</b>ropikal <b>H</b>eat</span>';

  /* ---------- En-tête et pied de page communs ---------- */
  const nav = [
    ["index.html", "Accueil", "accueil"],
    ["karukera.html", "Boutique", "edition"],
    ["univers.html", "Univers", "univers"],
    ["contact.html", "Contact", "contact"]
  ];
  $("#header").innerHTML = `
    <a class="brand" href="index.html" aria-label="Tropikal Heat, accueil">
      <img src="assets/embleme.svg" alt="" width="44" height="37">${wordmark()}
    </a>
    <nav aria-label="Navigation principale"><ul>
      ${nav.map(([h, l, p]) => `<li><a href="${h}" ${p === page ? 'aria-current="page"' : ""}>${l}</a></li>`).join("")}
    </ul></nav>
    <div class="head-actions">
      <a class="cart-link" href="panier.html" ${page === "panier" ? 'aria-current="page"' : ""} aria-label="Mon panier">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 4h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L21 8H6.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.4" fill="currentColor"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor"/></svg>
        <span class="cart-count" hidden>0</span>
      </a>
      <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
    </div>`;
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

  /* ---------- Première lettre en dégradé : data-initial ---------- */
  $$("[data-initial]").forEach((el) => {
    const t = el.textContent;
    if (!t) return;
    const b = document.createElement("b");
    b.className = "ini";
    b.textContent = t[0];
    el.textContent = t.slice(1);
    el.prepend(b);
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

  /* ---------- Outils prix ---------- */
  const E = C.edition;
  const euros = (n) => { n = Math.round(n * 100) / 100; return (Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")) + " €"; };
  const num = (s) => parseFloat(String(s).replace(",", ".")) || 0;
  const pluriel = (n) => n > 1 ? "s" : "";

  /* ---------- Prix de lancement : pièces restantes (lues dans le Google Sheet) ---------- */
  const LCT = E.lancement || { actif: false, pieces: 0 };
  let enLancement = !!LCT.actif;
  let restantes = null;
  const prixAffiche = (v) => (enLancement && v.prixLancement) ? v.prixLancement : v.prix;
  const prixDe = (v) => num(prixAffiche(v));
  const restantesLancement = (async () => {
    if (!LCT.actif || !C.marque.formulaire || !($(".marquee-track") || page === "edition" || page === "panier")) return null;
    try {
      const r = await fetch(C.marque.formulaire + "?action=stock");
      const j = await r.json();
      return typeof j.reservees === "number" ? Math.max(0, LCT.pieces - j.reservees) : null;
    } catch (err) { return null; }
  })();
  restantesLancement.then((n) => {
    if (n === null) return;
    restantes = n;
    if (n <= 0) enLancement = false;
    document.dispatchEvent(new CustomEvent("lancement:maj"));
  });
  const texteLancement = (apres) => `<b>Prix de lancement</b> · ${restantes === null
    ? `réservé aux ${LCT.pieces} premières pièces payées`
    : `plus que ${restantes} pièce${pluriel(restantes)} à ce prix`}${apres ? ", puis " + apres : ""}`;

  /* ---------- Bandeau défilant ---------- */
  const marquee = $(".marquee-track");
  if (marquee) {
    const dessine = (extra) => {
      const base = page === "edition" ? E.bandeauBoutique : C.accueil.bandeau;
      const mots = extra ? [extra, ...base] : base;
      marquee.innerHTML = mots.map((w) => `<span>${w}</span><i>✦</i>`).join("").repeat(6);
      marquee.style.animationDuration = mots.length * 12 + "s"; /* même vitesse quel que soit le nombre de messages */
    };
    dessine(LCT.actif ? `Prix de lancement · ${LCT.pieces} premières pièces` : "");
    restantesLancement.then((n) => {
      if (n === null) return;
      dessine(n > 0 ? `Prix de lancement · plus que ${n} pièce${pluriel(n)}` : "");
    });
  }

  /* ---------- Compteur : les chiffres d'un prix tournent quand il change ---------- */
  const roll = (el, text) => {
    const chars = [...text];
    const same = el.dataset.roll && el.childElementCount === chars.length &&
      chars.every((c, i) => /\d/.test(c) === el.children[i].classList.contains("rd"));
    if (!same) {
      el.dataset.roll = "1";
      el.innerHTML = chars.map((c) => /\d/.test(c)
        ? `<span class="rd" aria-hidden="true"><span class="rd-col">${"0123456789".split("").map((n) => `<span>${n}</span>`).join("")}</span></span>`
        : `<span class="rc" aria-hidden="true">${c === " " ? "&nbsp;" : c}</span>`).join("");
      el.offsetWidth; /* force le rendu avant l'animation */
    }
    el.setAttribute("aria-label", text);
    chars.forEach((c, i) => {
      if (/\d/.test(c)) el.children[i].firstChild.style.transform = `translateY(-${c}0%)`;
    });
  };

  /* ---------- Panier (gardé dans le navigateur du visiteur) ---------- */
  const CLE = "th-panier";
  const lirePanier = () => {
    try {
      const p = JSON.parse(localStorage.getItem(CLE) || "[]");
      return Array.isArray(p) ? p.filter((l) => E.variantes.some((v) => v.id === l.id) && l.qte > 0) : [];
    } catch (err) { return []; }
  };
  let panier = lirePanier();
  const nbArticles = () => panier.reduce((s, l) => s + l.qte, 0);
  const majBadge = () => {
    const n = nbArticles();
    $$(".cart-count").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    $$(".cart-link").forEach((el) => el.setAttribute("aria-label", `Mon panier, ${n} article${pluriel(n)}`));
  };
  const sauverPanier = () => {
    try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (err) { /* navigation privée stricte : le panier vit le temps de la page */ }
    majBadge();
  };
  const ajouterAuPanier = (id, taille) => {
    const l = panier.find((x) => x.id === id && x.taille === taille);
    if (l) l.qte += 1; else panier.push({ id, taille, qte: 1 });
    sauverPanier();
  };
  majBadge();
  /* le panier se met à jour si un autre onglet du site le modifie */
  window.addEventListener("storage", (e) => { if (e.key === CLE) { panier = lirePanier(); majBadge(); document.dispatchEvent(new CustomEvent("panier:maj")); } });

  /* ---------- Livraison par commune ---------- */
  const L = E.livraison;
  const frais = (km) => (km < L.gratuitSousKm ? 0 : Math.floor(km / L.trancheKm) * L.prixParTranche);
  const versCommune = (n) => n.startsWith("Les ") ? "aux " + n.slice(4) : n.startsWith("Le ") ? "au " + n.slice(3) : n.startsWith("La ") ? "à la " + n.slice(3) : "à " + n;
  const livraisons = L.communes.map((c) => {
    const gosier = c.nom === "Le Gosier";
    const prix = frais(c.km);
    return {
      nom: gosier ? "Livraison au Gosier" : `Livraison ${versCommune(c.nom)}`,
      label: gosier ? "Livraison au Gosier · gratuite" : `Livraison ${versCommune(c.nom)} · ${prix ? "+ " + euros(prix) : "gratuite"}`,
      detail: gosier ? "" : `${c.nom}, environ ${c.km} km du Gosier`,
      prix
    };
  });

  /* ---------- Page Boutique : variantes, tailles, ajout au panier ---------- */
  if (page === "edition") {
    const car = $("#product-car");
    /* Slides du carrousel construites depuis content.js */
    $(".car-track", car).innerHTML = E.variantes.map((v, i) => `
      <figure class="car-slide" aria-roledescription="diapositive" aria-label="${i + 1} sur ${E.variantes.length}">
        <img src="${v.mockup}" alt="T-shirt KARUKERA ${v.nom}, devant et dos" width="1800" height="1005"${i ? ' loading="lazy"' : ""}>
        <figcaption>${v.nom}</figcaption>
      </figure>`).join("");
    const vWrap = $("#variants");
    const sWrap = $("#sizes");
    let variant = E.variantes[0];
    let size = E.tailles[1] || E.tailles[0];

    const majLancement = () => {
      const el = $("#launch");
      el.hidden = !enLancement;
      if (enLancement) el.innerHTML = texteLancement(variant.prix);
    };
    const pick = (v, fromCar) => {
      variant = v;
      roll($("#price"), prixAffiche(v));
      majLancement();
      $$("button", vWrap).forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === v.id));
      if (!fromCar && car.goTo) car.goTo(E.variantes.indexOf(v));
    };
    car.addEventListener("car:change", (e) => pick(E.variantes[e.detail], true));
    E.variantes.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.id = v.id;
      b.className = "swatch";
      b.innerHTML = `<span style="background:${v.id.startsWith("noir") ? "#0b0b0b" : "#f4f1ec"}"></span><span>${v.nom} · <em>${prixAffiche(v)}</em></span>`;
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
    pick(variant, true);
    document.addEventListener("lancement:maj", () => {
      $$("button", vWrap).forEach((b, i) => { $("em", b).textContent = prixAffiche(E.variantes[i]); });
      pick(variant, true);
    });

    const addBtn = $("#add-to-cart"), added = $("#added");
    addBtn.addEventListener("click", () => {
      ajouterAuPanier(variant.id, size);
      added.hidden = false;
      $("#added-text").textContent = `${variant.nom} · taille ${size} ajouté au panier`;
      addBtn.classList.remove("pop"); addBtn.offsetWidth; addBtn.classList.add("pop");
      $$(".cart-link").forEach((c) => { c.classList.remove("pop"); c.offsetWidth; c.classList.add("pop"); });
    });
  }

  /* ---------- Page Panier ---------- */
  if (page === "panier") {
    const liste = $("#cart-list"), vide = $("#cart-empty"), plein = $("#cart-full");
    const sel = $("#shipping");
    livraisons.forEach((o, i) => sel.add(new Option(o.label, i)));
    let ship = livraisons[0];
    const variante = (id) => E.variantes.find((v) => v.id === id);
    const sousTotal = () => panier.reduce((s, l) => s + prixDe(variante(l.id)) * l.qte, 0);

    const dessiner = () => {
      const n = nbArticles();
      vide.hidden = n > 0;
      plein.hidden = n === 0;
      if (!n) {
        $("#cart-count-title").textContent = "";
        liste.innerHTML = "";
        liste.dataset.sig = "";
        return;
      }
      /* la liste n'est reconstruite que si un article est ajouté ou supprimé,
         sinon les chiffres (quantité, prix) tournent en place */
      const sig = panier.map((l) => l.id + "|" + l.taille).join(",");
      if (liste.dataset.sig !== sig) {
        liste.dataset.sig = sig;
        liste.innerHTML = panier.map((l, i) => {
          const v = variante(l.id);
          return `<li class="cart-item">
            <img src="${v.mockup}" alt="" width="1800" height="1005" loading="lazy">
            <div class="ci-info">
              <p class="ci-name">${E.nom} · ${v.nom}</p>
              <p class="ci-meta">Taille ${l.taille} · <span class="ci-unit"></span> l'unité</p>
              <div class="ci-actions">
                <div class="qty" role="group" aria-label="Quantité">
                  <button type="button" data-moins="${i}" aria-label="Retirer un exemplaire">−</button>
                  <span class="ci-qty" aria-live="polite"></span>
                  <button type="button" data-plus="${i}" aria-label="Ajouter un exemplaire">+</button>
                </div>
                <button type="button" class="ci-remove" data-suppr="${i}">Supprimer</button>
              </div>
            </div>
            <p class="ci-price"></p>
          </li>`;
        }).join("");
      }
      $$(".cart-item", liste).forEach((li, i) => {
        const l = panier[i], v = variante(l.id);
        $(".ci-unit", li).textContent = prixAffiche(v);
        roll($(".ci-qty", li), String(l.qte));
        roll($(".ci-price", li), euros(prixDe(v) * l.qte));
      });
      roll($("#subtotal"), euros(sousTotal()));
      $("#cart-count-title").textContent = `${n} article${pluriel(n)}`;
      $("#ship-note").textContent = ship.detail ? `${ship.detail} · ${ship.prix ? "frais " + euros(ship.prix) : "livraison offerte"}` : "";
      roll($("#total"), euros(sousTotal() + ship.prix));
      const lc = $("#cart-launch");
      lc.hidden = !enLancement;
      if (enLancement) lc.innerHTML = texteLancement("");
    };
    liste.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.plus) panier[+b.dataset.plus].qte += 1;
      if (b.dataset.moins) { const l = panier[+b.dataset.moins]; l.qte -= 1; if (l.qte < 1) panier.splice(+b.dataset.moins, 1); }
      if (b.dataset.suppr) panier.splice(+b.dataset.suppr, 1);
      sauverPanier();
      dessiner();
    });
    sel.addEventListener("change", () => { ship = livraisons[+sel.value]; dessiner(); });
    document.addEventListener("lancement:maj", dessiner);
    document.addEventListener("panier:maj", dessiner);
    dessiner();

    const po = $("#po-form");
    po.addEventListener("submit", async (e) => {
      e.preventDefault();
      const n = nbArticles();
      if (!n) return;
      const lignes = panier.map((l) => { const v = variante(l.id); return `${l.qte} × ${v.nom} · taille ${l.taille} · ${euros(prixDe(v) * l.qte)}`; });
      const ok = await envoyer(po, {
        _subject: `Précommande ${E.nom} · ${n} pièce${pluriel(n)} · ${ship.nom}`,
        type: "Précommande",
        edition: `${E.nom} (${E.numero})`,
        modele: lignes.join("\n"),
        taille: panier.map((l) => `${l.qte}×${l.taille}`).join(", "),
        pieces: n,
        prix: euros(sousTotal()) + (enLancement ? " (prix de lancement)" : ""),
        livraison: `${ship.nom} : ${ship.prix ? euros(ship.prix) : "gratuite"}`,
        total: euros(sousTotal() + ship.prix)
      }, E.precommande.merci);
      if (ok) {
        panier = [];
        sauverPanier();
        $("#cart-box").hidden = true;
        $(".cart-head p").textContent = "";
      }
    });
  }

  /* ---------- Formulaire de contact ---------- */
  const form = $("#contact-form");
  if (form) {
    const sel = $("#sujet");
    C.contact.sujets.forEach((s) => sel.add(new Option(s, s)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      envoyer(form, { _subject: `Contact · ${d.get("sujet")} · ${d.get("nom")}`, type: "Message" },
        "Merci, ton message est bien parti ! Je te réponds très vite 🙌");
    });
  }

  /* ---------- Inscription à la newsletter ---------- */
  const signup = $("#signup");
  if (signup) {
    signup.addEventListener("submit", (e) => {
      e.preventDefault();
      envoyer(signup, { type: "Inscription" }, C.inscription.merci);
    });
  }

  /* ---------- Carrousel (accueil) ---------- */
  $$("[data-carousel]").forEach((car) => {
    const track = $(".car-track", car);
    const slides = $$(".car-slide", car);
    const dotsWrap = $(".car-dots", car);
    let index = 0;
    const dots = slides.map((s, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", `Voir ${s.querySelector("figcaption").textContent.toLowerCase()}`);
      d.addEventListener("click", () => go(i));
      dotsWrap.appendChild(d);
      return d;
    });
    const mark = () => {
      dots.forEach((d, i) => d.setAttribute("aria-current", i === index));
      car.dispatchEvent(new CustomEvent("car:change", { detail: index }));
    };
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: index * track.clientWidth });
      mark();
    };
    car.goTo = (i) => { if (i !== index) { stop(); go(i); } };
    $(".prev", car).addEventListener("click", () => { go(index - 1); stop(); });
    $(".next", car).addEventListener("click", () => { go(index + 1); stop(); });
    track.addEventListener("scroll", () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== index) { index = i; mark(); }
    }, { passive: true });
    mark();
    // Défilement automatique toutes les 5 s, en pause au survol et arrêté dès qu'on clique
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches || car.dataset.autoplay === "false";
    let timer = calme ? null : setInterval(() => go(index + 1), 5000);
    const stop = () => { clearInterval(timer); timer = null; };
    car.addEventListener("mouseenter", () => { if (timer) { clearInterval(timer); timer = "pause"; } });
    car.addEventListener("mouseleave", () => { if (timer === "pause") timer = setInterval(() => go(index + 1), 5000); });
    car.addEventListener("focusin", stop);
    track.addEventListener("touchstart", stop, { passive: true });
  });

  /* ---------- Apparition douce au défilement ---------- */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 })
    : null;
  $$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
})();
