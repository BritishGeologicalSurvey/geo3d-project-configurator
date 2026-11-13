import { ControlProps, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Card, CardContent, FormControlLabel, Switch, Typography } from '@mui/material';

interface FeatureToggle {
  state: boolean;
  autoload?: boolean;
  opacity?: number;
  config?: Record<string, string | number | boolean>;
}

const FeatureToggleRenderer = ({ data, handleChange, path, label, uischema, schema }: ControlProps) => {
  const safeData: FeatureToggle = {
    state: false,
    ...(data ?? {}),
  };

  const extraInfo = uischema?.options?.['extraInfo'];

  console.log(extraInfo);

  const { state = false, autoload = false, opacity = '', config = {} } = safeData;

  const updateFeature = (key: keyof FeatureToggle, value: unknown) => {
    handleChange(path, {
      ...safeData,
      [key]: value,
    });
  };

  const handleStateChanged = (checked: boolean) => {
    updateFeature('state', checked);
  };

  const handleAutoloadChanged = (checked: boolean) => {
    updateFeature('autoload', checked);
  };

  const handleOpacityChanged = (value: string) => {
    updateFeature('opacity', Number(value));
  };

  const createConfigKey = (): string => {
    return `key${Object.keys(config).length + 1}`;
  };

  const addConfigEntry = () => {
    updateFeature('config', {
      ...config,
      [createConfigKey()]: '',
    });
  };

  const removeConfigEntry = (keyToRemove: string) => {
    const updated = { ...config };

    delete updated[keyToRemove];

    updateFeature('config', updated);
  };

  const renameConfigKey = (oldKey: string, newKey: string) => {
    if (newKey === oldKey) {
      return;
    }

    // Rebuild the object preserving original insertion order, rather than
    // delete+re-insert (which silently moves the edited entry to the end,
    // since JS re-inserts deleted string keys at the end on insertion).
    const updated: Record<string, string | number | boolean> = {};

    Object.entries(config).forEach(([key, value]) => {
      updated[key === oldKey ? newKey : key] = value;
    });

    updateFeature('config', updated);
  };

  const updateConfigValue = (key: string, value: string) => {
    updateFeature('config', {
      ...config,
      [key]: value,
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom>
          {label}
        </Typography>

        <div className="flex flex-row w-full p-2 bg-bg rounded   mb-2">
          <span className="text-sm text-gray-800">{extraInfo}</span>
        </div>

        <FormControlLabel
          control={
            <Switch
              checked={state}
              onChange={(e) => handleStateChanged(e.target.checked)}
            />
          }
          label="Enabled"
        />

        {state && (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={autoload}
                  onChange={(e) => handleAutoloadChanged(e.target.checked)}
                />
              }
              label="Autoload"
            />

            <div className="mt-2">
              <label
                htmlFor={`${path}-opacity`}
                className="block text-sm font-medium mb-1">
                Opacity
              </label>

              <input
                id={`${path}-opacity`}
                type="number"
                value={opacity}
                onChange={(e) => handleOpacityChanged(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>

            <div className="mt-4">
              <Typography
                variant="subtitle2"
                gutterBottom>
                Configuration
              </Typography>

              {Object.entries(config).map(([key, value], index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-2 w-full">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => renameConfigKey(key, e.target.value)}
                    className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Key"
                  />

                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => updateConfigValue(key, e.target.value)}
                    className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Value"
                  />

                  <Button
                    color="error"
                    onClick={() => removeConfigEntry(key)}
                    sx={{
                      minWidth: 0,
                      flexShrink: 0,
                      px: 1,
                      height: '32px',
                    }}>
                    <DeleteIcon fontSize="small" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addConfigEntry}>
                Add Config Entry
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const featureToggleTester = rankWith(1000, (uischema) => {
  return uischema?.type === 'Control' && (uischema as any)?.options?.renderer === 'feature-toggle';
});

export const WrappedFeatureToggleRenderer = withJsonFormsControlProps(FeatureToggleRenderer);
