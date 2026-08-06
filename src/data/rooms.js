// Room catalogue — drives the Rooms listing and the room detail pages.
// `slug` is used in the URL: /rooms/deluxe-room
// `name` MUST match the room_types.name values in supabase/availability.sql.

export const rooms = [
  {
    slug: 'single-room',
    index: '01',
    name: 'Single Room',
    img: '/single-room.jpg',
    bathroom: '/bath-single.jpg',
    sittingArea: '/sitting-single.jpg',
    blurb: 'A tidy, comfortable room for one — everything you need for a restful stay.',
    longDescription:
      'A compact, well-kept room built for a solo traveller. A comfortable bed, quiet air conditioning, and a clean ensuite — simple, affordable, and easy to settle into after a long day.',
    price: 50000,
    tone: '#ddd8ce',
    specs: {
      Size: '18 sqm',
      Occupancy: '1 Guest',
      Bed: 'Single',
      View: 'Courtyard',
      Bathroom: 'Ensuite, walk-in shower',
      Floor: '1st – 2nd',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Complimentary Wi-Fi',
      'Daily housekeeping',
    ],
  },
  {
    slug: 'standard-room',
    index: '02',
    name: 'Standard Room',
    img: '/standard-room.jpg',
    bathroom: '/bath-standard.jpg',
    sittingArea: '/sitting-standard.jpg',
    blurb: 'A clean, quiet retreat with everything you need and nothing you don’t.',
    longDescription:
      'A calm, well-proportioned room with a double bed, a work desk, and the essentials done properly. Ideal for a solo traveller or a couple who value quiet over clutter.',
    price: 60000,
    tone: '#d5cfc5',
    specs: {
      Size: '24 sqm',
      Occupancy: '2 Guests',
      Bed: 'Double',
      View: 'Garden',
      Bathroom: 'Ensuite, walk-in shower',
      Floor: '1st – 2nd',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Work desk',
      'Complimentary Wi-Fi',
      'Tea & coffee maker',
      'Daily housekeeping',
    ],
  },
  {
    slug: 'deluxe-room',
    index: '03',
    name: 'Deluxe Room',
    img: '/deluxe-room.jpg',
    bathroom: '/bath-deluxe.jpg',
    sittingArea: '/sitting-deluxe.jpg',
    blurb: 'More space, a sitting area, and a view worth waking up for.',
    longDescription:
      'More space to settle in, a comfortable sitting area by the window, and the kind of quiet that makes you forget you’re in Lagos. The Deluxe pairs a generous bed with a proper desk and morning light that makes the room feel twice its size.',
    price: 70000,
    tone: '#e0dbd3',
    specs: {
      Size: '32 sqm',
      Occupancy: '2 Guests',
      Bed: 'King',
      View: 'Garden',
      Bathroom: 'Ensuite, rain shower',
      Floor: '2nd – 3rd',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Mini bar',
      'Work desk',
      'Complimentary Wi-Fi',
      'Iron & ironing board',
      'Tea & coffee maker',
      'Room service',
    ],
  },
  {
    slug: 'twin-bed-room',
    index: '04',
    name: 'Twin Bed Room',
    img: '/twin-bed-room.jpg',
    bathroom: '/bath-twin.jpg',
    sittingArea: '/sitting-twin.jpg',
    blurb: 'Two full beds and room to spread out — made for friends, family, or colleagues.',
    longDescription:
      'Our most spacious room, with two full beds and plenty of room between them. Perfect for friends, colleagues travelling together, or a family — the same comfort and finish as the Deluxe, with twice the sleeping space.',
    price: 90000,
    tone: '#d8d3c9',
    specs: {
      Size: '38 sqm',
      Occupancy: '2 – 4 Guests',
      Bed: 'Two Doubles',
      View: 'Garden',
      Bathroom: 'Ensuite, rain shower',
      Floor: '2nd – 3rd',
    },
    amenities: [
      'Air conditioning',
      'Flat-screen TV',
      'In-room safe',
      'Mini bar',
      'Work desk',
      'Complimentary Wi-Fi',
      'Iron & ironing board',
      'Tea & coffee maker',
      '24-hour room service',
    ],
  },
]

export function getRoom(slug) {
  return rooms.find((r) => r.slug === slug)
}

export const naira = (n) => '₦' + n.toLocaleString('en-NG')
