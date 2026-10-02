import fs from "fs";
import path from "path";
import ZAI from "z-ai-web-dev-sdk";

const OUT = "public/demo";
fs.mkdirSync(OUT, { recursive: true });

const JOBS = [
  {
    file: "art1.png",
    prompt:
      "Egyptian old Cairo street at sunset, warm oil painting style, textured brushstrokes, ochre and terracotta palette, fine art, high quality, detailed artwork",
  },
  {
    file: "art2.png",
    prompt:
      "Abstract expressionist painting of the Nile river at dusk, bold acrylic strokes, deep blue and gold tones, contemporary fine art canvas, high quality",
  },
  {
    file: "art3.png",
    prompt:
      "Still life painting of pomegranates and a brass lantern on a wooden table, classical realism oil painting, dramatic warm light, high quality artwork",
  },
  {
    file: "art4.png",
    prompt:
      "Portrait painting of an Egyptian woman wearing a colorful headscarf, bold watercolor and ink style, expressive brushwork, modern fine art, high quality",
  },
  {
    file: "art5.png",
    prompt:
      "Luxor temple columns with hieroglyphs, stylized gouache painting, sandy warm colors, soft shadows, fine art poster style, high quality",
  },
  {
    file: "art6.png",
    prompt:
      "Surreal minimalist painting of a red boat floating on a calm mirror-like sea under pastel sky, dreamlike fine art, oil on canvas, high quality",
  },
  {
    file: "p1.png",
    prompt:
      "Studio portrait photograph of a young Egyptian male artist holding a paintbrush, warm smile, apron with paint stains, art studio background, soft light, professional photo",
    size: "768x1344",
  },
  {
    file: "p2.png",
    prompt:
      "Studio portrait photograph of a young Egyptian female artist with curly hair and colorful painted hands, confident smile, art studio background, soft light, professional photo",
    size: "768x1344",
  },
  {
    file: "p3.png",
    prompt:
      "Studio portrait photograph of a middle-aged Egyptian male sculptor with glasses and beard, thoughtful expression, studio background with clay sculptures, professional photo",
    size: "768x1344",
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const job of JOBS) {
    const outPath = path.join(OUT, job.file);
    if (fs.existsSync(outPath)) {
      console.log(`skip ${job.file}`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: job.prompt,
          size: job.size || "1024x1024",
        });
        const b64 = res?.data?.[0]?.base64;
        if (!b64) throw new Error("no image data");
        fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
        console.log(`ok ${job.file}`);
        ok = true;
      } catch (e) {
        console.log(`attempt ${attempt} failed for ${job.file}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 4000 * attempt));
      }
    }
    if (!ok) console.log(`FAILED ${job.file}`);
    await new Promise((r) => setTimeout(r, 2500));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
