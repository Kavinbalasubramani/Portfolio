import api from "./axios";
import type { ContactMessage } from "../types";

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Public: visitor submits the contact form
export const submitContact = async (payload: ContactFormInput) => {
  const { data } = await api.post("/contact", payload);
  return data;
};

// Admin: fetch all messages
export const getContacts = async (): Promise<ContactMessage[]> => {
  const { data } = await api.get<ContactMessage[]>("/contact");
  return data;
};

// Admin: toggle read/unread
export const toggleContactRead = async (id: string): Promise<ContactMessage> => {
  const { data } = await api.patch<ContactMessage>(`/contact/${id}/read`);
  return data;
};

// Admin: delete a message
export const deleteContact = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};
