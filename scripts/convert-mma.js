import fs from "fs";
import path from "path";
import JSZip from "jszip";

async function extractMindMapNodes(mmaPath, outputPath = "extracted.json") {
  // Lire le fichier MMA (ZIP)
  const data = fs.readFileSync(mmaPath);
  const zip = await JSZip.loadAsync(data);

  // Afficher tous les fichiers internes
  console.log("Fichiers internes :", Object.keys(zip.files));

  // Chercher canvas.json ou project.json
  let jsonFile = zip.file("canvas.json") || zip.file("project.json");
  if (!jsonFile) {
    throw new Error("Aucun fichier JSON interne trouvé dans le MMA !");
  }

  // Lire et parser le JSON
  const content = await jsonFile.async("string");
  const json = JSON.parse(content);

  // Récupérer le root → children
  let root = null;

  // Pour canvas.json, souvent charts[0].root
  if (json.charts && json.charts[0]?.root) {
    root = json.charts[0].root;
  }
  // Sinon, pour project.json, vérifier s’il y a un canvas interne
  else if (json.canvas) {
    root = json.canvas.root || json.canvas;
  } else {
    throw new Error("Structure des nodes introuvable !");
  }

  // Sauvegarder le JSON extrait
  fs.writeFileSync(outputPath, JSON.stringify(root, null, 2), "utf-8");
  console.log(`✅ Extraction terminée ! JSON sauvegardé dans ${outputPath}`);
  return root;
}

// Utilisation
const mmaFile = path.resolve("public/lib/courses/mapmma/nahw2.mma"); // chemin vers ton fichier
extractMindMapNodes(mmaFile, "nah2_extracted.json")
  .then((root) => console.log("Root extrait :", root))
  .catch((err) => console.error(err));
