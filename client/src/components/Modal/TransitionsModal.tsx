import React, { FC, ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

export interface TransitionsModalProps {
  open: boolean;
  handleClose: () => void;
  children: ReactElement;
}

const TransitionsModal: FC<TransitionsModalProps> = ({ open, handleClose, children }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(400px, 80%)',
            bgcolor: 'background.paper',
            borderRadius: '3px',
            boxShadow: 24,
            p: 4,
          }}
        >
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default TransitionsModal;
