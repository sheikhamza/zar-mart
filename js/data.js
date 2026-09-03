export const categories = [
  { id: "dairy", name: "Dairy", icon: "fa-cheese" },
  { id: "bakery", name: "Bakery", icon: "fa-bread-slice" },
  { id: "beverages", name: "Beverages", icon: "fa-mug-hot" },
  { id: "snacks", name: "Snacks", icon: "fa-cookie-bite" },
  { id: "cooking", name: "Cooking", icon: "fa-fire-burner" },
  { id: "cleaning", name: "Cleaning", icon: "fa-spray-can-sparkles" },
  { id: "personal-care", name: "Personal Care", icon: "fa-pump-soap" },
  { id: "baby-care", name: "Baby Care", icon: "fa-baby" },
  { id: "fruits-vegetables", name: "Fruits & Vegetables", icon: "fa-carrot" },
  { id: "meat-frozen", name: "Meat & Frozen", icon: "fa-drumstick-bite" },
  { id: "household", name: "Household", icon: "fa-house" },
  { id: "breakfast", name: "Breakfast", icon: "fa-egg" },
];

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;

export const products = [
  // Dairy
  { id: 1, name: "Milk 1 Liter", category: "dairy", price: 180, oldPrice: 200, discount: 10, unit: "1 Liter", image: img("1563636619-e9143da7973b"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 2, name: "Eggs (12 pcs)", category: "dairy", price: 240, oldPrice: 260, discount: 8, unit: "12 pcs", image: img("1516467508483-a7212febe31a"), description: "Farm fresh white eggs packed with protein.", stock: true, popular: true, featured: true, tags: ["eggs", "protein", "fresh"] },
  { id: 3, name: "Butter 200g", category: "dairy", price: 350, oldPrice: 380, discount: 8, unit: "200g", image: img("1589985270724-aa2644a22885"), description: "Creamy salted butter for cooking and spreading.", stock: true, popular: false, featured: false, tags: ["butter", "dairy"] },
  { id: 4, name: "Yogurt 500g", category: "dairy", price: 120, oldPrice: 140, discount: 14, unit: "500g", image: img("1571212515417-828026f4b173"), description: "Thick creamy yogurt, perfect for breakfast.", stock: true, popular: true, featured: false, tags: ["yogurt", "dairy"] },
  // Bakery
  { id: 5, name: "White Bread", category: "bakery", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1509440159596-0249088772ff"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "bakery", "fresh"] },
  { id: 6, name: "Brown Bread", category: "bakery", price: 150, oldPrice: 170, discount: 12, unit: "Loaf", image: img("1586444247842-3899b5004c82"), description: "Whole wheat brown bread, high in fiber.", stock: true, popular: false, featured: false, tags: ["bread", "healthy"] },
  { id: 7, name: "Croissant Pack", category: "bakery", price: 280, oldPrice: 320, discount: 13, unit: "4 pcs", image: img("1555507036-ab1f4038808a"), description: "Buttery flaky croissants, bakery fresh.", stock: true, popular: false, featured: true, tags: ["croissant", "bakery"] },
  { id: 8, name: "Rusk Pack", category: "bakery", price: 95, oldPrice: 110, discount: 14, unit: "300g", image: img("1608198395868-de28d25317402"), description: "Crispy tea rusk, perfect with morning chai.", stock: true, popular: true, featured: false, tags: ["rusk", "tea", "snack"] },
  // Beverages
  { id: 9, name: "Orange Juice 1L", category: "beverages", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100% pure orange juice, no added sugar.", stock: true, popular: true, featured: true, tags: ["juice", "orange", "drink"] },
  { id: 10, name: "Mineral Water 1.5L", category: "beverages", price: 60, oldPrice: 70, discount: 14, unit: "1.5 Liter", image: img("1548839140-29a7493981b5"), description: "Pure mineral water, pack of 1.", stock: true, popular: true, featured: false, tags: ["water", "drink"] },
  { id: 11, name: "Cola 1.5L", category: "beverages", price: 150, oldPrice: 170, discount: 12, unit: "1.5 Liter", image: img("1554866585-cd02180665f1"), description: "Refreshing cola drink for parties and meals.", stock: true, popular: false, featured: false, tags: ["cola", "soft drink"] },
  { id: 12, name: "Green Tea Box", category: "beverages", price: 320, oldPrice: 360, discount: 11, unit: "25 bags", image: img("1556679343-219538b12f9d"), description: "Premium green tea bags, antioxidant rich.", stock: true, popular: false, featured: false, tags: ["tea", "green tea"] },
  // Snacks
  { id: 13, name: "Potato Chips", category: "snacks", price: 80, oldPrice: 90, discount: 11, unit: "150g", image: img("1566478983877-231106549c1d"), description: "Crispy salted potato chips.", stock: true, popular: true, featured: true, tags: ["chips", "snacks"] },
  { id: 14, name: "Biscuit Pack", category: "snacks", price: 65, oldPrice: 75, discount: 13, unit: "200g", image: img("1558961363-fa8bdb86c5f5"), description: "Sweet cream biscuits for tea time.", stock: true, popular: true, featured: false, tags: ["biscuits", "snacks", "tea"] },
  { id: 15, name: "Mixed Nuts 250g", category: "snacks", price: 450, oldPrice: 500, discount: 10, unit: "250g", image: img("1599590959508-9a7a2a0e0a0e"), description: "Premium roasted mixed nuts.", stock: true, popular: false, featured: false, tags: ["nuts", "healthy", "snacks"] },
  { id: 16, name: "Chocolate Bar", category: "snacks", price: 120, oldPrice: 140, discount: 14, unit: "90g", image: img("1548907044-217daff745b2"), description: "Rich milk chocolate bar.", stock: true, popular: true, featured: false, tags: ["chocolate", "sweet"] },
  // Cooking
  { id: 17, name: "Cooking Oil 1L", category: "cooking", price: 520, oldPrice: 550, discount: 5, unit: "1 Liter", image: img("1474979266404-7eaacbcd87c5"), description: "100% pure cooking oil for daily healthy meals.", stock: true, popular: true, featured: true, tags: ["oil", "cooking"] },
  { id: 18, name: "Basmati Rice 5kg", category: "cooking", price: 1200, oldPrice: 1350, discount: 11, unit: "5 kg", image: img("1586201375761-83865001e26c"), description: "Premium long grain basmati rice.", stock: true, popular: true, featured: true, tags: ["rice", "basmati", "staple"] },
  { id: 19, name: "Salt 800g", category: "cooking", price: 35, oldPrice: 40, discount: 13, unit: "800g", image: img("1609501671932-73e1244d5b9c"), description: "Iodized table salt for everyday cooking.", stock: true, popular: false, featured: false, tags: ["salt", "cooking"] },
  { id: 20, name: "Red Chili Powder", category: "cooking", price: 180, oldPrice: 200, discount: 10, unit: "200g", image: img("1596040033229-a9821ebd058d"), description: "Fine ground red chili powder for curries.", stock: true, popular: false, featured: false, tags: ["spices", "chili"] },
  // Cleaning
  { id: 21, name: "Dish Wash Liquid", category: "cleaning", price: 250, oldPrice: 280, discount: 11, unit: "500ml", image: img("1563453393392-3265ff2759b1"), description: "Powerful grease-cutting dish wash liquid.", stock: true, popular: true, featured: false, tags: ["cleaning", "dish wash"] },
  { id: 22, name: "Floor Cleaner 1L", category: "cleaning", price: 320, oldPrice: 360, discount: 11, unit: "1 Liter", image: img("1583947213862-2a26b763ee08"), description: "Antibacterial floor cleaner with fresh scent.", stock: true, popular: false, featured: false, tags: ["cleaning", "floor"] },
  { id: 23, name: "Laundry Detergent", category: "cleaning", price: 450, oldPrice: 500, discount: 10, unit: "1 kg", image: img("1610557892470-55d9d6b5e0a0"), description: "Powerful stain removal laundry detergent.", stock: true, popular: true, featured: false, tags: ["laundry", "detergent"] },
  { id: 24, name: "Toilet Cleaner", category: "cleaning", price: 180, oldPrice: 200, discount: 10, unit: "500ml", image: img("1628177142136-443b0b0c0c0c"), description: "Deep cleaning toilet bowl cleaner.", stock: true, popular: false, featured: false, tags: ["cleaning", "toilet"] },
  // Personal Care
  { id: 25, name: "Shampoo 400ml", category: "personal-care", price: 380, oldPrice: 420, discount: 10, unit: "400ml", image: img("1522335781063-9a0a0a0a0a0a"), description: "Nourishing shampoo for all hair types.", stock: true, popular: true, featured: false, tags: ["shampoo", "hair care"] },
  { id: 26, name: "Toothpaste 120g", category: "personal-care", price: 220, oldPrice: 250, discount: 12, unit: "120g", image: img("1559591930-0c0c0c0c0c0c"), description: "Fluoride toothpaste for cavity protection.", stock: true, popular: true, featured: false, tags: ["toothpaste", "dental"] },
  { id: 27, name: "Soap Bar 3 Pack", category: "personal-care", price: 150, oldPrice: 170, discount: 12, unit: "3 pcs", image: img("1556228720-195a672e8a03"), description: "Moisturizing soap bars for daily use.", stock: true, popular: false, featured: false, tags: ["soap", "bath"] },
  { id: 28, name: "Hand Sanitizer", category: "personal-care", price: 180, oldPrice: 200, discount: 10, unit: "250ml", image: img("1584433144829-0a0a0a0a0a0a"), description: "70% alcohol hand sanitizer gel.", stock: true, popular: false, featured: false, tags: ["sanitizer", "hygiene"] },
  // Baby Care
  { id: 29, name: "Baby Diapers M", category: "baby-care", price: 850, oldPrice: 950, discount: 11, unit: "32 pcs", image: img("1584464491031-829443396107"), description: "Soft absorbent diapers for medium size babies.", stock: true, popular: true, featured: false, tags: ["baby", "diapers"] },
  { id: 30, name: "Baby Wipes 80pcs", category: "baby-care", price: 280, oldPrice: 320, discount: 13, unit: "80 pcs", image: img("1615485920500-0a0a0a0a0a0a"), description: "Gentle hypoallergenic baby wipes.", stock: true, popular: false, featured: false, tags: ["baby", "wipes"] },
  { id: 31, name: "Baby Powder 200g", category: "baby-care", price: 320, oldPrice: 350, discount: 9, unit: "200g", image: img("1555252337-9f7e8e8e8e8e"), description: "Talc-free baby powder for soft skin.", stock: true, popular: false, featured: false, tags: ["baby", "powder"] },
  // Fruits & Vegetables
  { id: 32, name: "Fresh Apples 1kg", category: "fruits-vegetables", price: 280, oldPrice: 320, discount: 13, unit: "1 kg", image: img("1560806887-1e4cd0b6cbd6"), description: "Crisp red apples, farm fresh.", stock: true, popular: true, featured: true, tags: ["apple", "fruit", "fresh"] },
  { id: 33, name: "Bananas 1 Dozen", category: "fruits-vegetables", price: 150, oldPrice: 170, discount: 12, unit: "12 pcs", image: img("1571771894821-ce9b6c11b08e"), description: "Ripe yellow bananas, rich in potassium.", stock: true, popular: true, featured: false, tags: ["banana", "fruit"] },
  { id: 34, name: "Tomatoes 1kg", category: "fruits-vegetables", price: 120, oldPrice: 140, discount: 14, unit: "1 kg", image: img("1546094113-0ea0a0a0a0a0"), description: "Fresh red tomatoes for cooking.", stock: true, popular: true, featured: false, tags: ["tomato", "vegetable"] },
  { id: 35, name: "Onions 1kg", category: "fruits-vegetables", price: 90, oldPrice: 100, discount: 10, unit: "1 kg", image: img("1518977956812-c2773eaa36e0"), description: "Fresh white onions for daily cooking.", stock: true, popular: false, featured: false, tags: ["onion", "vegetable"] },
  // Meat & Frozen
  { id: 36, name: "Chicken Breast 1kg", category: "meat-frozen", price: 650, oldPrice: 720, discount: 10, unit: "1 kg", image: img("1604509104696-f0a0a0a0a0a0"), description: "Fresh boneless chicken breast.", stock: true, popular: true, featured: true, tags: ["chicken", "meat", "protein"] },
  { id: 37, name: "Beef Mince 500g", category: "meat-frozen", price: 480, oldPrice: 520, discount: 8, unit: "500g", image: img("1603048292624-0a0a0a0a0a0a"), description: "Premium lean beef mince.", stock: true, popular: false, featured: false, tags: ["beef", "meat"] },
  { id: 38, name: "Frozen Fries 1kg", category: "meat-frozen", price: 350, oldPrice: 400, discount: 13, unit: "1 kg", image: img("1573080496219-a0a0a0a0a0a0"), description: "Crispy frozen french fries, ready to cook.", stock: true, popular: true, featured: false, tags: ["frozen", "fries"] },
  // Household
  { id: 39, name: "Toilet Paper 12 Roll", category: "household", price: 420, oldPrice: 460, discount: 9, unit: "12 rolls", image: img("1584433144829-0a0a0a0a0a0a"), description: "Soft 2-ply toilet paper rolls.", stock: true, popular: true, featured: false, tags: ["toilet paper", "household"] },
  { id: 40, name: "Tissue Box 200", category: "household", price: 180, oldPrice: 200, discount: 10, unit: "200 sheets", image: img("1610557892470-55d9d6b5e0a0"), description: "Soft facial tissues in convenient box.", stock: true, popular: false, featured: false, tags: ["tissue", "household"] },
  { id: 41, name: "Garbage Bags 30", category: "household", price: 250, oldPrice: 280, discount: 11, unit: "30 pcs", image: img("1583947213862-2a26b763ee08"), description: "Heavy duty garbage bags, medium size.", stock: true, popular: false, featured: false, tags: ["bags", "household"] },
  // Breakfast
  { id: 42, name: "Corn Flakes 500g", category: "breakfast", price: 380, oldPrice: 420, discount: 10, unit: "500g", image: img("1615485920500-0a0a0a0a0a0a"), description: "Crispy corn flakes cereal for breakfast.", stock: true, popular: true, featured: true, tags: ["cereal", "breakfast"] },
  { id: 43, name: "Honey 500g", category: "breakfast", price: 650, oldPrice: 720, discount: 10, unit: "500g", image: img("1587049643240-0a0a0a0a0a0a"), description: "Pure natural honey, no additives.", stock: true, popular: false, featured: false, tags: ["honey", "breakfast", "natural"] },
  { id: 44, name: "Peanut Butter 340g", category: "breakfast", price: 480, oldPrice: 520, discount: 8, unit: "340g", image: img("1599590959508-9a7a2a0e0a0e"), description: "Creamy peanut butter spread.", stock: true, popular: true, featured: false, tags: ["peanut butter", "breakfast"] },
  { id: 45, name: "Oats 1kg", category: "breakfast", price: 320, oldPrice: 360, discount: 11, unit: "1 kg", image: img("1517673400607-5d0a0a0a0a0a"), description: "Whole grain rolled oats for healthy breakfast.", stock: true, popular: false, featured: false, tags: ["oats", "healthy", "breakfast"] },
];

export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}
