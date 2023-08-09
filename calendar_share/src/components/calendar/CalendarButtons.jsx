import React from "react";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import { Clear, CloudDownload, Sync } from "@mui/icons-material";

export default function CalendarButtons({dayList, setDayList, stableList, setStableList, room_id, room, setRoom, dbUser, setDbUser, palette}){
  
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

      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleRestore = () => {
    console.log('Restoring calendar: ');
    console.log(stableList);
    setDayList(stableList);
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
    </Stack>
  );
}