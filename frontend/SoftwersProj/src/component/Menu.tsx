import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import './Header.css';
import { Alert } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Done from './Done'; // adjust the path if needed


const options = [
  'View Information',
  'Add Information',
  'Edit Information',
  'Delete Information',
];

const ITEM_HEIGHT = 48;

type MenuProps = {
  phone_nbr: string;
  country_code: string;
  country_name: string;
};

export default function LongMenu({
  phone_nbr,
  country_code,
  country_name,
}: {
  phone_nbr: string;
  country_code: string;
  country_name: string;
}) {
  const [userName, setUserName] = React.useState('');
  const [operatorName, setOperatorName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState(phone_nbr);
  const [countryName, setCountryName] = React.useState(country_name);
  const [countryCode, setCountryCode] = React.useState(country_code);
  


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openAddInfo, setOpenAddInfo] = React.useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = React.useState(false);
  const [openViewInfo, setOpenViewInfo] = React.useState(false);
  const [openEditInfo, setOpenEditInfo] = React.useState(false);
  const handleCloseAddInfo = () => {
    setOpenAddInfo(false);
  };
  const handleCloseEditInfo = () => {
    setOpenEditInfo(false);
  };
   const handleCloseDeleteInfo = () => {
    setOpenDeleteInfo(false);
  };
  const handleCloseViewInfo = () => {
    setOpenViewInfo(false);
  };

const handleMenuItemClick = async (option: string) => {
  if (option === 'Add Information') {
    setOpenAddInfo(true);
  } else if (option === 'Delete Information') {
    setOpenDeleteInfo(true);
  } else if (option === 'View Information') {
    try {
      const response = await fetch(`http://localhost:3000/getuser/${phone_nbr}`, {
        method: 'POST', // Usually GET for fetching data, not POST
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();

      // Assuming your data shape:
      setUserName(data.users_name || '');
      setOperatorName(data.operator_name || '');
      setDescription(data.description || '');
      // you can also update other states if needed

      setOpenViewInfo(true); // Open dialog after data is loaded
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
  if( option === 'Edit Information') {
    setOpenEditInfo(true);
  }
  handleClose();
};

const [openDoneDialog, setOpenDoneDialog] = React.useState(false);

const handleEditUser = async () => {
  try {
    const parsed = parsePhoneNumberFromString(phoneNumber);

    if (!parsed || !parsed.isValid()) {
      alert('Invalid phone number');
      return;
    }

    const formattedNumber = parsed.formatInternational(); // e.g., "+961 3 348 756"

    const requestBody = {
      users_name: userName,
      phone_number: formattedNumber,
      description: description,
      operator_name: operatorName,
      country_name: parsed.country || 'Unknown',
      country_code: `+${parsed.countryCallingCode}`,
    };

    const response = await fetch(`http://localhost:3000/edituser/${phone_nbr}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log(data);
    handleCloseAddInfo();
    
    setOpenDoneDialog(true);
  } catch (error) {
    console.error('Error editing user:', error);
    alert('There was an error editing the user.');
  }
};

const handleDeleteUser = async () => {
  try {
    const response = await fetch(`http://localhost:3000/deleteuser/${phone_nbr}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error deleting user:', error);
  }

  handleCloseDeleteInfo(); // Close the menu after deletion
  handleClose();
  
  setOpenDoneDialog(true);
};


const handleViewUser = async () => {
  try {
    const response = await fetch(`http://localhost:3000/getuser/${phone_nbr}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        users_name: userName,
        phone_number: phone_nbr,
        description: description,
        operator_name: operatorName,
        country_name: country_name,
        country_code: country_code,
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error editing user:', error);
  }
  handleCloseAddInfo();
};



  return (
    <div>
      <Done open={openDoneDialog} onClose={() => setOpenDoneDialog(false)} />
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
          list: {
            'aria-labelledby': 'long-button',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleMenuItemClick(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      <React.Fragment>
        <Dialog
          open={openAddInfo}
          onClose={handleCloseAddInfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              marginTop: '60px',
              alignSelf: 'flex-start',
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ width: '92%', maxWidth: '100%', height: '50px' }}
          >
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <h2
                style={{
                  color: '#3a834d',
                  fontSize: '20px',
                  margin: '0',
                }}
              >
                Add Information
              </h2>
              <Button
                onClick={handleCloseAddInfo}
                style={{ color: 'red', marginTop: '5px', minWidth: '0' }}
              >
                <CloseIcon />
              </Button>
            </Grid>
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '96%' },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  label="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  fullWidth
                  helperText="Please Enter The User Name of the phone number"
                />

                <TextField
                  label="OperatorName (g)"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  fullWidth
                  helperText="Please Enter OperatorName (g) of the phone number ex:alpha or touch"
                />

                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={5}
                />

              </Box>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleEditUser}
              autoFocus
              style={{
                color: '#3a834d',
                border: 'none',
                marginRight: '10px',
              }}
              variant="outlined"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>



      <React.Fragment>
        <Dialog
          open={openDeleteInfo}
          onClose={handleCloseDeleteInfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              marginTop: '60px',
              alignSelf: 'flex-start',
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ width: '500px', maxWidth: '100%', height: '50px' }}
          >
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <h2
                style={{
                  color: '#3a834d',
                  fontSize: '20px',
                  marginRight: '10px',
                }}
              >
               Warning 
              </h2>
             <WarningIcon style={{color:"red"}}/>
            </Grid>
          </DialogTitle>
                <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '96%' },
                }}
                noValidate
                autoComplete="off"
              >
               <Alert severity="warning">Are You Sure You Want To Delete This Phone Number</Alert>

              </Box>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleDeleteUser}
              autoFocus
              style={{
                color: '#3a834d',
                border: 'none',
                marginRight: '10px',
              }}
              variant="outlined"
            >
              Yes
            </Button>
             <Button
              onClick={handleCloseDeleteInfo}
              autoFocus
              style={{
                color: 'red',
                border: 'none',
                marginRight: '10px',
              }}
              variant="outlined"
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>


      

    <React.Fragment>
  <Dialog
    open={openViewInfo}
    onClose={handleCloseViewInfo}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    PaperProps={{
      sx: {
        marginTop: "10px",
        alignSelf: "flex-start",
        padding: "16px",
        width: "500px",
        maxWidth: "100%",
      },
    }}
  >
    <DialogTitle
      id="alert-dialog-title"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        height: "50px",
        paddingRight: 1,
      }}
    >
      <h2
        style={{
          color: "#3a834d",
          fontSize: "20px",
          margin: 0,
        }}
      >
        View Detailed Information
      </h2>
      <Button
        onClick={handleCloseViewInfo}
        sx={{ color: "red", marginTop: "5px", minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </DialogTitle>

    <DialogContent dividers>
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      mt: 1,
      px: 1,
      fontFamily: "'Poppins', sans-serif",  // <-- font added here
      fontSize: '16px',
      color: '#2c3e50',
    }}
  >
    <p>
      <strong style={{color:"#3a834d"}}>User Name:</strong> {userName || 'N/A'}
    </p>
    <p>
      <strong style={{color:"#3a834d"}}>Phone Number:</strong> {phone_nbr || 'N/A'}
    </p>
    <p>
      <strong style={{color:"#3a834d"}}>Operator Name:</strong> {operatorName || 'N/A'}
    </p>
    <p>
      <strong style={{color:"#3a834d"}}>Country Code:</strong> {country_code || 'N/A'}
    </p>
    <p>
      <strong style={{color:"#3a834d"}}>Country Name:</strong> {country_name || 'N/A'}
    </p>
  <p>
  <strong style={{ color: "#3a834d" }}>Description:</strong><br />
  <div
    style={{
      maxHeight: '4.5em', // approx 3 lines (1.5em per line)
      overflowY: 'auto',
      whiteSpace: 'pre-wrap', // preserve line breaks
      paddingRight: '8px', // add some padding so scrollbar doesn’t hide text
    }}
  >
    {description || 'N/A'}
  </div>
</p>

  </Box>
</DialogContent>

  </Dialog>
</React.Fragment>


 <React.Fragment>
        <Dialog
          open={openEditInfo}
          onClose={handleCloseEditInfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              marginTop: '60px',
              alignSelf: 'flex-start',
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ width: '92%', maxWidth: '100%', height: '50px' }}
          >
            <Grid
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <h2
                style={{
                  color: '#3a834d',
                  fontSize: '20px',
                  margin: '0',
                }}
              >
                Edit Information
              </h2>
              <Button
                onClick={handleCloseEditInfo}
                style={{ color: 'red', marginTop: '5px', minWidth: '0' }}
              >
                <CloseIcon />
              </Button>
            </Grid>
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '96%' },
                }}
                noValidate
                autoComplete="off"
              >
             
                <Grid style={{display: 'flex', justifyContent: 'space-between',flexDirection: 'row', alignItems: 'center'}}>
                <TextField
                    label="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    fullWidth
                    style={{width: '45%'}}
                  />
                <TextField
                  label="OperatorName (g)"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  fullWidth
                  style={{width: '45%'}}
                />
                </Grid>
                 <TextField
                  label="Phone Number*"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  fullWidth
                  
                />

                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={5}
                  helperText="Note: Don't leave any field blank unless you want to clear its value."                />

              </Box>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleEditUser}
              autoFocus
              style={{
                color: '#3a834d',
                border: 'none',
                marginRight: '10px',
              }}
              variant="outlined"
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      
    </div>
  );
}
