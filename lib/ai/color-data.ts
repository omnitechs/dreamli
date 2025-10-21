export type TypeOption = {
  slug: string;
  label: string;
  pricing_type: 'none' | 'percent';
  pricing_amount: number; // percent for type 'percent', 0 for 'none'
};

export type ColorOption = {
  slug: string;
  label: string;
  image: string;
};

export const TYPE_OPTIONS: TypeOption[] = [
  { slug: 'hs2lo', label: 'Basic', pricing_type: 'none', pricing_amount: 0 },
  { slug: '8tuei', label: 'Sparkle', pricing_type: 'percent', pricing_amount: 100 },
  { slug: 'kheir', label: 'Galaxy', pricing_type: 'percent', pricing_amount: 100 },
  { slug: '0qpgm', label: 'Glow', pricing_type: 'percent', pricing_amount: 150 },
  { slug: 'x5vw3', label: 'Marble', pricing_type: 'percent', pricing_amount: 100 },
  { slug: 'f87e1', label: 'Matte', pricing_type: 'none', pricing_amount: 0 },
  { slug: 'rx7f9', label: 'Metallic', pricing_type: 'percent', pricing_amount: 105 },
  { slug: 'dla8z', label: 'Translucent', pricing_type: 'percent', pricing_amount: 100 },
  { slug: 'egdqr', label: 'Wood', pricing_type: 'percent', pricing_amount: 100 },
  { slug: 'y3xpw', label: 'Silk', pricing_type: 'percent', pricing_amount: 5 },
];

