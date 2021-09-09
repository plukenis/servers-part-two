import express from "express";

const PORT = 3000;
const WEB = "web";

let nextId = 1;
const zmones = [
  {
    id: nextId++,
    vardas: "Jonas",
    pavarde: "Jonaitis",
    alga: 7234.56,
  },
  {
    id: nextId++,
    vardas: "Petras",
    pavarde: "Petraitis",
    alga: 750,
  },
  {
    id: nextId++,
    vardas: "Antanas",
    pavarde: "Antanaitis",
    alga: 750,
  },
];

const app = express();

app.use(express.static(WEB, {
  index: ["index.html"],
}));
app.use(express.urlencoded({
  extended: true,
}));

app.get("/labas", (req, res) => {
  console.log(req.ip);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query);
  res.send("labas");
});

app.get("/zmones", (req, res) => {
  let html = "";
  html += "<html>\r\n";
  html += "<body>\r\n";
  html += "<h1>Žmonių sąrašas</h1>\r\n";
  html += '<a href="/zmogusEdit">Naujas</a>\r\n';
  html += "<ul>\r\n";
  for (const zmogus of zmones) {
    html += `
    <li>
    <a href="/zmogusEdit?id=${zmogus.id}">${zmogus.vardas} ${zmogus.pavarde}</a> ${zmogus.alga}
    <a href="/zmogusDelete?id=${zmogus.id}">X</a>
    </li>
    `;
  }
  html += "</ul>\r\n";
  html += "</body>\r\n";
  html += "</html>\r\n";
  res.send(html);
});

app.get("/zmogusEdit", (req, res) => {
  let zmogus;
  if (req.query.id) {
    const id = parseInt(req.query.id);
    zmogus = zmones.find((e) => e.id === id);
    if (!zmogus) {
      res.redirect("/zmones");
      return;
    }
  }
  // jei zmogus yra undefined - vadinasi kursim nauja
  // jei zmogus rodo i objekta - redaguosim
  let html = "";
  html += "<html>\r\n";
  html += "<body>\r\n";
  html += "<h1>Naujas zmogus</h1>\r\n";
  html += `<form action="/zmogusSave"}" method="POST">\r\n`;
  if (zmogus) {
    html += `<input type="hidden" name="id" value="${zmogus.id}"><br>\r\n`;
  }
  html += `Vardas: <input type="text" name="vardas" value="${
    (zmogus) ? zmogus.vardas : ""
  }"><br>\r\n`;
  html += `Pavarde: <input type="text" name="pavarde" value="${
    (zmogus) ? zmogus.pavarde : ""
  }"><br>\r\n`;
  html += `Alga: <input type="text" name="alga" value="${
    (zmogus) ? zmogus.alga : ""
  }"><br>\r\n`;
  html += '<input type="submit" value="Save"><br>\r\n';
  html += "</form>\r\n";
  html += '<a href="/zmones">Atgal</a>\r\n';
  html += "</body>\r\n";
  html += "</html>\r\n";
  res.send(html);
});

app.post("/zmogusSave", (req, res) => {
  let zmogus;
  if (req.body.id) {
    const id = parseInt(req.body.id);
    zmogus = zmones.find((e) => e.id === id);
    if (!zmogus) {
      res.redirect("/zmones");
      return;
    }
  }
  let klaidos = [];
  if (!req.body.vardas || req.body.vardas.trim() === "") {
    klaidos.push("Vardas negali buti tuscias");
  }
  if (!req.body.pavarde || req.body.pavarde.trim() === "") {
    klaidos.push("Pavarde negali buti tuscia");
  }
  let alga = parseFloat(req.body.alga);
  if (isNaN(alga)) {
    klaidos.push("Neteisingai ivesta alga");
  }
  if (klaidos.length > 0) {
    let html = "";
    html += "<html>\r\n";
    html += "<body>\r\n";
    html += "<h1>Blogi duomenys</h1>\r\n";
    html += "<h2>" + klaidos + "</h2>\r\n";
    html += `<a href="/zmogusEdit${(zmogus) ? "/?id=" + zmogus.id : ""}">Atgal</a>\r\n`;
    html += "</body>\r\n";
    html += "</html>\r\n";
    res.send(html);
  } else {
    if (zmogus) {
      zmogus.vardas = req.body.vardas;
      zmogus.pavarde = req.body.pavarde;
      zmogus.alga = req.body.alga;
    } else {
      zmones.push({
        id: nextId++,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga,
      });
    }
    res.redirect("/zmones");
  }
});

app.get("/zmogusDelete", (req, res) => {
  const id = parseInt(req.query.id);
  const index = zmones.findIndex((e) => e.id === id);
  if (index >= 0) {
    zmones.splice(index, 1);
  }
  res.redirect("/zmones");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
