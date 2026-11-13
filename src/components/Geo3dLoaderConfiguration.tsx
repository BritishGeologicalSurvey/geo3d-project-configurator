/* eslint-disable @typescript-eslint/no-explicit-any */
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MenuIcon from '@mui/icons-material/Menu';
import RestoreIcon from '@mui/icons-material/Restore';
import UploadIcon from '@mui/icons-material/Upload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import type { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import Ajv from 'ajv/dist/2020';
import { FC, memo, useMemo, useState } from 'react';
import projectExampleDataGrangemouth from '../assets/project-example-grangemouth.json';
import projectExampleDataMcHenry from '../assets/project-example-mchenry.json';
import schema from '../assets/project.schema.json';
import uischema from '../assets/project.ui.schema.json';
import { buildLayersFromGVS, parseGVSText } from '../utils/gvs';
import { menuDividerSx, menuIconSx, menuItemSx, menuSubheaderSx } from './actionsMenuStyles';
import { NavigationDrawer } from './NavigationDrawer';
import { NotificationSnackbar } from './notifications/NotificationSnackbar';
import { useNotification } from './notifications/useNotification';
import { ColourRenderer } from './renderers/ColourRenderer';
import { customMaterialArrayRenderer } from './renderers/CustomMaterialArrayLayoutRenderer';
import { featureToggleTester, WrappedFeatureToggleRenderer } from './renderers/FeatureToggleRenderer';
import LanguageAutocompleteRenderer, { languageAutocompleteTester } from './renderers/LanguageAutocompleteRenderer';
import { multiLingualTextTester, WrappedMultiLingualTextRenderer } from './renderers/MultiLingualTextRenderer';
import { customOneOfRenderer } from './renderers/OneOfWithLabelRenderer';
import SimpleOneOfRenderer, { simpleOneOfTester } from './renderers/SimpleOneOfRenderer';
import {
  wellsDataColumnObjectTester,
  WrappedWellsDataColumnObjectRenderer,
} from './renderers/WellsDataColumnObjectRenderer';
export function createAjv202012() {
  const ajv = new Ajv({
    allErrors: true,
    inlineRefs: false,
    strict: false,
    discriminator: true,
    verbose: true,
  });

  addFormats(ajv);
  return ajv;
}

const formatAjvErrors = (errors: ErrorObject[] = []) => {
  return errors.map((error) => {
    switch (error.keyword) {
      case 'required': {
        const missingProperty = (error.params as any).missingProperty;
        const parent = error.instancePath || 'Project';

        return `${parent}.${missingProperty} is required`;
      }

      case 'additionalProperties': {
        const property = (error.params as any).additionalProperty;

        return `${error.instancePath || 'Project'} contains unexpected property "${property}"`;
      }

      case 'enum':
        return `${error.instancePath}: invalid value`;

      case 'type':
        return `${error.instancePath}: expected ${error.params['type']}`;

      default:
        return `${error.instancePath}: ${error.message}`;
    }
  });
};

const ajv = createAjv202012();

const exampleDataGrangemouth = projectExampleDataGrangemouth;
const exampleDataMcHenry = projectExampleDataMcHenry;

const MemoSimpleOneOfRenderer = memo(SimpleOneOfRenderer);

const MemoWellsDataColumnObjectRenderer = memo(WrappedWellsDataColumnObjectRenderer);

const MemoMultiLingualTextRenderer = memo(WrappedMultiLingualTextRenderer);

const MemoFeatureToggleRenderer = memo(WrappedFeatureToggleRenderer);

const renderers = [
  customMaterialArrayRenderer,
  ...materialRenderers,
  ColourRenderer,
  customOneOfRenderer,
  { tester: languageAutocompleteTester, renderer: LanguageAutocompleteRenderer },
  {
    tester: simpleOneOfTester,
    renderer: MemoSimpleOneOfRenderer,
  },
  {
    tester: wellsDataColumnObjectTester,
    renderer: MemoWellsDataColumnObjectRenderer,
  },
  {
    tester: multiLingualTextTester,
    renderer: MemoMultiLingualTextRenderer,
  },
  {
    tester: featureToggleTester,
    renderer: MemoFeatureToggleRenderer,
  },
];

