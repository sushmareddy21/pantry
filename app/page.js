// app/page.js
'use client';
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
  backgroundColor: '#4CAF50',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, box-shadow 0.3s',
  '&:hover': {
    backgroundColor: '#45a049',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  }
};

export default function PantryPage() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPantry = pantry.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        backgroundImage: `url('/images/groceryBackgroundImage3.jpeg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        color: '#fff',
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
              style={buttonStyle}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack spacing={3} alignItems="center" width="80%">
        <TextField
          id="search-bar"
          label="Search Pantry"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            color: '#333',
            '& .MuiInputLabel-root': { color: '#555' },
          }}
        />

        <Button
          variant="contained"
          onClick={handleOpen}
          style={buttonStyle}
        >
          Add New Item
        </Button>

        <Box border={'1px solid #333'} borderRadius={2} overflow="hidden">
          <Box
            width="800px"
            height="100px"
            bgcolor={'rgba(173, 216, 230, 0.8)'}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Pantry Items
            </Typography>
          </Box>

          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {filteredPantry.map(({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor={'rgba(240, 240, 240, 0.8)'}
                paddingX={5}
                borderBottom="1px solid #ddd"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(240, 240, 240, 1)', // Fully opaque on hover
                    transform: 'scale(1.02)', // Slight scale on hover
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
              >
                <Typography variant={'h5'} color={'#333'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                <Typography variant={'h5'} color={'#333'}>
                  Quantity: {count}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => addItem(name)}
                    startIcon={<AddIcon />}
                    style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => removeItem(name)}
                    startIcon={<RemoveIcon />}
                    style={{ ...buttonStyle, backgroundColor: '#f44336' }}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
