import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/authContext";
import { Box, Button, IconButton, TextField, Tooltip, } from "@mui/material";
import { Check, ContentCopy, Edit, } from "@mui/icons-material";
import axios from "axios";

const apiUrl = "https://calendar-share-ad4162ab16ec.herokuapp.com";

export default function CalendarTitle({room}) {
    const { dbUser, rooms, setRooms } = useAuth();
    const [editingTitle, setEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    useEffect(()=>{
        if (room) {
            setNewTitle(room.title);
        }
    },[room]);
  
    const handleEditClick = () => {
        setEditingTitle(true);
      };
      
    const handleSaveClick = () => {

        // update room in DATABASE, and update LOCAL COPY of rooms
        const updatedRoom = { ...room, title: newTitle };

        axios.patch(`${apiUrl}/rooms/${room.room_id}`, updatedRoom)
            .then(result => {
                console.log(result);
                setEditingTitle(false);
            
                const updatedRooms = rooms.map((localRoom) => {
                    if (localRoom.room_id === room.room_id) {
                        return updatedRoom;
                    }
                    else{
                        return localRoom;
                    }
                });

                setRooms(updatedRooms);
            })
            .catch(error => {
                console.log(error);
            })
    };

    const handleKeyDown = event => {
        if (event.key === "Enter") {
          handleSaveClick();
        }
      };
    
    return (
        <div className='calendar_title'>
          <Box 
            display='flex' 
            alignItems='center' 
            justifyContent='center' 
            ml={dbUser && dbUser.user_id === room.host_id ? 5 : 0} 
            mt={2} 
            mb={2} 
          >
            {
              editingTitle ? (
                <>
                    <TextField
                    sx={{
                        '& .MuiInputBase-root': {
                        fontSize: '3rem',
                        },
                        '& .MuiInputBase-input': {
                        padding: '6px 0', 
                        textAlign: 'center',
                        },
                    }}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyDown} // Call handleSaveClick on Enter key
                    autoFocus
                    variant='filled'
                    />


                    <Tooltip title="Save Title" placement="right">
                        <IconButton onClick={handleSaveClick}>
                            <Check />
                        </IconButton>
                    </Tooltip>

                </>
              ) : (
                <>
                    <TextField
                        sx={{
                            pr: '0px',
                            '& .MuiInputBase-root': {
                            fontSize: '3rem',
                            },
                            '& .MuiInputBase-input': {
                              padding: '6px 0', 
                            textAlign: 'center',
                            },
                        }}
                        value={newTitle}
                        variant='standard'
                        InputProps={{
                            readOnly: true
                        }}
                    />
                    {dbUser &&  dbUser.user_id === room.host_id &&
                    <Tooltip title="Edit Title" placement="right">
                      <IconButton onClick={handleEditClick}>
                        <Edit />
                      </IconButton>
                    </Tooltip>}                
                </>
              )
            }
          </Box>
          
          {/* {editingTitle && (
            <Box textAlign='center' mt={2}>
              <Button variant='contained' onClick={handleSaveClick}>Save</Button>
            </Box>
          )} */}

            <Box textAlign='center'>
              <Tooltip title="Copy Room ID to Clipboard" placement="right">

                <Button onClick={() => navigator.clipboard.writeText(`${room.room_id}`)} variant='text' size='large' endIcon={<ContentCopy fontSize='small' />} >
                  Room ID: #{room.room_id}
                </Button>
              </Tooltip>

            </Box>

        </div>
    );
}