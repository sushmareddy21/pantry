// app/page.js
'use client'; // Ensure this directive is at the top

import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Head from 'next/head';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: 'column',
  gap: 3
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, box-shadow 0.3s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const addButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#4A90E2', // Soft Blue
  color: '#fff',
  '&:hover': {
    backgroundColor: '#357ABD', // Darker Blue
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  }
};

const removeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#E94E77', // Soft Red
  color: '#fff',
  '&:hover': {
    backgroundColor: '#C42D50', // Darker Red
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  }
};

const iconStyle = {
  fontSize: '24px', // Adjust icon size as needed
};

const pantryBoxStyle = {
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  marginTop: '20px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)', // Subtle gradient
};

const headerBoxStyle = {
  width: "800px",
  height: "100px",
  bgcolor: '#B3E5FC', // Light blue background
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: '2px solid #81D4FA', // Slightly darker blue border
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
};

const itemBoxStyle = {
  width: "100%",
  minHeight: "150px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', // Subtle gradient
  paddingX: 5,
  borderBottom: '1px solid #E0E0E0', // Light gray border
  borderRadius: '8px',
  margin: '10px 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s, background-color 0.3s',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9', // Slight color change on hover
  }
};

export default function PantryPage() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ "name": doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        backgroundImage: `url('/images/groceryBackgroundImage3.jpeg')`, // Path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        color: '#fff', // Ensures text is readable on top of the image
      }}
    >
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              style={addButtonStyle}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={handleOpen}
        style={addButtonStyle}
      >
        Add New Item
      </Button>

      <Box sx={pantryBoxStyle}>
        <Box sx={headerBoxStyle}>
          <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {pantry.map(({ name, count }) => (
            <Box
              key={name}
              sx={itemBoxStyle}
            >
              <Typography variant='h6' color={'#333'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant='h6' color={'#333'}>
                Quantity: {count}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  startIcon={<AddIcon style={iconStyle} />}
                  style={addButtonStyle}
                />
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  startIcon={<RemoveIcon style={iconStyle} />}
                  style={removeButtonStyle}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
