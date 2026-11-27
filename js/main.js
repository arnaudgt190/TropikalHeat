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


  /* ---------- Envoi d'un formulaire vers Formspree (arrive dans ta boîte mail) ---------- */
  async function envoyer(f, extra, merci) {
    const msg = $(".form-msg", f), btn = $('button[type="submit"]', f);
    if (!f.checkValidity()) { msg.textContent = "Il manque une info : vérifie les champs."; f.reportValidity(); return; }
    const d = new FormData(f);
    if (d.get("_gotcha")) return;
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
    } catch (err) {
      btn.disabled = false;
      msg.innerHTML = `Oups, l'envoi n'est pas passé. Réessaie, ou écris-moi à <a href="mailto:${C.marque.email}">${C.marque.email}</a>.`;
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

  /* ---------- Bandeau défilant ---------- */
  const marquee = $(".marquee-track");
  if (marquee) {
    const words = C.accueil.bandeau.map((w) => `<span>${w}</span><i>✦</i>`).join("");
    marquee.innerHTML = words.repeat(6);
  }

  /* ---------- Page édition : variantes, tailles, précommande ---------- */
  if (page === "edition") {
    const E = C.edition;
    const car = $("#product-car");
    const euros = (n) => (Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")) + " €";
    const prixDe = (v) => parseFloat(String(v.prix).replace(",", ".")) || 0;
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

    /* Compteur : les chiffres du prix tournent quand il change */
    const roll = (el, text) => {
      const chars = [...text];
      const same = el.dataset.roll && el.childElementCount === chars.length &&
        chars.every((c, i) => /\d/.test(c) === el.children[i].classList.contains("rd"));
      if (!same) {
        el.dataset.roll = "1";
        el.setAttribute("aria-label", text);
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
    let showTotal = () => {};
    const pick = (v, fromCar) => {
      variant = v;
      roll($("#price"), v.prix);
      $$("button", vWrap).forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === v.id));
      if (!fromCar && car.goTo) car.goTo(E.variantes.indexOf(v));
      showTotal();
    };
    car.addEventListener("car:change", (e) => pick(E.variantes[e.detail], true));
    E.variantes.forEach((v) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.id = v.id;
      b.className = "swatch";
      b.innerHTML = `<span style="background:${v.id.startsWith("noir") ? "#0b0b0b" : "#f4f1ec"}"></span>${v.nom} · ${v.prix}`;
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
    /* Livraison, avec le total */
    const L = E.livraison;
    const frais = (km) => (km < L.gratuitSousKm ? 0 : Math.floor(km / L.trancheKm) * L.prixParTranche);
    const versCommune = (n) => n.startsWith("Les ") ? "aux " + n.slice(4) : n.startsWith("Le ") ? "au " + n.slice(3) : n.startsWith("La ") ? "à la " + n.slice(3) : "à " + n;
    const options = L.communes.map((c) => {
      const gosier = c.nom === "Le Gosier";
      const prix = frais(c.km);
      return {
        nom: gosier ? "Livraison au Gosier" : `Livraison ${versCommune(c.nom)}`,
        label: gosier ? "Gosier · livraison gratuite" : `Livraison ${versCommune(c.nom)} · ${prix ? "+ " + euros(prix) : "gratuit"}`,
        detail: gosier ? "" : `${c.nom}, environ ${c.km} km du Gosier`,
        prix
      };
    });
    const sel = $("#shipping");
    options.forEach((o, i) => sel.add(new Option(o.label, i)));
    let ship = options[0];
    showTotal = () => {
      roll($("#total"), euros(prixDe(variant) + ship.prix));
      $("#ship-note").textContent = ship.detail ? `${ship.detail} · ${ship.prix ? "frais " + euros(ship.prix) : "livraison offerte"}` : "";
    };
    sel.addEventListener("change", () => { ship = options[+sel.value]; showTotal(); });
    pick(variant, true);

    const poBtn = $("#precommande"), po = $("#po-form");
    const recap = () => `${E.nom} · ${variant.nom} · taille ${size} · ${ship.nom} (${ship.prix ? euros(ship.prix) : "gratuit"}) · Total ${euros(prixDe(variant) + ship.prix)}`;
    poBtn.addEventListener("click", () => {
      if (E.precommande.lienPaiement) {
        window.open(E.precommande.lienPaiement, "_blank", "noopener");
        return;
      }
      po.hidden = false;
      poBtn.hidden = true;
      poBtn.setAttribute("aria-expanded", "true");
      $("#po-recap").textContent = recap();
      $("input", po).focus();
    });
    /* le récap suit les choix faits après l'ouverture du formulaire */
    [$("#variants"), $("#sizes")].forEach((w) => w.addEventListener("click", () => { if (!po.hidden) $("#po-recap").textContent = recap(); }));
    sel.addEventListener("change", () => { if (!po.hidden) $("#po-recap").textContent = recap(); });
    po.addEventListener("submit", (e) => {
      e.preventDefault();
      envoyer(po, {
        _subject: `Précommande ${E.nom} · ${variant.nom} · ${size} · ${ship.nom}`,
        type: "Précommande",
        edition: `${E.nom} (${E.numero})`,
        modele: variant.nom,
        taille: size,
        prix: euros(prixDe(variant)),
        livraison: `${ship.nom} : ${ship.prix ? euros(ship.prix) : "gratuit"}`,
        total: euros(prixDe(variant) + ship.prix)
      }, E.precommande.merci);
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
