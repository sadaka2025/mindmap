import fs from "fs";
import OpenAI from "openai";

async function convertMindmap(apiKey) {
  try {
    if (!apiKey) throw new Error("❌ Aucun API key fourni en argument.");

    const client = new OpenAI({ apiKey });

    // -------------------------------
    // 🔧 Chemins personnalisés
    // -------------------------------
    const imagePath = "src/lib/courses/years/year2/s1/nahw/pngfile/nahw6.png";

    const outputPath =
      "src/lib/courses/years/year2/s1/nahw/jsonfile/nahw6test.json";

    // -------------------------------
    // 📥 Lecture du prompt maître
    // -------------------------------
    const prompt = fs.readFileSync("./scripts/prompt.txt", "utf8");

    // 📸 Lecture de l'image
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    console.log("📤 Envoi du prompt + image au modèle...");

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "input_image",
              image_url: `data:image/png;base64,${imageBase64}`,
            },
          ],
        },
      ],
      max_tokens: 8000,
      temperature: 0,
    });

    const jsonString = response.choices[0].message.content;

    const parsed = JSON.parse(jsonString);

    // 📁 Créer le dossier si nécessaire
    const dir = "src/lib/courses/years/year2/s1/nahw/jsonfile";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 💾 Sauvegarde
    fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2));

    console.log("✅ JSON généré :", outputPath);

    return parsed;
  } catch (err) {
    console.error("❌ Erreur:", err.message);
  }
}

// ------------------------------------------------------------
// 🎯 Lancement : clé OpenAI passée en argument
// ------------------------------------------------------------
const apiKey = process.argv[2];
convertMindmap(apiKey);
