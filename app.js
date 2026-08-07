const teachers = [
  { id: "gunnar", name: "Gunnar C", a: { label: "Vg1 ID" }, b: { label: "Vg1 FD" }, c: null },
  { id: "knut", name: "Knut Sverre", a: { label: "Vg1 TP" }, b: null, c: { label: "Vg1 HO" } },
  { id: "therese", name: "Therese", a: { label: "Vg1 TP" }, b: { label: "Vg1 EL" }, c: null },
  { id: "elisabeth", name: "Elisabeth", a: { label: "Vg2 ID" }, b: { label: "KK" }, c: { label: "Vg1 MK", room: "D236" } },
  { id: "hilde", name: "Hilde", a: { label: "Vg2 ID" }, b: { label: "Vg1 BA", room: "H148" }, c: null },
  { id: "unn", name: "Unn", a: { label: "Vg2 ID" }, b: { label: "Vg1 FD" }, c: { label: "Vg1 HO" } },
  { id: "halvor", name: "Halvor", a: { label: "Vg1 ID" }, b: { label: "Vg1 FD" }, c: { label: "Vg1 HO" } },
  { id: "galina", name: "Galina", a: { label: "Vg1 TP" }, b: { label: "Vg1 RM" }, c: null },
  { id: "maylinn", name: "Maylinn", a: null, b: { label: "Vg1 BA", room: "H148" }, c: { label: "Vg1 MK", room: "D236" } },
  { id: "mari", name: "Mari", a: null, b: null, c: { label: "Vg1 HO" } },
  { id: "torstein", name: "Torstein", a: null, b: { label: "Vg1 BA", room: "H148" }, c: { label: "Vg1 HO" } },
  { id: "kristin", name: "Kristin", a: null, b: { label: "Vg1 RM" }, c: { label: "Vg1 HO" } },
  { id: "lisbeth", name: "Lisbeth", a: null, b: { label: "Vg1 BA", room: "H148" }, c: { label: "IKO" } },
  { id: "janhelge", name: "Jan Helge", a: null, b: { label: "Vg1 RM" }, c: null },
  { id: "torunn", name: "Torunn", a: null, b: { label: "Vg1 RM" }, c: null },
  { id: "oyvind", name: "Øyvind", a: { label: "Vg1 ID" }, b: { label: "Vg1 FD" }, c: { label: null, room: "B230" } },
  { id: "maria", name: "Maria T", a: null, b: null, c: { label: "IKO" } },
];

const STORAGE_KEY = "planleggingsdager-2026-larer";
const VIEW_KEY = "planleggingsdager-2026-visning";

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cellHtml(slot) {
  if (!slot) return '<td class="tom">–</td>';
  const parts = [];
  if (slot.label) parts.push(esc(slot.label));
  if (slot.room) parts.push(`<span class="rk">${esc(slot.room)}</span>`);
  if (!parts.length) return '<td class="tom">–</td>';
  return `<td>${parts.join(" ")}</td>`;
}

function tagLabel(rot, slot) {
  if (!slot) return null;
  const bits = [`Rotasjon ${rot}`];
  if (slot.label) bits.push(slot.label);
  if (slot.room) bits.push(slot.room);
  return bits.join(" · ");
}

