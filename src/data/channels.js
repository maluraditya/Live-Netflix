// All videos are Blender Foundation open films — freely embeddable on YouTube.
// Thumbnails pulled directly from YouTube's CDN.
const yt = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const CHANNELS = [
  {
    id: 'comedy',
    name: 'Comedy Central',
    category: 'Comedy',
    emoji: '😂',
    tagline: 'Non-stop laughs, 24/7',
    color: 'from-yellow-500 to-orange-500',
    accentColor: '#f59e0b',
    thumbnail: yt('YE7VzlLtp-4'),
    playlist: [
      { videoId: 'YE7VzlLtp-4', title: 'Big Buck Bunny',       duration: 596, genre: 'Animated Comedy' },
      { videoId: 'pz6HbPiaN0E', title: 'Sprite Fright',        duration: 602, genre: 'Comedy Short'    },
      { videoId: '1LiqCFBMG_k', title: 'Coffee Run',           duration: 190, genre: 'Comedy'          },
      { videoId: 'SkVqJ1SGeL0', title: 'Caminandes: Llamigos', duration: 152, genre: 'Animated'        },
      { videoId: 'mN0zPOpADL4', title: 'Agent 327',            duration: 203, genre: 'Action Comedy'   },
    ],
  },
  {
    id: 'romance',
    name: 'Love Stories',
    category: 'Romance',
    emoji: '💕',
    tagline: 'Love is always in the air',
    color: 'from-pink-500 to-rose-600',
    accentColor: '#ec4899',
    thumbnail: yt('eRsGyueVLvQ'),
    playlist: [
      { videoId: 'eRsGyueVLvQ', title: 'Sintel',                 duration: 888, genre: 'Drama'          },
      { videoId: '1LiqCFBMG_k', title: 'Coffee Run',             duration: 190, genre: 'Short Film'     },
      { videoId: 'SkVqJ1SGeL0', title: 'Caminandes: Llamigos',   duration: 152, genre: 'Animated Drama' },
      { videoId: '_9LX9HSU9NM', title: "Elephant's Dream",       duration: 654, genre: 'Drama'          },
      { videoId: 'YE7VzlLtp-4', title: 'Big Buck Bunny',         duration: 596, genre: 'Feel Good'      },
    ],
  },
  {
    id: 'action',
    name: 'Action Zone',
    category: 'Action',
    emoji: '💥',
    tagline: 'Heart-pounding thrills',
    color: 'from-red-600 to-orange-600',
    accentColor: '#ef4444',
    thumbnail: yt('R6MlUcmOul8'),
    playlist: [
      { videoId: 'R6MlUcmOul8', title: 'Tears of Steel',       duration: 734, genre: 'Sci-Fi Action'   },
      { videoId: 'mN0zPOpADL4', title: 'Agent 327',            duration: 203, genre: 'Action'          },
      { videoId: 'Y-rmzh0PI3c', title: 'Cosmos Laundromat',    duration: 729, genre: 'Action Drama'    },
      { videoId: 'pz6HbPiaN0E', title: 'Sprite Fright',        duration: 602, genre: 'Action Comedy'   },
      { videoId: 'eRsGyueVLvQ', title: 'Sintel',               duration: 888, genre: 'Adventure'       },
    ],
  },
  {
    id: 'thriller',
    name: 'Dark Suspense',
    category: 'Thriller',
    emoji: '🔪',
    tagline: 'Keep you on the edge',
    color: 'from-purple-700 to-indigo-800',
    accentColor: '#8b5cf6',
    thumbnail: yt('Y-rmzh0PI3c'),
    playlist: [
      { videoId: 'Y-rmzh0PI3c', title: 'Cosmos Laundromat',    duration: 729, genre: 'Psychological'   },
      { videoId: 'R6MlUcmOul8', title: 'Tears of Steel',       duration: 734, genre: 'Sci-Fi Thriller' },
      { videoId: 'eRsGyueVLvQ', title: 'Sintel',               duration: 888, genre: 'Dark Fantasy'    },
      { videoId: '_9LX9HSU9NM', title: "Elephant's Dream",     duration: 654, genre: 'Mystery'         },
    ],
  },
  {
    id: 'documentary',
    name: 'Discovery',
    category: 'Documentary',
    emoji: '🌍',
    tagline: 'Real stories, real world',
    color: 'from-teal-500 to-cyan-600',
    accentColor: '#14b8a6',
    thumbnail: yt('_9LX9HSU9NM'),
    playlist: [
      { videoId: '_9LX9HSU9NM', title: "Elephant's Dream",          duration: 654, genre: 'Experimental'  },
      { videoId: 'Y-rmzh0PI3c', title: 'Cosmos Laundromat',         duration: 729, genre: 'Philosophical' },
      { videoId: 'YE7VzlLtp-4', title: 'Big Buck Bunny: In Nature', duration: 596, genre: 'Nature'        },
      { videoId: 'mN0zPOpADL4', title: 'Agent 327: Production',     duration: 203, genre: 'Making Of'     },
      { videoId: '1LiqCFBMG_k', title: 'Coffee Run',                duration: 190, genre: 'Short Doc'     },
    ],
  },
  {
    id: 'scifi',
    name: 'Sci-Fi Universe',
    category: 'Sci-Fi',
    emoji: '🚀',
    tagline: 'Beyond the known universe',
    color: 'from-blue-600 to-violet-700',
    accentColor: '#3b82f6',
    thumbnail: yt('R6MlUcmOul8'),
    playlist: [
      { videoId: 'R6MlUcmOul8', title: 'Tears of Steel',       duration: 734, genre: 'Sci-Fi'           },
      { videoId: '_9LX9HSU9NM', title: "Elephant's Dream",     duration: 654, genre: 'Sci-Fi Animated'  },
      { videoId: 'Y-rmzh0PI3c', title: 'Cosmos Laundromat',    duration: 729, genre: 'Sci-Fi Drama'     },
      { videoId: 'eRsGyueVLvQ', title: 'Sintel',               duration: 888, genre: 'Fantasy Sci-Fi'   },
      { videoId: 'pz6HbPiaN0E', title: 'Sprite Fright',        duration: 602, genre: 'Sci-Fi Comedy'    },
    ],
  },
];

