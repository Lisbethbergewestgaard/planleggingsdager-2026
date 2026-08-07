const SITE_PASSWORD = "SamEyde2026";
const AUTH_KEY = "planleggingsdager-2026-auth";

function unlockSite() {
  document.body.classList.remove("las");
  document.getElementById("passordport").classList.add("skjult");
  document.getElementById("sideinnhold").classList.remove("skjult");
}

function lockSite() {
  document.body.classList.add("las");
  document.getElementById("passordport").classList.remove("skjult");
  document.getElementById("sideinnhold").classList.add("skjult");
}

function checkPassword(password) {
  return password.trim() === SITE_PASSWORD;
}

function initAuth() {
  if (sessionStorage.getItem(AUTH_KEY) === "ok") {
    unlockSite();
    return;
  }

  lockSite();
  const form = document.getElementById("passord-skjema");
  const input = document.getElementById("passord-input");
  const error = document.getElementById("passord-feil");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.hidden = true;
    if (!checkPassword(input.value)) {
      error.hidden = false;
      input.select();
      return;
    }
    sessionStorage.setItem(AUTH_KEY, "ok");
    unlockSite();
  });

  input.focus();
}

initAuth();
