/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import UploadIcon from '@mui/icons-material/Upload';
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import addFormats from 'ajv-formats';
import Ajv from 'ajv/dist/2020';
import { FC, useRef, useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { parseGVSText } from '../utils/gvs';
import { menuDividerSx, menuIconSx, menuItemSx, menuSubheaderSx } from './actionsMenuStyles';
import { NavigationDrawer } from './NavigationDrawer';
import { NotificationSnackbar } from './notifications/NotificationSnackbar';
import { useNotification } from './notifications/useNotification';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});

addFormats(ajv);

export const GVSConfiguration: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState<any>({
    items: [],
  });
  const [errors, setErrors] = useState<any[]>([]);
  const [colourEditor, setColourEditor] = useState<{
    rowId: string;
    anchorEl: HTMLElement;
  } | null>(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
  const actionsOpen = Boolean(actionsAnchorEl);
  const currentYear = new Date().getFullYear();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasRequiredErrors = errors.some((e) => e.keyword === 'required');
  const canDownload = !hasRequiredErrors;
  const { notification, showNotification, closeNotification } = useNotification();
  const createRowId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const attachIds = (items: any[]) =>
    items.map((item) => ({
      ...item,
      _id: item._id ?? createRowId(),
    }));
  const rows = [...data.items]
    .sort((a, b) => a.Weight - b.Weight)
    .map((item) => ({
      id: item._id,
      ...item,
    }));

  const normaliseWeights = (items: any[]) => {
    return items.map((item, index) => ({
      ...item,
      Weight: index,
    }));
  };

  const sortByWeight = (items: any[]) => {
    return [...items].sort((a, b) => (a.Weight ?? 999999) - (b.Weight ?? 999999));
  };

  const clampRgb = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

  const updateRowColour = (rowId: string, colour: ColorResult) => {
    setData((current: any) => ({
      ...current,
      items: current.items.map((item: any) =>
        item._id === rowId
          ? {
              ...item,
              R: clampRgb(colour.rgb.r),
              G: clampRgb(colour.rgb.g),
              B: clampRgb(colour.rgb.b),
            }
          : item,
      ),
    }));
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const rowIndex = data.items.findIndex((item: any) => item._id === newRow['id']);

    if (rowIndex === -1) {
      return newRow;
    }

    const updatedItems = [...data.items];

    const originalRow = updatedItems[rowIndex];

    const updatedRow = {
      ...originalRow,
      Name: newRow['Name'],
      Weight: Number(newRow['Weight']),
      Geological_Unit: newRow['Geological_Unit'],
      R: Number(newRow['R']),
      G: Number(newRow['G']),
      B: Number(newRow['B']),
      Group: newRow['Group'],
    };

    const oldWeight = originalRow.Weight;
    const newWeight = Number(newRow['Weight']);

    if (oldWeight !== newWeight) {
      updatedItems.splice(rowIndex, 1);

      const targetIndex = Math.max(0, Math.min(newWeight, updatedItems.length));

      updatedItems.splice(targetIndex, 0, updatedRow);

      setData({
        ...data,
        items: normaliseWeights(updatedItems),
      });
    } else {
      updatedItems[rowIndex] = updatedRow;

      setData({
        ...data,
        items: updatedItems,
      });
    }

    return newRow;
  };

  const addLayer = () => {
    const updatedItems = [
      ...data.items,
      {
        _id: createRowId(),
        Name: '',
        Weight: data.items.length,
        Geological_Unit: '',
        R: 255,
        G: 255,
        B: 255,
        Group: '',
      },
    ];

    setData({
      ...data,
      items: updatedItems,
    });
  };

  const moveLayer = (rowId: string, direction: 'up' | 'down') => {
    const fromIndex = data.items.findIndex((item: any) => item._id === rowId);

    if (fromIndex === -1) {
      return;
    }

    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= data.items.length) {
      return;
    }

    const updatedItems = [...data.items];

    [updatedItems[fromIndex], updatedItems[toIndex]] = [updatedItems[toIndex], updatedItems[fromIndex]];

    setData({
      ...data,
      items: normaliseWeights(updatedItems),
    });
  };

  const deleteLayer = (rowId: string) => {
    const updatedItems = data.items.filter((item: any) => item._id !== rowId);

    setData({
      ...data,
      items: normaliseWeights(updatedItems),
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      editable: true,
      width: 180,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'Weight',
      headerName: 'Weight',
      editable: true,
      type: 'number',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'Geological_Unit',
      headerName: 'Geological Unit',
      editable: true,
      flex: 1,
      minWidth: 150,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'R',
      headerName: 'R',
      editable: true,
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'G',
      headerName: 'G',
      editable: true,
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'B',
      headerName: 'B',
      editable: true,
      type: 'number',
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'Colour',
      headerName: 'Colour',
      width: 120,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Box
            onClick={(event) =>
              setColourEditor({
                rowId: params.row._id,
                anchorEl: event.currentTarget,
              })
            }
            sx={{
              width: 44,
              height: 24,
              borderRadius: 1,
              border: '1px solid #BDBDBD',
              backgroundColor: `rgb(${params.row.R}, ${params.row.G}, ${params.row.B})`,
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: 'Group',
      headerName: 'Group',
      editable: true,
      width: 220,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 80,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: any) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => deleteLayer(params.row._id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: 'move',
      headerName: 'Move',
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',

      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: 0.25,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <IconButton
            size="small"
            disabled={params.row.Weight === 0}
            onClick={() => moveLayer(params.row._id, 'up')}>
            <ArrowUpwardIcon fontSize="inherit" />
          </IconButton>

          <IconButton
            size="small"
            disabled={params.row.Weight === rows.length - 1}
            onClick={() => moveLayer(params.row._id, 'down')}>
            <ArrowDownwardIcon fontSize="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      showNotification('error', 'Upload Error', 'Please upload a valid TEXT file (.txt)');
      resetFileInput();
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = parseGVSText(e.target?.result as string);
        setData({
          ...parsed,
          items: attachIds(normaliseWeights(sortByWeight(parsed.items ?? []))),
        });
        setErrors([]);
        showNotification('success', 'GVS Config Uploaded', '');
      } catch (err) {
        console.error(err);
        showNotification('error', 'Upload Error', 'Invalid GVS .TXT file.');
      } finally {
        resetFileInput();
      }
    };

    reader.readAsText(file);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearData = () => {
    setData({
      items: [],
    });
    setErrors([]);
    resetFileInput();

    showNotification('info', 'GVS Config Cleared', '');
  };

  const downloadData = () => {
    const txtContent = convertToGVSText(data);

    const blob = new Blob([txtContent], {
      type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'layer_config.txt';

    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
  };

  const convertToGVSText = (data: any) => {
    const orderedItems = normaliseWeights(sortByWeight(data.items ?? []));
    const header = ['Name', 'Weight', 'Geological_Unit', 'R', 'G', 'B', 'Group'].join('\t');

    const rows = orderedItems.map((item: any) =>
      [item.Name, item.Weight, item.Geological_Unit, item.R, item.G, item.B, item.Group].join('\t'),
    );

    return [header, ...rows].join('\n');
  };

  return (
    <Box className="h-full w-full bg-bg flex flex-col overflow-hidden">
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: '#fff',
          color: '#2F2F2F',
          borderBottom: '1px solid #E6E1DC',
          padding: '0px',
        }}>
        <Toolbar sx={{ justifyContent: 'space-between', ml: 32, mr: 44 }}>
          {/* Left: menu + title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                marginLeft: 8,
              }}>
              Generalised Vertical Section Config
            </Typography>
          </Box>

          {/* Right: actions */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Button
              variant="contained"
              data-testid="actions-button"
              endIcon={<ArrowDropDownIcon />}
              onClick={(event) => setActionsAnchorEl(event.currentTarget)}>
              Actions
            </Button>

            <Menu
              anchorEl={actionsAnchorEl}
              open={actionsOpen}
              onClose={() => setActionsAnchorEl(null)}
              slotProps={{
                paper: { sx: { minWidth: 220, mt: '4px' } },
                list: { dense: true, disablePadding: true, sx: { py: '4px' } },
              }}>
              <ListSubheader
                disableSticky
                sx={menuSubheaderSx}>
                Import
              </ListSubheader>

              <MenuItem
                component="label"
                data-testid="upload-button"
                sx={menuItemSx}>
                <ListItemIcon>
                  <UploadIcon sx={menuIconSx} />
                </ListItemIcon>
                <ListItemText>Upload GVS</ListItemText>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  data-testid="upload-input"
                  hidden
                  onChange={(e) => {
                    handleUpload(e);
                    setActionsAnchorEl(null);
                  }}
                />
              </MenuItem>

              <Divider sx={menuDividerSx} />

              <ListSubheader
                disableSticky
                sx={menuSubheaderSx}>
                Tools
              </ListSubheader>

              <MenuItem
                data-testid="clear-button"
                sx={menuItemSx}
                onClick={() => {
                  clearData();
                  setActionsAnchorEl(null);
                }}>
                <ListItemIcon>
                  <DeleteIcon sx={menuIconSx} />
                </ListItemIcon>
                <ListItemText>Clear</ListItemText>
              </MenuItem>

              <Divider sx={menuDividerSx} />

              <ListSubheader
                disableSticky
                sx={menuSubheaderSx}>
                Export
              </ListSubheader>

              <MenuItem
                data-testid="download-button"
                sx={menuItemSx}
                disabled={!canDownload}
                onClick={() => {
                  downloadData();
                  setActionsAnchorEl(null);
                }}>
                <ListItemIcon>
                  <DownloadIcon sx={menuIconSx} />
                </ListItemIcon>
                <ListItemText secondary={canDownload ? undefined : 'Complete all required fields first'}>
                  Download
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Spacer */}
      <Toolbar />

      {/* Content */}
      <Box className="flex-1 flex flex-col min-h-0">
        <Box className="bg-bg rounded shadow h-full flex flex-col min-h-0">
          <Box className="flex-1 flex flex-col min-h-0 p-10">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flex: 1,
                minHeight: 0,
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 10,
                  py: 10,
                  mb: 10,
                  bgcolor: '#fff',
                  border: '1px solid #E6E1DC',
                  borderRadius: 2,
                }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 0,
                    color: 'primary.main',
                    fontWeight: 600,
                  }}>
                  GVS Layers: {data.items.length}
                </Typography>

                <Button
                  variant="contained"
                  data-testid="add-layer-button"
                  startIcon={<AddIcon />}
                  onClick={addLayer}
                  sx={{
                    px: 8,
                    bgcolor: 'primary.main',

                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}>
                  Add Layer
                </Button>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  width: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  processRowUpdate={processRowUpdate}
                  disableRowSelectionOnClick
                  sx={{
                    border: 0,

                    '& .MuiDataGrid-columnHeaderTitle': {
                      color: '#fff',
                      fontSize: '0.9rem',
                      letterSpacing: '0.02em',
                    },

                    '& .MuiDataGrid-columnHeader': {
                      fontWeight: 700,
                      background: '#A5A58D',
                    },

                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid #EFEAE4',
                    },

                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#F8F7F5',
                    },

                    '& .MuiDataGrid-row.Mui-selected': {
                      backgroundColor: '#E8ECE5',
                    },

                    '& .MuiDataGrid-footerContainer': {
                      borderTop: '1px solid #E6E1DC',
                    },

                    '& .MuiDataGrid-columnSeparator': {
                      color: '#E6E1DC',
                    },
                  }}
                />
                <Popover
                  open={!!colourEditor}
                  anchorEl={colourEditor?.anchorEl}
                  onClose={() => setColourEditor(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}>
                  {colourEditor && (
                    <ChromePicker
                      color={{
                        r: data.items.find((item: any) => item._id === colourEditor.rowId)?.R ?? 255,
                        g: data.items.find((item: any) => item._id === colourEditor.rowId)?.G ?? 255,
                        b: data.items.find((item: any) => item._id === colourEditor.rowId)?.B ?? 255,
                      }}
                      onChange={(colour) => updateRowColour(colourEditor.rowId, colour)}
                    />
                  )}
                </Popover>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            px: 3,
            py: 2,
            borderTop: '1px solid #E6E1DC',
            bgcolor: '#FFFFF',
          }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              lineHeight: 1.5,
              textAlign: 'center',
              paddingTop: 8,
            }}>
            © UKRI (British Geological Survey) and the Polish Geological Institute {currentYear}.
          </Typography>
        </Box>
      </Box>

      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <NotificationSnackbar
        notification={notification}
        onClose={closeNotification}
      />
    </Box>
  );
};
