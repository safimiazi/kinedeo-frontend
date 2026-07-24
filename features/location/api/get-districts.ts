import { BdApiResponse, BdDistrict } from "../types";

const BD_API_BASE = "https://bdapis.com/api/v1.2";

/**
 * Fetch all districts for a given division from bdapis.com
 * Used as queryFn in useDistricts hook
 * @param divisionName - English division name (e.g., "Dhaka")
 */
export async function getDistricts(
  divisionName: string,
): Promise<BdDistrict[]> {
  const res = await fetch(`${BD_API_BASE}/division/${divisionName}`);
  if (!res.ok)
    throw new Error(
      `Failed to fetch districts for ${divisionName}: ${res.status}`,
    );
  const data: BdApiResponse<BdDistrict[]> = await res.json();
  return data.data ?? [];
}
