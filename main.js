console.log("main.js wurde geladen");

let trick = 0, aufgaben = [], aktuelleFrageIndex = 0, richtig = 0, startZeit = 0, versuch = 0, aktuellesLevel = "leicht";

const tipps = {
  1: ["Beispiel: 52×11 → 5(5+2)2 = 572", "Ziffern addieren und in die Mitte setzen"],
  2: ["Nur bei Endziffer 5: vordere Zahl × (vordere Zahl +1), dann 25 anhängen"],
  3: ["Teilbar durch 3/9? Quersumme durch 3/9 teilbar!", "5? Endziffer ist 0 oder 5"],
  4: ["(a+b)² = a² + 2ab + b²", "(a−b)² = a² − 2ab + b²", "(a+b)(a−b) = a² − b²"],
  5: ["×5: ÷10×2", "×25: ÷4×100", "25×4 = 100"],
  6: ["Halbiere eine Zahl, verdopple die andere → Produkt bleibt gleich"],
  7: ["Kreuztrick: vorne×vorne, hinten×hinten, Kreuzprodukte dazwischen", "23×14 → 322"],
  8: ["98×96: 98−4=94, 2×4=8 → 9408"],
  9: ["Brüche addieren: Zähler kreuzweise, Nenner multiplizieren", "3/4+1/5 = 19/20"],
  10: ["Lerne das kleine 1x1 – falsche werden wiederholt."],
  11: ["Division = Umkehrung von Multiplikation"],
  12: ["Zuerst Klammer berechnen, dann multiplizieren"],
  13: ["10 % = ÷10, 25 % = ÷4", "Prozentangabe als Bruch", "20 % von 50 = 10"],
  14: ["×10 → Komma 1 Stelle rechts", "÷10 → Komma 1 Stelle links", "1 m = 100 cm", "1 kg = 1000 g", "Achte auf Kommastellen!"],
  16: ["Rechne mit negativen und positiven Zahlen:\n– Ein Minus vor der Zahl bedeutet: nach links auf der Zahlengeraden.\n– Zwei Minuszeichen (− −) werden zu Plus.\n– Beispiel: 3 − (−2) = 5."]
};

const anleitungen = {
  1: "Multipliziere zweistellige Zahlen mit 11, indem du die Ziffern addierst und dazwischen setzt.",
  2: "Zahlen NUR mit Endziffer 5 quadrieren: vordere Zahl × (vordere Zahl +1), dann 25 hinterher - Rest ignorieren",
  3: "Teilbarkeitsregeln z.B. durch Quersumme (3/9) oder letzte Ziffer (5/10).",
  4: "Nutze binomische Formeln für schnelles Rechnen: (a+b)² usw.",
  5: "×5 ist wie ÷10×2, ×25 ist wie ÷4×100.",
  6: "Produkt bleibt beim Halbieren & Verdoppeln gleich: 16×25 = 8×50.",
  7: "Zwei zweistellige Zahlen multiplizieren: vorne × vorne, dann Kreuzprodukte usw.",
  8: "Bei Produkten nahe 100: Abstand bestimmen, subtrahieren, Kreuzprodukt anhängen.",
  9: "Bruch-Kreuzregel: Zähler kreuzweise, Nenner multiplizieren.",
  10: "Das 1x1 trainieren – falsch beantwortete Aufgaben kommen öfter.",
  11: "Division ist Umkehr von Multiplikation: 56 ÷ 7 → Welche Zahl ×7 ergibt 56?",
  12: "Ausmultiplizieren mit Klammern: (a+b)×c = ac + bc",
  13: "Prozent verstehen als Teil von 100: 25 % = ¼, 10 % = ÷10",
  14: "Kommaverschiebung bei Umrechnung: m→cm = ×100, ml→l = ÷1000",
  15: "da is noch nix",
  16: [
    "Zwei Minus ergeben ein Plus: 3 − (−2) = 3 + 2",
    "Minus vor der Klammer kehrt das Vorzeichen um",
    "Denk an die Zahlengerade: negativ = nach links, positiv = nach rechts",
    "3 + (−4) = 3 − 4 = −1"
  ]
};

