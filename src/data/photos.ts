import type { Photo } from './types';

/** Editorial stock photos (graded to one cool, neutral look). Credited on /credits. */
export const photos: Photo[] = [
  {
    "key": "texture",
    "file": "texture.jpg",
    "alt": "A single swipe of white cream on a pale grey surface",
    "photographer": "Jocelyn Morales",
    "photographerUrl": "https://unsplash.com/@molnj",
    "photoUrl": "https://unsplash.com/photos/JiqTLjzEH18",
    "site": "Unsplash",
    "license": "Unsplash License"
  },
  {
    "key": "skin",
    "file": "skin.jpg",
    "alt": "Close-up of a bare shoulder with small droplets of water",
    "photographer": "HUUM",
    "photographerUrl": "https://unsplash.com/@huumsauna",
    "photoUrl": "https://unsplash.com/photos/hZQLs0Pq2Qg",
    "site": "Unsplash",
    "license": "Unsplash License"
  },
  {
    "key": "shelf",
    "file": "shelf.jpg",
    "alt": "A white sink with three unlabelled amber bottles and a bar of soap",
    "photographer": "Monstera Production",
    "photographerUrl": "https://www.pexels.com/@gabby-k/",
    "photoUrl": "https://www.pexels.com/photo/sink-with-mirror-bottles-of-soap-and-cosmetic-oil-in-bathroom-6781116/",
    "site": "Pexels",
    "license": "Pexels License"
  },
  {
    "key": "male-street",
    "file": "male-street.jpg",
    "alt": "A quiet tree-lined street in Malé in the morning, with parked motorbikes",
    "photographer": "Mohamedh Masood",
    "photographerUrl": "https://unsplash.com/@konmmesmeehaku",
    "photoUrl": "https://unsplash.com/photos/h9mwRh_YXYo",
    "site": "Unsplash",
    "license": "Unsplash License"
  },
  {
    "key": "male-street-2",
    "file": "male-street-2.jpg",
    "alt": "The Malé skyline seen across calm blue sea",
    "photographer": "Shahaaim",
    "photographerUrl": "https://unsplash.com/@shahaaim",
    "photoUrl": "https://unsplash.com/photos/zWArmO0uA6Q",
    "site": "Unsplash",
    "license": "Unsplash License"
  },
  {
    "key": "lab",
    "file": "lab.jpg",
    "alt": "Clear laboratory glassware on a white surface",
    "photographer": "Ron Lach",
    "photographerUrl": "https://www.pexels.com/@ron-lach/",
    "photoUrl": "https://www.pexels.com/photo/glass-laboratory-equipment-casting-shadows-on-white-surface-10181423/",
    "site": "Pexels",
    "license": "Pexels License"
  },
  {
    "key": "water",
    "file": "water.jpg",
    "alt": "Calm turquoise lagoon water seen from above",
    "photographer": "Afrah",
    "photographerUrl": "https://unsplash.com/@ahmedafrah",
    "photoUrl": "https://unsplash.com/photos/9Ub-rAcplZg",
    "site": "Unsplash",
    "license": "Unsplash License"
  },
  {
    "key": "dropper",
    "file": "dropper.jpg",
    "alt": "A glass dropper releasing a drop of clear serum onto a fingertip",
    "photographer": "Karola G",
    "photographerUrl": "https://www.pexels.com/@karola-g/",
    "photoUrl": "https://www.pexels.com/photo/droplets-dripping-from-clear-dropper-4735907/",
    "site": "Pexels",
    "license": "Pexels License"
  }
];

export const photo = (key: string) => {
  const p = photos.find((x) => x.key === key);
  if (!p) throw new Error(`Missing photo ${key}`);
  return p;
};
