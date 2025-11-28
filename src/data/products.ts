export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_count: number;
  in_stock: boolean;
  stone_type?: string;
  style?: string;
  occasion?: string;
}

export const luxuryHealingBracelets: Product[] = [
  {
    id: '1',
    name: 'Celestial Amethyst Healing Bracelet',
    description: 'Premium AAA-grade amethyst stones set in 18K white gold. Known for promoting calmness, balance, and peace. Each stone is hand-selected for its exceptional clarity and deep purple hue.',
    price: 2870,
    category: 'Luxury Healing',
    image_url: 'https://images.pexels.com/photos/6011555/pexels-photo-6011555.jpeg',
    stock_count: 10,
    in_stock: true,
    stone_type: 'Amethyst',
    style: 'Luxury',
    occasion: 'Special Occasions'
  },
  {
    id: '2',
    name: 'Rose Quartz Divine Love Bracelet',
    description: 'Exquisite rose quartz crystals in 14K rose gold setting. The stone of unconditional love and infinite peace. Promotes compassion, tenderness, and emotional healing.',
    price: 2450,
    category: 'Luxury Healing',
    image_url: 'https://images.pexels.com/photos/7697409/pexels-photo-7697409.jpeg',
    stock_count: 10,
    in_stock: true,
    stone_type: 'Rose Quartz',
    style: 'Luxury',
    occasion: 'Daily Wear'
  },
  {
    id: '3',
    name: 'Black Tourmaline Protection Bracelet',
    description: 'Rare black tourmaline stones in sterling silver with gold accents. Powerful protective stone that repels negative energy and promotes emotional stability.',
    price: 1895,
    category: 'Luxury Healing',
    image_url: 'https://images.pexels.com/photos/8442322/pexels-photo-8442322.jpeg',
    stock_count: 10,
    in_stock: true,
    stone_type: 'Black Tourmaline',
    style: 'Luxury',
    occasion: 'Daily Wear'
  },
  {
    id: '4',
    name: 'Jade Prosperity & Harmony Bracelet',
    description: 'Imperial green jade beads set in 18K yellow gold. Attracts good luck and prosperity while promoting harmony and balance. Highly prized in Eastern traditions.',
    price: 2650,
    category: 'Luxury Healing',
    image_url: 'https://images.pexels.com/photos/6011554/pexels-photo-6011554.jpeg',
    stock_count: 10,
    in_stock: true,
    stone_type: 'Jade',
    style: 'Luxury',
    occasion: 'Special Occasions'
  },
  {
    id: '5',
    name: 'Clear Quartz Energy Amplifier',
    description: 'Master healing crystal in platinum setting. Clear quartz amplifies energy and thought, bringing clarity and harmony. Known as the most versatile healing stone.',
    price: 2299,
    category: 'Luxury Healing',
    image_url: 'https://images.pexels.com/photos/8442321/pexels-photo-8442321.jpeg',
    stock_count: 10,
    in_stock: true,
    stone_type: 'Clear Quartz',
    style: 'Luxury',
    occasion: 'Daily Wear'
  },
  {
    id: '6',
    name: 'Lapis Lazuli Wisdom Bracelet',
    description: 'Deep blue lapis lazuli with gold pyrite flecks, set in 14K gold. Stone of wisdom and truth. Enhances intellectual ability and stimulates enlightenment.',
    price: 2180,
    category: 'Luxury Healing',
    image_url: 'https://images.pexels.com/photos/6011553/pexels-photo-6011553.jpeg',
    stock_count: 10,
    in_stock: true,
    stone_type: 'Lapis Lazuli',
    style: 'Luxury',
    occasion: 'Special Occasions'
  }
];

