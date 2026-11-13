export const parseGVSText = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('File contains no data');
  }

  const headers = lines[0].split('\t');
  const expectedHeaders = ['Name', 'Weight', 'Geological_Unit', 'R', 'G', 'B', 'Group'];

  if (headers.length !== expectedHeaders.length || !headers.every((h, i) => h === expectedHeaders[i])) {
    throw new Error(`Invalid header row. Expected: ${expectedHeaders.join('\t')}`);
  }

  const items = lines.slice(1).map((line) => {
    const cols = line.split('\t');

    return {
      Name: cols[0],
      Weight: Number(cols[1]),
      Geological_Unit: cols[2],
      R: Number(cols[3]),
      G: Number(cols[4]),
      B: Number(cols[5]),
      Group: cols[6],
    };
  });

  return {
    resourceType: 'gvsLayerConfig',
    items,
  };
};

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => Number(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

const toMultilingualText = (value: string, language = 'en'): Record<string, string> => ({
  [language.toLowerCase()]: value,
});
export const buildLayersFromGVS = (gvsItems: any[], language = 'en') => {
  let nextId = 1;

  const groups: any[] = [];
  const layers: any[] = [];
  const groupMap = new Map<string, number>();

  for (const item of gvsItems) {
    if (!groupMap.has(item.Group)) {
      const groupId = nextId++;

      groupMap.set(item.Group, groupId);

      groups.push({
        id: groupId,
        label: toMultilingualText(item.Group, language),
        type: 'group',
        weight: item.Weight,
        autoload: true,
      });
    }
  }

  for (const item of gvsItems) {
    const layerLabel = item.Geological_Unit ? `${item.Name} (${item.Geological_Unit})` : item.Name;

    layers.push({
      id: nextId++,
      label: toMultilingualText(layerLabel, language),
      groupId: groupMap.get(item.Group),
      weight: item.Weight,
      type: 'model',
      autoload: true,
      color: rgbToHex(item.R, item.G, item.B),
    });
  }

  return [...groups, ...layers];
};
