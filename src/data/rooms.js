// Room catalogue — drives the Rooms listing and the room detail pages.
// `slug` is used in the URL: /rooms/deluxe-room

export const rooms = [
  {
    slug: 'standard-room',
    index: '01',
    name: 'Standard Room',
    img: '/roompic.jpg',
    bathroom: '/bathroomstandard.jpg',
    sittingArea: '/sittingareastandard.jpg',
    blurb: 'A clean, quiet retreat with everything you need and nothing you don’t.',
    longDescription:
      'A calm, well-proportioned room with a queen bed, garden views, and the essentials done properly. Ideal for a solo traveller or a couple who value quiet over clutter.',
    price: 80000,
    tone: '#ddd8ce',
    specs: {
      Size: '24 sqm',
      Occupancy: '2 Guests',
      Bed: 'Queen',
      View: 'Garden',
      Bathroom: 'Ensuite, walk-in shower',
      Floor: '1st – 2nd',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Complimentary Wi-Fi',
      'Tea & coffee maker',
      'Daily housekeeping',
    ],
  },
  {
    slug: 'deluxe-room',
    index: '02',
    name: 'Deluxe Room',
    img: '/deluxeroom.jpg',
    bathroom: '/bathroomdeluxe.jpg',
    sittingArea: '/sittingareadeluxe.jpg',
    blurb: 'More space, a sitting area, and a view worth waking up for.',
    longDescription:
      'More space to settle in, a comfortable sitting area by the window, and the kind of quiet that makes you forget you’re in Lagos. The Deluxe opens onto pool and garden views, with morning light that makes the room feel twice its size.',
    price: 100000,
    tone: '#d5cfc5',
    specs: {
      Size: '36 sqm',
      Occupancy: '2 Adults',
      Bed: 'King',
      View: 'Pool & Garden',
      Bathroom: 'Ensuite, rain shower',
      Floor: '2nd – 3rd',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Mini bar',
      'Complimentary Wi-Fi',
      'Iron & ironing board',
      'Tea & coffee maker',
      'Room service',
    ],
  },
  {
    slug: 'pavilion-suite',
    index: '03',
    name: 'Pavilion Suite',
    img: '/pavilionroom.jpg',
    bathroom: '/bathroompavilion.jpg',
    sittingArea: '/sittingareapavilion.jpg',
    blurb: 'Our finest room — a full living area, premium bath, and the best view in the house.',
    longDescription:
      'Our finest room — a full living area, a premium bath with a soaking tub, and panoramic views across the grounds. A king bed and a sofa bed make it as suited to a family as to a guest who simply wants more room to breathe.',
    price: 120000,
    tone: '#e0dbd3',
    specs: {
      Size: '52 sqm',
      Occupancy: '3 Guests',
      Bed: 'King + Sofa Bed',
      View: 'Panoramic',
      Bathroom: 'Ensuite, soaking tub & rain shower',
      Floor: '3rd – 4th',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Mini bar',
      'Complimentary Wi-Fi',
      'Iron & ironing board',
      'Tea & coffee maker',
      '24-hour room service',
      'Separate living area',
    ],
  },
]

export function getRoom(slug) {
  return rooms.find((r) => r.slug === slug)
}

export const naira = (n) => '₦' + n.toLocaleString('en-NG')