function row(tid, title, opts = {}) {
  const classes = ["rad"];
  if (opts.important) classes.push("viktig");
  if (opts.lunch) classes.push("lunsj");
  if (opts.pause) classes.push("pause");

  let body = `<b>${esc(title)}</b>`;
  if (opts.text) body += `<p>${esc(opts.text)}</p>`;
  if (opts.list?.length) {
    body += `<ul>${opts.list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }
  if (opts.rooms?.length) {
    body += opts.rooms.map((r) => `<span class="rom">${esc(r)}</span>`).join("");
  }

  return `<div class="${classes.join(" ")}"><div class="tid">${esc(tid)}</div><div class="hva">${body}</div></div>`;
}

function mondayRows() {
  return [
    row("08.15–09.15", "Line Marie og Jon sin time", {
      text: "Audun sitt kvarter — brannplan",
      rooms: ["Auditoriet"],
      important: true,
    }),
    row("09.15–09.30", "Pause", { pause: true }),
    row("09.30–09.55", "For pedagogisk personell", {
      list: ["Kontaktlærerperm (Ut-B)", "Helhetlig opplæring — startskudd"],
      important: true,
    }),
    row("10.00–11.00", "Elevdemokrati / klassens time (Ut-C)", { important: true }),
    row("11.30–12.30", "Lunsj — egen niste", { lunch: true }),
    row("12.30–13.00", "Oppstart avdeling", {
      rooms: ["Realfag og KK: H201"],
      important: true,
    }),
    row("13.00–14.00", "Individuell tid", {
      list: [
        "Orienter deg i timeplanen",
        "Hvem skal du samarbeide med i år?",
        "Ta med spørsmål til møtet kl. 14.15",
      ],
    }),
    row("14.15–15.30", "Avdelingsmøte", {
      list: [
        "Ønsker til samarbeid og puljestruktur",
        "Mandagsmøteplan",
        "Samtalestruktur elev-/fagsamtale",
        "Enkeltvedtak og IOP skal skrives i VIS",
      ],
      rooms: ["H201"],
      important: true,
    }),
  ].join("");
}

function tuesdayRows(teacher) {
  const rows = [];

  if (teacher.a) {
    rows.push(
      row("08.15–09.30", "Elev- og oppstartsfokus", {
        list: ["Elevinformasjon", "Oppstart, klassemiljø, klasseregler, første skoleuke"],
        important: true,
      }),
      row("09.30–11.30", "Helhetlig opplæring — gruppe A", {
        text: "Sosial læring, demokrati og medborgerskap",
        important: true,
      })
    );
  }

  if (teacher.b && !teacher.a) {
    rows.push(
      row("08.15–10.30", "Individuell planlegging", {
        text: "Avdelingstid er for programfagslærere. Du planlegger selv, eller jobber i en annen rotasjon.",
      })
    );
  }

  if (teacher.b) {
    rows.push(
      row("10.30–11.30", "KI-plan med Christian", {
        rooms: ["Auditoriet"],
        important: true,
      })
    );
  } else if (!teacher.a && teacher.c) {
    rows.push(
      row("08.15–11.30", "Individuell planlegging", {
        text: "Avdelingstid er for programfagslærere. Du planlegger selv, eller jobber i en annen rotasjon.",
      })
    );
  }

  rows.push(row("11.30–12.30", "Lunsj fra kantinen", { lunch: true }));

  if (teacher.b) {
    rows.push(
      row("12.30–13.45", "Elev- og oppstartsfokus", {
        list: ["Elevinformasjon", "Oppstart, klassemiljø, klasseregler"],
        important: true,
      }),
      row("13.45–15.30", "Helhetlig opplæring — gruppe B", {
        text: "Sosial læring, demokrati og medborgerskap",
        important: true,
      })
    );
  } else if (teacher.c) {
    rows.push(
      row("12.30–13.30", "KI-plan med Christian", {
        rooms: ["Auditoriet"],
        important: true,
      }),
      row("13.30–15.30", "Individuell planlegging", {
        text: "Avdelingstid er for programfagslærere. Du planlegger selv, eller jobber i en annen rotasjon.",
      })
    );
  } else if (teacher.a) {
    rows.push(
      row("12.30–15.30", "Individuell planlegging", {
        text: "Avdelingstid er for programfagslærere. Du planlegger selv, eller jobber i en annen rotasjon.",
      })
    );
  }

  return rows.join("");
}

function wednesdayRows(teacher) {
  const rows = [];

  if (teacher.c) {
    rows.push(
      row("08.15–09.30", "Elev- og oppstartsfokus", {
        list: ["Elevinformasjon", "Oppstart, klassemiljø, klasseregler"],
        important: true,
      }),
      row("09.30–11.30", "Helhetlig opplæring — gruppe C", {
        text: "Sosial læring, demokrati og medborgerskap",
        important: true,
      })
    );
  } else if (teacher.a || teacher.b) {
    rows.push(
      row("08.15–10.30", "Individuell planlegging", {
        text: "Avdelingstid er for programfagslærere. Du planlegger selv, eller jobber i en annen rotasjon.",
      })
    );
    if (teacher.a || teacher.b) {
      rows.push(
        row("10.30–11.30", "KI-plan med Christian", {
          rooms: ["Auditoriet"],
          important: true,
        })
      );
    }
  }

  rows.push(
    row("11.30–12.30", "Lunsj — egen niste", { lunch: true }),
    row("12.30–15.00", "Planlegging", {
      text: "Individuelt eller i samarbeid. Avtaler gjør dere selv.",
    }),
    row("15.00–15.30", "Kort samling: Er vi klare til skolestart?", {
      rooms: ["Realfag: H201"],
      important: true,
    })
  );

  return rows.join("");
}

function dayEm(teacher, day) {
  const rotations = [];
  if (teacher.a) rotations.push("A");
  if (teacher.b) rotations.push("B");
  if (teacher.c) rotations.push("C");

  if (day === "tue") {
    if (teacher.a && teacher.b) return "rotasjon A + B";
    if (teacher.b) return "rotasjon B";
    if (teacher.a) return "rotasjon A";
    if (teacher.c) return "rotasjon C";
  }
  if (day === "wed") {
    if (teacher.c) return "rotasjon C";
    if (rotations.length) return `rotasjon ${rotations.join(" + ")}`;
  }
  return "";
}

function buildPersonalWeek(teacher) {
  const tags = [];
  const aTag = tagLabel("A", teacher.a);
  const bTag = tagLabel("B", teacher.b);
  const cTag = tagLabel("C", teacher.c);
  if (aTag) tags.push(`<span class="tagg tA">${esc(aTag)}</span>`);
  if (bTag) tags.push(`<span class="tagg tB">${esc(bTag)}</span>`);
  if (cTag) tags.push(`<span class="tagg tC">${esc(cTag)}</span>`);
  tags.push('<span class="tagg tN">Avdeling: Realfag · H201</span>');

  const notes = [];
  if (teacher.c?.label === "IKO") {
    notes.push(
      "Du står som IKO i rotasjon C, ikke som kontaktlærer for en klasse. Sjekk med avdelingsleder om onsdagens «Elev- og oppstartsfokus» 08.15–09.30 gjelder deg, eller om du bare skal på gruppe C 09.30–11.30."
    );
  }
  if (teacher.id === "oyvind") {
    notes.push(
      "I rotasjon C står bare rom B230 — ingen klasse er oppgitt. Bekreft med ledelsen hva som gjelder for deg onsdag."
    );
  }

  return `
    <div class="taggrad">${tags.join("")}</div>
    <div class="dag">
      <h3>Mandag 10. august <em>felles for alle</em></h3>
      ${mondayRows()}
    </div>
    <div class="dag">
      <h3>Tirsdag 11. august <em>${esc(dayEm(teacher, "tue"))}</em></h3>
      ${tuesdayRows(teacher)}
    </div>
    <div class="dag">
      <h3>Onsdag 12. august <em>${esc(dayEm(teacher, "wed"))}</em></h3>
      ${wednesdayRows(teacher)}
    </div>
    ${notes.map((n) => `<div class="notat"><b>Å avklare:</b> ${esc(n)}</div>`).join("")}
  `;
}

function renderNameList(activeId) {
  const list = document.getElementById("navneliste");
  list.innerHTML = teachers
    .map((t) => {
      const active = t.id === activeId ? " aktiv" : "";
      const rots = [
        t.a ? "A" : null,
        t.b ? "B" : null,
        t.c ? "C" : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `<button type="button" class="navneknapp${active}" data-id="${t.id}">
        <span class="navneknapp-navn">${esc(t.name)}</span>
        <span class="navneknapp-rot">Rotasjon ${esc(rots)}</span>
      </button>`;
    })
    .join("");
}

function renderTable(activeId) {
  const tbody = document.getElementById("larertabell");
  tbody.innerHTML = teachers
    .map((t) => {
      const meg = t.id === activeId ? ' class="meg"' : "";
      return `<tr${meg}>
        <td><button type="button" class="navn" data-id="${t.id}">${esc(t.name)}</button></td>
        ${cellHtml(t.a)}
        ${cellHtml(t.b)}
        ${cellHtml(t.c)}
      </tr>`;
    })
    .join("");
}

function showPersonal(teacherId) {
  const teacher = teachers.find((t) => t.id === teacherId) || teachers[0];
  document.body.classList.add("modus-personlig");
  document.body.classList.remove("modus-oversikt");

  document.getElementById("start").hidden = true;
  document.getElementById("felles-oversikt").hidden = true;
  document.getElementById("minuke").hidden = false;

  document.getElementById("minuke-eyebrow").textContent = "Din timeplan · 10.–12. august";
  document.getElementById("minuke-tittel").textContent = teacher.name;
  document.getElementById("minuke-ingress").textContent =
    "Bare det som gjelder deg disse tre dagene — basert på rotasjonene du står i.";
  document.getElementById("minuke-innhold").innerHTML = buildPersonalWeek(teacher);

  renderNameList(teacher.id);
  renderTable(teacher.id);
  localStorage.setItem(STORAGE_KEY, teacher.id);
  localStorage.setItem(VIEW_KEY, "personlig");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showPicker() {
  document.body.classList.remove("modus-personlig", "modus-oversikt");
  document.getElementById("start").hidden = false;
  document.getElementById("minuke").hidden = true;
  document.getElementById("felles-oversikt").hidden = true;
  renderNameList(localStorage.getItem(STORAGE_KEY));
  localStorage.setItem(VIEW_KEY, "velg");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showOverview() {
  document.body.classList.add("modus-oversikt");
  document.body.classList.remove("modus-personlig");
  document.getElementById("start").hidden = false;
  document.getElementById("minuke").hidden = true;
  document.getElementById("felles-oversikt").hidden = false;
  renderNameList(localStorage.getItem(STORAGE_KEY));
  localStorage.setItem(VIEW_KEY, "oversikt");
  document.getElementById("mandag").scrollIntoView({ behavior: "smooth" });
}

function init() {
  renderTable(null);
  renderNameList(null);

  document.getElementById("navneliste").addEventListener("click", (event) => {
    const btn = event.target.closest("button.navneknapp");
    if (!btn) return;
    showPersonal(btn.dataset.id);
  });

  document.getElementById("larertabell").addEventListener("click", (event) => {
    const btn = event.target.closest("button.navn");
    if (!btn) return;
    showPersonal(btn.dataset.id);
  });

  document.getElementById("bytt-larer").addEventListener("click", showPicker);
  document.getElementById("vis-oversikt").addEventListener("click", showOverview);
  document.getElementById("apne-oversikt").addEventListener("click", (event) => {
    event.preventDefault();
    showOverview();
  });

  document.getElementById("nav-chips").addEventListener("click", (event) => {
    const link = event.target.closest("a[data-nav]");
    if (!link) return;
    if (link.dataset.nav === "velg") {
      event.preventDefault();
      showPicker();
      return;
    }
    if (document.body.classList.contains("modus-personlig")) {
      event.preventDefault();
      showOverview();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth" }), 50);
    }
  });

  const savedView = localStorage.getItem(VIEW_KEY);
  const savedId = localStorage.getItem(STORAGE_KEY);
  if (savedView === "personlig" && teachers.some((t) => t.id === savedId)) {
    showPersonal(savedId);
  } else if (savedView === "oversikt") {
    document.getElementById("felles-oversikt").hidden = false;
    document.body.classList.add("modus-oversikt");
  } else {
    document.getElementById("felles-oversikt").hidden = true;
  }
}

init();
