import heroCampaign from "@/assets/hero-campaign.jpg";
import catWedding from "@/assets/cat-wedding.jpg";
import catClothing from "@/assets/cat-clothing.jpg";
import catNew from "@/assets/cat-new.jpg";
import weddingCinematic from "@/assets/wedding-cinematic.jpg";
import brandStory from "@/assets/brand-story.jpg";
import prodBanarasi from "@/assets/prod-banarasi.jpg";
import prodMaheshwari from "@/assets/prod-maheshwari.jpg";
import prodHandpaintStole from "@/assets/prod-handpaint-stole.jpg";
import prodLavenderFloralSet from "@/assets/prod-lavender-floral-set.png";
import prodLavenderFloralSet2 from "@/assets/prod-lavender-floral-set-2.png";
import prodOliveIkatSet from "@/assets/prod-olive-ikat-set.jpg";
import prodOliveIkatSet2 from "@/assets/prod-olive-ikat-set-2.png";
import prodTealIkatSet from "@/assets/prod-teal-ikat-set.png";
import prodTealIkatSet2 from "@/assets/prod-teal-ikat-set-2.png";
import prodLilacChikankariSet from "@/assets/prod-lilac-chikankari-set.png";
import prodLilacChikankariSet2 from "@/assets/prod-lilac-chikankari-set-2.png";
import prodPinkPaisleySet from "@/assets/prod-pink-paisley-set.png";
import prodPinkPaisleySet2 from "@/assets/prod-pink-paisley-set-2.png";
import logo from "@/assets/logo.png";

export const images = {
  logo,
  heroCampaign,
  catWedding,
  catClothing,
  catNew,
  weddingCinematic,
  brandStory,
  prodBanarasi,
  prodMaheshwari,
  prodHandpaintStole,
  prodLavenderFloralSet,
  prodOliveIkatSet,
  prodTealIkatSet,
  prodLilacChikankariSet,
  prodPinkPaisleySet,
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  price: number;
  category: "clothing";
  type: string;
  collections: string[];
  material: string;
  colour: string;
  inStock: boolean;
  images: string[];
  description: string;
  craft: string;
  dimensions: string;
  care: string;
  sizes?: string[];
};

const inr = (n: number) => n;

type Seed = Omit<Product, "id" | "handle" | "images"> & {
  handle: string;
  images: string[];
};

