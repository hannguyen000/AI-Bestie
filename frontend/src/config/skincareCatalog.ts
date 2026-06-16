export const SKIN_CONCERNS = [
  "Acne-Prone", "Oily", "Dry", "Dehydrated", "Dullness",
  "Dark Spots", "Redness", "Sensitive", "Large Pores", "Aging",
];

export type SkincareProduct = {
    id: string;
    name: string;
    category: string;
    zone: "general" | "acne";
    actives: string[];     // use for detecting conflict between product
    concerns: string[];    // to feat with skin focus tags
    benefits: string[];    // short description of each product
    preferredPeriod?: "am" | "pm";  
    proTip?: string;  
};

export const PRODUCTS: SkincareProduct[] = [
    { id: "cleanser-gentle", name: "Gentle Cleanser", category: "Cleanser", zone: "general", actives: [], concerns: ["Dry", "Sensitive", "Redness"], benefits: ["Removes dirt & makeup"] },
    { id: "toner-hydrating", name: "Hydrating Toner", category: "Toner", zone: "general", actives: [], concerns: ["Dry", "Dehydrated"], benefits: ["Balance pH", "Absorb serums"] },
    { id: "vitc-serum", name: "Vitamin C Serum", category: "Serum", zone: "general", actives: ["Vitamin C"], concerns: ["Dullness", "Dark Spots"], benefits: ["Brightening", "Antioxidant"], preferredPeriod: "am", proTip: "Best in AM — brightens & boosts SPF." },
    { id: "retinol-serum", name: "Retinol Serum", category: "Serum", zone: "general", actives: ["Retinol"], concerns: ["Aging", "Dark Spots", "Large Pores"], benefits: ["Anti-aging", "Cell turnover"], preferredPeriod: "pm", proTip: "PM only — increases sun sensitivity." },
    { id: "sunscreen", name: "Sunscreen SPF50", category: "Sunscreen", zone: "general", actives: [], concerns: ["Aging", "Dark Spots", "Sensitive"], benefits: ["UV protection"], preferredPeriod: "am" },
    { id: "moisturizer", name: "Moisturizer", category: "Moisturizer", zone: "general", actives: [], concerns: ["Dry", "Dehydrated", "Aging"], benefits: ["Hydrate", "Barrier repair"] },
    { id: "salicylic-cleanser", name: "Salicylic Cleanser", category: "Cleanser", zone: "acne", actives: ["BHA"], concerns: ["Acne-Prone", "Oily", "Large Pores"], benefits: ["Pore cleansing", "Oil control"] },
    { id: "bha-serum", name: "BHA Serum", category: "Serum", zone: "acne", actives: ["BHA"], concerns: ["Acne-Prone", "Oily", "Large Pores"], benefits: ["Pore cleansing", "Oil control"] },
    { id: "niacinamide-serum", name: "Niacinamide Serum", category: "Serum", zone: "acne", actives: ["Niacinamide"], concerns: ["Oily", "Redness", "Large Pores"], benefits: ["Sebum control", "Anti-inflammatory"] },
];

export const CONFLICTS: { a: string; b: string; reason: string }[] = [
  { a: "Retinol", b: "BHA", reason: "Mixing Retinol and BHA can cause irritation. Alternate them (different times or nights)." },
  { a: "Retinol", b: "Vitamin C", reason: "Use Vitamin C in the AM and Retinol in the PM — not together." },
];

export function findConflicts(productIds: string[]) {
  const actives = new Set<string>();
  PRODUCTS.filter((p) => productIds.includes(p.id))
    .forEach((p) => p.actives.forEach((a) => actives.add(a)));
  return CONFLICTS.filter((c) => actives.has(c.a) && actives.has(c.b));
}

export const RITUAL_ORDER: Record<"am" | "pm", string[]> = {
  am: ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"],
  pm: ["Cleanser", "Toner", "Serum", "Moisturizer"],
};

export function productsForStep(closet: string[], step: string, period: "am" | "pm") {
  return PRODUCTS.filter(
    (p) => closet.includes(p.id) && p.category === step && (!p.preferredPeriod || p.preferredPeriod === period)
  );
}

export function conflictsForPeriod(closet: string[], period: "am" | "pm") {
  const ids = PRODUCTS.filter(
    (p) => closet.includes(p.id) && (!p.preferredPeriod || p.preferredPeriod === period)
  ).map((p) => p.id);
  return findConflicts(ids);
}