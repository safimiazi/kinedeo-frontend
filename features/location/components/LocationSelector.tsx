'use client';

import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { useBdLocations } from '../hooks/use-bd-locations';

interface LocationSelectorProps {
  /** Called when division changes */
  onDivisionChange: (division: string | null) => void;
  /** Called when district changes */
  onDistrictChange: (district: string | null) => void;
  /** Called when upazila changes */
  onUpazilaChange: (upazila: string | null) => void;
  /** Current division value */
  divisionValue?: string | null;
  /** Current district value */
  districtValue?: string | null;
  /** Current upazila value */
  upazilaValue?: string | null;
}

export function LocationSelector({
  onDivisionChange,
  onDistrictChange,
  onUpazilaChange,
  divisionValue,
  districtValue,
  upazilaValue,
}: LocationSelectorProps) {
  const {
    divisions,
    districts,
    upazilas,
    selectedDivision,
    selectedDistrict,
    selectDivision,
    selectDistrict,
    divLoading,
    distLoading,
  } = useBdLocations();

  const handleDivisionChange = async (value: string | null) => {
    await selectDivision(value);
    onDivisionChange(value);
    onDistrictChange(null);
    onUpazilaChange(null);
  };

  const handleDistrictChange = (value: string | null) => {
    selectDistrict(value);
    onDistrictChange(value);
    onUpazilaChange(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Division */}
      <SearchableSelect
        label="বিভাগ *"
        placeholder={divLoading ? "লোড হচ্ছে..." : "বিভাগ বেছে নিন"}
        loading={divLoading}
        disabled={divLoading}
        value={divisionValue ?? null}
        options={divisions.map((d) => ({
          value: d.division,
          label: `${d.divisionbn} (${d.division})`,
        }))}
        onChange={handleDivisionChange}
      />

      {/* District */}
      <SearchableSelect
        label="জেলা *"
        placeholder={
          !selectedDivision
            ? "আগে বিভাগ বেছে নিন"
            : distLoading
            ? "লোড হচ্ছে..."
            : "জেলা বেছে নিন"
        }
        loading={distLoading}
        disabled={!selectedDivision || distLoading}
        value={districtValue ?? null}
        options={districts.map((d) => ({
          value: d.district,
          label: `${d.districtbn} (${d.district})`,
        }))}
        onChange={handleDistrictChange}
      />

      {/* Upazila */}
      <SearchableSelect
        label="উপজেলা *"
        placeholder={
          !selectedDistrict ? "আগে জেলা বেছে নিন" : "উপজেলা বেছে নিন"
        }
        disabled={!selectedDistrict}
        value={upazilaValue ?? null}
        options={upazilas.map((u) => ({
          value: u,
          label: u,
        }))}
        onChange={onUpazilaChange}
      />
    </div>
  );
}