export const COLOR_OPTIONS_BY_TYPE: Record<string, ColorOption[]> = {
  // Basic
  hs2lo: [
    { slug: 'arctic-whisper', label: 'Arctic Whisper', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Arctic_Whisper-150x150.avif' },
    { slug: 'bambu-green', label: 'Bambu Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Bambu_Green-2.avif' },
    { slug: 'beige', label: 'Beige', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Beige.avif' },
    { slug: 'black', label: 'Black', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Black.avif' },
    { slug: 'blue', label: 'Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Blue.avif' },
    { slug: 'blue-grey', label: 'Blue Grey', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Blue_Grey.avif' },
    { slug: 'blueberry-bubblegum', label: 'Blueberry Bubblegum', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Blueberry_Bubblegum-150x150.avif' },
    { slug: 'bright-green', label: 'Bright Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Bright_Green-150x150.avif' },
    { slug: 'bronze', label: 'Bronze', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Bronze.avif' },
    { slug: 'brown', label: 'Brown', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Brown.avif' },
    { slug: 'cobalt-blue', label: 'Cobalt Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Cobalt_Blue-150x150.avif' },
    { slug: 'cocoa-brown', label: 'Cocoa Brown', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Cocoa_Brown-150x150.avif' },
    { slug: 'cotton-candy-cloud', label: 'Cotton Candy Cloud', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Cotton_Candy_Cloud-150x150.avif' },
    { slug: 'cyan', label: 'Cyan', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Cyan.avif' },
    { slug: 'dark-gray', label: 'Dark Gray', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Dark_Gray-150x150.avif' },
    { slug: 'dusk-glare', label: 'Dusk Glare', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Dusk_Glare-150x150.avif' },
    { slug: 'gold', label: 'Gold', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Gold.avif' },
    { slug: 'gray', label: 'Gray', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Gray.avif' },
    { slug: 'hot-pink', label: 'Hot Pink', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Hot_Pink-150x150.avif' },
    { slug: 'indigo-purple', label: 'Indigo Purple', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Indigo_Purple-150x150.avif' },
    { slug: 'jade-white', label: 'Jade White', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Jade_White-150x150.avif' },
    { slug: 'light-gray', label: 'Light Gray', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Light_Gray-150x150.avif' },
    { slug: 'magenta', label: 'Magenta', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Magenta.avif' },
    { slug: 'maroon-red', label: 'Maroon Red', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Maroon_Red-150x150.avif' },
    { slug: 'mint-lime', label: 'Mint Lime', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Mint_Lime-150x150.avif' },
    { slug: 'mistletoe-green', label: 'Mistletoe Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Mistletoe_Green.avif' },
    { slug: 'ocean-to-meadow', label: 'Ocean to Meadow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Ocean_to_Meadow-150x150.avif' },
    { slug: 'orange', label: 'Orange', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Orange.avif' },
    { slug: 'pink', label: 'Pink', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Pink.avif' },
    { slug: 'pink-citrus', label: 'Pink Citrus', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Pink_Citrus-150x150.avif' },
    { slug: 'pumpkin-orange', label: 'Pumpkin Orange', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Pumpkin_Orange-150x150.avif' },
    { slug: 'purple', label: 'Purple', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Purple.avif' },
    { slug: 'red', label: 'Red', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Red.avif' },
    { slug: 'silver', label: 'Silver', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silver.avif' },
    { slug: 'solar-breeze', label: 'Solar Breeze', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Solar_Breeze-150x150.avif' },
    { slug: 'sunflower-yellow', label: 'Sunflower Yellow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Sunflower_Yellow-150x150.avif' },
    { slug: 'turquoise', label: 'Turquoise', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Turquoise-150x150.avif' },
    { slug: 'yellow', label: 'Yellow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Yellow.avif' },
  ],
  // Sparkle
  '8tuei': [
    { slug: 'alpine-green-sparkle', label: 'Alpine Green Sparkle', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Alpine_Green_Sparkle.avif' },
    { slug: 'classic-gold-sparkle', label: 'Classic Gold Sparkle', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Classic_Gold_Sparkle.avif' },
    { slug: 'crimson-red-sparkle', label: 'Crimson Red Sparkle', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Crimson_Red_Sparkle.avif' },
    { slug: 'onyx-black-sparkle', label: 'Onyx Black Sparkle', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Onyx_Black_Sparkle.avif' },
    { slug: 'royal-purple-sparkle', label: 'Royal Purple Sparkle', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Royal_Purple_Sparkle.avif' },
    { slug: 'slate-gray-sparkle', label: 'Slate Gray Sparkle', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Slate_Gray_Sparkle.avif' },
  ],
  // Galaxy
  kheir: [
    { slug: 'brown-galaxy', label: 'Brown Galaxy', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Brown_Galaxy.avif' },
    { slug: 'green-galaxy', label: 'Green Galaxy', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Green_Galaxy.avif' },
    { slug: 'nebulae-galaxy', label: 'Nebulae Galaxy', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Nebulae_Galaxy.avif' },
    { slug: 'purple-galaxy', label: 'Purple Galaxy', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Purple_Galaxy.avif' },
  ],
  // Glow
  '0qpgm': [
    { slug: 'glow-blue', label: 'Glow Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Glow_Blue.avif' },
    { slug: 'glow-green', label: 'Glow Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Glow_Green.avif' },
    { slug: 'glow-orange', label: 'Glow Orange', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Glow_Orange.avif' },
    { slug: 'glow-pink', label: 'Glow Pink', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Glow_Pink.avif' },
    { slug: 'glow-yellow', label: 'Glow Yellow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Glow_Yellow.avif' },
    { slug: 'dusk-glare', label: 'Dusk Glare', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Dusk_Glare-150x150.avif' },
  ],
  // Marble
  'x5vw3': [
    { slug: 'red-granite-marble', label: 'Red Granite Marble', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Red_Granite_Marble.avif' },
    { slug: 'white-marble', label: 'White Marble', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/White_Marble.avif' },
  ],
  // Matte
  'f87e1': [
    { slug: 'matte-apple-green', label: 'Matte Apple Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Apple_Green-150x150.avif' },
    { slug: 'matte-ash-gray', label: 'Matte Ash Gray', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Ash_Gray.avif' },
    { slug: 'matte-bone-white', label: 'Matte Bone White', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Bone_White-150x150.avif' },
    { slug: 'matte-caramel', label: 'Matte Caramel', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Caramel-150x150.avif' },
    { slug: 'matte-charcoal', label: 'Matte Charcoal', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Charcoal.avif' },
    { slug: 'matte-dark-blue', label: 'Matte Dark Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Dark_Blue.avif' },
    { slug: 'matte-dark-brown', label: 'Matte Dark Brown', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Dark_Brown.avif' },
    { slug: 'matte-dark-chocolate', label: 'Matte Dark Chocolate', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Dark_Chocolate-150x150.avif' },
    { slug: 'matte-dark-green', label: 'Matte Dark Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Dark_Green.avif' },
    { slug: 'matte-dark-red', label: 'Matte Dark Red', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Dark_Red.avif' },
    { slug: 'matte-desert-tan', label: 'Matte Desert Tan', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Desert_Tan.avif' },
    { slug: 'matte-grass-green', label: 'Matte Grass Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Grass_Green.avif' },
    { slug: 'matte-ice-blue', label: 'Matte Ice Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Ice_Blue.avif' },
    { slug: 'matte-ivory-white', label: 'Matte Ivory White', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Ivory_White.avif' },
    { slug: 'matte-latte-brown', label: 'Matte Latte Brown', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Latte_Brown.avif' },
    { slug: 'matte-lemon-yellow', label: 'Matte Lemon Yellow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Lemon_Yellow.avif' },
    { slug: 'matte-lilac-purple', label: 'Matte Lilac Purple', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Lilac_Purple.avif' },
    { slug: 'matte-mandarin-orange', label: 'Matte Mandarin Orange', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Mandarin_Orange.avif' },
    { slug: 'matte-marine-blue', label: 'Matte Marine Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Marine_Blue.avif' },
    { slug: 'matte-nardo-gray', label: 'Matte Nardo Gray', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Nardo_Gray-150x150.avif' },
    { slug: 'matte-plum', label: 'Matte Plum', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Plum-150x150.avif' },
    { slug: 'matte-sakura-pink', label: 'Matte Sakura Pink', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Sakura_Pink.avif' },
    { slug: 'matte-scarlet-red', label: 'Matte Scarlet Red', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Scarlet_Red.avif' },
    { slug: 'matte-sky-blue', label: 'Matte Sky Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Sky_Blue-150x150.avif' },
    { slug: 'matte-terracotta', label: 'Matte Terracotta', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Matte_Terracotta-150x150.avif' },
  ],
  // Metallic
  'rx7f9': [
    { slug: 'cobalt-blue-metallic', label: 'Cobalt Blue Metallic', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Cobalt_Blue_Metallic.avif' },
    { slug: 'copper-brown-metallic', label: 'Copper Brown Metallic', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Copper_Brown_Metallic.avif' },
    { slug: 'iridium-gold-metallic', label: 'Iridium Gold Metallic', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Iridium_Gold_Metallic.avif' },
    { slug: 'iron-gray-metallic', label: 'Iron Gray Metallic', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Iron_Gray_Metallic.avif' },
    { slug: 'oxide-green-metallic', label: 'Oxide Green Metallic', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Oxide_Green_Metallic.avif' },
  ],
  // Translucent
  'dla8z': [
    { slug: 'translucent-blue', label: 'Translucent Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Blue-150x150.avif' },
    { slug: 'translucent-cherry-pink', label: 'Translucent Cherry Pink', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Cherry_Pink-150x150.avif' },
    { slug: 'translucent-ice-blue', label: 'Translucent Ice Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Ice_Blue-150x150.avif' },
    { slug: 'translucent-lavender', label: 'Translucent Lavender', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Lavender-150x150.avif' },
    { slug: 'translucent-light-jade', label: 'Translucent Light Jade', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Light_Jade-150x150.avif' },
    { slug: 'translucent-mellow-yellow', label: 'Translucent Mellow Yellow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Mellow_Yellow-150x150.avif' },
    { slug: 'translucent-orange', label: 'Translucent Orange', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Orange-150x150.avif' },
    { slug: 'translucent-purple', label: 'Translucent Purple', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Purple-150x150.avif' },
    { slug: 'translucent-red', label: 'Translucent Red', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Red-150x150.avif' },
    { slug: 'translucent-teal', label: 'Translucent Teal', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Translucent_Teal-150x150.avif' },
  ],
  // Wood
  'egdqr': [
    { slug: 'wood-black-walnut', label: 'Wood Black Walnut', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Wood_Black_Walnut.avif' },
    { slug: 'wood-classic-birch', label: 'Wood Classic Birch', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Wood_Classic_Birch.avif' },
    { slug: 'wood-clay-brown', label: 'Wood Clay Brown', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Wood_Clay_Brown.avif' },
    { slug: 'wood-ochre-yellow', label: 'Wood Ochre Yellow', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Wood_Ochre_Yellow.avif' },
    { slug: 'wood-rosewood', label: 'Wood Rosewood', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Wood_Rosewood.avif' },
    { slug: 'wood-white-oak', label: 'Wood White Oak', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Wood_White_Oak.avif' },
  ],
  // Silk
  'y3xpw': [
    { slug: 'silk-aurora-purple', label: 'Silk Aurora Purple', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Aurora_Purple-150x150.avif' },
    { slug: 'silk-baby-blue', label: 'Silk Baby Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Baby_Blue.avif' },
    { slug: 'silk-blue', label: 'Silk Blue', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Blue.avif' },
    { slug: 'silk-blue-hawaii', label: 'Silk Blue Hawaii', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Blue_Hawaii-150x150.avif' },
    { slug: 'silk-candy-green', label: 'Silk Candy Green', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Candy_Green.avif' },
    { slug: 'silk-candy-red', label: 'Silk Candy Red', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Candy_Red.avif' },
    { slug: 'silk-champagne', label: 'Silk Champagne', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Champagne.avif' },
    { slug: 'silk-dawn-radiance', label: 'Silk Dawn Radiance', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Dawn_Radiance-150x150.avif' },
    { slug: 'silk-gilded-rose', label: 'Silk Gilded Rose', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Gilded_Rose-150x150.avif' },
    { slug: 'silk-gold', label: 'Silk Gold', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Gold.avif' },
    { slug: 'silk-midnight-blaze', label: 'Silk Midnight Blaze', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Midnight_Blaze-150x150.avif' },
    { slug: 'silk-mint', label: 'Silk Mint', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Mint.avif' },
    { slug: 'silk-neon-city', label: 'Silk Neon City', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Neon_City-150x150.avif' },
    { slug: 'silk-pink', label: 'Silk Pink', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Pink.avif' },
    { slug: 'silk-purple', label: 'Silk Purple', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Purple.avif' },
    { slug: 'silk-rose-gold', label: 'Silk Rose Gold', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Rose_Gold.avif' },
    { slug: 'silk-silver', label: 'Silk Silver', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Silver.avif' },
    { slug: 'silk-south-beach', label: 'Silk South Beach', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/South_Beach-150x150.avif' },
    { slug: 'silk-titan-gray', label: 'Silk Titan Gray', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_Titan_Gray.avif' },
    { slug: 'silk-velvet-eclipse', label: 'Silk Velvet Eclipse', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Velvet_Eclipse-1-150x150.avif' },
    { slug: 'silk-white', label: 'Silk White', image: 'https://shop.dreamli.nl/wp-content/uploads/2025/09/Silk_White.avif' },
  ],
};
