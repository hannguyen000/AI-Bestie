export const SKIN_CONCERNS = [
  "Acne-Prone", "Oily", "Dry", "Dehydrated", "Dullness",
  "Dark Spots", "Redness", "Sensitive", "Large Pores", "Aging",
  "Uneven Texture", "Compromised Barrier", "Hyperpigmentation"
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
    // --- CLEANSERS ---
    { id: "cleanser-gentle", name: "Gentle Cleanser", category: "Cleanser", zone: "general", actives: [], concerns: ["Dry", "Sensitive", "Redness", "Compromised Barrier"], benefits: ["Removes dirt & makeup without stripping"] },
    { id: "salicylic-cleanser", name: "Salicylic Cleanser", category: "Cleanser", zone: "acne", actives: ["BHA"], concerns: ["Acne-Prone", "Oily", "Large Pores"], benefits: ["Pore cleansing", "Oil control"], preferredPeriod: "pm" },
    
    // --- TONERS ---
    { id: "toner-hydrating", name: "Hydrating Toner", category: "Toner", zone: "general", actives: ["Hyaluronic Acid"], concerns: ["Dry", "Dehydrated"], benefits: ["Balance pH", "Deeply hydrates skin layers"] },
    { id: "toner-bha", name: "Exfoliating BHA Toner", category: "Toner", zone: "acne", actives: ["BHA"], concerns: ["Acne-Prone", "Large Pores", "Uneven Texture"], benefits: ["Decongests pores", "Blackhead reduction"], preferredPeriod: "pm" },
    
    // --- SERUMS (The Core Treatments) ---
    { id: "vitc-serum", name: "Vitamin C Serum", category: "Serum", zone: "general", actives: ["Vitamin C"], concerns: ["Dullness", "Dark Spots", "Hyperpigmentation"], benefits: ["Brightening", "Antioxidant protection"], preferredPeriod: "am", proTip: "Best in AM — brightens & boosts SPF protection." },
    { id: "retinol-serum", name: "Retinol Serum", category: "Serum", zone: "general", actives: ["Retinol"], concerns: ["Aging", "Dark Spots", "Large Pores", "Uneven Texture"], benefits: ["Anti-aging", "Cell turnover", "Smooths skin"], preferredPeriod: "pm", proTip: "PM only — always follow up with high SPF the next morning." },
    { id: "aha-serum", name: "Glycolic Acid AHA Serum", category: "Serum", zone: "general", actives: ["AHA"], concerns: ["Dullness", "Uneven Texture", "Aging"], benefits: ["Surface exfoliation", "Fades surface dark spots"], preferredPeriod: "pm", proTip: "Use 2-3 times a week max. Do not mix with Retinol." },
    { id: "bha-serum", name: "Salicylic Acid 2% Serum", category: "Serum", zone: "acne", actives: ["BHA"], concerns: ["Acne-Prone", "Oily", "Large Pores"], benefits: ["Pore cleansing", "Reduces sebum secretion"], preferredPeriod: "pm" },
    { id: "niacinamide-serum", name: "Niacinamide 10% Serum", category: "Serum", zone: "acne", actives: ["Niacinamide"], concerns: ["Oily", "Redness", "Large Pores", "Dark Spots"], benefits: ["Sebum control", "Anti-inflammatory", "Brightening"] },
    { id: "cica-serum", name: "Centella Calming Serum", category: "Serum", zone: "general", actives: ["Centella"], concerns: ["Sensitive", "Redness", "Compromised Barrier"], benefits: ["Soothes irritation", "Speeds up skin healing"] },
    { id: "ha-b5-serum", name: "Hyaluronic Acid + B5 Serum", category: "Serum", zone: "general", actives: ["Hyaluronic Acid"], concerns: ["Dehydrated", "Dry", "Compromised Barrier"], benefits: ["Plumps skin", "Locks in moisture", "Repairs barrier"] },
    
    // --- ACNE SPOT TREATMENTS ---
    { id: "bp-treatment", name: "Benzoyl Peroxide Gel", category: "Treatment", zone: "acne", actives: ["Benzoyl Peroxide"], concerns: ["Acne-Prone"], benefits: ["Kills acne bacteria", "Dries active breakouts"], preferredPeriod: "pm", proTip: "Apply only on active acne spots, not the whole face." },
    
    // --- MOISTURIZERS ---
    { id: "moisturizer-rich", name: "Barrier Repair Cream", category: "Moisturizer", zone: "general", actives: [], concerns: ["Dry", "Dehydrated", "Compromised Barrier", "Sensitive"], benefits: ["Deep hydration", "Ceramide barrier repair"] },
    { id: "moisturizer-gel", name: "Oil-Free Gel Cream", category: "Moisturizer", zone: "acne", actives: [], concerns: ["Oily", "Acne-Prone", "Large Pores"], benefits: ["Lightweight hydration", "Matte finish", "Won't clog pores"] },
    
    // --- SUNSCREENS ---
    { id: "sunscreen", name: "Sunscreen SPF50+", category: "Sunscreen", zone: "general", actives: [], concerns: ["Aging", "Dark Spots", "Sensitive", "Hyperpigmentation"], benefits: ["Broad-spectrum UV protection"], preferredPeriod: "am", proTip: "Non-negotiable step if you use Retinol, AHA, or BHA." }
];

export const CONFLICTS: { a: string; b: string; reason: string }[] = [
  { 
    a: "Retinol", 
    b: "BHA", 
    reason: "Both speed up cell turnover. Mixing them in the same routine causes severe irritation, flaking, and skin barrier damage." 
  },
  { 
    a: "Retinol", 
    b: "AHA", 
    reason: "Combining these powerful actives can strip the skin barrier, leading to redness, burning, and over-exfoliation." 
  },
  { 
    a: "Retinol", 
    b: "Vitamin C", 
    reason: "Vitamin C requires a low pH (acidic) to work, while Retinol needs a higher pH. Using them together cancels out benefits and causes irritation. Use Vitamin C in AM, Retinol in PM." 
  },
  { 
    a: "Retinol", 
    b: "Benzoyl Peroxide", 
    reason: "Benzoyl Peroxide oxidizes Retinol, making both molecules completely ineffective. Use them on alternate nights." 
  },
  { 
    a: "BHA", 
    b: "Vitamin C", 
    reason: "Using multiple acids simultaneously can trigger redness and sensitivity. Spread them out (Vitamin C in AM, BHA in PM)." 
  },
  { 
    a: "AHA", 
    b: "Vitamin C", 
    reason: "Both are low-pH acids. Stacking them directly can over-exfoliate the skin, leading to a compromised moisture barrier." 
  },
  { 
    a: "AHA", 
    b: "BHA", 
    reason: "Combining chemical exfoliants increases the risk of raw, sensitive skin. Use them on different days or use a pre-formulated AHA/BHA blend." 
  },
  { 
    a: "Niacinamide", 
    b: "Vitamin C", 
    reason: "Pure Vitamin C (Ascorbic Acid) can turn Niacinamide into Niacin, which causes temporary flush/redness in sensitive skin types." 
  },
  {
    a: "Benzoyl Peroxide",
    b: "BHA",
    reason: "Both are highly drying and acne-clearing actives. Stacking them together can cause extreme dryness and flaking."
  }
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