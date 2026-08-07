// SHA-256 av passordet (ikke klartekst). Bytt ved å endre hash.
const PASSWORD_HASH =
  "462cf029b3ad80f6004d919902f2d970bd7374f66b49e2a388aaa82a4b0ab82d";
const AUTH_KEY = "planleggingsdager-2026-auth";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function unlockSite() {
  document.body.classList.remove("las");
  document.getElementById("passordport").hidden = true;
  document.getElementById("sideinnhold").hidden = false;
}

function lockSite() {
  document.body.classList.add("las");
  document.getElementById("passordport").hidden = false;
  document.getElementById("sideinnhold").hidden = true;
}

async function checkPassword(password) {
  const hash = await sha256(password.trim());
  return hash === PASSWORD_HASH;
}

async function initAuth() {
  if (sessionStorage.getItem(AUTH_KEY) === PASSWORD_HASH) {
    unlockSite();
    return;
  }

  lockSite();
  const form = document.getElementById("passord-skjema");
  const input = document.getElementById("passord-input");
  const error = document.getElementById("passord-feil");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;
    const ok = await checkPassword(input.value);
    if (!ok) {
      error.hidden = false;
      input.select();
      return;
    }
    sessionStorage.setItem(AUTH_KEY, PASSWORD_HASH);
    unlockSite();
  });

  input.focus();
}

initAuth();
