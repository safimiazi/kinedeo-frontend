/**
 * Get shipping cost based on division
 * - Dhaka division → ৳60
 * - Any other division → ৳120
 */
export function getShippingCostByDivision(divisionName: string | null | undefined): number {
  if (!divisionName) return 120;
  return divisionName.toLowerCase() === 'dhaka' ? 60 : 120;
}
