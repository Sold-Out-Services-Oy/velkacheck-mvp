const form = document.getElementById("velkaForm");
const tulos = document.getElementById("tulos");
const riskBadge = document.getElementById("riskBadge");
const selitys = document.getElementById("selitys");
const bulletit = document.getElementById("bulletit");
const luoLuonnosBtn = document.getElementById("luoLuonnos");
const poistopyyntoTeksti = document.getElementById("poistopyyntoTeksti");

function arvioiRiski(data) {
  let otsikko = "Tilanne näyttää normaalilta";
  let variLuokka = "badge--green";
  let selitysTeksti = "Tilanteessa ei näy merkittävää riskiä.";
  const huomiot = [];

  if (data.velkatyyppi === "Ulosotto") {
    otsikko = "Tilanne vaatii tarkempaa selvitystä";
    variLuokka = "badge--yellow";
    selitysTeksti = "Ulosotto vaatii tarkempaa analyysiä.";
    huomiot.push("Ulosotto kannattaa tarkistaa.");
  }

  return {
    otsikko,
    variLuokka,
    selitysTeksti,
    huomiot
  };
}

function renderoiTulos(arvio) {
  riskBadge.textContent = arvio.otsikko;
  riskBadge.className = `badge ${arvio.variLuokka}`;
  selitys.textContent = arvio.selitysTeksti;

  bulletit.innerHTML = "";
  arvio.huomiot.forEach((kohta) => {
    const li = document.createElement("li");
    li.textContent = kohta;
    bulletit.appendChild(li);
  });

  tulos.classList.remove("hidden");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    velkatyyppi: document.getElementById("velkatyyppi").value
  };

  const arvio = arvioiRiski(data);
  renderoiTulos(arvio);
});

luoLuonnosBtn?.addEventListener("click", () => {
  poistopyyntoTeksti.value = "Poistopyyntö luotu (testiversio).";
});


