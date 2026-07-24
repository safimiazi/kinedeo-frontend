import { BdApiResponse, BdDivision } from "../types";

const BD_API_BASE = "https://bdapis.com/api/v1.2";

/**
 * Fetch all divisions from bdapis.com
 * Used as queryFn in useDivisions hook
 */
export async function getDivisions(): Promise<BdDivision[]> {
  const res = await fetch(`${BD_API_BASE}/divisions`);
  if (!res.ok) throw new Error(`Failed to fetch divisions: ${res.status}`);
  const data: BdApiResponse<BdDivision[]> = await res.json();
  return data.data ?? [];
}