export const TRENDING = [
  { id: 't1', title: 'Neon Nights',     genre: 'Thriller',     thumbnail: `https://picsum.photos/seed/neon/300/170`,     rating: '9.1', year: 2024 },
  { id: 't2', title: 'Starfall',        genre: 'Sci-Fi',       thumbnail: `https://picsum.photos/seed/starfall/300/170`, rating: '8.8', year: 2024 },
  { id: 't3', title: 'The Heist',       genre: 'Action',       thumbnail: `https://picsum.photos/seed/heist/300/170`,    rating: '8.5', year: 2023 },
  { id: 't4', title: 'Love in Lisbon',  genre: 'Romance',      thumbnail: `https://picsum.photos/seed/lisbon/300/170`,   rating: '8.2', year: 2024 },
  { id: 't5', title: 'Comic Chaos',     genre: 'Comedy',       thumbnail: `https://picsum.photos/seed/chaos/300/170`,    rating: '8.0', year: 2024 },
  { id: 't6', title: 'Deep Current',    genre: 'Documentary',  thumbnail: `https://picsum.photos/seed/current/300/170`,  rating: '9.3', year: 2024 },
  { id: 't7', title: 'Phantom Signal',  genre: 'Sci-Fi',       thumbnail: `https://picsum.photos/seed/phantom/300/170`,  rating: '8.7', year: 2023 },
  { id: 't8', title: 'Crimson Tide',    genre: 'Action',       thumbnail: `https://picsum.photos/seed/crimson/300/170`,  rating: '8.4', year: 2024 },
];

export const NEW_ARRIVALS = [
  { id: 'n1', title: 'Arctic Silence',  genre: 'Thriller',    thumbnail: `https://picsum.photos/seed/arctic/300/170`,  rating: '8.9', year: 2025 },
  { id: 'n2', title: 'Café Chronicles', genre: 'Romance',     thumbnail: `https://picsum.photos/seed/cafe/300/170`,    rating: '7.8', year: 2025 },
  { id: 'n3', title: 'Quantum Break',   genre: 'Sci-Fi',      thumbnail: `https://picsum.photos/seed/quantum/300/170`, rating: '8.6', year: 2025 },
  { id: 'n4', title: 'Street Kings',    genre: 'Action',      thumbnail: `https://picsum.photos/seed/street/300/170`,  rating: '8.1', year: 2025 },
  { id: 'n5', title: 'The Laughing Man',genre: 'Comedy',      thumbnail: `https://picsum.photos/seed/laugh/300/170`,   rating: '7.9', year: 2025 },
  { id: 'n6', title: 'Wild Pulse',      genre: 'Documentary', thumbnail: `https://picsum.photos/seed/wild/300/170`,    rating: '9.0', year: 2025 },
  { id: 'n7', title: 'Mirror Dark',     genre: 'Thriller',    thumbnail: `https://picsum.photos/seed/mirror/300/170`,  rating: '8.3', year: 2025 },
];

// Hero uses Tears of Steel — most cinematic of the Blender films
export const HERO_CONTENT = {
  title: 'Tears of Steel',
  tagline: 'Now Streaming',
  description: 'In a dystopian future, a group of rebels attempt to take control of an AI that could save — or destroy — what remains of humanity.',
  genre: ['Sci-Fi', 'Action', 'Drama'],
  rating: '9.1',
  year: 2012,
  videoId: 'R6MlUcmOul8',
};