export const fashionBracelets: Product[] = [
  {
    id: '7',
    name: 'Crystal Tennis Bracelet',
    description: 'AAA quality cubic zirconia stones in a classic tennis bracelet design. Brilliant sparkle and timeless elegance for everyday glamour.',
    price: 89,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434598/pexels-photo-10434598.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Classic',
    occasion: 'Daily Wear'
  },
  {
    id: '8',
    name: 'Golden Chain Link Bracelet',
    description: 'Bold gold-plated chain link design. Perfect statement piece that adds sophistication to any outfit. Durable and tarnish-resistant.',
    price: 69,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442323/pexels-photo-8442323.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Modern',
    occasion: 'Daily Wear'
  },
  {
    id: '9',
    name: 'Pearl Strand Bracelet',
    description: 'AAA quality freshwater pearls with sterling silver clasp. Elegant and feminine, perfect for adding a touch of grace to any ensemble.',
    price: 95,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442315/pexels-photo-8442315.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Classic',
    occasion: 'Formal'
  },
  {
    id: '10',
    name: 'Rose Gold Cuff Bracelet',
    description: 'Sleek rose gold plated cuff with minimalist design. Adjustable and comfortable, perfect for stacking or wearing alone.',
    price: 79,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434597/pexels-photo-10434597.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Modern',
    occasion: 'Daily Wear'
  },
  {
    id: '11',
    name: 'Sapphire Blue Crystal Bracelet',
    description: 'Deep blue AAA crystals that shimmer like real sapphires. Stunning color and brilliant cut make this an eye-catching accessory.',
    price: 92,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442314/pexels-photo-8442314.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Elegant',
    occasion: 'Special Occasions'
  },
  {
    id: '12',
    name: 'Charm Bracelet Collection',
    description: 'Delicate silver chain with removable charms. Customize your story with interchangeable pendants. Comes with 3 starter charms.',
    price: 75,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442320/pexels-photo-8442320.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Casual',
    occasion: 'Daily Wear'
  },
  {
    id: '13',
    name: 'Infinity Symbol Bracelet',
    description: 'Sterling silver infinity symbol with AAA crystals. Represents eternal love and friendship. Perfect gift for someone special.',
    price: 85,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434599/pexels-photo-10434599.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Romantic',
    occasion: 'Gift'
  },
  {
    id: '14',
    name: 'Beaded Crystal Stretch Bracelet',
    description: 'Colorful AAA crystal beads on elastic cord. Easy to wear, no clasp needed. Available in rainbow colors for vibrant style.',
    price: 49,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442319/pexels-photo-8442319.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Casual',
    occasion: 'Daily Wear'
  },
  {
    id: '15',
    name: 'Art Deco Vintage Bracelet',
    description: 'Inspired by 1920s glamour. Geometric design with clear crystals and antiqued gold finish. A timeless piece of wearable art.',
    price: 98,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442318/pexels-photo-8442318.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Vintage',
    occasion: 'Special Occasions'
  },
  {
    id: '16',
    name: 'Double Wrap Leather Bracelet',
    description: 'Premium Italian leather with sterling silver accents. Wraps twice around wrist for bohemian chic look. Adjustable sizing.',
    price: 65,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434596/pexels-photo-10434596.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Bohemian',
    occasion: 'Casual'
  },
  {
    id: '17',
    name: 'Emerald Green Crystal Bracelet',
    description: 'Vibrant emerald-colored AAA crystals in silver setting. Rich color and brilliant sparkle. Perfect for adding pop of color.',
    price: 88,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442317/pexels-photo-8442317.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Elegant',
    occasion: 'Formal'
  },
  {
    id: '18',
    name: 'Minimalist Bar Bracelet',
    description: 'Simple gold bar on delicate chain. Sleek and modern design. Can be personalized with engraving. Perfect for everyday elegance.',
    price: 72,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434595/pexels-photo-10434595.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Minimalist',
    occasion: 'Daily Wear'
  },
  {
    id: '19',
    name: 'Stacking Bracelet Set',
    description: 'Set of 3 coordinating bracelets. Mix of textures and finishes - smooth, textured, and crystal-embellished. Wear together or separately.',
    price: 95,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442316/pexels-photo-8442316.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Modern',
    occasion: 'Daily Wear'
  },
  {
    id: '20',
    name: 'Byzantine Chain Bracelet',
    description: 'Intricate Byzantine weave in gold plating. Traditional craftsmanship meets modern style. Strong and substantial feel.',
    price: 82,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434594/pexels-photo-10434594.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Traditional',
    occasion: 'Daily Wear'
  },
  {
    id: '21',
    name: 'Rainbow Gemstone Bracelet',
    description: 'Multi-colored AAA crystals representing chakras. Each stone brings different energy and meaning. Beautiful spectrum of colors.',
    price: 91,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442313/pexels-photo-8442313.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Bohemian',
    occasion: 'Daily Wear'
  },
  {
    id: '22',
    name: 'Filigree Cuff Bracelet',
    description: 'Delicate filigree metalwork in antique silver. Intricate lace-like patterns. Lightweight yet statement-making.',
    price: 78,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434593/pexels-photo-10434593.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Vintage',
    occasion: 'Special Occasions'
  },
  {
    id: '23',
    name: 'Snake Chain Bracelet',
    description: 'Smooth snake chain in sterling silver. Fluid movement and comfortable fit. Classic design that never goes out of style.',
    price: 68,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442312/pexels-photo-8442312.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Classic',
    occasion: 'Daily Wear'
  },
  {
    id: '24',
    name: 'Heart Charm Bracelet',
    description: 'Multiple heart charms in mixed metals. Romantic and playful. Perfect for expressing love and affection.',
    price: 76,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434592/pexels-photo-10434592.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Romantic',
    occasion: 'Gift'
  },
  {
    id: '25',
    name: 'Magnetic Closure Bracelet',
    description: 'Easy-on magnetic clasp with crystal pavé. Perfect for those who struggle with traditional clasps. Secure and stylish.',
    price: 84,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442311/pexels-photo-8442311.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Practical',
    occasion: 'Daily Wear'
  },
  {
    id: '26',
    name: 'Twisted Rope Bracelet',
    description: 'Gold and silver twisted together in rope design. Durable and eye-catching. Mixed metal look is very on-trend.',
    price: 73,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434591/pexels-photo-10434591.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Modern',
    occasion: 'Daily Wear'
  },
  {
    id: '27',
    name: 'Crystal Flower Bracelet',
    description: 'Delicate flower motifs with crystal centers. Feminine and garden-inspired. Perfect for spring and summer style.',
    price: 87,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442310/pexels-photo-8442310.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Romantic',
    occasion: 'Special Occasions'
  },
  {
    id: '28',
    name: 'Geometric Link Bracelet',
    description: 'Modern geometric shapes in brushed gold. Contemporary design for the fashion-forward. Architectural and bold.',
    price: 81,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434590/pexels-photo-10434590.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Modern',
    occasion: 'Daily Wear'
  },
  {
    id: '29',
    name: 'Evil Eye Protection Bracelet',
    description: 'Traditional evil eye charm with blue crystals. Believed to ward off negative energy. Beautiful and meaningful.',
    price: 67,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442309/pexels-photo-8442309.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Spiritual',
    occasion: 'Daily Wear'
  },
  {
    id: '30',
    name: 'Hammered Metal Cuff',
    description: 'Hand-hammered texture in mixed metals. Artisan-crafted look. Each piece has unique variations. Substantial and stylish.',
    price: 93,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/10434589/pexels-photo-10434589.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Artisan',
    occasion: 'Daily Wear'
  },
  {
    id: '31',
    name: 'Crystal Slider Bracelet',
    description: 'Adjustable slider closure with sparkling crystals. One size fits all. Easy to put on and comfortable to wear.',
    price: 71,
    category: 'Fashion',
    image_url: 'https://images.pexels.com/photos/8442308/pexels-photo-8442308.jpeg',
    stock_count: 10,
    in_stock: true,
    style: 'Practical',
    occasion: 'Daily Wear'
  }
];

export const allProducts = [...luxuryHealingBracelets, ...fashionBracelets];

export const categories = [
  { id: '1', name: 'Luxury Healing', description: 'Premium healing crystals and gemstones' },
  { id: '2', name: 'Fashion', description: 'Affordable AAA quality fashion bracelets' }
];
