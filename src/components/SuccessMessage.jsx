import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function SuccessMessage(props) {
  // State is now directly controlled by props.open
  return (
    <Dialog
      open={props.open} // This controls the visibility based on the parent component
      onClose={() => {}} // Method to call on close (to be defined in the parent)
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick // Desabilita fechamento ao clicar no backdrop
      disableEscapeKeyDown // Opcional: desabilita fechamento com a tecla Esc
    >
      <DialogTitle id="alert-dialog-title">{'Successo'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
