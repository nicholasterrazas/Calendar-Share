import { Backdrop, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import axios from "axios";
import { blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightGreen, orange, pink, red, yellow } from "@mui/material/colors";
import theme from "../theme";

const palette = [

    // Base Colors
    {name: 'Black', color: grey[900]}, 
    {name: 'Grey', color: grey[600]}, 
    {name: 'Brown', color: brown[700]},
    {name: 'Red', color: red['A700']}, 
    {name: 'Orange', color: orange[700]}, 
    {name: 'Yellow', color: yellow[600]},
    {name: 'Green', color: green[800]},
    {name: 'Blue', color: blue[500]}, 
    {name: 'Indigo', color: indigo[700]},
    {name: 'Purple', color: deepPurple[500]}, 

    // Pastel Colors
    {name: 'Lavender', color: deepPurple[200]}, 
    {name: 'Matcha', color: lightGreen[200]},
    {name: 'Banana', color: yellow[100]},
    {name: 'Peach', color: deepOrange['A100']}, 
    {name: 'Rose', color: pink[200]}, 

    // Neon Colors
    {name: 'Pink', color: pink['A200']},
    {name: 'Cyan', color: cyan['A400']},
    {name: 'Lime', color: lightGreen['A200']}, 

];

function ParticipantSummary({userName, userColor}) {


    return (
        <Box
            pt='10px'
            // maxWidth='80%'
        >
            <Stack
                alignItems='center'
                
                direction='row'
            >
                <Typography
                    component='h5'
                    variant='h5'
                    textAlign='center'
                >
                    {userName}
                </Typography>
                <Box
                    ml={2}
                    width={20}
                    height={20}
                    sx={{
                        bgcolor: userColor,
                        borderRadius: 45,
                        border: 2
                    }}
                />
            </Stack>
        </Box>
    )
}


function ModifyParticipantButton({dbUser, room, setRoom, hexToPalette}) {
    const [open, setOpen] = useState(false);
    const [newColor, setNewColor] = useState('');

    const handleClose = () => {
      setOpen(false);
    };
    
    const handleOpen = () => {
      setOpen(true);
    };


    const handleSubmit = () => {
        setOpen(false);


        // check for new name/color        
        const modifiedUser = room.participants.find((user) => user.user_id === dbUser.user_id);
        const newName = document.getElementById('new-name').value;
        if (newName !== '') {
            modifiedUser.name = newName;
        }
        if (newColor !== '') {
            modifiedUser.color = newColor;
        }
        
        // modify user in room
        const newUsers = room.participants.map((user) => {
            if (user.user_id === dbUser.user_id){
                return modifiedUser;
            }
            else{
                return user;
            }
        });
        const updatedRoom = {...room, participants: newUsers};
        console.log(updatedRoom);

        // send updated room to DB
        axios.patch(`http://localhost:5050/rooms/${room.room_id}`, updatedRoom)
        .then(response => {
            console.log(response);
            setRoom(updatedRoom);
        })
        .catch(error => {
            console.error(error);
        })

    };

    const handleChange = (event) => {
        setNewColor(event.target.value)
    };

    return (
        <Box
            pt='10px'
            maxWidth='60%'
            
        >
            <Button
                variant='text'
                onClick={handleOpen}
            >
                Change Details
            </Button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Paper
                    onClick={e => e.stopPropagation()}
                    sx={{
                        width: '35%',
                        height: '45%',
                    }}
                >
                    <Stack 
                        spacing={2}
                        sx={{ 
                            alignItems: 'center', 
                        }}    
                    >
                        <Typography>
                            New Details
                        </Typography>
                        
                        <TextField 
                            id="new-name"
                            name="new-name"
                            label="New Name"
                            variant="outlined"
                            sx={{ width: '50%', }}
                        />

                        <FormControl 
                            sx={{
                                width: '50%',
                            }} 
                        >
                            <InputLabel 
                                id='select-color'
                            >
                                New Color
                            </InputLabel>
                            <Select
                                labelId='select-color'
                                id='select-color'
                                value={newColor}
                                label="New Color"
                                onChange={handleChange}
                                sx={{
                                    // bgcolor: `${color}.main`,
                                    color: hexToPalette(newColor),
                                }}
                        
                            >
                                {palette.map(color =>
                                    <MenuItem
                                        key={color.name}
                                        value={color.color}
                                        sx={{
                                            bgcolor: `${color.name}.main`,
                                            color: `${color.name}.main`,
                                        }}
                                    >
                                        {color.name}
                                    </MenuItem>
                                )}

                            </Select>
                        </FormControl>

                        <Button
                            variant='contained' 
                            sx={{ width: '50%' }} 
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>

                    </Stack>
                </Paper>
            </Backdrop>
        </Box>
    )
}


// Contains a summary of a person's profile within the room e.g. name and color, etc... 
// as well as ways to modify them
export default function ParticipantDetails({room, setRoom, dbUser, setDbUser}){
    
    const getUserColor = () => {
        const roomUser = room.participants.find((user) => user.user_id === dbUser.user_id);
        return roomUser.color;
    };

    const getUserName = () => {
        const roomUser = room.participants.find((user) => user.user_id === dbUser.user_id);
        return roomUser.name;
    };

    const hexToPalette = (color) => {
        if (color === null){
            return null;
        }

        // console.log(color)
        const paletteColor = palette.find((paletteColor) => paletteColor.color === color);
        // console.log(paletteColor)
        return (paletteColor) ? (`${paletteColor.name}.main`) : '#eeeeee'
    };

    const userName = getUserName();
    const userColor = hexToPalette(getUserColor());

    return (
        <Box
            sx={{
                // boxShadow: '1'
            }}
        >
            <Stack
                alignItems='center'
            >
                <Typography color="text.secondary" >
                    Personal Details
                </Typography>

                <ParticipantSummary
                    userName={userName}                
                    userColor={userColor}
                />

                <ModifyParticipantButton
                    room={room} 
                    setRoom={setRoom}
                    dbUser={dbUser}
                    setDbUser={setDbUser}
                    hexToPalette={hexToPalette}
                />                    
            </Stack>
        </Box>
    )
}