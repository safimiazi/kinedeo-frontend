/**
 * Bangladesh location types for bdapis.com API
 * API docs: https://bdapis.com
 */

export interface BdDivision {
  /** English name, e.g. "Dhaka" */
  division: string;
  /** Bangla name, e.g. "ঢাকা" */
  divisionbn: string;
  /** Lat/long coordinates */
  coordinates?: string;
}

export interface BdDistrict {
  /** English name, e.g. "Gazipur" */
  district: string;
  /** Bangla name, e.g. "গাজীপুর" */
  districtbn: string;
  /** Upazila list, e.g. ["Gazipur Sadar", "Kaliakair"] */
  upazilla: string[];
  /** Lat/long coordinates */
  coordinates?: string;
}

/** API response wrapper from bdapis.com */
export interface BdApiResponse<T> {
  status: {
    code: number;
    message: string;
    date: string;
  };
  data: T;
}
