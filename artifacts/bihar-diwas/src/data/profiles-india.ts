import type { Profile } from "./profiles";

const indianBios = [
  "College student 📚 | Music lover 🎵",
  "Shopping | Travel | Coffee ☕",
  "Dancer 💃 | Foodie 🍕",
  "Simple girl with big dreams ✨",
  "Fitness freak | Instagrammer 📷",
  "Chai lover ☕ | Hindi songs 🎵",
  "Travel goals 🌍 | Cooking 🍳",
  "Gamer girl 🎮 | Movie buff 🎬",
  "Art & craft lover 🎨 | Dog mom 🐾",
  "Cricket fan 🏏 | Bookworm 📖",
];

function photo(n: number): string {
  return `https://randomuser.me/api/portraits/women/${76 + (n % 24)}.jpg`;
}

export const indiaFemaleProfiles: Profile[] = [
  { id: 101, name: "Nandini Kumari", age: 20, city: "Patna", gender: "female", bio: indianBios[0], photos: [photo(0)] },
  { id: 102, name: "Khushi Singh", age: 19, city: "Patna", gender: "female", bio: indianBios[1], photos: [photo(1)] },
  { id: 103, name: "Priyanka Yadav", age: 21, city: "Patna", gender: "female", bio: indianBios[2], photos: [photo(2)] },
  { id: 104, name: "Shalini Devi", age: 18, city: "Patna", gender: "female", bio: indianBios[3], photos: [photo(3)] },
  { id: 105, name: "Anita Sinha", age: 22, city: "Patna", gender: "female", bio: indianBios[4], photos: [photo(4)] },
  { id: 106, name: "Babita Jha", age: 20, city: "Patna", gender: "female", bio: indianBios[5], photos: [photo(5)] },
  { id: 107, name: "Rinku Kumari", age: 19, city: "Patna", gender: "female", bio: indianBios[6], photos: [photo(6)] },
  { id: 108, name: "Komal Pandey", age: 21, city: "Patna", gender: "female", bio: indianBios[7], photos: [photo(7)] },

  { id: 109, name: "Aanya Sharma", age: 19, city: "Delhi", gender: "female", bio: indianBios[8], photos: [photo(8)] },
  { id: 110, name: "Sia Kapoor", age: 20, city: "Delhi", gender: "female", bio: indianBios[9], photos: [photo(9)] },
  { id: 111, name: "Diksha Verma", age: 21, city: "Delhi", gender: "female", bio: indianBios[0], photos: [photo(10)] },
  { id: 112, name: "Mehak Arora", age: 18, city: "Delhi", gender: "female", bio: indianBios[1], photos: [photo(11)] },
  { id: 113, name: "Srishti Gupta", age: 22, city: "Delhi", gender: "female", bio: indianBios[2], photos: [photo(12)] },
  { id: 114, name: "Nikita Joshi", age: 20, city: "Delhi", gender: "female", bio: indianBios[3], photos: [photo(13)] },
  { id: 115, name: "Aditi Malhotra", age: 19, city: "Delhi", gender: "female", bio: indianBios[4], photos: [photo(14)] },
  { id: 116, name: "Ishika Rajput", age: 21, city: "Delhi", gender: "female", bio: indianBios[5], photos: [photo(15)] },

  { id: 117, name: "Prachi Mehta", age: 20, city: "Mumbai", gender: "female", bio: indianBios[6], photos: [photo(16)] },
  { id: 118, name: "Shruti Desai", age: 19, city: "Mumbai", gender: "female", bio: indianBios[7], photos: [photo(17)] },
  { id: 119, name: "Ridhima Nair", age: 22, city: "Mumbai", gender: "female", bio: indianBios[8], photos: [photo(18)] },
  { id: 120, name: "Asmita Shah", age: 18, city: "Mumbai", gender: "female", bio: indianBios[9], photos: [photo(19)] },
  { id: 121, name: "Sanjana Iyer", age: 21, city: "Mumbai", gender: "female", bio: indianBios[0], photos: [photo(20)] },
  { id: 122, name: "Tanvi Patil", age: 20, city: "Mumbai", gender: "female", bio: indianBios[1], photos: [photo(21)] },
  { id: 123, name: "Vidhi Dalal", age: 19, city: "Mumbai", gender: "female", bio: indianBios[2], photos: [photo(22)] },
  { id: 124, name: "Devyani Kulkarni", age: 22, city: "Mumbai", gender: "female", bio: indianBios[3], photos: [photo(23)] },

  { id: 125, name: "Maya Fernandes", age: 20, city: "Goa", gender: "female", bio: indianBios[4], photos: [photo(0)] },
  { id: 126, name: "Tara D'Souza", age: 19, city: "Goa", gender: "female", bio: indianBios[5], photos: [photo(1)] },
  { id: 127, name: "Anisha Borkar", age: 21, city: "Goa", gender: "female", bio: indianBios[6], photos: [photo(2)] },
  { id: 128, name: "Leena Kamat", age: 18, city: "Goa", gender: "female", bio: indianBios[7], photos: [photo(3)] },
  { id: 129, name: "Tia Naik", age: 20, city: "Goa", gender: "female", bio: indianBios[8], photos: [photo(4)] },
  { id: 130, name: "Rhea Pinto", age: 22, city: "Goa", gender: "female", bio: indianBios[9], photos: [photo(5)] },
  { id: 131, name: "Alexa Gomes", age: 19, city: "Goa", gender: "female", bio: indianBios[0], photos: [photo(6)] },

  { id: 132, name: "Riya Chatterjee", age: 20, city: "Kolkata", gender: "female", bio: indianBios[1], photos: [photo(7)] },
  { id: 133, name: "Shreya Ghosh", age: 19, city: "Kolkata", gender: "female", bio: indianBios[2], photos: [photo(8)] },
  { id: 134, name: "Brishti Roy", age: 21, city: "Kolkata", gender: "female", bio: indianBios[3], photos: [photo(9)] },
  { id: 135, name: "Poulomi Sen", age: 18, city: "Kolkata", gender: "female", bio: indianBios[4], photos: [photo(10)] },
  { id: 136, name: "Swagata Bose", age: 22, city: "Kolkata", gender: "female", bio: indianBios[5], photos: [photo(11)] },
  { id: 137, name: "Mouli Das", age: 20, city: "Kolkata", gender: "female", bio: indianBios[6], photos: [photo(12)] },
  { id: 138, name: "Sohini Mukherjee", age: 19, city: "Kolkata", gender: "female", bio: indianBios[7], photos: [photo(13)] },

  { id: 139, name: "Akshara Reddy", age: 21, city: "Bengaluru", gender: "female", bio: indianBios[8], photos: [photo(14)] },
  { id: 140, name: "Aadhya Rao", age: 19, city: "Bengaluru", gender: "female", bio: indianBios[9], photos: [photo(15)] },
  { id: 141, name: "Kavyashree Naidu", age: 20, city: "Bengaluru", gender: "female", bio: indianBios[0], photos: [photo(16)] },
  { id: 142, name: "Snehal Hegde", age: 22, city: "Bengaluru", gender: "female", bio: indianBios[1], photos: [photo(17)] },
  { id: 143, name: "Megha Pillai", age: 18, city: "Bengaluru", gender: "female", bio: indianBios[2], photos: [photo(18)] },
  { id: 144, name: "Preethi Menon", age: 21, city: "Bengaluru", gender: "female", bio: indianBios[3], photos: [photo(19)] },
  { id: 145, name: "Rachita Kumar", age: 20, city: "Bengaluru", gender: "female", bio: indianBios[4], photos: [photo(20)] },

  { id: 146, name: "Muskan Agarwal", age: 19, city: "Agra", gender: "female", bio: indianBios[5], photos: [photo(21)] },
  { id: 147, name: "Kajal Rastogi", age: 21, city: "Agra", gender: "female", bio: indianBios[6], photos: [photo(22)] },
  { id: 148, name: "Chanchal Tiwari", age: 20, city: "Agra", gender: "female", bio: indianBios[7], photos: [photo(23)] },
  { id: 149, name: "Reetika Singh", age: 18, city: "Agra", gender: "female", bio: indianBios[8], photos: [photo(0)] },
  { id: 150, name: "Sakina Khan", age: 22, city: "Agra", gender: "female", bio: indianBios[9], photos: [photo(1)] },
];
