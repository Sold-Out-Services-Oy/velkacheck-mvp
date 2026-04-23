const form = document.getElementById("velkaForm");
const tulos = document.getElementById("tulos");
const riskBadge = document.getElementById("riskBadge");
const selitys = document.getElementById("selitys");
const bulletit = document.getElementById("bulletit");
const luoLuonnosBtn = document.getElementById("luoLuonnos");
const poistopyyntoTeksti = document.getElementById("poistopyyntoTeksti");
const kopioiTekstiBtn = document.getElementById("kopioiTeksti");

let viimeisinArvio = null;

function arvioiRiski(data) {
  const nykyVuosi = new Date().getFullYear();
  const velanIka = nykyVuosi - data.aloitusVuosi;
  const vuodetViimeMaksusta = nykyVuosi - data.viimeisinMaksuvuosi;

let riskitaso = "vihreä";
let variLuokka = "badge--green";
let otsikko = "Tilanne näyttää normaalilta";
let selitysTeksti = "Tietojen perusteella velkatilanteessa ei näy selviä merkkejä virheistä tai vanhentumisesta. Voit halutessasi tarkistaa tilanteen tarkemmin varmistaaksesi oikean lopputuloksen.";
const huomiot = [];

if (data.velkatyyppi === "Ulosotto" && velanIka > 15) {
  riskitaso = "punainen";
  variLuokka = "badge--red";
  otsikko = "Sinulla voi olla merkittävä mahdollisuus";
  selitysTeksti = "Tietojen perusteella velkatilanteessa voi olla mahdollisuus vanhentumiseen tai virheeseen. Tämä voi vaikuttaa velan määrään tai poistumiseen. Suosittelemme toimimaan nopeasti – tällä voi olla merkittävä vaikutus velkatilanteeseesi.";
  huomiot.push("Ulosoton täytäntöönpanokelpoisuus kannattaa tarkistaa viivytyksettä.");
}
} else if (data.velkatyyppi === "Elatusapu" || data.velkatyyppi === "Verovelka") {
  riskitaso = "keltainen";
  variLuokka = "badge--yellow";
  otsikko = "Tilanne vaatii tarkempaa selvitystä";
  selitysTeksti = "Velkatilanteessa on tekijöitä, jotka voivat vaikuttaa oikeuksiisi. Suosittelemme tarkempaa analyysiä ennen jatkotoimia. Tässä tilanteessa lisäselvitys voi johtaa merkittävään taloudelliseen hyötyyn.";

  if (data.velkatyyppi === "Elatusapu") {
    huomiot.push("Elatusapuasioissa vanhentuminen ja katkaisutoimet edellyttävät tarkempaa selvitystä.");
  } else {
    huomiot.push("Verovelan täytäntöönpanon määräajat ja katkaisutoimet kannattaa tarkistaa erikseen.");
  }
}

if (vuodetViimeMaksusta > 3) {
  huomiot.push("Maksujen ajoitus voi antaa aiheen lisäselvitykseen ja mahdolliseen takaisinsaantiin.");
}

if (data.ulosotossa === "Kyllä") {
  huomiot.push("Asia on tällä hetkellä ulosotossa, joten tilanteen tarkistaminen kannattaa tehdä viivytyksettä.");
} else {
  huomiot.push("Asia ei ole tällä hetkellä ulosotossa.");
}

  const maksusuhde = data.maksettuYhteensa / (data.maksettuYhteensa + data.jaljellaOlevaVelka || 1);
  if (maksusuhde >= 0.7) {
    huomiot.push("Suurin osa velasta on jo maksettu.");
  } else {
    huomiot.push("Jäljellä olevan velan osuus on vielä merkittävä.");
  }

  while (huomiot.length < 3) {
    huomiot.push("Suositus: kokoa kaikki maksutositteet jatkokäsittelyä varten.");
  }

return {
  riskitaso,
  variLuokka,
  otsikko,
  selitysTeksti,
  huomiot: huomiot.slice(0, 3),
  velanIka,
  vuodetViimeMaksusta,
};
}

function renderoiTulos(arvio) {
  riskBadge.textContent = arvio.otsikko || "Tilannearvio";
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

function luoPoistopyyntoTeksti(data, arvio) {
  return `Vastaanottaja: Toimivaltainen viranomainen

Aihe: Velan poistopyyntö

Pyydän arvioimaan velkatapaukseni poistamista tai kohtuullistamista seuraavilla tiedoilla:
- Velkatyyppi: ${data.velkatyyppi}
- Tuomion vuosi: ${data.tuomionVuosi}
- Velan aloitusvuosi: ${data.aloitusVuosi}
- Viimeisin maksuvuosi: ${data.viimeisinMaksuvuosi}
- Maksettu yhteensä: ${data.maksettuYhteensa.toFixed(2)} €
- Jäljellä oleva velka: ${data.jaljellaOlevaVelka.toFixed(2)} €
- Onko ulosotossa: ${data.ulosotossa}

Automaattinen arvio: ${arvio.otsikko || arvio.riskitaso}
Perustelu: ${arvio.selitysTeksti}

Ystävällisin terveisin,
[Oma nimi]`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = {
    velkatyyppi: document.getElementById("velkatyyppi").value,
    tuomionVuosi: Number(document.getElementById("tuomionVuosi").value),
    aloitusVuosi: Number(document.getElementById("aloitusVuosi").value),
    viimeisinMaksuvuosi: Number(document.getElementById("viimeisinMaksuvuosi").value),
    maksettuYhteensa: Number(document.getElementById("maksettuYhteensa").value),
    jaljellaOlevaVelka: Number(document.getElementById("jaljellaOlevaVelka").value),
    ulosotossa: document.getElementById("ulosotossa").value,
  };

  viimeisinArvio = { data, arvio: arvioiRiski(data) };
  renderoiTulos(viimeisinArvio.arvio);
});

luoLuonnosBtn.addEventListener("click", () => {
  if (!viimeisinArvio) {
    poistopyyntoTeksti.value = "Täytä ja arvioi tiedot ennen luonnoksen luontia.";
    return;
  }

  poistopyyntoTeksti.value = luoPoistopyyntoTeksti(viimeisinArvio.data, viimeisinArvio.arvio);
});

kopioiTekstiBtn.addEventListener("click", async () => {
  if (!poistopyyntoTeksti.value.trim()) {
    return;
  }

  try {
    await navigator.clipboard.writeText(poistopyyntoTeksti.value);
    kopioiTekstiBtn.textContent = "Kopioitu!";
    setTimeout(() => {
      kopioiTekstiBtn.textContent = "Kopioi asiakirja";
    }, 1200);
  } catch (error) {
    kopioiTekstiBtn.textContent = "Kopiointi epäonnistui";
  }
});
