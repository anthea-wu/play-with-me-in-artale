export interface Group {
  id: string;
  job: string;
  level: number;
  map: string;
  availableTimes: string[];
  gameId: string;
  discordId: string | null;
  createdAt: string;
}

export interface FilterValues {
  job: string;
  map: string;
  myLevel: number | null;
}

export function filterGroups(groups: Group[], filters: FilterValues): Group[] {
  return groups.filter(group => {
    // Job filter - exact match
    if (filters.job && group.job !== filters.job) {
      return false;
    }

    // Map filter - exact match
    if (filters.map && group.map !== filters.map) {
      return false;
    }

    // Level filter - within ±5 range
    if (filters.myLevel !== null) {
      const levelDiff = Math.abs(group.level - filters.myLevel);
      if (levelDiff > 5) {
        return false;
      }
    }

    return true;
  });
}

export function getFilterSummary(filters: FilterValues): string {
  const parts: string[] = [];
  
  if (filters.job) {
    parts.push(`職業: ${filters.job}`);
  }
  
  if (filters.map) {
    parts.push(`地圖: ${filters.map}`);
  }
  
  if (filters.myLevel !== null) {
    parts.push(`等級: ${filters.myLevel - 5} - ${filters.myLevel + 5}`);
  }
  
  return parts.join(', ');
}

export function hasActiveFilters(filters: FilterValues): boolean {
  return filters.job !== '' || filters.map !== '' || filters.myLevel !== null;
}