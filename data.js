/* data.js — ALL your content lives here. Edit this file, not script.js.
   Everything below is SAMPLE content: swap in your own countries, dates and words.

   Each destination:
     id        short lowercase name; used in the page URL (destination.html?id=italy) and photo folder (images/italy/)
     name      display name
     iso       3-letter country code; this highlights the country on the map
     region    Asia | Middle East | Europe | North America (filters and the continent count are built from these)
     date      "YYYY-MM"
     ll        [latitude, longitude] for the map pin
     wonder    optional: a World Wonder you saw there (must match a name in WONDERS)
     photos    optional: number of photos, named images/<id>/1.jpg, 2.jpg ... (default 4). Cover: images/<id>/cover.jpg
     tagline, highlights, memory, extra   optional text for the destination page (hidden when left out) */

// The New 7 Wonders of the World (2007)
const WONDERS = ["Chichén Itzá", "Christ the Redeemer", "Colosseum", "Great Wall of China", "Machu Picchu", "Petra", "Taj Mahal"];

const SAMPLE_MEMORY = "Replace this with your own story. The best ones are small: a meal, a stranger, the moment the light changed.";

const DESTINATIONS = [
  // Three fully written examples (they also carry your 3 World Wonders)
  { id: "india", name: "India", iso: "IND", region: "Asia", date: "2019-03", ll: [22.9, 79.6], wonder: "Taj Mahal", photos: 5,
    tagline: "Marble at sunrise, color in every lane.",
    highlights: ["The Taj Mahal at first light", "Agra Fort at golden hour", "Street food in Old Delhi"],
    memory: SAMPLE_MEMORY,
    extra: { title: "Travel tips", items: ["Go at sunrise to beat the crowds.", "Carry small change for rickshaws."] } },
  { id: "jordan", name: "Jordan", iso: "JOR", region: "Middle East", date: "2022-03", ll: [31.2, 36.5], wonder: "Petra",
    tagline: "A rose-red city carved into the cliffs.",
    highlights: ["Walking the Siq into Petra", "The Treasury at sunrise", "Floating in the Dead Sea"],
    memory: SAMPLE_MEMORY,
    extra: { title: "Travel tips", items: ["Give Petra two days, not one.", "Wear shoes with real grip."] } },
  { id: "italy", name: "Italy", iso: "ITA", region: "Europe", date: "2023-05", ll: [42.8, 12.6], wonder: "Colosseum",
    tagline: "Ancient stone, slow dinners.",
    highlights: ["Inside the Colosseum", "The Roman Forum", "Sunset over Florence"],
    memory: SAMPLE_MEMORY,
    extra: { title: "Travel tips", items: ["Book Colosseum tickets ahead.", "Dinner starts late; plan for it."] } },

  // Stubs: only the basics. Add tagline / highlights / memory / extra whenever you like.
  { id: "thailand", name: "Thailand", iso: "THA", region: "Asia", date: "2016-12", ll: [15.1, 101.0] },
  { id: "singapore", name: "Singapore", iso: "SGP", region: "Asia", date: "2017-06", ll: [1.35, 103.82] },
  { id: "malaysia", name: "Malaysia", iso: "MYS", region: "Asia", date: "2017-06", ll: [4.2, 102.0] },
  { id: "japan", name: "Japan", iso: "JPN", region: "Asia", date: "2018-04", ll: [36.2, 138.3] },
  { id: "indonesia", name: "Indonesia", iso: "IDN", region: "Asia", date: "2018-11", ll: [-2.5, 118.0] },
  { id: "uae", name: "United Arab Emirates", iso: "ARE", region: "Middle East", date: "2019-12", ll: [24.3, 54.4] },
  { id: "oman", name: "Oman", iso: "OMN", region: "Middle East", date: "2020-02", ll: [21.5, 55.9] },
  { id: "qatar", name: "Qatar", iso: "QAT", region: "Middle East", date: "2022-12", ll: [25.3, 51.2] },
  { id: "france", name: "France", iso: "FRA", region: "Europe", date: "2023-05", ll: [46.6, 2.3] },
  { id: "switzerland", name: "Switzerland", iso: "CHE", region: "Europe", date: "2023-06", ll: [46.8, 8.2] },
  { id: "germany", name: "Germany", iso: "DEU", region: "Europe", date: "2024-09", ll: [51.2, 10.4] },
  { id: "netherlands", name: "Netherlands", iso: "NLD", region: "Europe", date: "2024-09", ll: [52.1, 5.3] },
  { id: "usa", name: "United States", iso: "USA", region: "North America", date: "2024-06", ll: [39.8, -98.6] },
  { id: "mexico", name: "Mexico", iso: "MEX", region: "North America", date: "2025-03", ll: [23.6, -102.5] },
];