export const Geo3dLoaderConfiguration: FC = () => {
  const createInitialProjectData = () => ({
    resourceType: 'project',
    attributes: [
      {
        id: 0,
        type: 'discrete',
        default: true,
        name: { en: '' },
        weight: 0,
      },
    ],
  });

  // STATE MANAGEMENT
  // form state
  const [data, setData] = useState<any>(createInitialProjectData());
  const [errors, setErrors] = useState<any[]>([]);

  // upload
  const [uploadErrorTitle, setUploadErrorTitle] = useState('');
  const [uploadValidationErrors, setUploadValidationErrors] = useState<string[]>([]);

  // dialogs/drawers
  const [previewOpen, setPreviewOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // menus
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);

  const actionsOpen = Boolean(actionsAnchorEl);

  // notfications
  const hasRequiredErrors = errors.some((e) => e.keyword === 'required');
  const canDownload = !hasRequiredErrors;

  // HANDLERS
  // notifications
  const { notification, showNotification, closeNotification } = useNotification();

  const currentYear = new Date().getFullYear();

  // actions
  const clearData = () => {
    setData(createInitialProjectData());

    setErrors([]);

    setUploadErrorTitle('');
    setUploadValidationErrors([]);

    showNotification('info', 'Project Config Cleared', '');
  };

  const downloadData = () => {
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'project.json';

    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
  };

  // form
  const sortLayersByWeightIfNeeded = (projectData: any) => {
    if (!Array.isArray(projectData.layers)) {
      return projectData;
    }

    const layers = projectData.layers;

    const needsSort = layers.some(
      (layer: any, index: any) =>
        index > 0 && (layer.weight ?? Number.MAX_SAFE_INTEGER) < (layers[index - 1].weight ?? Number.MAX_SAFE_INTEGER),
    );

    if (!needsSort) {
      return projectData;
    }

    return {
      ...projectData,
      layers: [...layers].sort((a, b) => (a.weight ?? Number.MAX_SAFE_INTEGER) - (b.weight ?? Number.MAX_SAFE_INTEGER)),
    };
  };

  const handleChange = ({ data, errors }: any) => {
    setData(data);
    setErrors(errors ?? []);
  };

  // import/export
  const validationMessages = useMemo(() => formatAjvErrors(errors), [errors]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      showNotification('error', 'Invalid File', 'Please upload a JSON file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);

        const validate = ajv.compile(schema);

        const valid = validate(parsed);

        if (!valid) {
          const messages = formatAjvErrors(validate.errors ?? []);

          setUploadErrorTitle('Upload Validation Failed');
          setUploadValidationErrors(messages);

          showNotification('error', 'Schema Validation Failed', `${messages.length} validation issues found.`);

          return;
        }

        setUploadErrorTitle('');
        setUploadValidationErrors([]);

        if (Array.isArray(parsed['layers'])) {
          parsed['layers'] = normaliseLayerWeights(parsed['layers']);
        }

        setData(parsed);
        showNotification('success', 'Project Loaded', `${file.name} passed schema validation.`);
      } catch (error) {
        setUploadErrorTitle('Invalid JSON');

        setUploadValidationErrors([
          'The uploaded file contains invalid JSON syntax and could not be parsed.',
          error instanceof Error ? error.message : 'Unknown parsing error',
        ]);

        showNotification('error', 'Invalid JSON', 'The file contains invalid JSON syntax.');
      }
    };

    reader.readAsText(file);
  };

  const handleUploadGVS = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = parseGVSText(e.target?.result as string);

        const languageCode =
          typeof data?.language === 'string' && /^[a-z]{2}$/i.test(data.language) ? data.language.toLowerCase() : 'en';
        const layers = normaliseLayerWeights(buildLayersFromGVS(parsed.items, languageCode));

        setData((current: any) => ({
          ...current,
          layers,
        }));

        showNotification(
          'success',
          'GVS Imported',
          `${parsed.items.length} layers imported and project.layers replaced.`,
        );
      } catch (error) {
        showNotification('error', 'GVS Import Failed', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    reader.readAsText(file);
  };

  const normaliseLayerWeights = (layers: any[]) => {
    return [...layers]
      .sort((a, b) => (a.weight ?? Number.MAX_SAFE_INTEGER) - (b.weight ?? Number.MAX_SAFE_INTEGER))
      .map((layer, index) => ({
        ...layer,
        weight: index,
      }));
  };

  return (
    <Box className="h-full w-full bg-bg flex flex-col overflow-hidden">
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                marginLeft: 8,
              }}>
              Geo3D Project Configuration
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            {
              <Button
                variant="contained"
                endIcon={<ArrowDropDownIcon />}
                onClick={(event) => setActionsAnchorEl(event.currentTarget)}>
                Actions
              </Button>
            }

            {
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
                  sx={menuItemSx}>
                  <ListItemIcon>
                    <UploadIcon sx={menuIconSx} />
                  </ListItemIcon>
                  <ListItemText>Upload Project Config</ListItemText>
                  <input
                    hidden
                    data-testid="upload-project-input"
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      handleUpload(e);
                      setActionsAnchorEl(null);
                    }}
                  />
                </MenuItem>

                <MenuItem
                  component="label"
                  sx={menuItemSx}>
                  <ListItemIcon>
                    <UploadIcon sx={menuIconSx} />
                  </ListItemIcon>
                  <ListItemText>Upload GVS</ListItemText>
                  <input
                    hidden
                    data-testid="upload-gvs-input"
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                      handleUploadGVS(e);
                      setActionsAnchorEl(null);
                    }}
                  />
                </MenuItem>

                <Divider sx={menuDividerSx} />

                <ListSubheader
                  disableSticky
                  sx={menuSubheaderSx}>
                  Examples
                </ListSubheader>

                <MenuItem
                  data-testid="load-example-gm-buttton"
                  sx={menuItemSx}
                  onClick={() => {
                    setData({
                      ...exampleDataGrangemouth,
                      layers: normaliseLayerWeights(exampleDataGrangemouth.layers ?? []),
                    });
                    setActionsAnchorEl(null);
                  }}>
                  <ListItemIcon>
                    <RestoreIcon sx={menuIconSx} />
                  </ListItemIcon>
                  <ListItemText>Grangemouth</ListItemText>
                </MenuItem>

                <MenuItem
                  data-testid="load-example-mc-buttton"
                  sx={menuItemSx}
                  onClick={() => {
                    setData({
                      ...exampleDataMcHenry,
                      layers: normaliseLayerWeights(exampleDataMcHenry.layers ?? []),
                    });
                    setActionsAnchorEl(null);
                  }}>
                  <ListItemIcon>
                    <RestoreIcon sx={menuIconSx} />
                  </ListItemIcon>
                  <ListItemText>McHenry</ListItemText>
                </MenuItem>

                <Divider sx={menuDividerSx} />

                <ListSubheader
                  disableSticky
                  sx={menuSubheaderSx}>
                  Tools
                </ListSubheader>

                <MenuItem
                  data-testid="preview-button"
                  sx={menuItemSx}
                  onClick={() => {
                    setPreviewOpen(true);
                    setActionsAnchorEl(null);
                  }}>
                  <ListItemIcon>
                    <VisibilityIcon sx={menuIconSx} />
                  </ListItemIcon>
                  <ListItemText>Preview</ListItemText>
                </MenuItem>

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
                  <ListItemText>Download</ListItemText>
                </MenuItem>
              </Menu>
            }
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Box className="flex-1 overflow-auto ">
        <Box className="bg-bg rounded shadow h-full flex flex-col min-h-0">
          <Box className="flex-1 overflow-auto p-10">
            {uploadValidationErrors.length > 0 && (
              <Alert
                severity="warning"
                sx={{
                  mb: 8,
                  alignItems: 'flex-start',
                  border: 1,
                }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1 }}>
                  {uploadErrorTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2 }}>
                  These issues prevented the uploaded file from being loaded.
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 3,
                  }}>
                  {uploadValidationErrors.map((message) => (
                    <li key={message}>
                      <Typography variant="body2">{message}</Typography>
                    </li>
                  ))}
                </Box>
              </Alert>
            )}
            {validationMessages.length > 0 && (
              <Alert
                severity="error"
                icon={<ErrorOutlineIcon />}
                sx={{
                  mb: 8,
                  alignItems: 'flex-start',
                  border: 1,
                  borderColor: '#91737b',
                }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1 }}>
                  {validationMessages.length} Current Configuration Validation Issues
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mb: 2 }}>
                  The configuration currently being edited contains validation errors. These must be resolved before
                  downloading.
                </Typography>

                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 3,
                  }}>
                  {validationMessages.slice(0, 20).map((message) => (
                    <li key={message}>
                      <Typography variant="body2">{message}</Typography>
                    </li>
                  ))}
                </Box>

                {validationMessages.length > 20 && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1 }}>
                    ...and {validationMessages.length - 20} more errors.
                  </Typography>
                )}
              </Alert>
            )}
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              validationMode="ValidateAndShow"
              config={{
                useDefaults: true,
                showUnfocusedDescription: true,
              }}
              onChange={handleChange}
              ajv={ajv}
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 'auto',
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

      <Drawer
        anchor="right"
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}>
        <Box
          sx={{
            width: { xs: '100%', sm: 420, md: 500, lg: 720 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}>
            <Typography variant="h6">Config Preview</Typography>
            <IconButton onClick={() => setPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              bgcolor: '#fff',
              p: 8,
            }}>
            {previewOpen && (
              <JsonView
                value={data}
                style={lightTheme}
                displayDataTypes={false}
              />
            )}
          </Box>
        </Box>
      </Drawer>

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
