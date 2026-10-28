export type Sitter = {
  id: string;
  name: string;
  area: string;
  price: number;
  rating: number;
  reviews: number;
  experience: string;
  bio: string;
  image: string;
  avatar: string;
  tags: string[];
  verified: string[];
  capacity: number;
  available: boolean;
  home: string;
};
export const sitters: Sitter[] = [
  {
    id: "maya-shah",
    name: "Maya Shah",
    area: "Defence Colony, New Delhi",
    price: 1800,
    rating: 4.98,
    reviews: 42,
    experience: "6 years of care",
    bio: "A calm, pet-loving home with slow mornings, sunny naps and plenty of gentle play. I care for every guest as if they were part of my family.",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=85",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=160&q=80",
    tags: ["Dogs", "Cats", "Small pets", "Garden"],
    verified: ["Identity submitted", "Home visit pending"],
    capacity: 2,
    available: true,
    home: "A light-filled ground-floor home with a secure garden, cool tiled floors and a quiet corner for every guest.",
  },
  {
    id: "aarav-mehta",
    name: "Aarav Mehta",
    area: "Hauz Khas, New Delhi",
    price: 1500,
    rating: 4.95,
    reviews: 31,
    experience: "4 years of care",
    bio: "I work from home and love long walks around the neighbourhood. My days are structured around each pet’s familiar routines.",
    image:
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1000&q=85",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    tags: ["Dogs", "Puppies", "Walks"],
    verified: ["Identity approved", "Address approved"],
    capacity: 3,
    available: true,
    home: "A relaxed apartment near leafy walking trails, with supervised play and a dedicated pet lounge.",
  },
  {
    id: "nisha-kapoor",
    name: "Nisha Kapoor",
    area: "Greater Kailash II, New Delhi",
    price: 2200,
    rating: 5.0,
    reviews: 26,
    experience: "8 years of care",
    bio: "Experienced with senior pets and gentle routines. I keep the home peaceful and send thoughtful daily notes so you can feel close.",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=85",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    tags: ["Dogs", "Cats", "Senior pets", "Medication"],
    verified: ["Identity approved", "Address approved", "Home reviewed"],
    capacity: 2,
    available: false,
    home: "A peaceful, pet-friendly home with soft beds, a shaded balcony and a quiet room for rest.",
  },
  {
    id: "kabir-rao",
    name: "Kabir Rao",
    area: "Lajpat Nagar, New Delhi",
    price: 1200,
    rating: 4.91,
    reviews: 18,
    experience: "3 years of care",
    bio: "Playful, attentive care for curious dogs. We make time for enrichment, sniff walks and all the belly rubs they ask for.",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1000&q=85",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    tags: ["Dogs", "Outdoor space", "Walks"],
    verified: ["Identity submitted"],
    capacity: 2,
    available: true,
    home: "A welcoming home close to a neighbourhood park, with plenty of room for supervised play.",
  },
];
export const pets = [
  {
    id: "pepper",
    name: "Pepper",
    breed: "Indie · 3 years",
    type: "Dog",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "miso",
    name: "Miso",
    breed: "Domestic shorthair · 2 years",
    type: "Cat",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=240&q=80",
  },
];
export const initialBookings = [
  {
    id: "PC-2048",
    sitter: "Maya Shah",
    sitterId: "maya-shah",
    pet: "Pepper",
    dates: "Nov 12 – Nov 16, 2026",
    status: "Pending",
    total: 7200,
  },
  {
    id: "PC-1982",
    sitter: "Aarav Mehta",
    sitterId: "aarav-mehta",
    pet: "Miso",
    dates: "Oct 04 – Oct 06, 2026",
    status: "Completed",
    total: 3000,
  },
  {
    id: "PC-2110",
    sitter: "Nisha Kapoor",
    sitterId: "nisha-kapoor",
    pet: "Pepper",
    dates: "Dec 20 – Dec 24, 2026",
    status: "Upcoming",
    total: 8800,
  },
];
export const image =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1400&q=85";
