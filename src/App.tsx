import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router';
import { Geo3dLoaderConfiguration } from './components/Geo3dLoaderConfiguration';
import { GVSConfiguration } from './components/GVSConfiguration';
import { ProjectsListConfiguration } from './components/ProjectsListConfiguration';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#6B705C',
      light: '#A5A58D',
      dark: '#3A3F2E',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#CB997E',
      light: '#DDBEA9',
      dark: '#A47148',
      contrastText: '#2F2F2F',
    },

    background: {
      default: '#F5F3F0',
    },

    text: {
      primary: '#2F2F2F',
      secondary: '#363636',
    },

    success: {
      main: '#7C8C6B',
    },

    warning: {
      main: '#D4A373',
    },

    error: {
      main: '#B56576',
    },

    divider: '#E6E1DC',
  },

  spacing: 1,
  typography: {
    fontSize: 14,
    fontFamily: '"Inter", sans-serif',

    h1: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Inter", sans-serif', fontWeight: 700, marginBottom: 12 },

    subtitle1: { fontFamily: '"Inter", sans-serif' },
    subtitle2: { fontFamily: '"Inter", sans-serif' },

    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          // gap: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '12px',
          border: 'none',
          boxShadow: 'none',
          background: '#fff',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: '#7C8C6B',
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          marginTop: '8px',
          marginLeft: 0,
          marginRight: 0,
          marginBottom: '8px',
          letterSpacing: '0px',
          lineHeight: '1.4',

          '&:not(:empty):not(.Mui-error)': {
            backgroundColor: '#f5f3f0',
            padding: '8px 12px',
            borderRadius: '4px',
          },

          '&.Mui-error': {
            backgroundColor: 'transparent',
            paddingLeft: 8,
            borderRadius: 0,
          },

          '&:empty': {
            backgroundColor: 'transparent',
            padding: 0,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          padding: '4px 8px',
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          marginTop: '0',
          marginBottom: '16px',
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          border: '1px solid #E6E1DC',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
          borderRadius: 6,
        },

        root: {
          '& .MuiFormControl-root': {
            marginBottom: 0,
          },
          '& .MuiFormHelperText-root': {
            marginBottom: 0,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 4,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '1px solid #E6E1DC',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
          borderRadius: 6,
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid',
          borderColor: '#999',
          borderRadius: 4,

          '&:before': {
            display: 'none',
          },

          '& + &': {
            marginTop: 8,
          },
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        <Route
          path="/"
          element={<Geo3dLoaderConfiguration />}
        />
        <Route
          path="/projects-list"
          element={<ProjectsListConfiguration />}
        />
        <Route
          path="/gvs-config"
          element={<GVSConfiguration />}
        />
        <Route
          path="*"
          element={<Geo3dLoaderConfiguration />}
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
