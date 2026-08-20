// QuoteVerse — Complete Quote Dataset
// Each quote contains: id, text, author, category, tags, mood

const quotes = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivation",
    tags: ["success", "work", "passion"],
    mood: "motivated"
  },
  {
    id: 2,
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "Technology",
    tags: ["innovation", "leadership", "tech"],
    mood: "ambitious"
  },
  {
    id: 3,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Motivation",
    tags: ["dreams", "future", "belief"],
    mood: "motivated"
  },
  {
    id: 4,
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Wisdom",
    tags: ["strength", "resilience", "hope"],
    mood: "calm"
  },
  {
    id: 5,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success",
    tags: ["courage", "perseverance", "failure"],
    mood: "confident"
  },
  {
    id: 6,
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Happiness",
    tags: ["happiness", "action", "self"],
    mood: "happy"
  },
  {
    id: 7,
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Wisdom",
    tags: ["opportunity", "challenge", "growth"],
    mood: "motivated"
  },
  {
    id: 8,
    text: "A friend is someone who knows all about you and still loves you.",
    author: "Elbert Hubbard",
    category: "Friendship",
    tags: ["friendship", "love", "acceptance"],
    mood: "loved"
  },
  {
    id: 9,
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Life",
    tags: ["action", "time", "growth"],
    mood: "motivated"
  },
  {
    id: 10,
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Success",
    tags: ["doubt", "future", "potential"],
    mood: "confident"
  },
  {
    id: 11,
    text: "Love is not about how many days, months, or years you have been together. It is about how much you love each other every single day.",
    author: "Unknown",
    category: "Love",
    tags: ["love", "commitment", "daily"],
    mood: "loved"
  },
  {
    id: 12,
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "Study",
    tags: ["education", "change", "power"],
    mood: "focused"
  },
  {
    id: 13,
    text: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
    category: "Creativity",
    tags: ["creativity", "intelligence", "fun"],
    mood: "happy"
  },
  {
    id: 14,
    text: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell",
    category: "Leadership",
    tags: ["leadership", "guidance", "example"],
    mood: "confident"
  },
  {
    id: 15,
    text: "Technology is best when it brings people together.",
    author: "Matt Mullenweg",
    category: "Technology",
    tags: ["technology", "connection", "people"],
    mood: "happy"
  },
  {
    id: 16,
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "Wisdom",
    tags: ["mind", "thoughts", "becoming"],
    mood: "calm"
  },
  {
    id: 17,
    text: "Do not wait to strike till the iron is hot, but make it hot by striking.",
    author: "William Butler Yeats",
    category: "Motivation",
    tags: ["action", "initiative", "determination"],
    mood: "ambitious"
  },
  {
    id: 18,
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "Life",
    tags: ["resilience", "perseverance", "glory"],
    mood: "motivated"
  },
  {
    id: 19,
    text: "Friendship is born at that moment when one person says to another, 'What! You too? I thought I was the only one.'",
    author: "C.S. Lewis",
    category: "Friendship",
    tags: ["friendship", "connection", "understanding"],
    mood: "happy"
  },
  {
    id: 20,
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "Success",
    tags: ["success", "work", "focus"],
    mood: "focused"
  },
  {
    id: 21,
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "Happiness",
    tags: ["purpose", "happiness", "life"],
    mood: "happy"
  },
  {
    id: 22,
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life",
    tags: ["life", "plans", "present"],
    mood: "calm"
  },
  {
    id: 23,
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "Motivation",
    tags: ["journey", "beginning", "possibility"],
    mood: "ambitious"
  },
  {
    id: 24,
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "Wisdom",
    tags: ["authenticity", "self", "identity"],
    mood: "confident"
  },
  {
    id: 25,
    text: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.",
    author: "Helen Keller",
    category: "Love",
    tags: ["beauty", "feeling", "heart"],
    mood: "loved"
  },
  {
    id: 26,
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    category: "Study",
    tags: ["learning", "life", "wisdom"],
    mood: "focused"
  },
  {
    id: 27,
    text: "Creativity takes courage.",
    author: "Henri Matisse",
    category: "Creativity",
    tags: ["creativity", "courage", "art"],
    mood: "confident"
  },
  {
    id: 28,
    text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.",
    author: "Jack Welch",
    category: "Leadership",
    tags: ["leadership", "growth", "success"],
    mood: "ambitious"
  },
  {
    id: 29,
    text: "Any sufficiently advanced technology is indistinguishable from magic.",
    author: "Arthur C. Clarke",
    category: "Technology",
    tags: ["technology", "magic", "future"],
    mood: "ambitious"
  },
  {
    id: 30,
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Motivation",
    tags: ["belief", "confidence", "progress"],
    mood: "confident"
  },
  {
    id: 31,
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Success",
    tags: ["action", "start", "progress"],
    mood: "motivated"
  },
  {
    id: 32,
    text: "Keep your face always toward the sunshine, and shadows will fall behind you.",
    author: "Walt Whitman",
    category: "Happiness",
    tags: ["positivity", "optimism", "sunshine"],
    mood: "happy"
  },
  {
    id: 33,
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "Study",
    tags: ["beginning", "greatness", "learning"],
    mood: "motivated"
  },
  {
    id: 34,
    text: "The true sign of intelligence is not knowledge but imagination.",
    author: "Albert Einstein",
    category: "Creativity",
    tags: ["intelligence", "imagination", "creativity"],
    mood: "calm"
  },
  {
    id: 35,
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "Wisdom",
    tags: ["inner strength", "potential", "self"],
    mood: "confident"
  }
];

export default quotes;

// Extract unique categories from the quotes data
export const categories = [...new Set(quotes.map(q => q.category))];

// Mood options with emoji and associated categories/tags
export const moods = [
  { id: "happy", emoji: "😊", label: "Happy", keywords: ["happiness", "fun", "joy", "positivity", "optimism"] },
  { id: "motivated", emoji: "🔥", label: "Motivated", keywords: ["motivation", "action", "determination", "perseverance"] },
  { id: "calm", emoji: "🧘", label: "Calm", keywords: ["peace", "mind", "thoughts", "resilience"] },
  { id: "confident", emoji: "💪", label: "Confident", keywords: ["confidence", "belief", "courage", "strength"] },
  { id: "loved", emoji: "❤️", label: "Loved", keywords: ["love", "friendship", "connection", "heart"] },
  { id: "focused", emoji: "📚", label: "Focused", keywords: ["education", "learning", "focus", "study"] },
  { id: "ambitious", emoji: "🚀", label: "Ambitious", keywords: ["innovation", "future", "leadership", "growth"] }
];
