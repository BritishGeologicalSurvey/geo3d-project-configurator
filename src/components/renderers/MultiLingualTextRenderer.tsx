import { ControlProps, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, debounce, FormHelperText, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

const MultiLingualTextRenderer = ({ data, handleChange, path, uischema, config, schema, errors }: ControlProps) => {
  const start = performance.now();
  const value: Record<string, string> = typeof data === 'object' && data !== null && !Array.isArray(data) ? data : {};
  const propertyName = path
    .split('.')
    .pop()
    ?.replace(/^./, (c) => c.toUpperCase());
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});

  const addEntry = () => {
    let i = 1;
    let key = '';
    while (value[key]) {
      key = `key${i++}`;
    }
    handleChange(path, { ...value, [key]: '' });
  };

  const updateKey = (oldKey: string, newKey: string) => {
    if (!newKey || newKey === oldKey || value[newKey]) {
      return;
    }

    const { [oldKey]: oldValue, ...rest } = value;

    handleChange(path, {
      ...rest,
      [newKey]: oldValue,
    });

    setTempKeys((prev) => {
      const { [oldKey]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateValueDebounced = useMemo(
    () =>
      debounce((key: string, newValue: string) => {
        handleChange(path, {
          ...value,
          newValue,
        });
      }, 300),
    [handleChange, path, value],
  );

  const updateValue = (key: string, newValue: string) => {
    handleChange(path, { ...value, [key]: newValue });
  };

  const removeEntry = (key: string) => {
    const { [key]: _, ...rest } = value;

    handleChange(path, rest);

    setTempKeys((prev) => {
      const { [key]: __, ...restTemp } = prev;
      return restTemp;
    });
  };
  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 5 }}>
        {propertyName}
      </Typography>
      <Stack
        spacing={1}
        className="pt-2">
        {Object.entries(value).map(([key, text], index) => {
          const displayKey = tempKeys[key] ?? key;

          return (
            <Box
              key={`${key}-${index}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 4,
                alignItems: 'center',
              }}>
              <TextField
                size="small"
                label="Language"
                value={displayKey}
                onChange={(e) =>
                  setTempKeys((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                onBlur={(e) => updateKey(key, e.target.value)}
                fullWidth
              />

              <TextField
                size="small"
                label="Value"
                value={text}
                onChange={(e) => updateValue(key, e.target.value)}
                fullWidth
              />

              <IconButton
                size="small"
                onClick={() => removeEntry(key)}
                sx={{
                  height: 38,
                  width: 40,
                  border: '1px solid',
                  alignSelf: 'stretch',
                  borderColor: 'divider',
                  borderRadius: 1,
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'rgba(181, 101, 118, 0.08)',
                  },
                }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}

        <Button
          variant="outlined"
          size="small"
          onClick={addEntry}
          className="self-start mt-2">
          Add
        </Button>
      </Stack>

      <FormHelperText>{schema?.description || ''}</FormHelperText>
      <FormHelperText error={!!errors}>{errors || ''}</FormHelperText>
    </>
  );
};

export const WrappedMultiLingualTextRenderer = withJsonFormsControlProps(MultiLingualTextRenderer);

export const multiLingualTextTester = rankWith(10, (_uischema, schema) => {
  if (!schema || typeof schema === 'boolean') {
    return false;
  }

  return (
    schema.type === 'object' &&
    schema.additionalProperties === false &&
    schema.patternProperties?.['^[a-z]{2}$']?.type === 'string'
  );
});