const seeds: Seed[] = [
  // ---------------- FEATURED HANDCRAFTED SUIT SETS ----------------
  {
    handle: "lavender-floral-schiffli-suit-set",
    title: "Lavender Floral Schiffli Cotton Suit Set",
    price: inr(8400),
    category: "clothing",
    type: "Handloom Suit Sets",
    collections: [
      "new-arrivals",
      "bestsellers",
      "lamoksh-collection",
      "festive-edit",
      "occasion-wear",
    ],
    material: "Cotton",
    colour: "Lavender",
    inStock: true,
    images: [prodLavenderFloralSet, prodLavenderFloralSet2],
    description:
      "Hand-crafted lavender floral cotton kurta detailed with schiffli lace embroidery, matching pants, and a sheer organza dupatta.",
    craft: "Schiffli lace work and handblock floral prints.",
    dimensions: "3-Piece Set (Kurta, Pants & Dupatta)",
    care: "Dry clean recommended.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    handle: "olive-ikat-lace-kurta-set",
    title: "Olive Green Ikat Lace Kurta Set",
    price: inr(7900),
    category: "clothing",
    type: "Ikat Prints",
    collections: ["new-arrivals", "bestsellers", "lamoksh-collection", "occasion-wear"],
    material: "Cotton",
    colour: "Green",
    inStock: true,
    images: [prodOliveIkatSet, prodOliveIkatSet2],
    description:
      "Traditional olive green ikat weave kurta set styled with intricate crochet lace edging and coordinated dupatta.",
    craft: "Handwoven ikat weave with crochet lace yoke.",
    dimensions: "3-Piece Set (Kurta, Pants & Dupatta)",
    care: "Dry clean recommended.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    handle: "teal-turquoise-ikat-suit-set",
    title: "Teal Turquoise Ikat Handcrafted Suit Set",
    price: inr(8200),
    category: "clothing",
    type: "Ikat Prints",
    collections: ["new-arrivals", "lamoksh-collection", "festive-edit", "occasion-wear"],
    material: "Cotton Silk",
    colour: "Teal",
    inStock: true,
    images: [prodTealIkatSet, prodTealIkatSet2],
    description:
      "Vibrant teal turquoise ikat print suit set accented with delicate lace inserts and a matching Kota Doria dupatta.",
    craft: "Ikat block weave with cutwork lace inserts.",
    dimensions: "3-Piece Set (Kurta, Pants & Dupatta)",
    care: "Dry clean recommended.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    handle: "lilac-chikankari-lace-suit-set",
    title: "Lilac Chikankari Lace Suit Set",
    price: inr(9600),
    category: "clothing",
    type: "Designer Formals",
    collections: ["new-arrivals", "bestsellers", "wedding-edit", "festive-edit", "occasion-wear"],
    material: "Georgette",
    colour: "Purple",
    inStock: true,
    images: [prodLilacChikankariSet, prodLilacChikankariSet2],
    description:
      "Graceful lilac suit set adorned with dense lattice Chikankari work, scalloped lace borders, and a flowing sheer dupatta.",
    craft: "Hand Chikankari embroidery with scalloped lace.",
    dimensions: "3-Piece Set (Kurta, Pants & Dupatta)",
    care: "Dry clean only.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    handle: "soft-pink-paisley-kurta-set",
    title: "Soft Pink Paisley Handblock Kurta Set",
    price: inr(7500),
    category: "clothing",
    type: "Handpaint",
    collections: ["new-arrivals", "bestsellers", "lamoksh-collection", "festive-edit"],
    material: "Chanderi Cotton",
    colour: "Pink",
    inStock: true,
    images: [prodPinkPaisleySet, prodPinkPaisleySet2],
    description:
      "Soft blush pink paisley handblock printed suit set accented with scalloped lace hemline and a lightweight organza dupatta.",
    craft: "Handblock paisley print with eyelet lace trimming.",
    dimensions: "3-Piece Set (Kurta, Pants & Dupatta)",
    care: "Dry clean recommended.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },

  // ---------------- OTHER CLOTHING SIGNATURES ----------------
  {
    handle: "banarasi-silk-saree-burgundy",
    title: "Banarasi Silk Saree in Burgundy",
    price: inr(14500),
    category: "clothing",
    type: "Banarasi",
    collections: ["banarasi", "wedding-exclusive", "wedding-edit", "bestsellers", "occasion-wear"],
    material: "Silk",
    colour: "Burgundy",
    inStock: true,
    images: [prodBanarasi, catWedding],
    description:
      "A deep burgundy Banarasi woven with fine gold zari buta across the body and a broad temple border. The saree for the ceremony itself.",
    craft: "Handwoven on pit looms in Varanasi over approximately three weeks.",
    dimensions: "5.5 m saree with 0.8 m unstitched blouse piece",
    care: "Dry clean only. Store folded in muslin, refold every few months.",
    sizes: ["Free Size"],
  },
  {
    handle: "maheshwari-silk-cotton-saree-sage",
    title: "Maheshwari Silk Cotton Saree in Sage",
    price: inr(6400),
    category: "clothing",
    type: "Maheshwari Silk",
    collections: ["maheshwari-silk", "lamoksh-collection", "new-arrivals", "occasion-wear"],
    material: "Silk Cotton",
    colour: "Green",
    inStock: true,
    images: [prodMaheshwari, catClothing],
    description:
      "A featherlight Maheshwari in soft sage with a gold zari border — the everyday saree that still feels like an occasion.",
    craft: "Handwoven in Maheshwar in a silk-cotton blend with reversible border.",
    dimensions: "5.5 m saree with blouse piece",
    care: "Dry clean recommended for first wash.",
    sizes: ["Free Size"],
  },
  {
    handle: "handpaint-chanderi-saree-ivory",
    title: "Handpaint Chanderi Saree in Ivory",
    price: inr(8900),
    category: "clothing",
    type: "Handpaint",
    collections: ["handpaint", "lamoksh-collection", "new-arrivals", "bestsellers"],
    material: "Chanderi",
    colour: "Ivory",
    inStock: true,
    images: [catNew, prodHandpaintStole],
    description:
      "Hand-painted botanicals travel across an ivory chanderi ground, no two sarees identical.",
    craft: "Painted by hand in natural pigments; each piece signed by the artist.",
    dimensions: "5.5 m saree with blouse piece",
    care: "Dry clean only. Do not rub the painted areas.",
    sizes: ["Free Size"],
  },
  {
    handle: "handpainted-silk-stole",
    title: "Hand-painted Silk Stole",
    price: inr(3800),
    category: "clothing",
    type: "Stoles",
    collections: ["stoles", "handpaint", "new-arrivals", "winter-specials"],
    material: "Silk",
    colour: "Ivory",
    inStock: true,
    images: [prodHandpaintStole, catClothing],
    description: "A soft ivory silk stole carrying fine hand-painted stems — the finishing layer.",
    craft: "Hand-painted in small batches; hand-rolled edges.",
    dimensions: "200 cm × 70 cm",
    care: "Dry clean only.",
    sizes: ["Free Size"],
  },
  {
    handle: "premium-cotton-saree-taupe",
    title: "Premium Cotton Saree in Taupe",
    price: inr(4200),
    category: "clothing",
    type: "Premium Cottons",
    collections: ["premium-cottons", "cottons", "lamoksh-collection", "bestsellers"],
    material: "Cotton",
    colour: "Beige",
    inStock: true,
    images: [catClothing, prodMaheshwari],
    description:
      "A fine-count cotton in warm taupe with a subtle zari edge — structured, breathable, and built for long days.",
    craft: "Handwoven fine-count cotton with tissue border.",
    dimensions: "5.5 m saree with blouse piece",
    care: "Gentle hand wash separately in cold water.",
    sizes: ["Free Size"],
  },
  {
    handle: "wedding-exclusive-lehenga-crimson",
    title: "Wedding Exclusive Lehenga in Crimson",
    price: inr(48000),
    category: "clothing",
    type: "Wedding Exclusive",
    collections: ["wedding-exclusive", "wedding-edit", "bridal", "occasion-wear"],
    material: "Silk",
    colour: "Burgundy",
    inStock: true,
    images: [catWedding, prodBanarasi],
    description:
      "A crimson silk lehenga with dense gold thread work across the ghera, paired with a fine tulle dupatta.",
    craft: "Hand-embroidered over approximately 400 hours across an atelier of six karigars.",
    dimensions: "Ghera 4.2 m · Dupatta 2.5 m",
    care: "Dry clean only, specialist embroidery care.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "haldi-organza-set-marigold",
    title: "Haldi Organza Set in Marigold",
    price: inr(11500),
    category: "clothing",
    type: "Wedding Exclusive",
    collections: ["wedding-exclusive", "wedding-edit", "haldi", "occasion-wear", "new-arrivals"],
    material: "Organza",
    colour: "Yellow",
    inStock: true,
    images: [weddingCinematic, catClothing],
    description:
      "A marigold organza kurta set with tonal embroidery — designed for morning light and turmeric.",
    craft: "Hand-embroidered organza with cotton-silk lining.",
    dimensions: "Kurta length 46 in",
    care: "Dry clean only.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "mehendi-silk-kurta-set-emerald",
    title: "Mehendi Silk Kurta Set in Emerald",
    price: inr(13200),
    category: "clothing",
    type: "Wedding Exclusive",
    collections: ["wedding-exclusive", "wedding-edit", "mehendi", "occasion-wear"],
    material: "Silk",
    colour: "Green",
    inStock: true,
    images: [prodMaheshwari, weddingCinematic],
    description:
      "Emerald silk with mirror and thread work at the yoke, cut generously for dancing.",
    craft: "Hand-worked mirror embroidery on silk.",
    dimensions: "Kurta length 48 in",
    care: "Dry clean only.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "sangeet-sequin-saree-champagne",
    title: "Sangeet Sequin Saree in Champagne",
    price: inr(16800),
    category: "clothing",
    type: "Wedding Exclusive",
    collections: ["wedding-exclusive", "wedding-edit", "sangeet", "reception", "occasion-wear"],
    material: "Georgette",
    colour: "Champagne",
    inStock: true,
    images: [heroCampaign, catNew],
    description: "A champagne georgette saree carrying fine tonal sequins that catch every light.",
    craft: "Hand-sequinned georgette with a hand-rolled edge.",
    dimensions: "5.5 m saree with stitched blouse",
    care: "Dry clean only.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    handle: "reception-drape-gown-espresso",
    title: "Reception Drape Gown in Espresso",
    price: inr(24500),
    category: "clothing",
    type: "Designer Formals",
    collections: ["designer-formals", "reception", "wedding-edit", "occasion-wear"],
    material: "Crepe",
    colour: "Espresso",
    inStock: true,
    images: [catClothing, heroCampaign],
    description: "A pre-draped gown in deep espresso crepe with a single sculpted shoulder.",
    craft: "Hand-draped and finished in our atelier.",
    dimensions: "Length 58 in",
    care: "Dry clean only.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    handle: "designer-formal-co-ord-ivory",
    title: "Designer Formal Co-ord in Ivory",
    price: inr(9800),
    category: "clothing",
    type: "Designer Formals",
    collections: ["designer-formals", "lamoksh-collection", "new-arrivals"],
    material: "Cotton Silk",
    colour: "Ivory",
    inStock: true,
    images: [catNew, catClothing],
    description: "A clean ivory co-ord in cotton silk — the modern alternative to occasion wear.",
    craft: "Cut and finished in small runs with French seams.",
    dimensions: "Jacket length 32 in",
    care: "Dry clean recommended.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "winter-wool-blend-shawl-espresso",
    title: "Winter Wool Blend Shawl",
    price: inr(5600),
    category: "clothing",
    type: "Winter Specials",
    collections: ["winter-specials", "stoles"],
    material: "Wool",
    colour: "Espresso",
    inStock: true,
    images: [prodHandpaintStole, brandStory],
    description:
      "A warm wool-blend shawl with a woven border, for winter weddings and evening air.",
    craft: "Handwoven wool blend with fringed edge.",
    dimensions: "220 cm × 90 cm",
    care: "Dry clean only.",
    sizes: ["Free Size"],
  },
  {
    handle: "wedding-guest-tissue-saree-blush",
    title: "Wedding Guest Tissue Saree in Blush",
    price: inr(7800),
    category: "clothing",
    type: "LaMoksh Collection",
    collections: [
      "lamoksh-collection",
      "wedding-guest",
      "wedding-edit",
      "occasion-wear",
      "new-arrivals",
    ],
    material: "Tissue",
    colour: "Blush",
    inStock: true,
    images: [catNew, heroCampaign],
    description:
      "Soft blush tissue with a fine zari border — considered, never competing with the bride.",
    craft: "Handwoven tissue with zari selvedge.",
    dimensions: "5.5 m saree with blouse piece",
    care: "Dry clean only.",
    sizes: ["Free Size"],
  },
  {
    handle: "cotton-handloom-saree-indigo",
    title: "Cotton Handloom Saree in Indigo",
    price: inr(3400),
    category: "clothing",
    type: "Cottons",
    collections: ["cottons", "premium-cottons", "lamoksh-collection"],
    material: "Cotton",
    colour: "Blue",
    inStock: true,
    images: [catClothing, prodMaheshwari],
    description: "An indigo handloom cotton with a plain ground and a woven stripe pallu.",
    craft: "Handwoven cotton, natural indigo dye.",
    dimensions: "5.5 m saree with blouse piece",
    care: "Hand wash separately; colour may bleed initially.",
    sizes: ["Free Size"],
  },
];

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `mn-${String(i + 1).padStart(3, "0")}`,
}));

