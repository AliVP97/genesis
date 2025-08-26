const MOCK_RESPONSE = {
  busMap: [
    {
      floorNumber: 1,
      column: 4,
      row: 9,
      seat: [
        {
          x: 1,
          y: 1,
          seatNumber: 3,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 2,
          y: 1,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 1,
          seatNumber: 2,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 4,
          y: 1,
          seatNumber: 1,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 1,
          y: 2,
          seatNumber: 6,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 2,
          y: 2,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 2,
          seatNumber: 5,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 4,
          y: 2,
          seatNumber: 4,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 1,
          y: 3,
          seatNumber: 9,
          availability: 'SEAT_UNAVAILABLE_WOMAN',
        },
        {
          x: 2,
          y: 3,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 3,
          seatNumber: 8,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 4,
          y: 3,
          seatNumber: 7,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 1,
          y: 4,
          seatNumber: 12,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 2,
          y: 4,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 4,
          seatNumber: 11,
          availability: 'SEAT_UNAVAILABLE_WOMAN',
        },
        {
          x: 4,
          y: 4,
          seatNumber: 10,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 1,
          y: 5,
          seatNumber: 13,
          availability: 'SEAT_UNAVAILABLE_WOMAN',
        },
        {
          x: 2,
          y: 5,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 5,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 4,
          y: 5,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 1,
          y: 6,
          seatNumber: 16,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 2,
          y: 6,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 6,
          seatNumber: 15,
          availability: 'SEAT_UNAVAILABLE_WOMAN',
        },
        {
          x: 4,
          y: 6,
          seatNumber: 14,
          availability: 'SEAT_UNAVAILABLE_WOMAN',
        },
        {
          x: 1,
          y: 7,
          seatNumber: 19,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 2,
          y: 7,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 7,
          seatNumber: 18,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 4,
          y: 7,
          seatNumber: 17,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 1,
          y: 8,
          seatNumber: 22,
          availability: 'SEAT_UNAVAILABLE_WOMAN',
        },
        {
          x: 2,
          y: 8,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 8,
          seatNumber: 21,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 4,
          y: 8,
          seatNumber: 20,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 1,
          y: 9,
          seatNumber: 25,
          availability: 'SEAT_UNAVAILABLE_MAN',
        },
        {
          x: 2,
          y: 9,
          seatNumber: 0,
          availability: 'UNDEFINED',
        },
        {
          x: 3,
          y: 9,
          seatNumber: 24,
          availability: 'SEAT_AVAILABLE',
        },
        {
          x: 4,
          y: 9,
          seatNumber: 23,
          availability: 'SEAT_AVAILABLE',
        },
      ],
    },
  ],
};

// app/api/users/route.js
export async function GET(request: Request) {
  // Handle GET request for users
  return new Response(JSON.stringify(MOCK_RESPONSE));
}

export async function POST(request: Request) {
  // Handle POST request to create a user
  return new Response('User created');
}
