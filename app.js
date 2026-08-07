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

function buildPersonalWeek(teacher) {
  const rotations = [];
  if (teacher.a) rotations.push("A");
  if (teacher.b) rotations.push("B");
  if (teacher.c) rotations.push("C");

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
    notes.push("I rotasjon C står bare rom B230 — ingen klasse er oppgitt. Bekreft med ledelsen hva som gjelder for deg onsdag.");
  }

  const tue = [];
  const wed = [];

  // Tirsdag: prioriter fellesfagsslots fra egne rotasjoner
  if (teacher.a) {
    tue.push(row("08.15–09.30", "Elev- og oppstartsfokus", {
      list: ["Elevinformasjon", "Oppstart, klassemiljø, klasseregler, første skoleuke"],
      important: true,
    }));
    tue.push(row("09.30–11.30", "Helhetlig opplæring — gruppe A", {
      text: "Sosial læring, demokrati og medborgerskap",
      important: true,
    }));
  }

  if (teacher.b && !teacher.a) {
    tue.push(row("08.15–10.30", "Individuell planlegging", {
      text: "Avdelingstid er for programfagslærere. Som fellesfagslærer: planlegg selv, eller jobb i en annen rotasjon.",
    }));
  }

  if (teacher.b) {
    tue.push(row("10.30–11.30", "KI-plan med Christian", {
      rooms: ["Auditoriet"],
      important: true,
    }));
  } else if (teacher.a && !teacher.c) {
    // A-only: KI onsdag
  } else if (!teacher.a && !teacher.b && teacher.c) {
    tue.push(row("08.15–11.30", "Individuell planlegging", {
      text: "Avdelingstid er for programfagslærere. Som fellesfagslærer: planlegg selv, eller jobb i en annen rotasjon.",
    }));
  }

  tue.push(row("11.30–12.30", "Lunsj fra kantinen", { lunch: true }));

  if (teacher.c && !teacher.b) {
    tue.push(row("12.30–13.30", "KI-plan med Christian", {
      rooms: ["Auditoriet"],
      important: true,
    }));
    tue.push(row("13.30–15.30", "Individuell planlegging", {
      text: "Avdelingstid er for programfagslærere. Som fellesfagslærer: planlegg selv, eller jobb i en annen rotasjon.",
    }));
  }

  if (teacher.b) {
    tue.push(row("12.30–13.45", "Elev- og oppstartsfokus", {
      list: ["Elevinformasjon", "Oppstart, klassemiljø, klasseregler"],
      important: true,
    }));
    tue.push(row("13.45–15.30", "Helhetlig opplæring — gruppe B", {
      text: "Sosial læring, demokrati og medborgerskap",
      important: true,
    }));
  } else if (teacher.a && !teacher.c) {
    tue.push(row("12.30–15.30", "Individuell planlegging", {
      text: "Avdelingstid er for programfagslærere. Som fellesfagslærer: planlegg selv, eller jobb i en annen rotasjon.",
    }));
  }

  // Onsdag
  if (teacher.c) {
    wed.push(row("08.15–09.30", "Elev- og oppstartsfokus", {
      list: ["Elevinformasjon", "Oppstart, klassemiljø, klasseregler"],
      important: true,
    }));
    wed.push(row("09.30–11.30", "Helhetlig opplæring — gruppe C", {
      text: "Sosial læring, demokrati og medborgerskap",
      important: true,
    }));
  } else if (teacher.a || teacher.b) {
    wed.push(row("08.15–10.30", "Individuell planlegging", {
      text: "Avdelingstid er for programfagslærere. Som fellesfagslærer: planlegg selv, eller jobb i en annen rotasjon.",
    }));
    if (teacher.a || (teacher.b && !teacher.c)) {
      wed.push(row("10.30–11.30", "KI-plan med Christian", {
        rooms: ["Auditoriet"],
        important: true,
      }));
    }
  }

  wed.push(row("11.30–12.30", "Lunsj — egen niste", { lunch: true }));
  wed.push(row("12.30–15.00", "Planlegging", {
    text: "Individuelt eller i samarbeid. Avtaler gjør dere selv.",
  }));
  wed.push(row("15.00–15.30", "Kort samling: Er vi klare til skolestart?", {
    rooms: ["Realfag: H201"],
  }));

  const tueEm = rotations.includes("B") && rotations.includes("A")
    ? "rotasjon A + B"
    : rotations.includes("B")
      ? "rotasjon B"
      : rotations.includes("A")
        ? "rotasjon A"
        : rotations.includes("C")
          ? "rotasjon C"
          : "";

  const wedEm = rotations.includes("C")
    ? "rotasjon C"
    : rotations.length
      ? `rotasjon ${rotations.join(" + ")}`
      : "";

  return `
    <div class="taggrad">${tags.join("")}</div>
    <div class="dag">
      <h3>Mandag 10.08 <em>felles for alle</em></h3>
      ${row("08.15–11.00", "Fellesprogram i auditoriet", {
        text: "Se «Mandag» under — helt likt for alle rotasjoner.",
      })}
      ${row("12.30–15.30", "Avdeling: Realfag og KK", { rooms: ["H201"] })}
    </div>
    <div class="dag">
      <h3>Tirsdag 11.08 <em>${esc(tueEm)}</em></h3>
      ${tue.join("")}
    </div>
    <div class="dag">
      <h3>Onsdag 12.08 <em>${esc(wedEm)}</em></h3>
      ${wed.join("")}
    </div>
    ${notes
      .map(
        (n) =>
          `<div class="notat"><b>Å avklare:</b> ${esc(n)}</div>`
      )
      .join("")}
  `;
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

function renderWeek(teacherId) {
  const teacher = teachers.find((t) => t.id === teacherId) || teachers[0];
  const select = document.getElementById("larer-velger");
  select.value = teacher.id;
  document.getElementById("minuke-innhold").innerHTML = buildPersonalWeek(teacher);
  renderTable(teacher.id);
  localStorage.setItem(STORAGE_KEY, teacher.id);
}

function init() {
  const select = document.getElementById("larer-velger");
  select.innerHTML = teachers
    .map((t) => `<option value="${t.id}">${esc(t.name)}</option>`)
    .join("");

  const saved = localStorage.getItem(STORAGE_KEY);
  const startId = teachers.some((t) => t.id === saved) ? saved : "lisbeth";
  renderWeek(startId);

  select.addEventListener("change", () => {
    renderWeek(select.value);
  });

  document.getElementById("larertabell").addEventListener("click", (event) => {
    const btn = event.target.closest("button.navn");
    if (!btn) return;
    renderWeek(btn.dataset.id);
    document.getElementById("minuke").scrollIntoView({ behavior: "smooth" });
  });
}

init();