const trickNamen = {
  1: "×11",
  2: "Quadrat mit 5-Endung",
  3: "Teilbarkeit",
  4: "Binomische Formeln",
  5: "×5 oder ×25",
  6: "Halbieren & Verdoppeln",
  7: "Zweistellige × Zweistellige",
  8: "× nahe 100",
  9: "Bruch-Kreuztrick",
  10: "1×1",
  11: "1÷1",
  12: "Klammertrick",
  13: "Prozentrechnen",
  14: "Komma & Einheiten",
  15: "Potenzen",
  16: "Positive & negative Zahlen"
};

function generiereAufgaben(nr) {
  const arr = [];
  const gespeicherteFehler = JSON.parse(localStorage.getItem("fehlerAufgaben") || "[]");
  const fehlerDiesesTricks = gespeicherteFehler.filter(f => f.trick === nr);
  const fehlerWiederholen = fehlerDiesesTricks.slice(0, 3);
  arr.push(...fehlerWiederholen);

  if (nr === 1) {
    const level = document.getElementById("level").value;
    let min, max;
    if (level === "leicht") { min = 1; max = 9; }
    else if (level === "mittel") { min = 1; max = 99; }
    else { min = 1; max = 999; }
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * (max - min + 1)) + min;
      arr.push({ frage: `${x} × 11`, korrekt: x * 11 });
    }

  } else if (nr === 2) {
    for (let i = 0; i < 10; i++) {
      const base = Math.floor(Math.random() * 90 / 10) * 10 + 5;
      arr.push({ frage: `${base}²`, korrekt: base ** 2 });
    }

  } else if (nr === 3) {
    for (let i = 0; i < 10; i++) {
      const zahl = Math.floor(Math.random() * 900 + 100);
      const teiler = [3, 5, 6, 9][Math.floor(Math.random() * 4)];
      const korrekt = zahl % teiler === 0 ? "ja" : "nein";
      arr.push({ frage: `Ist ${zahl} durch ${teiler} teilbar? (ja/nein)`, korrekt });
    }

  } else if (nr === 4) {
    let aMin, aMax, bMin, bMax, typListe;
    if (aktuellesLevel === "leicht") { aMin = 2; aMax = 5; bMin = 1; bMax = 3; typListe = ["+"]; }
    else if (aktuellesLevel === "mittel") { aMin = 5; aMax = 12; bMin = 1; bMax = 5; typListe = ["+", "-"]; }
    else { aMin = 10; aMax = 20; bMin = 2; bMax = 10; typListe = ["+", "-", "*"]; }
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
      const b = Math.floor(Math.random() * (bMax - bMin + 1)) + bMin;
      const typ = typListe[Math.floor(Math.random() * typListe.length)];
      let frage, korrekt;
      if (typ === "+") { frage = `(${a}+${b})²`; korrekt = (a + b) ** 2; }
      else if (typ === "-") { frage = `(${a}-${b})²`; korrekt = (a - b) ** 2; }
      else { frage = `(${a}+${b})×(${a}-${b})`; korrekt = a ** 2 - b ** 2; }
      arr.push({ frage, korrekt });
    }

  } else if (nr === 5 || nr === 6 || nr === 7 || nr === 8) {
    const level = document.getElementById("level").value;
    const genMinMax = (lvl, easy, mid, hard) => (lvl === "leicht" ? easy : (lvl === "mittel" ? mid : hard));
    const range = genMinMax(level, [5, 15], [10, 40], [30, 99]);
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
      let b;
      if (nr === 5) {
        b = [5, 25][Math.floor(Math.random() * 2)];
      } else if (nr === 6) {
        const potenzen = [4, 8, 16, 32, 64];
        b = potenzen[Math.floor(Math.random() * potenzen.length)];
      } else {
        b = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
      }
      arr.push({ frage: `${a} × ${b}`, korrekt: a * b });
    }

  } else if (nr === 9) {
    for (let i = 0; i < 10; i++) {
      const n1 = Math.floor(Math.random() * 8 + 2);
      const n2 = Math.floor(Math.random() * 8 + 2);
      const z1 = Math.floor(Math.random() * (n1 - 1) + 1);
      const z2 = Math.floor(Math.random() * (n2 - 1) + 1);
      arr.push({ frage: `${z1}/${n1} + ${z2}/${n2}`, korrekt: `${z1 * n2 + z2 * n1}/${n1 * n2}` });
    }

  } else if (nr === 10) {
    const level = document.getElementById("level").value;
    const max = level === "leicht" ? 5 : (level === "mittel" ? 10 : 12);
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * max) + 1;
      const b = Math.floor(Math.random() * max) + 1;
      arr.push({ frage: `${a} × ${b}`, korrekt: a * b });
    }

  } else if (nr === 11) {
    const level = document.getElementById("level").value;
    const max = level === "leicht" ? 5 : (level === "mittel" ? 10 : 12);
    for (let i = 0; i < 10; i++) {
      const b = Math.floor(Math.random() * max) + 1;
      const a = b * (Math.floor(Math.random() * max) + 1);
      arr.push({ frage: `${a} ÷ ${b}`, korrekt: a / b });
    }

  } else if (nr === 12) {
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * 10 + 1);
      const b = Math.floor(Math.random() * 10 + 1);
      const c = Math.floor(Math.random() * 5 + 1);
      arr.push({ frage: `(${a}+${b})×${c}`, korrekt: (a + b) * c });
    }

  } else if (nr === 13) {
    let prozentsätze, grundwertGen;
    if (aktuellesLevel === "leicht") {
      prozentsätze = [10, 25, 50];
      grundwertGen = () => Math.floor(Math.random() * 10 + 1) * 10;
    } else if (aktuellesLevel === "mittel") {
      prozentsätze = [5, 10, 20, 25, 50, 75];
      grundwertGen = () => Math.floor(Math.random() * 100 + 50);
    } else {
      prozentsätze = [2, 3, 4, 6, 12.5, 17, 33];
      grundwertGen = () => (Math.random() * 300 + 2).toFixed(1);
    }
    for (let i = 0; i < 10; i++) {
      const proz = prozentsätze[Math.floor(Math.random() * prozentsätze.length)];
      const grundwert = grundwertGen();
      const wert = parseFloat(grundwert) * (proz / 100);
      const korrekt = (Math.round(wert * 100) / 100).toString();
      arr.push({ frage: `Wie viel sind ${proz}% von ${grundwert}?`, korrekt });
    }

  } else if (nr === 14) {
    const level = aktuellesLevel;
    const typenLeicht = [
      { frage: "m → cm", faktor: 100, einheitA: "m", einheitB: "cm" },
      { frage: "kg → g", faktor: 1000, einheitA: "kg", einheitB: "g" },
      { frage: "l → ml", faktor: 1000, einheitA: "l", einheitB: "ml" },
      { frage: "×10", faktor: 10 },
    ];
    const typenMittel = [
      { frage: "cm → m", faktor: 0.01, einheitA: "cm", einheitB: "m" },
      { frage: "g → kg", faktor: 0.001, einheitA: "g", einheitB: "kg" },
      { frage: "ml → l", faktor: 0.001, einheitA: "ml", einheitB: "l" },
      { frage: "÷10", faktor: 0.1 },
      { frage: "×100", faktor: 100 },
    ];
    const typenSchwer = [
      { frage: "÷1000", faktor: 0.001 },
      { frage: "×1000", faktor: 1000 },
      { frage: "mm → m", faktor: 0.001, einheitA: "mm", einheitB: "m" },
    ];
    const festeAufgaben = [
      { frage: "Wie viele mm sind 1,3 cm?", korrekt: "13" },
      { frage: "Wie viele g sind 2,5 kg?", korrekt: "2500" },
      { frage: "0.025 km = ? m", korrekt: "25" },
      { frage: "Wie viele l sind 1500 ml?", korrekt: "1.5" },
      { frage: "0.84 × 10 = ?", korrekt: "8.4" },
      { frage: "Was ist mehr: 0.5 kg oder 300 g?", korrekt: "0.5 kg" },
      { frage: "0.012 m = ? mm", korrekt: "12" }
    ];
    const typen = level === "leicht" ? typenLeicht
                : level === "mittel" ? typenLeicht.concat(typenMittel)
                : typenLeicht.concat(typenMittel, typenSchwer);
    for (let i = 0; i < 6; i++) {
      const typ = typen[Math.floor(Math.random() * typen.length)];
      const basis = level === "leicht" ? (Math.random() * 9 + 1).toFixed(0)
                   : level === "mittel" ? (Math.random() * 50 + 1).toFixed(1)
                   : (Math.random() * 100).toFixed(3);
      const frage = typ.einheitA ? `${basis} ${typ.einheitA} = ? ${typ.einheitB}` : `${basis} ${typ.frage}`;
      const korrekt = (parseFloat(basis) * typ.faktor).toFixed(5).replace(/\.?0+$/, "");
      arr.push({ frage, korrekt });
    }
    festeAufgaben.sort(() => 0.5 - Math.random()).slice(0, 4).forEach(e => arr.push(e));

  } else if (nr === 15) {
    const aufgabenTypen = [
      () => { const a = Math.floor(Math.random() * 10 + 2); const e = Math.floor(Math.random() * 3 + 2);
              return { frage: `${a}^${e}`, korrekt: (a ** e).toString() }; },
      () => { const base = [2, 3, 5][Math.floor(Math.random() * 3)];
              const exp1 = Math.floor(Math.random() * 4 + 1);
              const exp2 = Math.floor(Math.random() * 4 + 1);
              return { frage: `${base}^${exp1} × ${base}^${exp2}`, korrekt: `${base}^${exp1 + exp2}` }; },
      () => { const base = [2, 10][Math.floor(Math.random() * 2)];
              const exp = Math.floor(Math.random() * 5 + 1);
              return { frage: `${base}^${exp} = ?`, korrekt: (base ** exp).toString() }; },
      () => { const base = [2, 3, 10][Math.floor(Math.random() * 3)];
              const exp1 = Math.floor(Math.random() * 4 + 2);
              const exp2 = Math.floor(Math.random() * 2 + 1);
              return { frage: `(${base}^${exp1})^${exp2}`, korrekt: `${base}^${exp1 * exp2}` }; }
    ];
    for (let i = 0; i < 10; i++) {
      const aufgabe = aufgabenTypen[Math.floor(Math.random() * aufgabenTypen.length)]();
      arr.push(aufgabe);
    }

  } else if (nr === 16) {
    const level = document.getElementById("level").value;
    const max = level === "leicht" ? 10 : (level === "mittel" ? 20 : 50);
    for (let i = 0; i < 10; i++) {
      let a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      if (Math.random() < 0.5) a = -a;
      if (Math.random() < 0.5) b = -b;
      const operator = Math.random() < 0.5 ? "+" : "-";
      const korrekt = operator === "+" ? a + b : a - b;
      let frage = `${a} ${operator} ${b}`;
      if (b < 0) frage = `${a} ${operator} (${b})`;
      arr.push({ frage, korrekt });
    }
  }

  return arr;
}

