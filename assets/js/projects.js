/* ============================================================
   PROJECTS — add, edit or remove villas here.

   Photos: put files in  assets/img/projects/<id>/
     cover.jpg   -> main photo (cards + top of project page)
     1.jpg, 2.jpg, 3.jpg ... -> gallery (list them in "photos")
   Missing photos show a soft placeholder, so the site never breaks.

   status: "completed" or "ongoing"
   For ongoing projects, set "progress" (0–100) and "stage" (what's happening now).
   Fields left empty/null are hidden on the site.

   Project page fields (like alexisdornier.com/project/the-barn):
     type:         "residential" | "boutique" | "hospitality"
     architect:    name of the architect (credits)
     photographer: name of the photographer (credits)
     description:  story of the villa. Either one text for all languages:
                     description: "First paragraph.\n\nSecond paragraph."
                   or per language:
                     description: { en: "...", ru: "...", nl: "...", pt: "...", id: "..." }
   ============================================================ */
window.PROJECTS = [
  {
    id: "coz",
    type: "boutique",
    architect: null,
    photographer: null,
    description: null,
    name: "COZ Boutique Villas",
    location: "Uluwatu, Bali",
    status: "completed",
    scope: null,                  // "design-build" | "construction" | "construction-material"
    instagram: "cozvillas",
    // ⚠ DUMMY numbers — replace with real ones
    units: 4,                     // villas built in this project
    buildingArea: 820,             // m² total building area
    landArea: 1500,                 // m² land
    bedrooms: "2–3",              // per villa
    year: 2024,                  // year completed
    duration: 14,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
    featured: true
  },
  {
    id: "nori",
    type: "boutique",
    architect: null,
    photographer: null,
    description: null,
    name: "NORI Boutique Villas",
    location: "Uluwatu, Bali",
    status: "completed",
    scope: null,
    instagram: "norivillas",
    // ⚠ DUMMY numbers — replace with real ones
    units: 6,                     // villas built in this project
    buildingArea: 1100,             // m² total building area
    landArea: 2000,                 // m² land
    bedrooms: "3",              // per villa
    year: 2024,                  // year completed
    duration: 16,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg"],
    featured: true
  },
  {
    id: "mizu",
    type: "boutique",
    architect: null,
    photographer: null,
    description: null,
    name: "MIZU Boutique Villas",
    location: "Uluwatu, Bali",
    status: "completed",
    scope: null,
    instagram: "mizuvillas",
    // ⚠ DUMMY numbers — replace with real ones
    units: 10,                     // villas built in this project
    buildingArea: 1500,             // m² total building area
    landArea: 3000,                 // m² land
    bedrooms: "2",              // per villa
    year: 2025,                  // year completed
    duration: 18,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg"],
    featured: true
  },
  {
    id: "theyoung",
    type: null,
    architect: null,
    photographer: null,
    description: null,
    name: "The Young Villas",
    location: "Bali",
    status: "completed",
    scope: null,
    instagram: "theyoungvillas",
    // ⚠ DUMMY numbers — replace with real ones
    units: 3,                     // villas built in this project
    buildingArea: 540,             // m² total building area
    landArea: 900,                 // m² land
    bedrooms: "1–3",              // per villa
    year: 2023,                  // year completed
    duration: 10,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg"],
    featured: true
  },

  /* ---------- UNDER CONSTRUCTION ----------
     ⚠ DUMMY DATA: photos are drawn "Sample image" placeholders, and location / progress / stage
     are guesses. Replace with real photos (same file names) and real numbers before launch. */
  {
    id: "yugen",
    name: "Yugen",
    location: "Bali",              // TODO real area, e.g. "Uluwatu, Bali"
    status: "ongoing",
    progress: 70,                  // TODO real %
    stage: "roof",                 // foundation | structure | roof | finishing | landscaping
    type: null, scope: null,
    description: null, architect: null, photographer: null, instagram: null,
    // ⚠ DUMMY numbers — replace with real ones
    units: 5,                     // villas built in this project
    buildingArea: 900,             // m² total building area
    landArea: 1600,                 // m² land
    bedrooms: "2",              // per villa
    year: null,                  // year completed
    duration: 14,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg"]
  },
  {
    id: "coppa",
    name: "Coppa",
    location: "Bali",              // TODO
    status: "ongoing",
    progress: 40,                  // TODO
    stage: "structure",
    type: null, scope: null,
    description: null, architect: null, photographer: null, instagram: null,
    // ⚠ DUMMY numbers — replace with real ones
    units: 4,                     // villas built in this project
    buildingArea: 700,             // m² total building area
    landArea: 1200,                 // m² land
    bedrooms: "2–3",              // per villa
    year: null,                  // year completed
    duration: 12,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg"]
  },
  {
    id: "borntolive",
    name: "Born to Live",
    location: "Bali",              // TODO
    status: "ongoing",
    progress: 85,                  // TODO
    stage: "finishing",
    type: null, scope: null,
    description: null, architect: null, photographer: null, instagram: null,
    // ⚠ DUMMY numbers — replace with real ones
    units: 2,                     // villas built in this project
    buildingArea: 480,             // m² total building area
    landArea: 800,                 // m² land
    bedrooms: "3",              // per villa
    year: null,                  // year completed
    duration: 10,                 // build time in months
    photos: ["1.jpg", "2.jpg", "3.jpg"]
  }

  /* Example of an ongoing project — copy, fill in, and remove the comment marks:
  ,{
    id: "villa-example",
    name: "Villa Example",
    location: "Canggu, Bali",
    status: "ongoing",
    progress: 60,
    stage: "roof",               // foundation | structure | roof | finishing | landscaping
    bedrooms: 3,
    buildingArea: 350,
    scope: "construction-material",
    photos: ["1.jpg", "2.jpg"]
  }
  */
];