export const getProduct = (handle: string) => products.find((p) => p.handle === handle);

export const productsIn = (collection: string) =>
  products.filter((p) => p.collections.includes(collection));

export type Collection = {
  handle: string;
  title: string;
  editorialTitle: string;
  description: string;
  image: string;
  group: "clothing" | "curated" | "wedding";
};

export const collections: Collection[] = [
  // Clothing
  {
    handle: "wedding-exclusive",
    title: "Wedding Exclusive",
    editorialTitle: "Wedding Exclusive",
    description: "Our most worked pieces, reserved for the ceremonies that matter most.",
    image: catWedding,
    group: "clothing",
  },
  {
    handle: "lamoksh-collection",
    title: "LaMoksh Collection",
    editorialTitle: "The LaMoksh Collection",
    description: "The house signature — contemporary drape, Indian hand.",
    image: prodLavenderFloralSet,
    group: "clothing",
  },
  {
    handle: "premium-cottons",
    title: "Premium Cottons",
    editorialTitle: "Premium Cottons",
    description: "Fine-count cottons with structure and breath.",
    image: prodTealIkatSet,
    group: "clothing",
  },
  {
    handle: "cottons",
    title: "Cottons",
    editorialTitle: "Cottons",
    description: "Handloom cottons for the everyday.",
    image: prodOliveIkatSet,
    group: "clothing",
  },
  {
    handle: "handpaint",
    title: "Handpaint",
    editorialTitle: "Handpaint",
    description: "Painted by hand, so no two are the same.",
    image: prodPinkPaisleySet,
    group: "clothing",
  },
  {
    handle: "maheshwari-silk",
    title: "Maheshwari Silk",
    editorialTitle: "Maheshwari Silk",
    description: "Featherlight silk-cotton woven on the banks of the Narmada.",
    image: prodMaheshwari,
    group: "clothing",
  },
  {
    handle: "designer-formals",
    title: "Designer Formals",
    editorialTitle: "Designer Formals",
    description: "Modern tailoring with an Indian sensibility.",
    image: prodLilacChikankariSet,
    group: "clothing",
  },
  {
    handle: "banarasi",
    title: "Banarasi",
    editorialTitle: "Banarasi",
    description: "Zari woven on pit looms in Varanasi.",
    image: prodBanarasi,
    group: "clothing",
  },
  {
    handle: "winter-specials",
    title: "Winter Specials",
    editorialTitle: "Winter Specials",
    description: "Layers for cold mornings and long evenings.",
    image: brandStory,
    group: "clothing",
  },
  {
    handle: "stoles",
    title: "Stoles",
    editorialTitle: "Stoles",
    description: "The finishing layer.",
    image: prodHandpaintStole,
    group: "clothing",
  },

  // Curated
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    editorialTitle: "The New Edit",
    description: "The latest expressions of LaMoksh Fabrics, added as they leave the atelier.",
    image: prodLavenderFloralSet,
    group: "curated",
  },
  {
    handle: "bestsellers",
    title: "Most Loved",
    editorialTitle: "Most Loved by LaMoksh",
    description: "The pieces returned to again and again.",
    image: prodLilacChikankariSet,
    group: "curated",
  },
  {
    handle: "festive-edit",
    title: "Festive Edit",
    editorialTitle: "The Festive Edit",
    description: "For the season of light, sound and gathering.",
    image: prodTealIkatSet,
    group: "curated",
  },
  {
    handle: "occasion-wear",
    title: "Occasion Wear",
    editorialTitle: "Occasion Wear",
    description: "Dressing for the days that are marked in the calendar.",
    image: prodPinkPaisleySet,
    group: "curated",
  },

  // Wedding occasions
  {
    handle: "wedding-edit",
    title: "Wedding Edit",
    editorialTitle: "The Wedding Edit",
    description: "Designed for every celebration surrounding the big day.",
    image: catWedding,
    group: "wedding",
  },
  {
    handle: "bridal",
    title: "Bridal",
    editorialTitle: "Bridal",
    description: "For the bride, and the day she is the centre of.",
    image: catWedding,
    group: "wedding",
  },
  {
    handle: "haldi",
    title: "Haldi",
    editorialTitle: "Haldi",
    description: "Morning light, turmeric and marigold.",
    image: weddingCinematic,
    group: "wedding",
  },
  {
    handle: "mehendi",
    title: "Mehendi",
    editorialTitle: "Mehendi",
    description: "Green, gold and hands held still.",
    image: prodOliveIkatSet,
    group: "wedding",
  },
  {
    handle: "sangeet",
    title: "Sangeet",
    editorialTitle: "Sangeet",
    description: "Cut for movement and long nights.",
    image: prodLilacChikankariSet,
    group: "wedding",
  },
  {
    handle: "reception",
    title: "Reception",
    editorialTitle: "Reception",
    description: "The last, most composed look of the week.",
    image: prodLavenderFloralSet,
    group: "wedding",
  },
  {
    handle: "wedding-guest",
    title: "Wedding Guest",
    editorialTitle: "Wedding Guest",
    description: "Considered dressing that never competes.",
    image: prodTealIkatSet,
    group: "wedding",
  },
];

export const getCollection = (handle: string) => collections.find((c) => c.handle === handle);

export const formatPrice = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
