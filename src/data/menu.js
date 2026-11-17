// Restaurant menu — prices in Naira (₦). Source: printed hotel menu.
export const foodMenu = [
  {
    cat: 'Protein',
    items: [
      ['Assorted Meat', 7000],
      ['Beef', 7000],
      ['Boiled Egg', 1000],
      ['Cat Fish Cut', 7000],
      ['Chicken Lap', 8000],
      ['Cow Leg', 8000],
      ['Cow Tail', 8000],
      ['Croaker Fish Cut', 7000],
      ['Full Cat Fish', 20000],
      ['Full Croaker Fish', 20000],
      ['Gizzard', 7000],
      ['Goat Meat', 8000],
      ['Mangalla Fish', 10000],
      ['Snail', 12000],
      ['Turkey', 9000],
    ],
  },
  {
    cat: 'Pepper Soup',
    items: [
      ['Assorted Meat Pepper Soup', 8000],
      ['Beef Pepper Soup', 8000],
      ['Cat Fish Cut Pepper Soup', 8000],
      ['Chicken Pepper Soup', 9000],
      ['Cow Leg Pepper Soup', 9000],
    ],
  },
  {
    cat: 'Rice',
    items: [
      ['Basmati Rice', 4000],
      ['Chinese Fried Rice', 8000],
      ['Coconut Rice', 3000],
      ['Fried Rice', 4000],
      ['Jollof Rice', 3000],
      ['Native Rice', 4000],
      ['Special Fried Rice', 7000],
      ['White Rice', 3000],
    ],
  },
  {
    cat: 'Swallow',
    items: [
      ['Amala', 2000],
      ['Eba', 2000],
      ['Poundo', 3000],
      ['Semo', 2000],
      ['Wheat', 2000],
    ],
  },
  {
    cat: 'Soups',
    items: [
      ['Efo-Riro', 4000],
      ['Egusi Soup', 4000],
      ['Ogbonno Soup', 4000],
      ['Okro Soup', 4000],
      ['Seafood Okro', 8000],
    ],
  },
  {
    cat: 'Sandwich',
    items: [
      ['Pavilion Special Sandwich', 15000],
      ['Royal Club Sandwich', 11000],
      ['Tuna Sandwich', 7000],
    ],
  },
  {
    cat: 'Burger',
    items: [
      ['Beef Burger', 10000],
      ['Chicken Burger', 10000],
      ['Classic Burger', 10000],
    ],
  },
  {
    cat: 'Buffet',
    items: [
      ['Dinner Buffet', 25000],
      ['Lunch Buffet', 25000],
    ],
  },
  {
    cat: 'Dessert',
    items: [
      ['Cake of the Day', 3000],
      ['Fruit', 4000],
      ['Ice Cream', 4000],
    ],
  },
  {
    cat: 'Take Away',
    items: [['Take Away Plate', 1000]],
  },
]

export const drinksMenu = [
  {
    cat: 'Beer',
    items: [
      ['Big Stout', 3500],
      ['Budweiser', 3000],
      ['Desperado', 3000],
      ['Heineken', 3000],
      ['Orijin Beer', 2500],
      ['Small Stout', 2000],
      ['Smirnoff Ice Small', 2000],
      ['Star Radler', 2000],
      ['Trophy', 2000],
    ],
  },
  {
    cat: 'Cocktails & Mocktails',
    items: [
      ['Chapman', 5000],
      ['Gin & Tonic', 5000],
      ['Long Island', 7000],
      ['Piña Colada', 5000],
      ['Rum & Cola', 5000],
      ['Screwdriver', 5000],
      ['Sex on the Beach', 5000],
      ['Virgin Colada', 5000],
    ],
  },
  {
    cat: 'Soft Drinks',
    items: [
      ['Amstel Malt', 1500],
      ['Aquafina Water', 1000],
      ['Chivita Active Juice', 3000],
      ['Chivita Exotic Juice', 3500],
      ['Coke', 1200],
      ['Fanta', 1200],
      ['Hollandia Yoghurt', 4000],
      ['Malta Guinness', 1500],
      ['Sprite', 1200],
    ],
  },
  {
    cat: 'Wine',
    items: [
      ['Carlo Rossi Red', 20000],
      ['Carlo Rossi White', 20000],
      ['Four Cousins Red', 20000],
      ['Four Cousins Rosé', 20000],
      ['Four Cousins White', 20000],
    ],
  },
  {
    cat: 'Champagne',
    items: [
      ['André Brut', 25000],
      ['André Rosé', 25000],
    ],
  },
  {
    cat: 'Tequila, Gin & Tots',
    items: [
      ['Olmeca Tequila Bianco', 35000],
      ['Gordon Gin', 12000],
      ['Gordon Gin Tot', 2000],
      ['Olmeca Tot', 5000],
    ],
  },
  {
    cat: 'Bitters',
    items: [['Orijin Bitters', 2500]],
  },
  {
    cat: 'Energy Drinks',
    items: [['Black Bullet', 3000]],
  },
]

export const formatPrice = (n) => `₦${n.toLocaleString('en-NG')}`