function loescheFehlerAufgaben() {
  localStorage.removeItem("fehlerAufgaben");
  alert("Alle gespeicherten Fehler wurden gelöscht.");
}

function zeigeMenue() {
  document.getElementById('spielbereich').style.display = 'none';
  document.getElementById('status').style.display = 'none';
  document.getElementById('menue').style.display = 'block';
  document.getElementById('emoji').textContent = "🙂";
}

function zeigeAnleitung() {
  alert(anleitungen[trick] || "Keine Anleitung verfügbar.");
}

function zeigeTipp() {
  const arr = tipps[trick] || [];
  const zufallsTipp = arr[Math.floor(Math.random() * arr.length)] || "Kein Tipp vorhanden.";
  document.getElementById('tipp').textContent = zufallsTipp;
}

function speichereFehlerAufgabe(aufgabe) {
  const fehlerListe = JSON.parse(localStorage.getItem("fehlerAufgaben") || "[]");
  fehlerListe.push(aufgabe);
  localStorage.setItem("fehlerAufgaben", JSON.stringify(fehlerListe));
}

function startTrick(nr) {
  trick = nr;
  const level = document.getElementById("level").value;
  aktuellesLevel = level;
  aufgaben = generiereAufgaben(nr);
  aktuelleFrageIndex = 0;
  richtig = 0;

  document.getElementById('menue').style.display = 'none';
  document.getElementById('spielbereich').style.display = 'block';

  const alteAnzeige = document.querySelector("#spielbereich .level-anzeige");
  if (alteAnzeige) alteAnzeige.remove();
  document.getElementById("fortschritt")
    .insertAdjacentHTML("beforebegin", `<p class="level-anzeige" style="color:#666">Level: ${level}</p>`);

  // Wichtig: true übergeben -> Focus im selben User-Event
  naechsteAufgabe(true);
}

