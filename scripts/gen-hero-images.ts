// One-off: the hero corridor's photos, made with the image hand so no stock licence is involved. `bun run scripts/gen-hero-images.ts`.
import { writeFileSync } from "node:fs";
import { OpenRouterImages } from "../src/tools/providers/misc.ts";

const key = process.env.OPENROUTER_API_KEY;
if (!key) throw new Error("OPENROUTER_API_KEY missing");
const gen = new OpenRouterImages(key, process.env.IMAGE_MODEL);
const style = "Candid editorial photograph, natural daylight, warm film look, shallow depth of field, real people, no text, no logos, square crop.";
const shots: [string, string][] = [
  ["family", "A multigenerational family laughing together around a kitchen table, grandmother, parents and two kids, relaxed Sunday morning."],
  ["couple", "A couple in their thirties holding hands walking down a city street at golden hour, seen from behind, slightly out of focus storefronts."],
  ["gifts", "A stack of wrapped gifts in colourful paper with ribbons on a wooden table, a hand placing a small card on top."],
  ["friends", "Four friends at a long dinner table outdoors at night, string lights, clinking glasses, mid-laugh."],
  ["ski", "Three friends in ski jackets on a snowy mountain terrace with a chalet behind them, bright sun, laughing with hot drinks."],
  ["unboxing", "Two housemates unboxing a delivery of matcha tins and ceramics on a kitchen counter, excited, morning light."],
];
for (const [name, prompt] of shots) {
  const r = await gen.generate({ prompt: `${style} ${prompt}` });
  const ext = r.mimeType === "image/jpeg" ? "jpg" : r.mimeType.split("/")[1];
  const path = `web/img/hero-${name}.${ext}`;
  writeFileSync(path, Buffer.from(r.imageBase64, "base64"));
  console.log(path, Math.round(Buffer.byteLength(r.imageBase64, "base64") / 1024), "KB");
}
