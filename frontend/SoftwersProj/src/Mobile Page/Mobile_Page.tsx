import React, { useState } from 'react';
import { Header } from '../component/Header';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Menu from '../component/Menu';
import './Mobile_Page.css';

type RowData = {
  number: string;
  country: string;
  countryCode: string;
  operatorName: string;
};

export function Mobile_Page() {
  const [showTable, setShowTable] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [number, setNumber] = useState<string>('');
  const [rows, setRows] = useState<RowData[]>([]);
  const [open, setOpen] = useState(true);

  const handleClose = () => setOpen(false);

  const handleValidate = async () => {
    const parsed = parsePhoneNumberFromString(number);

    if (parsed && parsed.isValid()) {
      setIsValid(true);
      const formattedNumber = parsed.formatInternational();

      const requestBody = {
        users_name: "Guest",
        phone_number: formattedNumber,
        description: "Validated by UI",
        operator_name: "Not available",
        country_name: parsed.country || "Unknown",
        country_code: parsed.countryCallingCode || "N/A",
      };

      try {
        const response = await fetch("http://localhost:3000/adduser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unknown error");

        const user = data.user;

        setRows([
          {
            number: user.phone_nbr,
            country: user.country_name,
            countryCode: user.country_code,
            operatorName: user.operator_name,
          },
        ]);
        setShowTable(true);
        setOpen(false);
      } catch (error) {
        console.error("Error:", error);
        alert("There was an error contacting the server.");
      }
    } else {
      setIsValid(false);
      setOpen(true);
      setShowTable(false);
    }
  };

  const handleGetAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/getallusers");
      const data = await response.json();

      if (!response.ok || !Array.isArray(data.users)) {
        throw new Error(data.error || "Invalid response");
      }

      const userRows: RowData[] = data.users.map((user: any) => ({
        number: user.phone_nbr,
        country: user.country_name,
        countryCode: user.country_code,
        operatorName: user.operator_name,
      }));

      setRows(userRows);
      setShowTable(true);
      setOpen(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  return (
    <>
      <Header onGetAllUsers={handleGetAllUsers} />

      <Grid className="mobile-page-header">
        <TextField
          label="Phone Number"
          type="tel"
          variant="outlined"
          className="NbrTxt"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          helperText={
            <span style={{ fontSize: '12px', textAlign: 'center' }}>
              Enter a valid phone number with country code (e.g., +961...),<br />
              <span style={{ color: "red" }}>no spaces allowed.</span>
            </span>
          }
          style={{ marginBottom: "15px" }}
        />
        <Button
          className="NbrBtn"
          variant="contained"
          style={{ backgroundColor: "#3a834d", marginBottom: "30px" }}
          onClick={handleValidate}
        >
          Validate Mobile Number
        </Button>
      </Grid>

      {open && isValid === false && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          PaperProps={{
            sx: {
              marginTop: '70px',
              alignSelf: 'flex-start',
              width:"500px"
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'red' }}>Warning</span>
            <Button onClick={handleClose} style={{ color: "red", minWidth: "0" }}>
              <CloseIcon />
            </Button>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{margin:"10px"}}>
              <Alert severity="error">Invalid Phone Number</Alert>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}

      {showTable && (
        <Grid className="mobile-page-table">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Country Code</TableCell>
                  <TableCell>Operator Name</TableCell>
                  <TableCell>Information</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.number}>
                    <TableCell>{row.number}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.countryCode}</TableCell>
                    <TableCell>{row.operatorName}</TableCell>
                    <TableCell>
                      <Menu
                        phone_nbr={row.number}
                        country_code={row.countryCode}
                        country_name={row.country}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </>
  );
}

export default Mobile_Page;