function checkAntwort() {
  // Guard: keine Aufgabe mehr? raus.
  if (aktuelleFrageIndex >= aufgaben.length) return;

  const cur = aufgaben[aktuelleFrageIndex];
  if (!cur) return;

  const eingabe = document.getElementById('eingabe').value.trim().replace(",", ".").toLowerCase();
  const korrekt = String(cur.korrekt).toLowerCase();
  const dauer = ((Date.now() - startZeit) / 1000).toFixed(1);
  const feedback = document.getElementById('feedback');
  feedback.className = "";

  if (eingabe === korrekt) {
    feedback.textContent = `✅ Richtig! (${dauer} Sek.)`;
    feedback.classList.add("richtig");
    document.getElementById('emoji').textContent = "😄";
    richtig++;
    aktuelleFrageIndex++;
    setTimeout(naechsteAufgabe, 1000);
  } else {
    versuch++;
    document.getElementById('emoji').textContent = "🤔";
    feedback.classList.add("falsch");
    if (versuch < 2) {
      feedback.textContent = `❌ Leider falsch – versuch’s nochmal!`;
    } else {
      feedback.textContent = `❌ Leider falsch. Richtig war: ${korrekt}`;
      speichereFehlerAufgabe({ ...cur, trick });
      aktuelleFrageIndex++;
      setTimeout(naechsteAufgabe, 1500);
    }
  }
}

