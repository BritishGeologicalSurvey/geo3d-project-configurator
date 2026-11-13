import CloseIcon from '@mui/icons-material/Close';
import ConstructionIcon from '@mui/icons-material/Construction';
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import { Box, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NavigationDrawer: FC<NavigationDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentYear = new Date().getFullYear();

  const navItems = [
    {
      label: 'Project Config',
      path: '/',
      icon: <ConstructionIcon fontSize="small" />,
    },
    {
      label: 'Project List',
      path: '/projects-list',
      icon: <FolderIcon fontSize="small" />,
    },
    {
      label: 'GVS Config',
      path: '/gvs-config',
      icon: <LayersIcon fontSize="small" />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            borderRight: '1px solid #E6E1DC',
          },
        },
      }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFF',
        }}>
        <Box
          sx={{
            px: 8,
            py: 8,
            borderRadius: 2,
            background: '#6B705C',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}>
              Geo3D Config
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
              }}>
              Configuration Management Tools
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#fff',
              mt: -0.5,

              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 1,
          }}>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}>
            Navigation
          </Typography>
        </Box>

        <List
          sx={{
            px: 2,
          }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1.25,

                '&:hover': {
                  bgcolor: 'rgba(107,112,92,0.08)',
                },

                '&.Mui-selected': {
                  bgcolor: 'rgba(107,112,92,0.15)',

                  '&:hover': {
                    bgcolor: 'rgba(107,112,92,0.20)',
                  },
                },
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? '#6B705C' : 'text.secondary',
                }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

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
            }}>
            © UKRI (British Geological Survey) and the Polish Geological Institute {currentYear}.
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};
