import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface DoneProps {
  open: boolean;
  onClose: () => void;
}

const Done: React.FC<DoneProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="done-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 3,
          minWidth: 300,
          textAlign: 'center',
          mt: 4, // margin from the top (adjust as needed)
          alignSelf: 'flex-start', // ensures top alignment in the viewport
          position: 'absolute',
          top: 170, // <-- This pushes it down from the top (in pixels)
          
        },
      }}
    >
      <DialogTitle id="done-dialog-title" sx={{ paddingBottom: 0 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#3a834d' }} />
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6" sx={{ color: '#3a834d', fontWeight: 'bold' }}>
          Changes Saved!
        </Typography>
        
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
            onClick={() => {
            onClose();
            window.location.reload();
            }}
          variant="contained"
          sx={{
            backgroundColor: '#3a834d',
            '&:hover': {
              backgroundColor: '#2e6c3a',
            },
            borderRadius: 2,
            px: 4,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Done;