function naechsteAufgabe(fromUserGesture = false) {
  versuch = 0;
  document.getElementById('weiterBtn').style.display = 'none';
  document.getElementById('tipp').textContent = "";

  const eingabe = document.getElementById('eingabe');
  eingabe.value = "";

  const feedback = document.getElementById('feedback');
  feedback.textContent = "";
  feedback.className = "";

  if (aktuelleFrageIndex >= aufgaben.length) {
    zeigeStatus();
    return;
  }

  const aufgabe = aufgaben[aktuelleFrageIndex];
  document.getElementById('frage').textContent = aufgabe.frage;
  document.getElementById('fortschritt').textContent =
    `Frage ${aktuelleFrageIndex + 1} von ${aufgaben.length}`;

  // Inputmode/Pattern je nach Trick (für die iOS-Tastatur)
  if ([3, 16].includes(trick)) {
    // Text: für "ja/nein" bzw. Minuszeichen sicher
    eingabe.setAttribute("inputmode", "text");
    eingabe.setAttribute("pattern", ".*");
  } else if ([13, 14].includes(trick)) {
    // Dezimalzahlen inkl. Komma/Punkt und Minus erlauben
    eingabe.setAttribute("inputmode", "decimal");
    eingabe.setAttribute("pattern", "[-0-9.,]*");
  } else {
    // Reine Ziffern
    eingabe.setAttribute("inputmode", "numeric");
    eingabe.setAttribute("pattern", "[0-9]*");
  }
  eingabe.setAttribute("autocomplete", "off");
  eingabe.style.display = 'inline';

  // Fokus setzen (direkt bei User-Geste; sonst im nächsten Frame)
  const doFocus = () => {
    eingabe.focus({ preventScroll: true });
    try { eingabe.setSelectionRange(eingabe.value.length, eingabe.value.length); } catch {}
  };
  if (fromUserGesture) doFocus(); else requestAnimationFrame(doFocus);

  startZeit = Date.now();
}

