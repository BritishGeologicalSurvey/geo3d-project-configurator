import { isControl, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import PaletteIcon from '@mui/icons-material/Palette';
import { Box, IconButton, Popover, TextField } from '@mui/material';
import { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColourControl = (props: any) => {
  const { data, handleChange, path, label, required } = props;

  const value = typeof data === 'string' ? data : '';

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <TextField
        fullWidth
        size="medium"
        label={label}
        value={value}
        required={required}
        onChange={(e) => handleChange(path, e.target.value)}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: value,
            color: getContrastText(value),
          },

          '& .MuiInputLabel-root': {
            color: 'inherit',
            background: 'white',
          },

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.23)',
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                size="small"
                sx={{ background: 'white', color: 'black' }}
                onClick={handleOpen}>
                <PaletteIcon fontSize="small" />
              </IconButton>
            ),
          },
          htmlInput: {
            placeholder: '#BC8F8F',
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}>
        <ChromePicker
          color={value}
          onChange={(color) => handleChange(path, color.hex)}
        />
      </Popover>
    </Box>
  );
};

const getContrastText = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186 ? '#000000' : '#ffffff';
};

export const colourTester = rankWith(
  10,
  (uischema) => isControl(uischema) && typeof uischema.scope === 'string' && uischema.scope.endsWith('/color'),
);

export const ColourRenderer = {
  tester: colourTester,
  renderer: withJsonFormsControlProps(ColourControl),
};
