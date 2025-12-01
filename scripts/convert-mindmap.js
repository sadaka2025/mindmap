import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

// dossier d'entrée = contient les fichiers .mma
const INPUT_DIR = "public/lib/courses/mapmma";

// dossier de sortie = json final après التحويل
const OUTPUT_DIR = "public/lib/courses/mapjson";

// créer le dossier output s’il n’existe pas
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Ici ضع دالتك الخاصة التي تحول project.json إلى الخريطة النهائية
 * convertMindmap()
 */
function convertMindmap(projectJson) {
  // ===== EXEMPLE =====
  // ترجع البيانات بدون تغيير (ضع كودك الحقيقي هنا)
  return projectJson;
}

/**
 * Lire tous les fichiers .mma داخل المجلد INPUT_DIR
 */
function getAllMMAFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mma"))
    .map((f) => path.join(dir, f));
}

/**
 * Convertir un fichier .mma -> .json
 */
function convertMMAFile(inputPath) {
  const zip = new AdmZip(inputPath);

  const entry = zip.getEntry("project.json");
  if (!entry) {
    console.warn("⚠ Aucune project.json trouvée dans:", inputPath);
    return;
  }

  const projectJson = JSON.parse(zip.readAsText(entry));

  // convertir عبر الدالة الخاصة بك
  const outJson = convertMindmap(projectJson);

  // output path
  const baseName = path.basename(inputPath, ".mma");
  const outputPath = path.join(OUTPUT_DIR, baseName + ".json");

  fs.writeFileSync(outputPath, JSON.stringify(outJson, null, 2), "utf-8");

  console.log("✔ Converti :", outputPath);
}

/**
 * MAIN – exécuter tous les fichiers .mma
 */
function main() {
  const mmaFiles = getAllMMAFiles(INPUT_DIR);

  if (mmaFiles.length === 0) {
    console.log("Aucun fichier .mma trouvé dans", INPUT_DIR);
    return;
  }

  console.log("🔍 Fichiers trouvés :", mmaFiles.length);

  for (const file of mmaFiles) {
    convertMMAFile(file);
  }

  console.log("\n🎉 Conversion terminée !");
}

main();
