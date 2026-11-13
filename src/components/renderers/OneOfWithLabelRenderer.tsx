import { isOneOfControl, rankWith } from '@jsonforms/core';
import { MaterialOneOfRenderer } from '@jsonforms/material-renderers';
import { Box, Typography } from '@mui/material';

const CustomOneOfRenderer = (props: any) => {
  const { uischema, schema } = props;

  const customLabel = uischema?.options?.groupLabel || props.label || schema?.title;

  return (
    <Box>
      {customLabel && (
        <Typography
          variant="h6"
          sx={{ mb: 5 }}>
          {customLabel}
        </Typography>
      )}

      <MaterialOneOfRenderer {...props} />
    </Box>
  );
};

export const customOneOfRenderer = {
  tester: rankWith(10, isOneOfControl),
  renderer: CustomOneOfRenderer,
};
