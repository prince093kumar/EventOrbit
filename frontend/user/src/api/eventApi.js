import apiClient from "./apiClient";

export const fetchEvents = async () => {
  try {
    const response = await apiClient.get("/events");
    return response.data;
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
  const stored = localStorage.getItem('user_tickets');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const bookEvent = async (event) => {
  const currentTickets = await fetchUserTickets();
  const isBooked = currentTickets.some(t => t.id === event.id);
  if (isBooked) return { success: false, message: 'Event already booked!' };

  const uniqueId = `TIX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const newTicket = {
    ...event,
    ticketId: uniqueId,
    bookedDate: new Date().toISOString().split('T')[0],
    status: 'confirmed'
  };

  const updatedTickets = [newTicket, ...currentTickets];
  localStorage.setItem('user_tickets', JSON.stringify(updatedTickets));
  return { success: true, message: 'Ticket booked successfully!', ticket: newTicket };
};
