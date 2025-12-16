import apiClient from "./apiClient";

export const fetchEvents = async (category) => {
  try {
    let url = "/events";
    if (category && category !== 'all') {
      url += `?category=${category}`;
    }
    const response = await apiClient.get(url);
    return response.data.events || [];
  } catch (error) {
    console.error("Failed to fetch events from backend", error);
    return [];
  }
};

export const fetchEventById = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch event details", error);
    return null;
  }
};

export const fetchCategories = async () => {
  // Mock categories or fetch from backend if endpoint exists
  return [
    { id: 'all', label: 'All Events' },
    { id: 'Concert', label: 'Concerts' },
    { id: 'Conference', label: 'Conferences' },
    { id: 'Sports', label: 'Sports' },
    { id: 'Art', label: 'Arts & Theater' },
    { id: 'Comedy', label: 'Comedy' },
    { id: 'Workshop', label: 'Workshops' },
    { id: 'Exhibition', label: 'Exhibitions' }
  ];
};

export const searchEvents = async (query) => {
  try {
    const response = await apiClient.get(`/events?search=${query}`);
    return response.data.events || [];
  } catch (error) {
    return [];
  }
};

export const fetchUserTickets = async () => {
  try {
    const response = await apiClient.get('/bookings/my-tickets');
    if (response.data.success) {
      return response.data.bookings;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch user tickets", error);
    return [];
  }
};

export const bookEvent = async (event) => {
  const quantity = event.quantity || 1;
  const passedNames = event.attendeeNames || []; // Array of names
  const newTickets = [];

  // Sequential Seat Generation for Group Booking
  const rows = ['A', 'B', 'C', 'D', 'E', 'VIP'];
  const randomRow = rows[Math.floor(Math.random() * rows.length)];
  const startNum = Math.floor(Math.random() * 50) + 1;

  for (let i = 0; i < quantity; i++) {
    const uniqueId = `TIX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const seat = `${randomRow}-${startNum + i}`;

    // Determine Attendee Name
    let attendeeName = passedNames[i] || "Guest User";
    if (!passedNames[i]) {
      try {
        const userStr = localStorage.getItem('eventorbit_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          attendeeName = user.fullName || user.name || "Guest User";
        }
      } catch (e) { console.error(e); }
    }

    const pricePaid = event.pricePaid ? (event.pricePaid / quantity) : event.price;
    const ticketData = {
      ...event,
      ticketId: uniqueId,
      bookedDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      seat: seat,
      attendeeName: attendeeName,
      pricePaid: pricePaid
    };

    // Send to Backend
    try {
      await apiClient.post('/bookings', {
        event: event.id, // Assuming event has .id from EventCard
        seatType: event.selectedType || 'Regular',
        seatNumber: seat,
        amountPaid: pricePaid,
        qrCode: uniqueId,
        attendeeName: attendeeName // Send specific name
      });
      newTickets.push(ticketData);
    } catch (error) {
      console.error("Booking failed for ticket", i, error);
      return { success: false, message: 'Failed to book one or more tickets. Please try again.' };
    }
  }

  // Reload cache from server implies fetchUserTickets will now be used,
  // so no need to manually update local storage cache for "My Tickets" if we switch to API-first
  // but for safety we can clear the cache or just let the new logic handle it.
  localStorage.removeItem('user_tickets');

  return {
    success: true,
    message: `Successfully booked ${quantity} ticket(s)!`,
    tickets: newTickets
  };
};
// ... (existing code)

export const fetchReviews = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/reviews`);
    return response.data.reviews || [];
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return [];
  }
};

export const submitReview = async (eventId, { rating, comment }) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/reviews`, { rating, comment });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
