/* eslint-disable @typescript-eslint/no-explicit-any */
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
import addFormats from 'ajv-formats';
import Ajv from 'ajv/dist/2020';
import { FC, useMemo, useRef, useState } from 'react';
import projectsListSchema from '../assets/projects-list.schema.json';
import projectsListUiSchema from '../assets/projects-list.ui.schema.json';
import { menuDividerSx, menuIconSx, menuItemSx, menuSubheaderSx } from './actionsMenuStyles';
import { NavigationDrawer } from './NavigationDrawer';
import { NotificationSnackbar } from './notifications/NotificationSnackbar';
import { useNotification } from './notifications/useNotification';
import { customOneOfRenderer } from './renderers/OneOfWithLabelRenderer';

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});

addFormats(ajv);

export const ProjectsListConfiguration: FC = () => {
  const validateProjectsList = useMemo(() => ajv.compile(projectsListSchema), []);
  const renderers = useMemo(() => [...materialRenderers, customOneOfRenderer], []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState<any>({
    resourceType: 'projectsList',
    items: [],
  });
  const [errors, setErrors] = useState<any[]>([]);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
  const actionsOpen = Boolean(actionsAnchorEl);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasRequiredErrors = errors.some((e) => e.keyword === 'required');
  const canDownload = !hasRequiredErrors;

  const { notification, showNotification, closeNotification } = useNotification();

  const currentYear = new Date().getFullYear();

  // JSON Forms change handler
  const handleChange = useMemo(() => {
    return ({ data, errors }: any) => {
      setData(data);
      setErrors(errors ?? []);
    };
  }, []);

  // Upload handler
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      showNotification('error', 'Invalid JSON', 'Please upload a valid JSON file (.json)');
      resetFileInput();
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);

        const isValid = validateProjectsList(parsed);

        if (!isValid) {
          console.error(validateProjectsList.errors);

          const messages = validateProjectsList.errors?.map((err) => `${err.instancePath} ${err.message}`).join('\n');

          showNotification('error', 'Schema Validation Failed', messages || 'Invalid projects list file');
          return;
        }

        setData(parsed);
        setErrors([]);
      } catch (err) {
        console.error(err);
        showNotification('error', 'Invalid JSON', 'The uploaded file contains invalid JSON.');
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
      resourceType: 'projectsList',
      items: [],
    });
    setErrors([]);
    resetFileInput();

    showNotification('info', 'Project List Config Cleared', '');
  };

  const downloadData = () => {
    const output = {
      ...data,
      resourceType: 'projectsList',
    };

    const jsonString = JSON.stringify(output, null, 2);

    const blob = new Blob([jsonString], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'projects-list.json';

    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
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
              Geo3D Project List Config
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
                <ListItemText>Upload Project List Config</ListItemText>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
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
      <Box className="flex-1 overflow-auto">
        <Box className="bg-bg rounded shadow h-full flex flex-col min-h-0">
          <Box className="flex-1 overflow-auto p-10">
            <JsonForms
              schema={projectsListSchema}
              uischema={projectsListUiSchema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              ajv={ajv}
              onChange={handleChange}
            />
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
