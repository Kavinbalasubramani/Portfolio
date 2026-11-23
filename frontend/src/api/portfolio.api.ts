import api from "./axios";
import type { Portfolio } from "../types";

export const getPortfolio = async (): Promise<Portfolio> => {
  const { data } = await api.get<Portfolio>("/portfolio");
  return data;
};

export const updatePortfolio = async (
  payload: Partial<Portfolio>
): Promise<Portfolio> => {
  const { data } = await api.put<Portfolio>("/portfolio", payload);
  return data;
};
