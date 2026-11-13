export const menuSubheaderSx = {
  lineHeight: '28px',
  px: '12px',
  pt: '8px',
  pb: '2px',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  '&:first-of-type': { pt: '4px' },
} as const;

export const menuItemSx = {
  minHeight: '34px',
  px: '12px',
  borderRadius: '4px',
  mx: '4px',
  '& .MuiListItemIcon-root': { minWidth: '32px' },
  '& .MuiListItemText-primary': { fontSize: '0.875rem' },
} as const;

export const menuDividerSx = { my: '6px !important' } as const;
export const menuIconSx = { fontSize: '18px' } as const;
