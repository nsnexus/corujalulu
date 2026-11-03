import { MAX_COMPANIONS, getPlan, getStyle, getTheme, getValue } from "@/lib/catalog";
import type { BookInput, Companion, Gender } from "@/lib/types";

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida e normaliza o payload do assistente. Lança Error com mensagem amigável. */
export function parseBookInput(raw: unknown): BookInput {
  const r = (raw ?? {}) as Record<string, any>;
  const c = r.child ?? {};

  const name = str(c.name, 40);
  if (name.length < 2) throw new Error("Informe o nome da criança.");
  const age = Math.round(Number(c.age));
  if (!Number.isFinite(age) || age < 0 || age > 12) throw new Error("Idade deve ser entre 0 e 12 anos.");
  const gender: Gender = ["menino", "menina", "neutro"].includes(c.gender) ? c.gender : "neutro";

  if (!getTheme(r.themeId)) throw new Error("Escolha um tema.");
  if (r.themeId === "custom" && str(r.customIdea, 400).length < 10) throw new Error("Conte um pouco mais sobre sua ideia de história.");
  if (!getValue(r.valueId)) throw new Error("Escolha uma mensagem.");
  if (!getStyle(r.styleId)) throw new Error("Escolha um estilo de ilustração.");
  if (!getPlan(r.planId)) throw new Error("Escolha um plano.");

  const companions: Companion[] = (Array.isArray(r.companions) ? r.companions : [])
    .slice(0, MAX_COMPANIONS)
    .map((p: any) => ({
      kind: ["pessoa", "pet", "brinquedo"].includes(p?.kind) ? p.kind : "pessoa",
      name: str(p?.name, 40),
      relation: str(p?.relation, 40),
      description: str(p?.description, 120),
    }))
    .filter((p: Companion) => p.name.length > 0);

  const b = r.buyer ?? {};
  const buyerName = str(b.name, 80);
  const email = str(b.email, 120).toLowerCase();
  const whatsapp = str(b.whatsapp, 20).replace(/\D/g, "");
  if (buyerName.length < 2) throw new Error("Informe seu nome.");
  if (!EMAIL.test(email)) throw new Error("E-mail inválido.");
  if (whatsapp && (whatsapp.length < 10 || whatsapp.length > 13)) throw new Error("WhatsApp inválido.");
  if (r.consent !== true) throw new Error("É preciso aceitar os termos.");

  return {
    child: {
      name,
      age,
      gender,
      hairColor: str(c.hairColor, 30),
      hairType: str(c.hairType, 30),
      hairLength: str(c.hairLength, 30),
      skinTone: str(c.skinTone, 30),
      eyeColor: str(c.eyeColor, 30),
      glasses: c.glasses === true,
      favoriteColor: str(c.favoriteColor, 30),
      likes: str(c.likes, 200),
    },
    companions,
    themeId: r.themeId,
    customIdea: str(r.customIdea, 400),
    valueId: r.valueId,
    styleId: r.styleId,
    dedication: str(r.dedication, 300),
    planId: r.planId,
    buyer: { name: buyerName, email, whatsapp },
    consent: true,
    photoConsent: r.photoConsent === true,
  };
}
