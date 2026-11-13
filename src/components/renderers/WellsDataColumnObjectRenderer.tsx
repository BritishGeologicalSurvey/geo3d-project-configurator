import { ControlProps, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const WellsDataColumnObjectRenderer = ({ data, handleChange, path }: ControlProps) => {
  const value: Record<string, any> = data ?? {};
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});
  const [tempTitleKeys, setTempTitleKeys] = useState<Record<string, Record<string, string>>>({});

  const addEntry = () => {
    let i = 1;
    let key = '';

    while (value[key]) {
      key = `lang${i++}`;
    }

    handleChange(path, {
      ...value,
      [key]: {
        popupColumns: [],
        tooltipColumns: [],
        nameColumn: '',
        titles: {},
      },
    });
  };

  const updateKey = (oldKey: string, newKey: string) => {
    if (!newKey || newKey === oldKey || value[newKey]) return;

    const { [oldKey]: val, ...rest } = value;

    handleChange(path, {
      ...rest,
      [newKey]: val,
    });

    setTempKeys((prev) => {
      const { [oldKey]: _, ...restTemp } = prev;
      return restTemp;
    });
  };

  const removeEntry = (key: string) => {
    const { [key]: _, ...rest } = value;
    handleChange(path, rest);
  };

  const updateEntry = (lang: string, field: string, newValue: any) => {
    handleChange(path, {
      ...value,
      [lang]: {
        ...value[lang],
        [field]: newValue,
      },
    });
  };

  const updateTitleKey = (lang: string, oldKey: string, newKey: string) => {
    if (!newKey || newKey === oldKey || value[lang]?.titles?.[newKey]) return;

    const titles = value[lang]?.titles || {};
    const oldValue = titles[oldKey];
    const { [oldKey]: _, ...rest } = titles;

    handleChange(path, {
      ...value,
      [lang]: {
        ...value[lang],
        titles: {
          ...rest,
          [newKey]: oldValue,
        },
      },
    });
  };

  const updateTitleValue = (lang: string, key: string, newVal: string) => {
    handleChange(path, {
      ...value,
      [lang]: {
        ...value[lang],
        titles: {
          ...(value[lang]?.titles || {}),
          [key]: newVal,
        },
      },
    });
  };

  const removeTitle = (lang: string, key: string) => {
    const { [key]: _, ...rest } = value[lang]?.titles || {};

    handleChange(path, {
      ...value,
      [lang]: {
        ...value[lang],
        titles: rest,
      },
    });
  };

  const addTitle = (lang: string) => {
    let i = 1;
    let key = `key${i}`;

    while (value[lang]?.titles?.[key]) {
      key = `key${++i}`;
    }

    handleChange(path, {
      ...value,
      [lang]: {
        ...value[lang],
        titles: {
          ...(value[lang]?.titles || {}),
          [key]: '',
        },
      },
    });
  };

  return (
    <div className="space-y-5 pb-4">
      <Typography
        variant="h6"
        sx={{ mb: 12 }}>
        Well Data Column
      </Typography>
      {Object.entries(value).map(([lang, config]) => {
        const displayKey = tempKeys[lang] ?? lang;

        return (
          <div
            key={lang}
            className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-100">
              <TextField
                label="Language"
                size="small"
                value={displayKey}
                onChange={(e) =>
                  setTempKeys((prev) => ({
                    ...prev,
                    [lang]: e.target.value,
                  }))
                }
                onBlur={(e) => updateKey(lang, e.target.value)}
              />

              <IconButton
                size="small"
                onClick={() => removeEntry(lang)}>
                <DeleteIcon />
              </IconButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                size="small"
                label="Name Column"
                value={config.nameColumn || ''}
                onChange={(e) => updateEntry(lang, 'nameColumn', e.target.value)}
              />

              <TextField
                size="small"
                label="Popup Columns"
                value={(config.popupColumns || []).join(', ')}
                onChange={(e) =>
                  updateEntry(
                    lang,
                    'popupColumns',
                    e.target.value.split(',').map((s) => s.trim()),
                  )
                }
              />

              <TextField
                size="small"
                label="Tooltip Columns"
                value={(config.tooltipColumns || []).join(', ')}
                onChange={(e) =>
                  updateEntry(
                    lang,
                    'tooltipColumns',
                    e.target.value.split(',').map((s) => s.trim()),
                  )
                }
              />
            </div>

            <div className="pt-3 space-y-3">
              <Typography variant="subtitle2">Titles</Typography>

              <div className="space-y-2">
                {Object.entries(config.titles || {}).map(([k, v]) => {
                  const displayTitleKey = tempTitleKeys[lang]?.[k] ?? k;

                  return (
                    <div
                      key={k}
                      className="flex gap-2 items-center">
                      <TextField
                        size="small"
                        label="Key"
                        value={displayTitleKey}
                        onChange={(e) =>
                          setTempTitleKeys((prev) => ({
                            ...prev,
                            [lang]: {
                              ...(prev[lang] || {}),
                              [k]: e.target.value,
                            },
                          }))
                        }
                        onBlur={(e) => updateTitleKey(lang, k, e.target.value)}
                        className="w-1/3"
                      />

                      <TextField
                        size="small"
                        label="Value"
                        value={v as string}
                        onChange={(e) => updateTitleValue(lang, k, e.target.value)}
                        className="flex-1"
                      />

                      <IconButton
                        size="small"
                        onClick={() => removeTitle(lang, k)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="outlined"
                size="small"
                onClick={() => addTitle(lang)}>
                Add Title
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        variant="outlined"
        size="small"
        onClick={addEntry}>
        Add Data Column Item
      </Button>
    </div>
  );
};

export const WrappedWellsDataColumnObjectRenderer = withJsonFormsControlProps(WellsDataColumnObjectRenderer);

export const wellsDataColumnObjectTester = rankWith(100, (_uischema, schema) => {
  const isCorrectShape =
    schema?.type === 'object' && typeof schema?.additionalProperties === 'object' && schema?.title === 'Data Columns';

  return isCorrectShape;
});
