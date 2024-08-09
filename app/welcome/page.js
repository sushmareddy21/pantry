// app/welcome/page.js
'use client';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from "@mui/material";

const WelcomePage = () => {
  const router = useRouter();

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f8f8f8"
      gap={4}
      style={{
        backgroundImage: `url('/images/groceryBackgroundImage2.jpeg')`, // Path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Typography variant="h2" color="#fff" textAlign="center">
        Welcome to Grocery Manager!
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push('/')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50', // Green color
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049'; // Darker green on hover
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50'; // Original green color
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        }}
      >
        Go to Pantry
      </Button>
    </Box>
  );
};

export default WelcomePage;
