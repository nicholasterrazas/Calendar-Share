import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = "https://calendar-share-ad4162ab16ec.herokuapp.com";

export default function JoinRoom() {
    const [roomID, setRoomID] = useState(""); 
    const [incorrectFormat, setIncorrectFormat] = useState(false); 
    const navigate = useNavigate();


    const handleInput = () => {
        const room_id = roomID.toUpperCase();
        console.log(`Joining room ${room_id}`);

        axios.get(`${apiUrl}/rooms/${room_id}`)
            .then(response => {
                if (response.data === "Not found"){
                    console.warn("Room doesn't exist!");
                    return;
                }

                navigate(`/calendar/${room_id}`);

            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleKeyDown = event => {
        if (event.key === "Enter") {
            handleInput();
        }
    };

    useEffect(() => {
        if (roomID === ""){
            setIncorrectFormat(false);
            return;
        }

        const correctFormat = /^([A-Za-z]{6})$/.test(roomID);
        if (correctFormat === false){
            setIncorrectFormat(true);
        }
        else {
            setIncorrectFormat(false);
        }
    }, [roomID]);
    
    return (
        <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            mt='-100px'
        >

            <Stack
                direction='column' 
                justifyContent='center' 
                alignContent='center' 
            >
                <Typography
                    component="h1"
                    variant="h3"
                    align="center"
                    color="text.primary"
                >
                    Join Calendar
                </Typography>
                <Typography 
                    variant="h6" 
                    align="center" 
                    color="text.secondary" 
                >
                    Enter Room ID Below
                </Typography>
                <Stack 
                    spacing={3} 
                    direction='column' 
                    justifyContent='center' 
                    alignContent='center' 
                    sx={{width: '300px'}} 
                >
                    <TextField 
                        value={roomID.toUpperCase()}
                        onChange={(e) => setRoomID(e.target.value)}
                        onKeyDown={handleKeyDown}
                        error={incorrectFormat}
                        helperText={incorrectFormat ? 'Must be 6 alphabetical letters' : null}
                        id='inputID' 
                        variant='standard'
                        sx={{
                            textAlign: 'center', 
                            '& .MuiInputBase-root': {
                                fontSize: '2rem',
                            },
                            '& .MuiInputBase-input': {
                                padding: '6px 0', 
                                textAlign: 'center',
                            },
                        }}
                    />
                    <Button 
                        variant='contained' 
                        onClick={handleInput} 
                        size='large'
                        disabled={incorrectFormat}
                    >
                        Enter Room
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
