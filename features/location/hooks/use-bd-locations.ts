'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BdDivision, BdDistrict } from '../types';
import { getDivisions } from '../api/get-divisions';
import { getDistricts } from '../api/get-districts';

// ── Query keys ─────────────────────────────────────────────────────────────

export const locationKeys = {
  divisions: () => ['bd-locations', 'divisions'] as const,
  districts: (division: string) => ['bd-locations', 'districts', division] as const,
};

// ── Individual hooks ────────────────────────────────────────────────────────

/**
 * Fetch all Bangladesh divisions.
 * Cached for 24h — divisions never change.
 */
export function useDivisions() {
  return useQuery<BdDivision[]>({
    queryKey: locationKeys.divisions(),
    queryFn: getDivisions,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Fetch districts for a given division.
 * Only runs when divisionName is provided.
 * Cached per-division for 24h.
 */
export function useDistricts(divisionName: string | null) {
  return useQuery<BdDistrict[]>({
    queryKey: locationKeys.districts(divisionName ?? ''),
    queryFn: () => getDistricts(divisionName!),
    enabled: !!divisionName,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}


export function useBdLocations() {
  const [selectedDivision, setSelectedDivision] = useState<BdDivision | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<BdDistrict | null>(null);

  const { data: divisions = [], isLoading: divLoading } = useDivisions();
  const { data: districts = [], isLoading: distLoading } = useDistricts(
    selectedDivision?.division ?? null,
  );

  const upazilas = selectedDistrict?.upazilla ?? [];

  const selectDivision = (divisionName: string | null) => {
    const div = divisions.find((d) => d.division === divisionName) ?? null;
    setSelectedDivision(div);
    setSelectedDistrict(null); // reset district when division changes
  };

  const selectDistrict = (districtName: string | null) => {
    const dist = districts.find((d) => d.district === districtName) ?? null;
    setSelectedDistrict(dist);
  };

  return {
    // Data
    divisions,
    districts,
    upazilas,
    selectedDivision,
    selectedDistrict,

    // Actions
    selectDivision,
    selectDistrict,

    // Loading states
    divLoading,
    distLoading,
    loading: divLoading || distLoading,
  };
}
