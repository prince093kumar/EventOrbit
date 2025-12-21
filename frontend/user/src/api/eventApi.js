import apiClient from "./apiClient";

export const fetchEvents = async (category) => {
  try {
    const url = category && category !== 'all' ? `/events?category=${category}` : '/events';
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
    { id: 'Comedy', label: 'Comedy' }
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
      return response.data.bookings.map(booking => ({
        ...booking,
        id: booking.ticketId,
        type: booking.selectedType,
        price: `₹${booking.pricePaid}`,
        date: new Date(booking.date).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        }),
        rawDate: booking.date, // Keep raw date for stable sorting/filtering
        time: booking.time || (booking.event && booking.event.time) || '10:00 AM', // Fallback or map from event
        bookedDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric'
        })
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch user tickets", error);
    return [];
  }
};

export const bookEvent = async (event) => {
  try {
    // Generate simplified default booking details
    // In a real app, this would come from a seat selection UI
    const user = JSON.parse(localStorage.getItem("eventorbit_user")) || {};

    // Determine price (use minimum if object)
    let amount = 0;
    if (typeof event.price === 'object') {
      const prices = Object.values(event.price).map(p => Number(p) || 0);
      amount = prices.length > 0 ? Math.min(...prices) : 0;
    } else {
      amount = Number(event.price) || 0; // Handle 'Free' as 0 if specific parsing needed
      if (isNaN(amount) && event.price === 'Free') amount = 0;
    }

    const payload = {
      event: event.id || event._id,
      seatType: event.selectedType || "General",
      seatNumber: event.seatNumber || "Any",
      amountPaid: event.pricePaid || amount,
      qrCode: `TIX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      attendeeName: (event.attendeeNames && event.attendeeNames[0]) || user.name || "Valued Guest",
      quantity: event.quantity || 1,
      attendeeNames: event.attendeeNames || []
    };

    const response = await apiClient.post('/bookings', payload);

    if (response.data.success) {
      return { success: true, message: 'Ticket booked successfully!', ticket: response.data.data };
    } else {
      return { success: false, message: response.data.message || 'Booking failed' };
    }
  } catch (error) {
    console.error("Booking error", error);
    return { success: false, message: error.response?.data?.message || 'Server error during booking' };
  }
};

export const submitReview = async (eventId, rating, comment) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/reviews`, {
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReviews = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/reviews`);
    return response.data.reviews || [];
  } catch (error) {
    console.error("Failed to fetch reviews", error);
    return [];
  }
};

export const fetchUserReviews = async () => {
  try {
    const response = await apiClient.get('/events/my-reviews');
    return response.data.reviews || [];
  } catch (error) {
    console.error("Failed to fetch user reviews", error);
    return [];
  }
};
