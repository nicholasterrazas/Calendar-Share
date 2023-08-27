import React, { useState } from "react";
import { Delete, Person, SaveAlt, Undo } from "@mui/icons-material";
import { Alert, Backdrop, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightGreen, orange, pink, red, yellow } from "@mui/material/colors";

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

const hexToPalette = (color) => {
    if (color === null){
        return null;
    }

    // console.log(color)
    const paletteColor = palette.find((paletteColor) => paletteColor.color === color);
    // console.log(paletteColor)
    return (paletteColor) ? (`${paletteColor.name}.main`) : '#eeeeee'
};

export default function MobileSpeedDial ({
    dayList, setDayList, stableList, setStableList, 
    room_id, room, setRoom, 
    dbUser, setDbUser, 
    palette, 
    }) {

    const [newColor, setNewColor] = useState('');

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('default'); 
    const [open, setOpen] = useState(false);
  
    const handleClose = () => {
        setOpen(false);
      };
      
    const handleOpen = () => {
        setOpen(true);
    };
  
    const handleChange = (event) => {
        setNewColor(event.target.value)
    };

    const displayAlert = (alertType) => {
        if (alertType === "calendar-success") {
        return ( 
            <Alert onClose={handleAlertClose} severity="success" variant="filled">
            Calendar saved successfully
            </Alert>        
        )
        }
        else if (alertType === "calendar-info") {
        return ( 
            <Alert onClose={handleAlertClose} severity="info" variant="filled">
            No changes made to calendar
            </Alert>
        ) 
        }
        else if (alertType === "calendar-error") {
        return ( 
            <Alert onClose={handleAlertClose} severity="error" variant="filled">
            Error saving calendar, try again
            </Alert>
        )    
        }
        else if (alertType === "user-success") {
            return ( 
                <Alert onClose={handleAlertClose} severity="success" variant="filled">
                    Details changed successfully
                </Alert>        
            )
        }
        else if (alertType === "user-info") {
            return ( 
                <Alert onClose={handleAlertClose} severity="info" variant="filled">
                    No changes made
                </Alert>
            ) 
        }
        else {
            return (
                <Alert onClose={handleAlertClose} severity="warning" variant="filled">
                    Unknown alert type "{alertType}"
                </Alert>                
            )
        }
    };
  
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };
    

    const handleClear = () => {
        setDayList([]);

    };

    const handleRestore = () => {
        setDayList(stableList);
    }

    const handleSave = () => {
        console.log('Saving calendar: ');
        console.log(dayList);
    
        if (room===null || room === undefined){
          console.warn('No room to save to!');
          return;
        }
      
        if (dayList === stableList) {
          setAlertType('calendar-info');
          setAlertOpen(true);
          return;
        }
    
    
        // SAVE SELECTED DAYS TO ROOM DB
        console.log(`updating room ${room_id}`);
        console.log(room);
        // let foundUser = false;
        let updatedRoom = { 
          ...room,
          participants: room.participants.map(participant => {
            // console.log(participant.user_id);
            // console.log(dbUser.user_id);
            if (participant.user_id === dbUser.user_id) {
              // Update the selected days of the current user
              // foundUser = true;
              return {
                ...participant,
                selected_days: dayList
              };
            } else {
              // Keep the other participants as they are
              return participant;
            }
          })
        };
    
    
        // update user's selected days
        console.log('updatedRoom: ');
        console.log(updatedRoom);
    
        axios
          .patch(`http://localhost:5050/rooms/${room_id}`, updatedRoom)
          .then(response => {
            // Update the local state with the updated room
            console.log(response);
            setStableList(dayList);
            setRoom(updatedRoom);
    
            setAlertType('calendar-success');
            setAlertOpen(true)    
          })
          .catch(error => {
            console.error(error);
            setAlertType('error');
            setAlertOpen(true)    
          });
    };


    const handleSubmit = () => {
        setOpen(false);

        // check for new name/color        
        const modifiedUser = room.participants.find((user) => user.user_id === dbUser.user_id);
        const newName = document.getElementById('new-name').value;
        
        if (newName === '' && newColor === ''){
            setAlertType("user-info");
            setAlertOpen(true);  
            return;
        }

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

            setNewColor('');
            setAlertType("user-success");
            setAlertOpen(true);    
        })
        .catch(error => {
            console.error(error);
            
            setNewColor('');
            setAlertType("error");
            setAlertOpen(true);
        })

    };



    return (
        <Box 
            // sx={{ transform: 'translateZ(0px)', }}
        >            
            <SpeedDial 
                ariaLabel="Speed Dial"
                sx={{ position: 'fixed', bottom: 64, right: 32 }}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction 
                    key='Save'
                    icon={<SaveAlt />}
                    tooltipTitle='Save Calendar'
                    onClick={handleSave}
                />
                <SpeedDialAction 
                    key='Clear'
                    icon={<Delete />}
                    tooltipTitle='Clear Calendar'
                    onClick={handleClear}
                />
                <SpeedDialAction 
                    key='Restore'
                    icon={<Undo />}
                    tooltipTitle='Restore Calendar'
                    onClick={handleRestore}
                />
                <SpeedDialAction 
                    key='Modify'
                    icon={<Person />}
                    tooltipTitle='Modify Personal Details'
                    onClick={handleOpen}
                />
                
            </SpeedDial>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Paper
                    onClick={e => e.stopPropagation()}
                    sx={{
                        width: 400,
                        height: 250,
                    }}
                >
                    <Stack 
                        spacing={2}
                        sx={{ 
                            alignItems: 'center',
                            // mx: 0.75,
                            width: 400,
                            height: 100,
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
                            sx={{ width: '65%', }}
                        />

                        <FormControl 
                            sx={{
                                width: '65%',
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
                            sx={{ width: '65%' }} 
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </Button>

                    </Stack>
                </Paper>
            </Backdrop>

            <Snackbar 
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} 
                open ={alertType !== null && alertOpen} 
                autoHideDuration={6000}
                onClose={handleAlertClose}
            >
                {displayAlert(alertType)}
            </Snackbar>
        </Box>
    );
}