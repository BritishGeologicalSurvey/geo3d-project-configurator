import {
  CombinatorRendererProps,
  createCombinatorRenderInfos,
  createDefaultValue,
  isOneOfControl,
  JsonSchema,
  rankWith,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsOneOfProps } from '@jsonforms/react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useMemo } from 'react';

export const SimpleOneOfRenderer = ({
  handleChange,
  schema,
  path,
  renderers,
  cells,
  rootSchema,
  visible,
  uischema,
  uischemas,
  data,
}: CombinatorRendererProps) => {
  const oneOfSchemas = (schema as JsonSchema)?.oneOf ?? [];

  const options = useMemo(
    () => createCombinatorRenderInfos(oneOfSchemas as JsonSchema[], rootSchema, 'oneOf', uischema, path, uischemas),
    [oneOfSchemas, rootSchema, uischema, path, uischemas],
  );

  const selected = options.find((opt) => {
    const typeConst = opt.schema?.properties?.['type']?.const;
    return typeConst === data?.type;
  });

  const handleChangeType = (event: any) => {
    const selectedType = event.target.value;

    const foundIndex = options.findIndex((opt) => {
      return opt.schema?.properties?.['type']?.const === selectedType;
    });

    if (foundIndex === -1) return;

    const newSchema = options[foundIndex].schema;

    handleChange(path, createDefaultValue(newSchema, rootSchema));
  };

  if (!visible) return null;

  return (
    <Box>
      <FormControl
        fullWidth
        sx={{ mb: 8 }}
        className="mb-4">
        <InputLabel>Layer Type</InputLabel>
        <Select
          value={data?.type || ''}
          label="Layer Type"
          onChange={handleChangeType}>
          {options.map((opt) => {
            const typeConst = opt.schema?.properties?.['type']?.const;

            return (
              <MenuItem
                key={typeConst}
                value={typeConst}>
                {opt.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {selected && (
        <JsonFormsDispatch
          schema={selected.schema}
          uischema={selected.uischema}
          path={path}
          renderers={renderers}
          cells={cells}
        />
      )}
    </Box>
  );
};

export const simpleOneOfTester = rankWith(1000, (uischema, schema, context) => {
  if (!isOneOfControl(uischema, schema, context)) return false;

  const oneOf = (schema as JsonSchema)?.oneOf;
  if (!Array.isArray(oneOf)) return false;

  const looksLikeLayer = oneOf.some((s: any) => {
    return s?.properties?.type?.const;
  });

  return looksLikeLayer;
});

export default withJsonFormsOneOfProps(SimpleOneOfRenderer);