function zeigeStatus() {
  const titel = trickNamen[trick] || `Trick #${trick}`;

  // Ansicht umschalten
  document.getElementById('spielbereich').style.display = 'none';
  document.getElementById('status').style.display = 'block';
  document.getElementById('emoji').textContent = "🎉";

  // Punkte & Sterne
  const punkte = richtig * 10;
  const anzahlSterne = Math.round((richtig / aufgaben.length) * 5);
  const sterne = '⭐️'.repeat(anzahlSterne) + '☆'.repeat(5 - anzahlSterne);

  // Lob-Text
  let lob = "";
  if (richtig === aufgaben.length) {
    lob = "🏆 Perfekt! Du bist ein Rechentrick-Profi!";
    konfetti();
  } else if (richtig >= aufgaben.length * 0.8) {
    lob = "👏 Super Leistung!";
  } else if (richtig >= aufgaben.length * 0.5) {
    lob = "💪 Weiter so!";
  } else {
    lob = "🧐 Übung macht den Meister!";
  }

  // Zusammenfassung schreiben (alles in EINEM Template-String mit Backticks!)
  const z = document.getElementById('zusammenfassung');
  z.innerText = `🧠 Thema: ${titel}
🧩 Level: ${aktuellesLevel}
Du hast ${richtig} von ${aufgaben.length} Aufgaben richtig gelöst.
🎯 Punkte: ${punkte}
${sterne}

${lob}`;

  // Auto-Level nur für bestimmte Tricks
  const levelTricks = [1, 4, 7, 8, 13, 14];
  if (levelTricks.includes(trick)) {
    const neuesLevel = (richtig >= 9) ? "schwer" : (richtig >= 6) ? "mittel" : "leicht";
    document.getElementById("level").value = neuesLevel;
    aktuellesLevel = neuesLevel;
    z.innerText += `\n📊 Dein Level wurde auf "${neuesLevel}" angepasst.`;
  }
}



function konfetti() {
  for (let i = 0; i < 25; i++) {
    const el = document.createElement("div");
    el.textContent = "🎉";
    el.className = "confetti";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `-${Math.random() * 20}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

// DOM bereit
window.addEventListener('DOMContentLoaded', () => {
  const eingabe = document.getElementById('eingabe');
  if (eingabe) {
    eingabe.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        checkAntwort();
      }
    });
  }

  document.getElementById('menue')?.addEventListener('click', (e) => {
    if (e.target.matches('.startTrickBtn')) {
      e.preventDefault();
      const trickNummer = parseInt(e.target.dataset.trick);
      startTrick(trickNummer);
    }
  });

  document.getElementById('okBtn')?.addEventListener('click', checkAntwort);
  document.getElementById('weiterBtn')?.addEventListener('click', naechsteAufgabe);
  document.getElementById('tippBtn')?.addEventListener('click', zeigeTipp);
  document.getElementById('zurueckBtn')?.addEventListener('click', zeigeMenue);

  const anleitungBtn = document.getElementById('anleitungBtn');
  if (anleitungBtn) {
    anleitungBtn.addEventListener('click', (e) => {
      e.preventDefault();
      zeigeAnleitung();
    });
  }
});

// Service Worker registrieren + Update anstoßen + Version anzeigen
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(async (reg) => {
      console.log("✅ Service Worker registriert", reg);

      // Nach Updates suchen
      reg.update?.();

      // Wenn schon ein neuer SW auf "waiting" steht → aktivieren
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      // Falls gerade ein neuer SW installiert wird → nach "installed" aktivieren
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });

      // Auf aktive Kontrolle warten, dann Version abfragen
      await navigator.serviceWorker.ready;
      const target = navigator.serviceWorker.controller || reg.active;
      target?.postMessage({ type: "GET_VERSION" });
    })
    .catch((err) => console.error("❌ SW Fehler:", err));

  // Nachricht vom SW empfangen (Version)
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "VERSION") {
      const el = document.getElementById("version");
      if (el) el.textContent = "Version: " + event.data.version;
    }
  });

  // Wenn der aktive SW wechselt → einmal neu laden
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
} else {
  // Fallback, falls kein SW (z. B. im dev-File://)
  const el = document.getElementById("version");
  if (el) el.textContent = "Version: dev";
}
