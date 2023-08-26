import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { Clear, CloudDownload, Sync } from "@mui/icons-material";

export default function CalendarButtons({dayList, setDayList, stableList, setStableList, room_id, room, setRoom, dbUser, setDbUser, palette}){
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('default'); 

  const displayAlert = (alertType) => {
    if (alertType === "success") {
      return ( 
        <Alert onClose={handleAlertClose} severity="success" variant="filled">
          Calendar saved successfully
        </Alert>        
      )
    }
    else if (alertType === "info") {
      return ( 
        <Alert onClose={handleAlertClose} severity="info" variant="filled">
          No changes made to calendar
        </Alert>
      ) 
    }
    else if (alertType === "error") {
      return ( 
        <Alert onClose={handleAlertClose} severity="error" variant="filled">
          Error saving calendar, try again
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

  const handleClear = () => {
    console.log('Clearing calendar: ');
    console.log(dayList);
    setDayList([]);
  }

  const handleSave = () => {
    console.log('Saving calendar: ');
    console.log(dayList);

    if (room===null || room === undefined){
      console.warn('No room to save to!');
      return;
    }
  
    if (dayList === stableList) {
      setAlertType('info');
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

        setAlertType('success');
        setAlertOpen(true)    
      })
      .catch(error => {
        console.error(error);
        setAlertType('error');
        setAlertOpen(true)    
      });
  };

  const handleRestore = () => {
    console.log('Restoring calendar: ');
    console.log(stableList);
    setDayList(stableList);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setAlertOpen(false);
  };

  return(
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button 
        variant="outlined" 
        endIcon={<Clear />}
        onClick={handleClear}
        disabled={!dayList.length}  
      >
        Clear Calendar
      </Button>
      <Button 
        variant="contained" 
        endIcon={<CloudDownload />}
        onClick={handleSave}
      >
        Save Calendar
      </Button>
      <Button
        variant="outlined"
        endIcon={<Sync />}
        onClick={handleRestore}
        disabled={!stableList.length || stableList === dayList}
      >
        Restore Calendar
      </Button>  
      <Snackbar 
        // anchorOrigin={{vertical: 'top', horizontal: 'center'}} 
        open ={alertType !== null && alertOpen} 
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        {displayAlert(alertType)}
      </Snackbar>                    
    </Stack>
  );
}