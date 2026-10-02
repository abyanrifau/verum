import type { Product } from './types';

/**
 * 50 real products from 21 brands. Names, sizes, ingredient lists and published strengths come from each
 * brand's own website (see `source`). `concentration` is set only where the brand publishes it.
 * Prices (MVR, GST included), stock, flags and notes are VERUM's own.
 */
export const products: Product[] = [
  {
    "code": "VRM-01",
    "slug": "beauty-of-joseon-ginseng-cleansing-oil",
    "brand": "beauty-of-joseon",
    "name": "Ginseng Cleansing Oil",
    "short": "Ginseng Cleansing Oil",
    "size": "210 ml",
    "sizeValue": 210,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Oil cleanser",
    "format": "oil-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal"
    ],
    "concerns": [
      "oil-control",
      "dryness"
    ],
    "texture": "Comfortably lightweight oil that turns into a lather with water, with a subtly calming scent.",
    "keyIngredients": [
      {
        "name": "Ginseng seed oil",
        "inci": "Panax Ginseng Seed Oil",
        "concentration": null,
        "role": "Softening oil"
      },
      {
        "name": "Soybean oil",
        "inci": "Glycine Soja (Soybean) Oil",
        "concentration": null,
        "role": "Cleansing oil base"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "No added fragrance listed, but it contains sage, mugwort and basil oils and camphor, which give it a light herbal scent.",
    "strength": "gentle",
    "price": 450,
    "stock": 18,
    "flags": [],
    "addedOn": "2025-11-03",
    "featured": 23,
    "salesRank": 24,
    "images": [
      "boj-ginseng-cleansing-oil-1.webp"
    ],
    "imageAlt": "Beauty of Joseon Ginseng Cleansing Oil, 210 ml pump bottle",
    "note": "A first cleanse that rinses clean, which matters when you wear sunscreen every day. It is not fragrance free: the herbal oils are listed, so we list them too.",
    "howToUse": "Massage 1-2 pumps onto dry skin, add water to emulsify, then rinse with lukewarm water. Follow with a water-based cleanser.",
    "frequency": "Evenings, as a first cleanse",
    "pairsWith": [
      "cosrx-low-ph-good-morning-gel-cleanser",
      "beauty-of-joseon-relief-sun-spf50"
    ],
    "source": "https://beautyofjoseon.com/products/ginseng-cleansing-oil"
  },
  {
    "code": "VRM-02",
    "slug": "anua-heartleaf-pore-control-cleansing-oil",
    "brand": "anua",
    "name": "Heartleaf Pore Control Cleansing Oil",
    "short": "Heartleaf Cleansing Oil",
    "size": "200 ml",
    "sizeValue": 200,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Oil cleanser",
    "format": "oil-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "pores",
      "oil-control"
    ],
    "texture": "Lightweight cleansing oil that emulsifies with water and rinses off without a greasy residue.",
    "keyIngredients": [
      {
        "name": "Heartleaf extract",
        "inci": "Houttuynia Cordata Extract",
        "concentration": "10,000 ppb",
        "role": "Soothing",
        "ingredient": "heartleaf"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "Lists fragrance.",
    "strength": "gentle",
    "price": 425,
    "stock": 22,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-06-14",
    "featured": 7,
    "salesRank": 7,
    "images": [
      "anua-heartleaf-cleansing-oil-1.webp"
    ],
    "imageAlt": "Anua Heartleaf Pore Control Cleansing Oil, 200 ml pump bottle",
    "note": "Emulsifies quickly and leaves no film, so it suits oily skin that dislikes oil cleansers. Anua publishes the heartleaf figure in parts per billion, and that is the number we show.",
    "howToUse": "Massage 2-3 pumps onto a dry face in circular motions, add water to emulsify, and rinse well. Follow with a water-based cleanser.",
    "frequency": "Evenings, as a first cleanse",
    "pairsWith": [
      "anua-heartleaf-77-soothing-toner",
      "cosrx-low-ph-good-morning-gel-cleanser"
    ],
    "source": "https://anua.com/products/heartleaf-pore-control-cleansing-oil-200ml"
  },
  {
    "code": "VRM-03",
    "slug": "the-inkey-list-oat-cleansing-balm",
    "brand": "the-inkey-list",
    "name": "Oat Cleansing Balm",
    "short": "Oat Cleansing Balm",
    "size": "150 ml",
    "sizeValue": 150,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Cleansing balm",
    "format": "balm-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sensitivity",
      "dryness",
      "barrier"
    ],
    "texture": "Smooth, buttery balm that melts into an oil on skin and turns milky with water.",
    "keyIngredients": [
      {
        "name": "Oat kernel oil",
        "inci": "Avena Sativa (Oat) Kernel Oil",
        "concentration": "5%",
        "role": "Barrier-friendly oil"
      },
      {
        "name": "Sea buckthorn oil",
        "inci": "Hippophae Rhamnoides (Seaberry) Fruit Oil",
        "concentration": null,
        "role": "Antioxidant oil"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 325,
    "stock": 16,
    "flags": [],
    "addedOn": "2026-02-10",
    "featured": 19,
    "salesRank": 27,
    "images": [
      "inkey-oat-cleansing-balm-1.webp",
      "inkey-oat-cleansing-balm-2.webp"
    ],
    "imageAlt": "The INKEY List Oat Cleansing Balm, 150 ml tube",
    "note": "A balm that melts, lifts sunscreen and waterproof mascara, then rinses milky. The 5% oat kernel oil is published by the brand, which is why it has a bar.",
    "howToUse": "Massage a raspberry-sized amount onto dry skin, add warm water to turn it milky, then rinse. Use it as the first step of a double cleanse.",
    "frequency": "Evenings, as a first cleanse",
    "pairsWith": [
      "cerave-hydrating-cleanser",
      "la-roche-posay-toleriane-double-repair"
    ],
    "source": "https://www.theinkeylist.com/products/oat-cleansing-balm-150ml"
  },
  {
    "code": "VRM-04",
    "slug": "bioderma-sensibio-h2o-micellar-water",
    "brand": "bioderma",
    "name": "Sensibio H2O Micellar Water",
    "short": "Sensibio H2O Micellar Water",
    "size": "250 ml",
    "sizeValue": 250,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Micellar water",
    "format": "micellar-water",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sensitivity"
    ],
    "texture": "Clear, no-rinse micellar water with a non-greasy, non-sticky finish.",
    "keyIngredients": [
      {
        "name": "Micellar cleansing agents",
        "inci": "PEG-6 Caprylic/Capric Glycerides",
        "concentration": null,
        "role": "Lifts make-up"
      },
      {
        "name": "Cucumber fruit extract",
        "inci": "Cucumis Sativus (Cucumber) Fruit Extract",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "D.A.F. complex",
        "inci": "Fructooligosaccharides, Mannitol, Xylitol, Rhamnose",
        "concentration": null,
        "role": "Tolerance support"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 345,
    "stock": 30,
    "flags": [],
    "addedOn": "2025-03-02",
    "featured": 29,
    "salesRank": 22,
    "images": [
      "bioderma-sensibio-h2o-1.webp"
    ],
    "imageAlt": "Bioderma Sensibio H2O Micellar Water, 250 ml bottle",
    "note": "Ten ingredients, no fragrance, no rinse. The easy first cleanse for very reactive skin, or after a long day outdoors.",
    "howToUse": "Soak a cotton pad and wipe over the face and eyes until the pad comes away clean. No need to rinse.",
    "frequency": "As needed, AM or PM",
    "pairsWith": [
      "cerave-hydrating-cleanser",
      "avene-thermal-spring-water"
    ],
    "source": "https://www.bioderma.co.uk/p/sensibio-h2o-micellar-water"
  },
  {
    "code": "VRM-05",
    "slug": "cosrx-low-ph-good-morning-gel-cleanser",
    "brand": "cosrx",
    "name": "Low pH Good Morning Gel Cleanser",
    "short": "Low pH Good Morning Gel Cleanser",
    "size": "150 ml",
    "sizeValue": 150,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Gel cleanser",
    "format": "gel-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "oil-control",
      "breakouts",
      "pores"
    ],
    "texture": "Gentle gel cleanser with a mildly acidic pH that lathers into a light foam.",
    "keyIngredients": [
      {
        "name": "Betaine salicylate (BHA)",
        "inci": "Betaine Salicylate",
        "concentration": "0.5%",
        "role": "Gentle exfoliation",
        "ingredient": "salicylic-acid"
      },
      {
        "name": "Tea tree leaf oil",
        "inci": "Melaleuca Alternifolia (Tea Tree) Leaf Oil",
        "concentration": "5,000 ppm",
        "role": "Clarifying"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "No added fragrance listed, but it contains tea tree leaf oil, an essential oil.",
    "strength": "gentle",
    "price": 265,
    "stock": 34,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-01-20",
    "featured": 10,
    "salesRank": 12,
    "images": [
      "cosrx-low-ph-good-morning-cleanser-1.webp"
    ],
    "imageAlt": "COSRX Low pH Good Morning Gel Cleanser, 150 ml tube",
    "note": "A mildly acidic gel wash that does not squeak. COSRX publishes both figures in an official ingredient graphic. The tea tree oil is why we do not call it fragrance free.",
    "howToUse": "Lather a small amount with water, massage over damp skin avoiding the eyes, then rinse.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "cosrx-bha-blackhead-power-liquid",
      "cosrx-advanced-snail-96-mucin-power-essence"
    ],
    "source": "https://www.cosrx.com/products/low-ph-good-morning-gel-cleanser"
  },
  {
    "code": "VRM-06",
    "slug": "cerave-hydrating-cleanser",
    "brand": "cerave",
    "name": "Hydrating Cleanser",
    "short": "Hydrating Cleanser",
    "size": "236 ml",
    "sizeValue": 236,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Cream cleanser",
    "format": "cream-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "normal",
      "dry",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier",
      "sensitivity"
    ],
    "texture": "Gentle, non-foaming cleansing formula that rinses off without leaving skin tight or dry.",
    "keyIngredients": [
      {
        "name": "Ceramides",
        "inci": "Ceramide NP, Ceramide AP, Ceramide EOP",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 375,
    "stock": 40,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2024-12-01",
    "featured": 9,
    "salesRank": 6,
    "images": [
      "cerave-hydrating-cleanser-1.webp"
    ],
    "imageAlt": "CeraVe Hydrating Cleanser, 236 ml pump bottle",
    "note": "A non-foaming lotion wash with three ceramides. It cleans without the tight feeling, which is the whole job of a cleanser for dry skin.",
    "howToUse": "Massage onto damp skin with lukewarm water, then rinse.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "cerave-moisturising-cream",
      "la-roche-posay-anthelios-uvmune-400-fluid-spf50"
    ],
    "source": "https://www.cerave.co.uk/skincare/cleansers/hydrating-cleanser"
  },
  {
    "code": "VRM-07",
    "slug": "cerave-foaming-cleanser",
    "brand": "cerave",
    "name": "Foaming Cleanser",
    "short": "Foaming Cleanser",
    "size": "236 ml",
    "sizeValue": 236,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Foam cleanser",
    "format": "gel-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "normal",
      "oily",
      "combination"
    ],
    "concerns": [
      "oil-control",
      "barrier"
    ],
    "texture": "Refreshing gel that foams gently as it cleanses.",
    "keyIngredients": [
      {
        "name": "Ceramides",
        "inci": "Ceramide NP, Ceramide AP, Ceramide EOP",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Calming",
        "ingredient": "niacinamide"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 375,
    "stock": 26,
    "flags": [],
    "addedOn": "2024-12-01",
    "featured": 21,
    "salesRank": 19,
    "images": [
      "cerave-foaming-cleanser-1.webp"
    ],
    "imageAlt": "CeraVe Foaming Cleanser, 236 ml pump bottle",
    "note": "A gel that foams lightly and removes oil without stripping. A steady choice for oily skin in Malé heat.",
    "howToUse": "Massage onto damp skin with lukewarm water, then rinse.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "the-ordinary-niacinamide-10-zinc-1",
      "eucerin-sun-gel-cream-oil-control-spf50"
    ],
    "source": "https://www.cerave.co.uk/skincare/cleansers/foaming-cleanser"
  },
  {
    "code": "VRM-08",
    "slug": "la-roche-posay-effaclar-purifying-cleansing-gel",
    "brand": "la-roche-posay",
    "name": "Effaclar Purifying Cleansing Gel",
    "short": "Effaclar Purifying Cleansing Gel",
    "size": "200 ml",
    "sizeValue": 200,
    "sizeUnit": "ml",
    "category": "cleanse",
    "subcategory": "Gel cleanser",
    "format": "gel-cleanser",
    "step": "cleanse",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination"
    ],
    "concerns": [
      "oil-control",
      "breakouts",
      "pores"
    ],
    "texture": "Foaming gel that lathers with water.",
    "keyIngredients": [
      {
        "name": "Zinc PCA",
        "inci": "Zinc PCA",
        "concentration": null,
        "role": "Oil balance",
        "ingredient": "zinc"
      },
      {
        "name": "Phylobioma",
        "inci": "Brand complex, INCI not specified",
        "concentration": null,
        "role": "Microbiome support"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "Lists parfum.",
    "strength": "gentle",
    "price": 425,
    "stock": 12,
    "flags": [],
    "addedOn": "2025-04-18",
    "featured": 31,
    "salesRank": 32,
    "images": [
      "lrp-effaclar-gel-1.webp"
    ],
    "imageAlt": "La Roche-Posay Effaclar Purifying Cleansing Gel, 200 ml tube",
    "note": "A foaming gel for oily, breakout-prone skin. It contains fragrance, so if your skin reacts easily, the CeraVe foaming wash is the safer swap.",
    "howToUse": "Lather with warm water, massage over the face avoiding the eyes, then rinse.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant",
      "eucerin-sun-gel-cream-oil-control-spf50"
    ],
    "source": "https://www.laroche-posay.co.uk/en_GB/effaclar-purifying-cleansing-gel/3337872411083.html"
  },
  {
    "code": "VRM-09",
    "slug": "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant",
    "brand": "paulas-choice",
    "name": "Skin Perfecting 2% BHA Liquid Exfoliant",
    "short": "2% BHA Liquid Exfoliant",
    "size": "118 ml",
    "sizeValue": 118,
    "sizeUnit": "ml",
    "category": "exfoliate",
    "subcategory": "Leave-on exfoliant",
    "format": "exfoliant",
    "step": "exfoliate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "breakouts",
      "pores",
      "oil-control",
      "dullness"
    ],
    "texture": "Lightweight liquid with a toner-like texture that absorbs quickly.",
    "keyIngredients": [
      {
        "name": "Salicylic acid (BHA)",
        "inci": "Salicylic Acid",
        "concentration": "2%",
        "role": "Exfoliates inside pores",
        "ingredient": "salicylic-acid"
      },
      {
        "name": "Green tea",
        "inci": "Camellia Oleifera",
        "concentration": null,
        "role": "Soothing antioxidant"
      },
      {
        "name": "Methylpropanediol",
        "inci": "Methylpropanediol",
        "concentration": null,
        "role": "Hydrating base"
      }
    ],
    "fragranceFree": true,
    "strength": "strong",
    "price": 745,
    "stock": 15,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-02-11",
    "featured": 8,
    "salesRank": 9,
    "images": [
      "paulas-choice-2-bha-1.webp"
    ],
    "imageAlt": "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant, 118 ml bottle",
    "note": "The reference BHA: 2% salicylic acid in a light liquid. Strong enough to matter, so start every other night.",
    "howToUse": "Sweep over clean skin with a cotton pad or your hands. Do not rinse. Follow with moisturiser, and sunscreen in the morning.",
    "frequency": "Every other night to start",
    "pairsWith": [
      "cerave-pm-facial-moisturising-lotion",
      "la-roche-posay-anthelios-uvmune-400-fluid-spf50"
    ],
    "source": "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html"
  },
  {
    "code": "VRM-10",
    "slug": "cosrx-bha-blackhead-power-liquid",
    "brand": "cosrx",
    "name": "BHA Blackhead Power Liquid",
    "short": "BHA Blackhead Power Liquid",
    "size": "100 ml",
    "sizeValue": 100,
    "sizeUnit": "ml",
    "category": "exfoliate",
    "subcategory": "Leave-on exfoliant",
    "format": "exfoliant",
    "step": "exfoliate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "pores",
      "breakouts",
      "oil-control"
    ],
    "texture": "Watery exfoliating liquid used at the toner or essence step.",
    "keyIngredients": [
      {
        "name": "Betaine salicylate (BHA)",
        "inci": "Betaine Salicylate",
        "concentration": "4%",
        "role": "Exfoliates",
        "ingredient": "salicylic-acid"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": "2%",
        "role": "Pores and tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Willow bark water",
        "inci": "Salix Alba (Willow) Bark Water",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 445,
    "stock": 19,
    "flags": [],
    "addedOn": "2025-01-20",
    "featured": 22,
    "salesRank": 21,
    "images": [
      "cosrx-bha-blackhead-power-liquid-1.webp"
    ],
    "imageAlt": "COSRX BHA Blackhead Power Liquid, 100 ml bottle",
    "note": "Betaine salicylate is a milder BHA than salicylic acid, so this is a gentler first step into exfoliation. Both percentages come from COSRX's own ingredient graphic.",
    "howToUse": "After cleansing, apply at the toner step and let it absorb fully before the next product.",
    "frequency": "2 to 3 nights a week to start",
    "pairsWith": [
      "cosrx-low-ph-good-morning-gel-cleanser",
      "cosrx-advanced-snail-92-all-in-one-cream"
    ],
    "source": "https://www.cosrx.com/products/bha-blackhead-power-liquid"
  },
  {
    "code": "VRM-11",
    "slug": "the-ordinary-glycolic-acid-7-exfoliating-toner",
    "brand": "the-ordinary",
    "name": "Glycolic Acid 7% Exfoliating Toner",
    "short": "Glycolic Acid 7% Exfoliating Toner",
    "size": "240 ml",
    "sizeValue": 240,
    "sizeUnit": "ml",
    "category": "exfoliate",
    "subcategory": "Exfoliating toner",
    "format": "exfoliant",
    "step": "exfoliate",
    "time": "PM",
    "skinTypes": [
      "normal",
      "combination",
      "oily",
      "dry"
    ],
    "concerns": [
      "dullness",
      "dark-spots",
      "ageing"
    ],
    "texture": "Water-based exfoliating toner; a plant extract may cause seasonal colour variation.",
    "keyIngredients": [
      {
        "name": "Glycolic acid (AHA)",
        "inci": "Glycolic Acid",
        "concentration": "7%",
        "role": "Exfoliates",
        "ingredient": "aha"
      },
      {
        "name": "Tasmanian pepperberry",
        "inci": "Tasmannia Lanceolata Fruit/Leaf Extract",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "Ginseng root extract",
        "inci": "Panax Ginseng Root Extract",
        "concentration": null,
        "role": "Antioxidant"
      },
      {
        "name": "Aloe leaf water",
        "inci": "Aloe Barbadensis Leaf Water",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "fragranceNote": "No added fragrance, though it contains rose and cornflower waters.",
    "strength": "strong",
    "price": 265,
    "stock": 21,
    "flags": [],
    "addedOn": "2025-05-07",
    "featured": 25,
    "salesRank": 25,
    "images": [
      "ordinary-glycolic-toner-1.webp",
      "ordinary-glycolic-toner-2.webp"
    ],
    "imageAlt": "The Ordinary Glycolic Acid 7% Exfoliating Toner, 240 ml bottle",
    "note": "7% glycolic acid at a price that makes it easy to try. It is a real acid, so evening use, sunscreen in the morning, and a few nights a week to start.",
    "howToUse": "In the evening, sweep over face and neck with a cotton pad. Do not rinse.",
    "frequency": "2 to 3 nights a week to start",
    "pairsWith": [
      "the-ordinary-natural-moisturizing-factors-ha",
      "beauty-of-joseon-relief-sun-spf50"
    ],
    "source": "https://theordinary.com/en-us/glycolic-acid-7-exfoliating-toner-100418.html"
  },
  {
    "code": "VRM-12",
    "slug": "the-inkey-list-pha-toner",
    "brand": "the-inkey-list",
    "name": "PHA Toner",
    "short": "PHA Toner",
    "size": "100 ml",
    "sizeValue": 100,
    "sizeUnit": "ml",
    "category": "exfoliate",
    "subcategory": "Exfoliating toner",
    "format": "exfoliant",
    "step": "exfoliate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dullness",
      "sensitivity",
      "pores"
    ],
    "texture": "Water-light, refreshing liquid that absorbs quickly.",
    "keyIngredients": [
      {
        "name": "PHA (gluconolactone)",
        "inci": "Gluconolactone",
        "concentration": "3%",
        "role": "Gentle exfoliation",
        "ingredient": "pha"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": "3%",
        "role": "Tone and shine",
        "ingredient": "niacinamide"
      },
      {
        "name": "Aloe vera",
        "inci": "Aloe Barbadensis Leaf Juice",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 295,
    "stock": 24,
    "flags": [
      "new"
    ],
    "addedOn": "2026-08-28",
    "featured": 15,
    "salesRank": 36,
    "images": [
      "inkey-pha-toner-1.webp",
      "inkey-pha-toner-2.webp",
      "inkey-pha-toner-3.webp"
    ],
    "imageAlt": "The INKEY List PHA Toner, 100 ml bottle",
    "note": "A gentle acid for skin that stings with glycolic. The brand publishes both 3% figures. A sensible first exfoliant.",
    "howToUse": "After cleansing, sweep over face and neck with a cotton pad. Do not rinse.",
    "frequency": "1 to 2 times a week to start",
    "pairsWith": [
      "the-ordinary-hyaluronic-acid-2-b5",
      "cerave-moisturising-cream"
    ],
    "source": "https://www.theinkeylist.com/products/pha-toner"
  },
  {
    "code": "VRM-13",
    "slug": "beauty-of-joseon-glow-serum-propolis-niacinamide",
    "brand": "beauty-of-joseon",
    "name": "Glow Serum: Propolis + Niacinamide",
    "short": "Glow Serum: Propolis + Niacinamide",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "pores",
      "dullness",
      "breakouts"
    ],
    "texture": "Thick, cushiony, honey-like serum that sinks in without leaving a sticky residue.",
    "keyIngredients": [
      {
        "name": "Propolis extract",
        "inci": "Propolis Extract",
        "concentration": null,
        "role": "Calms and hydrates",
        "ingredient": "propolis"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Pores and tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Betaine salicylate (BHA)",
        "inci": "Betaine Salicylate",
        "concentration": null,
        "role": "Gentle exfoliation",
        "ingredient": "salicylic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 365,
    "stock": 27,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-01-08",
    "featured": 11,
    "salesRank": 16,
    "images": [
      "boj-glow-serum-propolis-niacinamide-1.webp"
    ],
    "imageAlt": "Beauty of Joseon Glow Serum: Propolis + Niacinamide, 30 ml dropper bottle",
    "note": "A honey-textured serum for pores and dullness. Beauty of Joseon does not publish percentages for this formula, so every row reads Not published. That is the honest answer.",
    "howToUse": "Press 2-3 drops into face and neck and tap lightly until absorbed. Contains BHA, so wear sunscreen when using it in the day.",
    "frequency": "Morning or evening",
    "pairsWith": [
      "beauty-of-joseon-relief-sun-spf50",
      "beauty-of-joseon-dynasty-cream"
    ],
    "source": "https://beautyofjoseon.com/products/glow-serum-propolis-niacinamide"
  },
  {
    "code": "VRM-14",
    "slug": "beauty-of-joseon-glow-deep-serum-rice-alpha-arbutin",
    "brand": "beauty-of-joseon",
    "name": "Glow Deep Serum: Rice + Alpha-Arbutin",
    "short": "Glow Deep Serum: Rice + Alpha-Arbutin",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dark-spots",
      "dullness"
    ],
    "texture": "Light, fast-absorbing fluid.",
    "keyIngredients": [
      {
        "name": "Rice bran water",
        "inci": "Oryza Sativa (Rice) Bran Water",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "rice-extract"
      },
      {
        "name": "Alpha-arbutin",
        "inci": "Alpha-Arbutin",
        "concentration": null,
        "role": "Brightening",
        "ingredient": "alpha-arbutin"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 365,
    "stock": 3,
    "flags": [],
    "addedOn": "2025-03-15",
    "featured": 20,
    "salesRank": 20,
    "images": [
      "boj-glow-deep-serum-rice-arbutin-1.webp"
    ],
    "imageAlt": "Beauty of Joseon Glow Deep Serum: Rice + Alpha-Arbutin, 30 ml dropper bottle",
    "note": "Alpha-arbutin for dark marks in a soft rice base. The brand suggests evenings only and storing it away from heat, which is sensible advice in Malé.",
    "howToUse": "In the evening, pat a few drops into clean skin, then follow with moisturiser. Avoid touching the dropper to the skin.",
    "frequency": "Evenings",
    "pairsWith": [
      "beauty-of-joseon-relief-sun-spf50",
      "cerave-pm-facial-moisturising-lotion"
    ],
    "source": "https://beautyofjoseon.com/products/glow-deep-serum-rice-alpha-arbutin"
  },
  {
    "code": "VRM-15",
    "slug": "cosrx-advanced-snail-96-mucin-power-essence",
    "brand": "cosrx",
    "name": "Advanced Snail 96 Mucin Power Essence",
    "short": "Advanced Snail 96 Mucin Power Essence",
    "size": "100 ml",
    "sizeValue": 100,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Essence",
    "format": "essence",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier",
      "dullness"
    ],
    "texture": "Lightweight, fast-absorbing essence.",
    "keyIngredients": [
      {
        "name": "Snail mucin",
        "inci": "Snail Secretion Filtrate",
        "concentration": "96%",
        "role": "Hydration",
        "ingredient": "snail-mucin"
      },
      {
        "name": "Sodium hyaluronate",
        "inci": "Sodium Hyaluronate",
        "concentration": "1,000 ppm",
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Betaine",
        "inci": "Betaine",
        "concentration": null,
        "role": "Hydration"
      },
      {
        "name": "Allantoin",
        "inci": "Allantoin",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 485,
    "stock": 14,
    "flags": [
      "bestseller",
      "restocked"
    ],
    "addedOn": "2024-11-12",
    "featured": 3,
    "salesRank": 3,
    "images": [
      "cosrx-snail-96-mucin-essence-1.webp"
    ],
    "imageAlt": "COSRX Advanced Snail 96 Mucin Power Essence, 100 ml pump bottle",
    "note": "Bouncy, quick to absorb and hard to get wrong. The 96% is in the name and the hyaluronate figure is in COSRX's own fact sheet, in parts per million.",
    "howToUse": "After cleansing and toning, pat a small amount over the face until absorbed. Follow with moisturiser.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "cosrx-advanced-snail-92-all-in-one-cream",
      "cosrx-low-ph-good-morning-gel-cleanser"
    ],
    "source": "https://www.cosrx.com/products/advanced-snail-96-mucin-power-essence"
  },
  {
    "code": "VRM-16",
    "slug": "anua-niacinamide-10-txa-4-serum",
    "brand": "anua",
    "name": "Niacinamide 10 TXA 4 Serum",
    "short": "Niacinamide 10 TXA 4 Serum",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "dark-spots",
      "dullness",
      "pores"
    ],
    "texture": "Non-greasy, watery, lightweight serum that absorbs easily.",
    "keyIngredients": [
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": "10%",
        "role": "Pores and tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Tranexamic acid",
        "inci": "Tranexamic Acid",
        "concentration": "4%",
        "role": "Dark spots",
        "ingredient": "tranexamic-acid"
      },
      {
        "name": "Arbutin",
        "inci": "Arbutin",
        "concentration": "2%",
        "role": "Brightening",
        "ingredient": "alpha-arbutin"
      },
      {
        "name": "Ceramide NP",
        "inci": "Ceramide NP",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 465,
    "stock": 20,
    "flags": [
      "new"
    ],
    "addedOn": "2026-09-12",
    "featured": 5,
    "salesRank": 17,
    "images": [
      "anua-niacinamide-txa-serum-1.webp"
    ],
    "imageAlt": "Anua Niacinamide 10 TXA 4 Serum, 30 ml dropper bottle",
    "note": "Three brightening actives, all at published strengths. 10% niacinamide can tingle at first, so patch test and start once a day.",
    "howToUse": "Pat a few drops onto areas of concern before moisturiser, morning and night. Apply SPF 30+ during the day.",
    "frequency": "Morning and evening, once your skin is used to it",
    "pairsWith": [
      "anua-heartleaf-77-soothing-toner",
      "beauty-of-joseon-relief-sun-spf50"
    ],
    "source": "https://anua.com/products/niacinamide-10-txa-4-serum-2"
  },
  {
    "code": "VRM-17",
    "slug": "torriden-dive-in-serum",
    "brand": "torriden",
    "name": "DIVE IN Serum",
    "short": "DIVE IN Serum",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier",
      "sensitivity"
    ],
    "texture": "Lightweight serum that leaves skin feeling plump, smooth and comfortably dewy without heaviness or stickiness.",
    "keyIngredients": [
      {
        "name": "Hyaluronic acid, five weights",
        "inci": "Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Allantoin",
        "inci": "Allantoin",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 445,
    "stock": 25,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-02-24",
    "featured": 6,
    "salesRank": 15,
    "images": [
      "torriden-dive-in-serum-1.webp"
    ],
    "imageAlt": "Torriden DIVE IN Serum, 50 ml dropper bottle",
    "note": "Five sizes of hyaluronic acid in a serum that never feels sticky, even in humidity. Torriden publishes no percentages, so neither do we.",
    "howToUse": "Smooth a few drops over clean skin and pat in, before moisturiser.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "torriden-dive-in-moisture-sun-cream-spf50",
      "cerave-hydrating-cleanser"
    ],
    "source": "https://torriden.us/products/dive-in-serum"
  },
  {
    "code": "VRM-18",
    "slug": "skin1004-madagascar-centella-ampoule",
    "brand": "skin1004",
    "name": "Madagascar Centella Ampoule",
    "short": "Madagascar Centella Ampoule",
    "size": "55 ml",
    "sizeValue": 55,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Ampoule",
    "format": "ampoule",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sensitivity",
      "barrier",
      "breakouts"
    ],
    "texture": "Watery, slippery ampoule that spreads smoothly and absorbs quickly, keeping skin hydrated without stickiness.",
    "keyIngredients": [
      {
        "name": "Centella asiatica extract",
        "inci": "Centella Asiatica Extract",
        "concentration": null,
        "role": "Calming",
        "ingredient": "centella-asiatica"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 325,
    "stock": 31,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-01-30",
    "featured": 12,
    "salesRank": 8,
    "images": [
      "skin1004-centella-ampoule-1.webp"
    ],
    "imageAlt": "SKIN1004 Madagascar Centella Ampoule, 55 ml dropper bottle",
    "note": "Seven ingredients, one of them centella. Water comes first on the list, and the brand publishes no percentage, so the row says so.",
    "howToUse": "Drop an appropriate amount onto the skin, spread evenly and pat to help absorption.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "skin1004-hyalu-cica-water-fit-sun-serum-spf50",
      "la-roche-posay-cicaplast-baume-b5"
    ],
    "source": "https://www.skin1004.com/products/skin1004-madagascar-centella-ampoule"
  },
  {
    "code": "VRM-19",
    "slug": "innisfree-green-tea-seed-hyaluronic-serum",
    "brand": "innisfree",
    "name": "Green Tea Seed Hyaluronic Serum",
    "short": "Green Tea Seed Hyaluronic Serum",
    "size": "80 ml",
    "sizeValue": 80,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier"
    ],
    "texture": "Lightweight, water-like gel serum that absorbs quickly and does not clog pores.",
    "keyIngredients": [
      {
        "name": "Green tea water and hyaluronic acid",
        "inci": "Camellia Sinensis Leaf Extract, Sodium Hyaluronate, Hyaluronic Acid",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Green Tea Tri-biotics",
        "inci": "Lactobacillus Ferment Lysate and related",
        "concentration": null,
        "role": "Microbiome support"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Tone",
        "ingredient": "niacinamide"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 535,
    "stock": 11,
    "flags": [],
    "addedOn": "2025-07-19",
    "featured": 27,
    "salesRank": 34,
    "images": [
      "innisfree-green-tea-serum-1.webp"
    ],
    "imageAlt": "innisfree Green Tea Seed Hyaluronic Serum, 80 ml pump bottle",
    "note": "A light gel serum that layers under anything. A hydration step first; the niacinamide is supporting, not the headline.",
    "howToUse": "After cleanser and toner and before cream, smooth 2-3 pumps over the face and neck and pat in gently. Use morning and evening.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "innisfree-super-volcanic-pore-clay-mask",
      "neutrogena-hydro-boost-water-gel"
    ],
    "source": "https://us.innisfree.com/products/green-tea-seed-hyaluronic-serum"
  },
  {
    "code": "VRM-20",
    "slug": "dear-klairs-freshly-juiced-vitamin-drop",
    "brand": "klairs",
    "name": "Freshly Juiced Vitamin Drop",
    "short": "Freshly Juiced Vitamin Drop",
    "size": "35 ml",
    "sizeValue": 35,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "normal",
      "combination",
      "oily",
      "dry"
    ],
    "concerns": [
      "dullness",
      "dark-spots"
    ],
    "texture": "Lightweight, watery dropper serum that absorbs quickly and is non-sticky (the brand also mentions a light, oil-like slip).",
    "keyIngredients": [
      {
        "name": "Vitamin C (ascorbic acid)",
        "inci": "Ascorbic Acid",
        "concentration": "5%",
        "role": "Brightening antioxidant",
        "ingredient": "vitamin-c"
      },
      {
        "name": "Centella asiatica extract",
        "inci": "Centella Asiatica Extract",
        "concentration": null,
        "role": "Calming",
        "ingredient": "centella-asiatica"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "No added fragrance listed, but it contains orange and lavender oils. The brand does not call it fragrance free.",
    "strength": "moderate",
    "price": 435,
    "stock": 3,
    "flags": [],
    "addedOn": "2025-04-02",
    "featured": 17,
    "salesRank": 26,
    "images": [
      "klairs-vitamin-drop-1.webp",
      "klairs-vitamin-drop-2.webp"
    ],
    "imageAlt": "Dear, Klairs Freshly Juiced Vitamin Drop, 35 ml dropper bottle",
    "note": "Pure ascorbic acid at a low 5%, which makes it an easier first vitamin C. Keep it cool and use it within a few months of opening.",
    "howToUse": "After cleansing and toner, apply 3-4 drops, spread over the face and pat lightly to absorb; follow with moisturiser and use sunscreen in the daytime.",
    "frequency": "Mornings, a few times a week to start",
    "pairsWith": [
      "la-roche-posay-anthelios-uvmune-400-fluid-spf50",
      "dear-klairs-supple-preparation-facial-toner"
    ],
    "source": "https://www.klairs.com/products/freshly-juiced-vitamin-drop"
  },
  {
    "code": "VRM-21",
    "slug": "axis-y-dark-spot-correcting-glow-serum",
    "brand": "axis-y",
    "name": "Dark Spot Correcting Glow Serum",
    "short": "Dark Spot Correcting Glow Serum",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "dark-spots",
      "dullness"
    ],
    "texture": "Lightweight, fast-absorbing serum suited to consistent daily use.",
    "keyIngredients": [
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": "5%",
        "role": "Dark spots and tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Squalane",
        "inci": "Squalane",
        "concentration": null,
        "role": "Softening",
        "ingredient": "squalane"
      },
      {
        "name": "Sea buckthorn fruit extract",
        "inci": "Hippophae Rhamnoides Fruit Extract",
        "concentration": null,
        "role": "Antioxidant"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "No added fragrance listed, but it contains rosemary leaf oil.",
    "strength": "gentle",
    "price": 425,
    "stock": 17,
    "flags": [
      "new"
    ],
    "addedOn": "2026-09-05",
    "featured": 13,
    "salesRank": 30,
    "images": [
      "axis-y-dark-spot-serum-1.webp"
    ],
    "imageAlt": "AXIS-Y Dark Spot Correcting Glow Serum, 50 ml tube",
    "note": "5% niacinamide with squalane, aimed at post-breakout marks. A gentler strength than the 10% serums, which suits skin that flushes.",
    "howToUse": "Apply a small amount to the whole face or to targeted areas and pat gently until fully absorbed.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "the-inkey-list-pha-toner",
      "isntree-hyaluronic-acid-watery-sun-gel-spf50"
    ],
    "source": "https://axis-y.com/products/dark-spot-correcting-glow-serum"
  },
  {
    "code": "VRM-22",
    "slug": "the-ordinary-niacinamide-10-zinc-1",
    "brand": "the-ordinary",
    "name": "Niacinamide 10% + Zinc 1%",
    "short": "Niacinamide 10% + Zinc 1%",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "pores",
      "oil-control",
      "breakouts"
    ],
    "texture": "Lightweight water-based serum.",
    "keyIngredients": [
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": "10%",
        "role": "Pores and shine",
        "ingredient": "niacinamide"
      },
      {
        "name": "Zinc PCA",
        "inci": "Zinc PCA",
        "concentration": "1%",
        "role": "Oil balance",
        "ingredient": "zinc"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 165,
    "stock": 38,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2024-11-12",
    "featured": 4,
    "salesRank": 5,
    "images": [
      "ordinary-niacinamide-zinc-1.webp"
    ],
    "imageAlt": "The Ordinary Niacinamide 10% + Zinc 1%, 30 ml dropper bottle",
    "note": "Two published percentages, one job: shine and pores. It can pill under some silicone sunscreens, so let it dry first.",
    "howToUse": "Apply a few drops to the face morning and evening, after cleansing and before heavier creams.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "cerave-foaming-cleanser",
      "eucerin-sun-gel-cream-oil-control-spf50"
    ],
    "source": "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html"
  },
  {
    "code": "VRM-23",
    "slug": "the-ordinary-hyaluronic-acid-2-b5",
    "brand": "the-ordinary",
    "name": "Hyaluronic Acid 2% + B5 (with Ceramides)",
    "short": "Hyaluronic Acid 2% + B5 (with Ceramides)",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier"
    ],
    "texture": "Lightweight water-based serum that absorbs quickly and dries to a non-tacky finish.",
    "keyIngredients": [
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate Crosspolymer",
        "concentration": "2%",
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Pro-vitamin B5",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Ceramides",
        "inci": "Not specified by the brand",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 215,
    "stock": 33,
    "flags": [],
    "addedOn": "2025-02-03",
    "featured": 16,
    "salesRank": 13,
    "images": [
      "ordinary-hyaluronic-b5-1.webp"
    ],
    "imageAlt": "The Ordinary Hyaluronic Acid 2% + B5 (with Ceramides), 30 ml dropper bottle",
    "note": "A plain hydration serum that goes under everything. The 2% is published. The ceramides are named but not specified, so that row stays honest.",
    "howToUse": "Apply a few drops to the face morning and evening, after cleansing and before heavier creams or oils.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "the-ordinary-natural-moisturizing-factors-ha",
      "the-ordinary-niacinamide-10-zinc-1"
    ],
    "source": "https://theordinary.com/en-us/hyaluronic-acid-2-b5-serum-with-ceramides-100637.html"
  },
  {
    "code": "VRM-24",
    "slug": "the-ordinary-azelaic-acid-suspension-10",
    "brand": "the-ordinary",
    "name": "Azelaic Acid Suspension 10%",
    "short": "Azelaic Acid Suspension 10%",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Treatment cream",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "breakouts",
      "dark-spots",
      "sensitivity"
    ],
    "texture": "Cream-like brightening suspension.",
    "keyIngredients": [
      {
        "name": "Azelaic acid",
        "inci": "Azelaic Acid",
        "concentration": "10%",
        "role": "Breakouts, redness and marks",
        "ingredient": "azelaic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 245,
    "stock": 13,
    "flags": [],
    "addedOn": "2025-05-07",
    "featured": 18,
    "salesRank": 23,
    "images": [
      "ordinary-azelaic-acid-1.webp"
    ],
    "imageAlt": "The Ordinary Azelaic Acid Suspension 10%, 30 ml tube",
    "note": "10% azelaic acid in a cream-gel. A useful middle path for breakouts and redness when acids and retinoids feel like too much.",
    "howToUse": "Apply a small amount to the face morning and evening, after water-based serums; avoid the eyes and mouth. Use sun protection during the day.",
    "frequency": "Once a day to start",
    "pairsWith": [
      "cerave-hydrating-cleanser",
      "la-roche-posay-toleriane-double-repair"
    ],
    "source": "https://theordinary.com/en-us/azelaic-acid-suspension-10-exfoliator-100407.html"
  },
  {
    "code": "VRM-25",
    "slug": "the-ordinary-retinol-0-5-in-squalane",
    "brand": "the-ordinary",
    "name": "Retinol 0.5% in Squalane",
    "short": "Retinol 0.5% in Squalane",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Serum",
    "format": "serum",
    "step": "treat",
    "time": "PM",
    "skinTypes": [
      "dry",
      "normal",
      "combination"
    ],
    "concerns": [
      "ageing",
      "dullness"
    ],
    "texture": "Water-free (anhydrous) squalane-based serum.",
    "keyIngredients": [
      {
        "name": "Retinol",
        "inci": "Retinol",
        "concentration": "0.5%",
        "role": "Texture and fine lines",
        "ingredient": "retinol"
      },
      {
        "name": "Squalane",
        "inci": "Squalane",
        "concentration": null,
        "role": "Softening base",
        "ingredient": "squalane"
      }
    ],
    "fragranceFree": true,
    "strength": "strong",
    "price": 215,
    "stock": 9,
    "flags": [],
    "addedOn": "2025-06-01",
    "featured": 26,
    "salesRank": 29,
    "images": [
      "ordinary-retinol-squalane-1.webp"
    ],
    "imageAlt": "The Ordinary Retinol 0.5% in Squalane, 30 ml dropper bottle",
    "note": "0.5% retinol in a water-free squalane base. Not a starter strength: if you have never used retinol, begin with the COSRX 0.1 cream.",
    "howToUse": "Apply a few drops to the face in the evening. Do not use with other retinoids, and use sun protection during the day.",
    "frequency": "2 to 3 nights a week to start",
    "pairsWith": [
      "la-roche-posay-cicaplast-baume-b5",
      "la-roche-posay-anthelios-uvmune-400-fluid-spf50"
    ],
    "source": "https://theordinary.com/en-us/retinol-05-in-squalane-serum-100440.html"
  },
  {
    "code": "VRM-26",
    "slug": "cosrx-the-retinol-0-1-cream",
    "brand": "cosrx",
    "name": "The Retinol 0.1 Cream",
    "short": "The Retinol 0.1 Cream",
    "size": "20 ml",
    "sizeValue": 20,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Treatment cream",
    "format": "moisturiser",
    "step": "treat",
    "time": "PM",
    "skinTypes": [
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "ageing",
      "pores",
      "breakouts"
    ],
    "texture": "Elastic, creamy texture that spreads softly over the skin.",
    "keyIngredients": [
      {
        "name": "Retinol",
        "inci": "Retinol",
        "concentration": "0.1%",
        "role": "Texture and fine lines",
        "ingredient": "retinol"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Adenosine",
        "inci": "Adenosine",
        "concentration": null,
        "role": "Smoothing"
      },
      {
        "name": "Tocotrienol (super vitamin E)",
        "inci": "Tocotrienols",
        "concentration": null,
        "role": "Antioxidant"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 465,
    "stock": 10,
    "flags": [],
    "addedOn": "2025-08-09",
    "featured": 24,
    "salesRank": 31,
    "images": [
      "cosrx-retinol-0-1-cream-1.webp"
    ],
    "imageAlt": "COSRX The Retinol 0.1 Cream, 20 ml tube",
    "note": "A first retinol at 0.1%, published in the name and in the ingredient list. Start small: a rice-grain amount, three nights a week.",
    "howToUse": "At night, at the moisturiser step, apply a rice-grain-sized amount to areas of concern. Once skin is comfortable, spread it over the whole face.",
    "frequency": "Up to 3 nights a week to start",
    "pairsWith": [
      "cosrx-advanced-snail-92-all-in-one-cream",
      "beauty-of-joseon-relief-sun-spf50"
    ],
    "source": "https://www.cosrx.com/products/the-retinol-0-1-cream-1"
  },
  {
    "code": "VRM-27",
    "slug": "paulas-choice-10-niacinamide-booster",
    "brand": "paulas-choice",
    "name": "10% Niacinamide Booster",
    "short": "10% Niacinamide Booster",
    "size": "20 ml",
    "sizeValue": 20,
    "sizeUnit": "ml",
    "category": "treat",
    "subcategory": "Booster",
    "format": "serum",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "pores",
      "dark-spots",
      "dullness"
    ],
    "texture": "Sheer, ultra-light, water-like liquid.",
    "keyIngredients": [
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": "10%",
        "role": "Pores and tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Ascorbyl glucoside (vitamin C)",
        "inci": "Ascorbyl Glucoside",
        "concentration": "2%",
        "role": "Brightening",
        "ingredient": "vitamin-c"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Acetyl glucosamine",
        "inci": "Acetyl Glucosamine",
        "concentration": null,
        "role": "Tone"
      },
      {
        "name": "Licorice root extract",
        "inci": "Glycyrrhiza Glabra (Licorice) Root Extract",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 895,
    "stock": 2,
    "flags": [],
    "addedOn": "2025-09-14",
    "featured": 30,
    "salesRank": 35,
    "images": [
      "paulas-choice-niacinamide-booster-1.webp"
    ],
    "imageAlt": "Paula's Choice 10% Niacinamide Booster, 20 ml dropper bottle",
    "note": "A small bottle that does a lot: published niacinamide and vitamin C strengths, plus soothing extras. It can also be mixed into your moisturiser.",
    "howToUse": "Apply 2-3 drops to the face (a few more for neck and chest) after cleansing, toning and exfoliating, or mix into a non-SPF moisturiser or serum. Finish with SPF 30+ by day.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant",
      "la-roche-posay-toleriane-double-repair"
    ],
    "source": "https://www.paulaschoice.com/10pct-niacinamide-booster/798.html"
  },
  {
    "code": "VRM-28",
    "slug": "anua-heartleaf-77-soothing-toner",
    "brand": "anua",
    "name": "Heartleaf 77 Soothing Toner",
    "short": "Heartleaf 77 Soothing Toner",
    "size": "250 ml",
    "sizeValue": 250,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Toner",
    "format": "toner",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sensitivity",
      "breakouts",
      "oil-control"
    ],
    "texture": "Fresh, lightweight hydrating toner.",
    "keyIngredients": [
      {
        "name": "Heartleaf extract",
        "inci": "Houttuynia Cordata Extract",
        "concentration": "77%",
        "role": "Soothing",
        "ingredient": "heartleaf"
      },
      {
        "name": "Hyaluronic acid complex",
        "inci": "Sodium Hyaluronate and related",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 455,
    "stock": 29,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-06-14",
    "featured": 2,
    "salesRank": 4,
    "images": [
      "anua-heartleaf-77-toner-1.webp"
    ],
    "imageAlt": "Anua Heartleaf 77 Soothing Toner, 250 ml bottle",
    "note": "A watery toner that is mostly heartleaf, and says so: 77% is the brand's own figure. Cooling on hot afternoons.",
    "howToUse": "After cleansing, pat onto the face with fingertips or a cotton pad. Use morning and night.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "anua-heartleaf-pore-control-cleansing-oil",
      "anua-niacinamide-10-txa-4-serum"
    ],
    "source": "https://anua.com/products/heartleaf-77-soothing-toner"
  },
  {
    "code": "VRM-29",
    "slug": "round-lab-1025-dokdo-toner",
    "brand": "round-lab",
    "name": "1025 Dokdo Toner",
    "short": "1025 Dokdo Toner",
    "size": "200 ml",
    "sizeValue": 200,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Toner",
    "format": "toner",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dullness",
      "dryness"
    ],
    "texture": "Water-type texture that absorbs into skin instantly and leaves no tacky or sticky finish; unscented.",
    "keyIngredients": [
      {
        "name": "Deep-sea water",
        "inci": "Sea Water",
        "concentration": null,
        "role": "Minerals"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Allantoin",
        "inci": "Allantoin",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "Betaine",
        "inci": "Betaine",
        "concentration": null,
        "role": "Hydration"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 345,
    "stock": 5,
    "flags": [],
    "addedOn": "2025-03-28",
    "featured": 28,
    "salesRank": 28,
    "images": [
      "round-lab-dokdo-toner-1.webp"
    ],
    "imageAlt": "Round Lab 1025 Dokdo Toner, 200 ml bottle",
    "note": "A clear, unscented toner with a light enzyme exfoliation the brand does not quantify. Good for wiping away the last of a cleanse.",
    "howToUse": "After cleansing, soak a cotton pad and gently wipe along the skin texture, then pat in the remainder. For a leave-on mask, place soaked cotton pads on the face for 5-10 minutes.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "torriden-dive-in-serum",
      "cerave-foaming-cleanser"
    ],
    "source": "https://roundlab.com/products/1025-dokdo-toner"
  },
  {
    "code": "VRM-30",
    "slug": "dear-klairs-supple-preparation-facial-toner",
    "brand": "klairs",
    "name": "Supple Preparation Facial Toner",
    "short": "Supple Preparation Facial Toner",
    "size": "180 ml",
    "sizeValue": 180,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Toner",
    "format": "toner",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "sensitive",
      "dry",
      "normal",
      "combination"
    ],
    "concerns": [
      "dryness",
      "sensitivity"
    ],
    "texture": "Watery toner with a light, slippery feel.",
    "keyIngredients": [
      {
        "name": "Dimethyl sulfone",
        "inci": "Dimethyl Sulfone",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "Betaine",
        "inci": "Betaine",
        "concentration": null,
        "role": "Hydration"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "No added fragrance listed, but it contains several essential oils, including lemon, lavender and orange.",
    "strength": "gentle",
    "price": 385,
    "stock": 14,
    "flags": [],
    "addedOn": "2025-04-02",
    "featured": 32,
    "salesRank": 33,
    "images": [
      "klairs-supple-preparation-toner-1.webp",
      "klairs-supple-preparation-toner-2.webp"
    ],
    "imageAlt": "Dear, Klairs Supple Preparation Facial Toner, 180 ml bottle",
    "note": "A soft, slightly slippery toner that preps skin for the next step. It contains essential oils, so we do not label it fragrance free.",
    "howToUse": "After cleansing, pat the toner onto a dry face using the warmth of the palms to help absorption. The brand recommends several layers on dry areas.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "dear-klairs-freshly-juiced-vitamin-drop",
      "the-ordinary-hyaluronic-acid-2-b5"
    ],
    "source": "https://www.klairscosmetics.com/product/supple-preparation-facial-toner/"
  },
  {
    "code": "VRM-31",
    "slug": "im-from-rice-toner",
    "brand": "im-from",
    "name": "Rice Toner",
    "short": "Rice Toner",
    "size": "150 ml",
    "sizeValue": 150,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Toner",
    "format": "toner",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "dullness",
      "dryness"
    ],
    "texture": "Dual-layer toner (a water layer and a moisturising layer) that is shaken before use.",
    "keyIngredients": [
      {
        "name": "Goami rice extract",
        "inci": "Oryza Sativa (Rice) Extract",
        "concentration": "7,778 ppm",
        "role": "Hydration and softness",
        "ingredient": "rice-extract"
      },
      {
        "name": "Rice bran extract",
        "inci": "Oryza Sativa (Rice) Bran Extract",
        "concentration": "50 ppm",
        "role": "Softening",
        "ingredient": "rice-extract"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Adenosine",
        "inci": "Adenosine",
        "concentration": null,
        "role": "Smoothing"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 495,
    "stock": 12,
    "flags": [
      "new"
    ],
    "addedOn": "2026-08-20",
    "featured": 14,
    "salesRank": 37,
    "images": [
      "im-from-rice-toner-1.webp",
      "im-from-rice-toner-2.webp"
    ],
    "imageAlt": "I'm From Rice Toner, 150 ml bottle",
    "note": "Often sold as 77.78% rice. The brand's own ingredient list says 7,778 ppm, which is 0.78%. We show the official figure.",
    "howToUse": "Shake well so the layers mix, then wipe over the skin with a cotton pad or pat in with the hands.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "beauty-of-joseon-glow-deep-serum-rice-alpha-arbutin",
      "beauty-of-joseon-dynasty-cream"
    ],
    "source": "https://imfrom.co.kr/product/detail.html?product_no=229"
  },
  {
    "code": "VRM-32",
    "slug": "beauty-of-joseon-dynasty-cream",
    "brand": "beauty-of-joseon",
    "name": "Dynasty Cream",
    "short": "Dynasty Cream",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "normal",
      "dry",
      "combination"
    ],
    "concerns": [
      "dryness",
      "dullness",
      "barrier"
    ],
    "texture": "Comfortably nourishing cream that absorbs without stickiness and layers well under makeup.",
    "keyIngredients": [
      {
        "name": "Rice bran water",
        "inci": "Oryza Sativa (Rice) Bran Water",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "rice-extract"
      },
      {
        "name": "Ginseng root water",
        "inci": "Panax Ginseng Root Water",
        "concentration": null,
        "role": "Antioxidant"
      },
      {
        "name": "Squalane",
        "inci": "Squalane",
        "concentration": null,
        "role": "Softening",
        "ingredient": "squalane"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Tone",
        "ingredient": "niacinamide"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 495,
    "stock": 16,
    "flags": [],
    "addedOn": "2025-01-08",
    "featured": 33,
    "salesRank": 18,
    "images": [
      "boj-dynasty-cream-1.webp"
    ],
    "imageAlt": "Beauty of Joseon Dynasty Cream, 50 ml jar",
    "note": "A rich-feeling cream that still sinks in. Best for normal to dry skin, or for air-conditioned offices.",
    "howToUse": "After serum, smooth a small amount over face and neck and pat in. Oily or combination skin can use a smaller, half-pea-sized amount.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "beauty-of-joseon-glow-serum-propolis-niacinamide",
      "beauty-of-joseon-relief-sun-spf50"
    ],
    "source": "https://beautyofjoseon.com/products/dynasty-cream"
  },
  {
    "code": "VRM-33",
    "slug": "cosrx-advanced-snail-92-all-in-one-cream",
    "brand": "cosrx",
    "name": "Advanced Snail 92 All in One Cream",
    "short": "Advanced Snail 92 All in One Cream",
    "size": "100 g",
    "sizeValue": 100,
    "sizeUnit": "g",
    "category": "hydrate",
    "subcategory": "Moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier",
      "sensitivity"
    ],
    "texture": "Lightweight gel-cream that hydrates without heaviness.",
    "keyIngredients": [
      {
        "name": "Snail mucin",
        "inci": "Snail Secretion Filtrate",
        "concentration": "92%",
        "role": "Hydration",
        "ingredient": "snail-mucin"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": "1,000 ppm",
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Betaine",
        "inci": "Betaine",
        "concentration": null,
        "role": "Hydration"
      },
      {
        "name": "Allantoin",
        "inci": "Allantoin",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": null,
        "role": "Soothing",
        "ingredient": "panthenol"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 495,
    "stock": 18,
    "flags": [],
    "addedOn": "2024-11-12",
    "featured": 34,
    "salesRank": 10,
    "images": [
      "cosrx-snail-92-cream-1.webp"
    ],
    "imageAlt": "COSRX Advanced Snail 92 All in One Cream, 100 g jar",
    "note": "The cream partner to the 96 essence: gel-light, cushioning, and quick to absorb in humid air.",
    "howToUse": "After cleansing and toning, smooth a small amount evenly over the face and pat in. Follow with sunscreen in the morning.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "cosrx-advanced-snail-96-mucin-power-essence",
      "cosrx-the-retinol-0-1-cream"
    ],
    "source": "https://www.cosrx.com/products/advanced-snail-92-all-in-one-cream"
  },
  {
    "code": "VRM-34",
    "slug": "the-ordinary-natural-moisturizing-factors-ha",
    "brand": "the-ordinary",
    "name": "Natural Moisturizing Factors + HA",
    "short": "Natural Moisturizing Factors + HA",
    "size": "30 ml",
    "sizeValue": 30,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dryness",
      "barrier"
    ],
    "texture": "Lightweight, non-greasy cream.",
    "keyIngredients": [
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Amino acids",
        "inci": "Arginine, Aspartic Acid, Glycine, Alanine, Serine and others",
        "concentration": null,
        "role": "Skin-identical hydration"
      },
      {
        "name": "Urea",
        "inci": "Urea",
        "concentration": null,
        "role": "Hydration"
      },
      {
        "name": "Sodium PCA",
        "inci": "Sodium PCA",
        "concentration": null,
        "role": "Hydration"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 165,
    "stock": 36,
    "flags": [],
    "addedOn": "2024-11-12",
    "featured": 35,
    "salesRank": 2,
    "images": [
      "ordinary-nmf-ha-1.webp"
    ],
    "imageAlt": "The Ordinary Natural Moisturizing Factors + HA, 30 ml tube",
    "note": "Our best-selling moisturiser by units, because it is simple, light and inexpensive. No published strengths, so none shown.",
    "howToUse": "Apply as needed as the last step of the routine, after serums and treatments.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "the-ordinary-hyaluronic-acid-2-b5",
      "the-ordinary-niacinamide-10-zinc-1"
    ],
    "source": "https://theordinary.com/en-us/natural-moisturizing-factors-ha-moisturizer-100435.html"
  },
  {
    "code": "VRM-35",
    "slug": "cerave-moisturising-cream",
    "brand": "cerave",
    "name": "Moisturising Cream",
    "short": "Moisturising Cream",
    "size": "340 g",
    "sizeValue": 340,
    "sizeUnit": "g",
    "category": "hydrate",
    "subcategory": "Moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "dryness",
      "barrier",
      "sensitivity"
    ],
    "texture": "Rich but non-greasy cream.",
    "keyIngredients": [
      {
        "name": "Ceramides",
        "inci": "Ceramide NP, Ceramide AP, Ceramide EOP",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 495,
    "stock": 17,
    "flags": [],
    "addedOn": "2024-12-01",
    "featured": 36,
    "salesRank": 38,
    "images": [
      "cerave-moisturising-cream-1.webp"
    ],
    "imageAlt": "CeraVe Moisturising Cream, 340 g tub",
    "note": "A rich ceramide cream for face and body. Heavy for oily skin in Malé humidity; very good for dry patches and air-conditioned nights.",
    "howToUse": "Smooth over face or body as often as needed.",
    "frequency": "As needed",
    "pairsWith": [
      "cerave-hydrating-cleanser",
      "the-inkey-list-pha-toner"
    ],
    "source": "https://www.cerave.co.uk/skincare/moisturisers/moisturising-cream"
  },
  {
    "code": "VRM-36",
    "slug": "cerave-pm-facial-moisturising-lotion",
    "brand": "cerave",
    "name": "PM Facial Moisturising Lotion",
    "short": "PM Facial Moisturising Lotion",
    "size": "52 ml",
    "sizeValue": 52,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "PM",
    "skinTypes": [
      "normal",
      "dry",
      "combination"
    ],
    "concerns": [
      "barrier",
      "dryness"
    ],
    "texture": "Lightweight gel-cream moisturiser for evening use.",
    "keyIngredients": [
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Calming",
        "ingredient": "niacinamide"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Ceramides",
        "inci": "Ceramide NP, Ceramide AP, Ceramide EOP",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 345,
    "stock": 21,
    "flags": [
      "restocked"
    ],
    "addedOn": "2024-12-01",
    "featured": 37,
    "salesRank": 39,
    "images": [
      "cerave-pm-lotion-1.webp"
    ],
    "imageAlt": "CeraVe PM Facial Moisturising Lotion, 52 ml tube",
    "note": "A light night lotion that pairs well with acids and retinoids. CeraVe does not publish the niacinamide strength.",
    "howToUse": "Apply generously to face and neck at night.",
    "frequency": "Evenings",
    "pairsWith": [
      "paulas-choice-skin-perfecting-2-bha-liquid-exfoliant",
      "the-ordinary-retinol-0-5-in-squalane"
    ],
    "source": "https://www.cerave.co.uk/skincare/moisturisers/pm-facial-moisturising-lotion"
  },
  {
    "code": "VRM-37",
    "slug": "la-roche-posay-toleriane-double-repair",
    "brand": "la-roche-posay",
    "name": "Toleriane Double Repair Face Moisturizer",
    "short": "Toleriane Double Repair Moisturizer",
    "size": "100 ml",
    "sizeValue": 100,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "barrier",
      "sensitivity",
      "dryness"
    ],
    "texture": "Lightweight cream that absorbs easily and gives immediate comfort.",
    "keyIngredients": [
      {
        "name": "Ceramide-3",
        "inci": "Ceramide NP",
        "concentration": null,
        "role": "Barrier support",
        "ingredient": "ceramides"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Calming",
        "ingredient": "niacinamide"
      },
      {
        "name": "Glycerin",
        "inci": "Glycerin",
        "concentration": null,
        "role": "Hydration"
      },
      {
        "name": "Prebiotic thermal water",
        "inci": "Aqua / Water (La Roche-Posay thermal spring water)",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 545,
    "stock": 15,
    "flags": [],
    "addedOn": "2025-05-22",
    "featured": 38,
    "salesRank": 40,
    "images": [
      "lrp-toleriane-double-repair-1.webp"
    ],
    "imageAlt": "La Roche-Posay Toleriane Double Repair Face Moisturizer, 100 ml tube",
    "note": "An unfussy, oil-free barrier cream that sits well under sunscreen. A safe default for sensitive skin.",
    "howToUse": "After cleansing, apply to the face and neck with gentle circular motions, morning and/or evening.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "the-inkey-list-oat-cleansing-balm",
      "la-roche-posay-anthelios-uvmune-400-fluid-spf50"
    ],
    "source": "https://www.laroche-posay.us/our-products/face/face-moisturizer/toleriane-double-repair-face-moisturizer-3337875545792.html"
  },
  {
    "code": "VRM-38",
    "slug": "la-roche-posay-cicaplast-baume-b5",
    "brand": "la-roche-posay",
    "name": "Cicaplast Baume B5+ Repairing Balm",
    "short": "Cicaplast Baume B5+",
    "size": "40 ml",
    "sizeValue": 40,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Balm",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "sensitive",
      "dry",
      "normal"
    ],
    "concerns": [
      "barrier",
      "sensitivity",
      "dryness"
    ],
    "texture": "Lightweight but nourishing balm that leaves an invisible protective layer with a non-greasy finish.",
    "keyIngredients": [
      {
        "name": "Panthenol (vitamin B5)",
        "inci": "Panthenol",
        "concentration": "5%",
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Madecassoside",
        "inci": "Madecassoside",
        "concentration": null,
        "role": "Calming",
        "ingredient": "centella-asiatica"
      },
      {
        "name": "Tribioma prebiotic complex",
        "inci": "Brand complex, INCI not specified",
        "concentration": null,
        "role": "Microbiome support"
      },
      {
        "name": "Zinc and manganese",
        "inci": "Zinc Gluconate, Manganese Gluconate",
        "concentration": null,
        "role": "Skin comfort",
        "ingredient": "zinc"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 295,
    "stock": 23,
    "flags": [],
    "addedOn": "2025-05-22",
    "featured": 39,
    "salesRank": 41,
    "images": [
      "lrp-cicaplast-baume-b5-1.webp"
    ],
    "imageAlt": "La Roche-Posay Cicaplast Baume B5+, 40 ml tube",
    "note": "A thick balm for dry patches, flaky retinol nights and sun-tight skin. The 5% panthenol is printed on the brand's own page.",
    "howToUse": "Apply a generous layer to clean skin, avoiding the eye contour. Works on face, body and lips.",
    "frequency": "Up to twice a day",
    "pairsWith": [
      "the-ordinary-retinol-0-5-in-squalane",
      "skin1004-madagascar-centella-ampoule"
    ],
    "source": "https://www.laroche-posay.co.uk/en_GB/cicaplast-baume-b5-repairing-balm/3337875816809.html"
  },
  {
    "code": "VRM-39",
    "slug": "neutrogena-hydro-boost-water-gel",
    "brand": "neutrogena",
    "name": "Hydro Boost Water Gel Moisturiser",
    "short": "Hydro Boost Water Gel",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "hydrate",
    "subcategory": "Gel moisturiser",
    "format": "moisturiser",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "dryness",
      "oil-control"
    ],
    "texture": "Fresh, water-like gel that feels weightless and absorbs quickly.",
    "keyIngredients": [
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Amino acids and NMF",
        "inci": "Alanine, Glycine, Serine, Sodium PCA, Urea and others",
        "concentration": null,
        "role": "Skin-identical hydration"
      },
      {
        "name": "Electrolytes",
        "inci": "Not specified by the brand",
        "concentration": null,
        "role": "Hydration"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "Lists parfum.",
    "strength": "gentle",
    "price": 395,
    "stock": 19,
    "flags": [],
    "addedOn": "2025-07-02",
    "featured": 40,
    "salesRank": 42,
    "images": [
      "neutrogena-hydro-boost-gel-1.webp",
      "neutrogena-hydro-boost-gel-2.webp"
    ],
    "imageAlt": "Neutrogena Hydro Boost Water Gel, 50 ml jar and carton",
    "note": "A water-light gel for oily skin that still wants hydration. It contains fragrance, so it is not our pick for reactive skin.",
    "howToUse": "After cleansing and any serum, dot a 5p-sized amount over the face and neck and massage in gently. Let it absorb before applying other products or make-up.",
    "frequency": "Morning and evening",
    "pairsWith": [
      "cerave-foaming-cleanser",
      "isntree-hyaluronic-acid-watery-sun-gel-spf50"
    ],
    "source": "https://www.neutrogena.co.uk/skincare/moisturisers/hydro-boost-water-gel"
  },
  {
    "code": "VRM-40",
    "slug": "beauty-of-joseon-relief-sun-spf50",
    "brand": "beauty-of-joseon",
    "name": "Relief Sun: Rice + Niacinamide SPF50+ PA++++",
    "short": "Relief Sun: Rice + Niacinamide SPF50+",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "protect",
    "subcategory": "Sunscreen",
    "format": "sunscreen",
    "step": "protect",
    "time": "AM",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "sun-protection",
      "dryness"
    ],
    "texture": "Creamy, moisturiser-like sunscreen that stays lightweight and non-sticky, absorbs quickly and leaves no white cast.",
    "keyIngredients": [
      {
        "name": "UV filters",
        "inci": "Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Diethylhexyl Butamido Triazone",
        "concentration": null,
        "role": "UVA and UVB protection",
        "ingredient": "uv-filters"
      },
      {
        "name": "Rice extract",
        "inci": "Oryza Sativa (Rice) Extract",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "rice-extract"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Tone",
        "ingredient": "niacinamide"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 395,
    "stock": 4,
    "flags": [
      "bestseller",
      "restocked"
    ],
    "addedOn": "2024-11-12",
    "featured": 1,
    "salesRank": 1,
    "images": [
      "boj-relief-sun-rice-probiotics-1.webp"
    ],
    "imageAlt": "Beauty of Joseon Relief Sun: Rice + Niacinamide SPF50+ PA++++, 50 ml tube",
    "note": "The sunscreen people actually reapply: creamy, no white cast, no sting. Formerly Rice + Probiotics; the brand says only the name changed.",
    "howToUse": "Apply generously as the last step every morning, about two finger lengths for face and neck. Reapply every 2 hours outdoors.",
    "frequency": "Every morning, reapply outdoors",
    "pairsWith": [
      "beauty-of-joseon-ginseng-cleansing-oil",
      "beauty-of-joseon-glow-serum-propolis-niacinamide"
    ],
    "source": "https://ca.beautyofjoseon.com/products/relief-sun-rice-probiotics"
  },
  {
    "code": "VRM-41",
    "slug": "torriden-dive-in-moisture-sun-cream-spf50",
    "brand": "torriden",
    "name": "DIVE IN Moisture Sun Cream SPF50+ PA++++",
    "short": "DIVE IN Moisture Sun Cream SPF50+",
    "size": "60 ml",
    "sizeValue": 60,
    "sizeUnit": "ml",
    "category": "protect",
    "subcategory": "Sunscreen",
    "format": "sunscreen",
    "step": "protect",
    "time": "AM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sun-protection",
      "dryness"
    ],
    "texture": "Moisturising chemical-filter sun cream that the brand describes as forming a hydrating 'water-film' layer that sits closely on skin; can be used as a moist base under makeup without pilling.",
    "keyIngredients": [
      {
        "name": "UV filters",
        "inci": "Ethylhexyl Triazone, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Drometrizole Trisiloxane, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol",
        "concentration": null,
        "role": "UVA and UVB protection",
        "ingredient": "uv-filters"
      },
      {
        "name": "Hyaluronic acid complex",
        "inci": "Sodium Hyaluronate, Hyaluronic Acid and eight related forms",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Panthenol",
        "inci": "Panthenol",
        "concentration": "5,025 ppm",
        "role": "Soothing",
        "ingredient": "panthenol"
      },
      {
        "name": "Allantoin",
        "inci": "Allantoin",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 385,
    "stock": 20,
    "flags": [
      "new"
    ],
    "addedOn": "2026-09-20",
    "featured": 41,
    "salesRank": 43,
    "images": [
      "torriden-dive-in-sun-cream-1.webp"
    ],
    "imageAlt": "Torriden DIVE IN Moisture Sun Cream SPF50+ PA++++, 60 ml tube",
    "note": "Torriden's renewed sun cream, with the panthenol figure printed in the Korean ingredient list. A moist finish that works as a base.",
    "howToUse": "As the last step, spread a coin-sized amount over the face in small portions, 15 minutes before going out. Reapply every 2 hours in strong sun.",
    "frequency": "Every morning, reapply outdoors",
    "pairsWith": [
      "torriden-dive-in-serum",
      "cerave-hydrating-cleanser"
    ],
    "source": "https://torriden.com/goods/goods_view.php?goodsNo=252"
  },
  {
    "code": "VRM-42",
    "slug": "skin1004-hyalu-cica-water-fit-sun-serum-spf50",
    "brand": "skin1004",
    "name": "Hyalu-Cica Water-Fit Sun Serum SPF50+ PA++++",
    "short": "Hyalu-Cica Water-Fit Sun Serum SPF50+",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "protect",
    "subcategory": "Sunscreen",
    "format": "sunscreen",
    "step": "protect",
    "time": "AM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sun-protection",
      "sensitivity"
    ],
    "texture": "Light, serum-like chemical sunscreen with no stickiness; absorbs quickly for a dewy, glowy finish with no white cast.",
    "keyIngredients": [
      {
        "name": "UV filters",
        "inci": "Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Diethylhexyl Butamido Triazone",
        "concentration": null,
        "role": "UVA and UVB protection",
        "ingredient": "uv-filters"
      },
      {
        "name": "Centella asiatica extract",
        "inci": "Centella Asiatica Extract",
        "concentration": null,
        "role": "Calming",
        "ingredient": "centella-asiatica"
      },
      {
        "name": "Hyaluronic acid",
        "inci": "Sodium Hyaluronate",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 365,
    "stock": 26,
    "flags": [],
    "addedOn": "2025-02-18",
    "featured": 42,
    "salesRank": 44,
    "images": [
      "skin1004-hyalu-cica-sun-serum-1.webp"
    ],
    "imageAlt": "SKIN1004 Hyalu-Cica Water-Fit Sun Serum SPF50+ PA++++, 50 ml tube",
    "note": "A serum-thin sunscreen with a dewy finish. Easy to reapply over make-up, which is the test that matters.",
    "howToUse": "As the last step of the morning, apply evenly to face and neck. Reapply every 2 hours outdoors.",
    "frequency": "Every morning, reapply outdoors",
    "pairsWith": [
      "skin1004-madagascar-centella-ampoule",
      "bioderma-sensibio-h2o-micellar-water"
    ],
    "source": "https://www.skin1004.com/products/hyalu-cica-water-fit-sun-serum-spf50-pa?country=KR"
  },
  {
    "code": "VRM-43",
    "slug": "isntree-hyaluronic-acid-watery-sun-gel-spf50",
    "brand": "isntree",
    "name": "Hyaluronic Acid Watery Sun Gel",
    "short": "Hyaluronic Acid Watery Sun Gel SPF50+",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "protect",
    "subcategory": "Sunscreen",
    "format": "sunscreen",
    "step": "protect",
    "time": "AM",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sun-protection",
      "oil-control"
    ],
    "texture": "Water-based sun gel with a moist yet fresh finish; the brand's images describe it as lightweight and non-sticky with no white cast.",
    "keyIngredients": [
      {
        "name": "UV filters",
        "inci": "Ethylhexyl Salicylate, Homosalate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Polysilicone-15, Diethylamino Hydroxybenzoyl Hexyl Benzoate",
        "concentration": null,
        "role": "UVA and UVB protection",
        "ingredient": "uv-filters"
      },
      {
        "name": "Hyaluronic acid, eight types",
        "inci": "Sodium Hyaluronate, Hyaluronic Acid and related",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 395,
    "stock": 22,
    "flags": [
      "new"
    ],
    "addedOn": "2026-08-15",
    "featured": 43,
    "salesRank": 45,
    "images": [
      "isntree-ha-watery-sun-gel-1.webp"
    ],
    "imageAlt": "Isntree Hyaluronic Acid Watery Sun Gel SPF50+ PA++++, 50 ml tube",
    "note": "A water-based gel that disappears on oily skin. The lightest sunscreen we stock.",
    "howToUse": "As the last step of the morning, apply and pat gently until absorbed. Reapply every 2 hours outdoors.",
    "frequency": "Every morning, reapply outdoors",
    "pairsWith": [
      "the-ordinary-niacinamide-10-zinc-1",
      "neutrogena-hydro-boost-water-gel"
    ],
    "source": "https://isntree-global.com/products/isntree-hyaluronic-acid-watery-sun-gel-50ml"
  },
  {
    "code": "VRM-44",
    "slug": "la-roche-posay-anthelios-uvmune-400-fluid-spf50",
    "brand": "la-roche-posay",
    "name": "Anthelios UVMune 400 Invisible Fluid SPF50+",
    "short": "Anthelios UVMune 400 Invisible Fluid SPF50+",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "protect",
    "subcategory": "Sunscreen",
    "format": "sunscreen",
    "step": "protect",
    "time": "AM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sun-protection",
      "sensitivity",
      "dark-spots"
    ],
    "texture": "Lightweight, invisible fluid with a non-greasy, non-sticky finish and no white marks.",
    "keyIngredients": [
      {
        "name": "Mexoryl 400",
        "inci": "Methoxypropylamino Cyclohexenylidene Ethoxyethylcyanoacetate",
        "concentration": null,
        "role": "Ultra-long UVA filter",
        "ingredient": "uv-filters"
      },
      {
        "name": "UV filter system",
        "inci": "Ethylhexyl Salicylate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Triazone, Butyl Methoxydibenzoylmethane, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Drometrizole Trisiloxane, Terephthalylidene Dicamphor Sulfonic Acid",
        "concentration": null,
        "role": "UVA and UVB protection",
        "ingredient": "uv-filters"
      },
      {
        "name": "Netlock technology",
        "inci": "Brand film-former, INCI not specified",
        "concentration": null,
        "role": "Water and sweat resistance"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 595,
    "stock": 12,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2025-03-10",
    "featured": 44,
    "salesRank": 11,
    "images": [
      "lrp-uvmune-400-fluid-1.webp"
    ],
    "imageAlt": "La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+, 50 ml bottle",
    "note": "Very high UVA cover, including the ultra-long wavelengths, in a fluid that resists sweat and sand. The one for boat days.",
    "howToUse": "Shake, then apply generously before sun exposure. Reapply often, especially after swimming, sweating or towelling.",
    "frequency": "Every morning, reapply outdoors",
    "pairsWith": [
      "cerave-hydrating-cleanser",
      "la-roche-posay-toleriane-double-repair"
    ],
    "source": "https://www.laroche-posay.co.uk/en_GB/anthelios-uvmune-400-invisible-fluid-spf50-sun-cream-for-sensitive-skin-50ml/LRP_026.html"
  },
  {
    "code": "VRM-45",
    "slug": "eucerin-sun-gel-cream-oil-control-spf50",
    "brand": "eucerin",
    "name": "Sun Gel-Cream Oil Control SPF 50+",
    "short": "Sun Gel-Cream Oil Control SPF50+",
    "size": "50 ml",
    "sizeValue": 50,
    "sizeUnit": "ml",
    "category": "protect",
    "subcategory": "Sunscreen",
    "format": "sunscreen",
    "step": "protect",
    "time": "AM",
    "skinTypes": [
      "oily",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "sun-protection",
      "oil-control"
    ],
    "texture": "Ultra-light, non-greasy gel-cream that leaves an immediate dry-touch finish.",
    "keyIngredients": [
      {
        "name": "UV filters",
        "inci": "Not published on the official page",
        "concentration": null,
        "role": "UVA and UVB protection",
        "ingredient": "uv-filters"
      },
      {
        "name": "Licochalcone A",
        "inci": "Glycyrrhiza Inflata Root Extract",
        "concentration": null,
        "role": "Oil control"
      },
      {
        "name": "Glycyrrhetinic acid",
        "inci": "Glycyrrhetinic Acid",
        "concentration": null,
        "role": "Soothing"
      },
      {
        "name": "L-Carnitine",
        "inci": "Carnitine",
        "concentration": null,
        "role": "Oil control"
      }
    ],
    "fragranceFree": true,
    "fragranceNote": "The brand describes it as unperfumed. The official page does not publish a full ingredient list.",
    "strength": "gentle",
    "price": 525,
    "stock": 4,
    "flags": [],
    "addedOn": "2025-04-26",
    "featured": 45,
    "salesRank": 46,
    "images": [
      "eucerin-oil-control-sun-gel-1.webp"
    ],
    "imageAlt": "Eucerin Sun Gel-Cream Oil Control SPF50+, 50 ml tube",
    "note": "A dry-touch finish that keeps shine down through a humid afternoon. Eucerin does not publish the full ingredient list on its page, and we say so.",
    "howToUse": "Apply in the morning on its own or over moisturiser, before going out. Reapply to keep protection.",
    "frequency": "Every morning, reapply outdoors",
    "pairsWith": [
      "cerave-foaming-cleanser",
      "the-ordinary-niacinamide-10-zinc-1"
    ],
    "source": "https://www.en.eucerin-me.com/products/sun-protection/sun-gel-creme-oil-control-dry-touch-spf-50plus"
  },
  {
    "code": "VRM-46",
    "slug": "laneige-water-sleeping-mask",
    "brand": "laneige",
    "name": "Water Sleeping Mask",
    "short": "Water Sleeping Mask",
    "size": "70 ml",
    "sizeValue": 70,
    "sizeUnit": "ml",
    "category": "masks",
    "subcategory": "Sleeping mask",
    "format": "sleeping-mask",
    "step": "hydrate",
    "time": "PM",
    "skinTypes": [
      "normal",
      "dry",
      "combination"
    ],
    "concerns": [
      "dryness",
      "dullness"
    ],
    "texture": "Lightweight, refreshing gel(-cream) that gently cools and wraps skin in breathable hydration overnight.",
    "keyIngredients": [
      {
        "name": "Hyaluronic acid, three types",
        "inci": "Sodium Hyaluronate, Hydroxypropyltrimonium Hyaluronate and related",
        "concentration": null,
        "role": "Hydration",
        "ingredient": "hyaluronic-acid"
      },
      {
        "name": "Squalane",
        "inci": "Squalane",
        "concentration": null,
        "role": "Softening",
        "ingredient": "squalane"
      },
      {
        "name": "Niacinamide",
        "inci": "Niacinamide",
        "concentration": null,
        "role": "Tone",
        "ingredient": "niacinamide"
      },
      {
        "name": "Probiotic-derived complex",
        "inci": "Lactobacillus Ferment Lysate",
        "concentration": null,
        "role": "Skin comfort"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "Lists fragrance, limonene and linalool.",
    "strength": "gentle",
    "price": 595,
    "stock": 10,
    "flags": [
      "restocked"
    ],
    "addedOn": "2025-02-27",
    "featured": 46,
    "salesRank": 48,
    "images": [
      "laneige-water-sleeping-mask-1.webp"
    ],
    "imageAlt": "LANEIGE Water Sleeping Mask, 70 ml jar",
    "note": "An overnight gel that seals in the steps underneath. It is scented, so skip it if fragrance bothers you.",
    "howToUse": "After face cream, apply evenly across the face, leave on overnight and rinse off in the morning.",
    "frequency": "2 or more nights a week",
    "pairsWith": [
      "laneige-lip-sleeping-mask-berry",
      "torriden-dive-in-serum"
    ],
    "source": "https://us.laneige.com/products/water-sleeping-mask"
  },
  {
    "code": "VRM-47",
    "slug": "innisfree-super-volcanic-pore-clay-mask",
    "brand": "innisfree",
    "name": "Super Volcanic Pore Clay Mask",
    "short": "Super Volcanic Pore Clay Mask",
    "size": "80 g",
    "sizeValue": 80,
    "sizeUnit": "g",
    "category": "masks",
    "subcategory": "Wash-off mask",
    "format": "wash-off-mask",
    "step": "exfoliate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "combination"
    ],
    "concerns": [
      "pores",
      "oil-control"
    ],
    "texture": "Creamy, non-drying wash-off clay mask with a cooling feel.",
    "keyIngredients": [
      {
        "name": "Volcanic clusters",
        "inci": "Volcanic Ash",
        "concentration": null,
        "role": "Absorbs oil"
      },
      {
        "name": "AHA (lactic acid)",
        "inci": "Lactic Acid",
        "concentration": null,
        "role": "Gentle exfoliation",
        "ingredient": "aha"
      }
    ],
    "fragranceFree": true,
    "strength": "moderate",
    "price": 325,
    "stock": 13,
    "flags": [],
    "addedOn": "2025-07-19",
    "featured": 47,
    "salesRank": 47,
    "images": [
      "innisfree-volcanic-clay-mask-1.webp"
    ],
    "imageAlt": "innisfree Super Volcanic Pore Clay Mask, 80 g jar",
    "note": "A weekly clay mask for oily zones. The current version uses lactic acid rather than BHA, and comes in 80 g.",
    "howToUse": "After cleansing, apply to a dry face or to pore-focused areas, leave for 10 minutes or until dry, then rinse with lukewarm water using circular motions.",
    "frequency": "1 to 2 times a week",
    "pairsWith": [
      "innisfree-green-tea-seed-hyaluronic-serum",
      "cosrx-low-ph-good-morning-gel-cleanser"
    ],
    "source": "https://us.innisfree.com/products/super-volcanic-pore-clay-mask"
  },
  {
    "code": "VRM-48",
    "slug": "cosrx-acne-pimple-master-patch",
    "brand": "cosrx",
    "name": "Acne Pimple Master Patch",
    "short": "Acne Pimple Master Patch",
    "size": "24 patches",
    "sizeValue": 24,
    "sizeUnit": "patches",
    "category": "masks",
    "subcategory": "Spot patch",
    "format": "patch",
    "step": "treat",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "breakouts"
    ],
    "texture": "Thin hydrocolloid dots in three sizes.",
    "keyIngredients": [
      {
        "name": "Hydrocolloid",
        "inci": "Cellulose Gum, Polyisobutylene, Styrene Isoprene Styrene Block Copolymer",
        "concentration": null,
        "role": "Absorbs fluid, covers the spot"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 115,
    "stock": 48,
    "flags": [],
    "addedOn": "2025-01-20",
    "featured": 48,
    "salesRank": 49,
    "images": [
      "cosrx-acne-pimple-master-patch-1.webp"
    ],
    "imageAlt": "COSRX Acne Pimple Master Patch, pack of 24 patches",
    "note": "Small, thin and nearly invisible. A patch keeps fingers off a spot, which is most of the battle.",
    "howToUse": "Cleanse and dry the area, choose a patch slightly larger than the spot and press it on.",
    "frequency": "As needed",
    "pairsWith": [
      "the-ordinary-azelaic-acid-suspension-10",
      "the-ordinary-niacinamide-10-zinc-1"
    ],
    "source": "https://www.cosrx.com/products/acne-pimple-master-patch"
  },
  {
    "code": "VRM-49",
    "slug": "laneige-lip-sleeping-mask-berry",
    "brand": "laneige",
    "name": "Lip Sleeping Mask, Berry",
    "short": "Lip Sleeping Mask, Berry",
    "size": "20 g",
    "sizeValue": 20,
    "sizeUnit": "g",
    "category": "masks",
    "subcategory": "Lip mask",
    "format": "lip-mask",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "dryness"
    ],
    "texture": "Rich, balm-like leave-on lip mask that melts onto lips with a non-sticky finish.",
    "keyIngredients": [
      {
        "name": "Berry fruit complex",
        "inci": "Not specified by the brand",
        "concentration": null,
        "role": "Antioxidant"
      },
      {
        "name": "Murumuru seed butter",
        "inci": "Astrocaryum Murumuru Seed Butter",
        "concentration": null,
        "role": "Softening"
      },
      {
        "name": "Shea butter",
        "inci": "Butyrospermum Parkii (Shea) Butter",
        "concentration": null,
        "role": "Softening"
      },
      {
        "name": "Vitamin C",
        "inci": "Ascorbic Acid",
        "concentration": null,
        "role": "Antioxidant",
        "ingredient": "vitamin-c"
      }
    ],
    "fragranceFree": false,
    "fragranceNote": "Lists fragrance.",
    "strength": "gentle",
    "price": 395,
    "stock": 27,
    "flags": [
      "bestseller"
    ],
    "addedOn": "2024-11-20",
    "featured": 49,
    "salesRank": 14,
    "images": [
      "laneige-lip-sleeping-mask-1.webp"
    ],
    "imageAlt": "LANEIGE Lip Sleeping Mask in Berry, 20 g pot",
    "note": "The add-on most people come back for. Sun and sea air are hard on lips; this helps overnight.",
    "howToUse": "At night, apply generously before bed for intensive overnight moisture. In the morning, apply a thin layer to prep lips before the rest of the lip routine.",
    "frequency": "Nightly, and as needed",
    "pairsWith": [
      "laneige-water-sleeping-mask",
      "beauty-of-joseon-relief-sun-spf50"
    ],
    "source": "https://us.laneige.com/products/lip-sleeping-mask?variant=31760703160372"
  },
  {
    "code": "VRM-50",
    "slug": "avene-thermal-spring-water",
    "brand": "avene",
    "name": "Thermal Spring Water Spray",
    "short": "Thermal Spring Water Spray",
    "size": "150 ml",
    "sizeValue": 150,
    "sizeUnit": "ml",
    "category": "masks",
    "subcategory": "Face mist",
    "format": "mist",
    "step": "hydrate",
    "time": "AM+PM",
    "skinTypes": [
      "oily",
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "sensitivity"
    ],
    "texture": "Fine, soft mist sprayed from an aerosol.",
    "keyIngredients": [
      {
        "name": "Avène thermal spring water",
        "inci": "Avene Thermal Spring Water (Avene Aqua)",
        "concentration": null,
        "role": "Soothing"
      }
    ],
    "fragranceFree": true,
    "strength": "gentle",
    "price": 285,
    "stock": 24,
    "flags": [],
    "addedOn": "2025-05-30",
    "featured": 50,
    "salesRank": 50,
    "images": [
      "avene-thermal-water-1.webp",
      "avene-thermal-water-2.webp"
    ],
    "imageAlt": "Avène Thermal Spring Water Spray, 150 ml can",
    "note": "Two ingredients: spring water and the nitrogen that sprays it. A cool mist after the beach or before your serum.",
    "howToUse": "Spray over the face for a few seconds, wait a moment, then pat dry.",
    "frequency": "As often as you like",
    "pairsWith": [
      "bioderma-sensibio-h2o-micellar-water",
      "la-roche-posay-cicaplast-baume-b5"
    ],
    "source": "https://www.avene.co.uk/p/avene-thermal-spring-water-spray-3282779003124-b5405ca4"
  },
];
