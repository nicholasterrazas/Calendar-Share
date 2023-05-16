import React from 'react';
import './Calendar.css';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Button, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import { Refresh, Save } from '@mui/icons-material';
import CalendarList from './CalendarLists';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../firebase/authContext';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'dayIsSelected',
})(({ theme, dayIsSelected, isDragging }) => ({
  ...(dayIsSelected && !isDragging && {
    borderRadius: 0,
    background: `linear-gradient(to top, ${theme.palette.primary.light} 80%, ${theme.palette.primary.main} 50% )`,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(dayIsSelected && isDragging && {
    backgroundColor: theme.palette.primary.light,
  }),
}));


function Day(props) {
  const { day, selectedDay, dayList, isMouseDown, toggleDays, ...other } = props;
  const dayIsSelected = dayList.some((d) => day.isSame(d, 'day'));

  if (selectedDay == null) {
    return <PickersDay day={day} sx={{ px: 2.5, mx: 0 }} {...other} />;
  }


  const handleMouseOver = () => {
    if (isMouseDown) {
      toggleDays(day);
    }
  };

  const handleMouseDown = () => {
    // console.log('day is clicked!');
    // console.log(day);
    toggleDays(day);
  }

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5, mx: 0 }}
      dayIsSelected={dayIsSelected}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
    />
  );
}

Day.propTypes = {
  /**
   * The date to show.
   */
  day: PropTypes.object.isRequired,
  selectedDay: PropTypes.object,
};


function groupAdjacentDays(dayList) {
  let groups = [];
  if (!dayList.length){
    return groups;
  }
  let start = dayList[0];
  let end = dayList[0];
  for (let i = 1; i < dayList.length; i++) {
    if (dayjs(dayList[i]).diff(dayjs(end), 'day') === 1) {
      end = dayList[i];
    } else {
      if (start !== end) {
        groups.push(`${dayjs(start).format('LL')} - ${dayjs(end).format('LL')}`);
      } else {
        groups.push(dayjs(start).format('LL'));
      }
      start = dayList[i];
      end = dayList[i];
    }
  }
  if (start !== end) {
    groups.push(`${dayjs(start).format('LL')} - ${dayjs(end).format('LL')}`);
  } else {
    groups.push(dayjs(start).format('LL'));
  }
  return groups;
}


export default function Calendar() {
  const { room_id } = useParams();
  const { dbUser, setDbUser } = useAuth();
  const [value, setValue] = React.useState(dayjs('2023-05-06'));
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [dayList, setDayList] = React.useState([]);
  const [stableList, setStableList] = React.useState([])
  const [room, setRoom] = React.useState(null);

  React.useEffect(() => {
    if (!room_id){
      console.info('No id provided');
      return
    }
    console.log(`retrieving room: ${room_id}`)
    // fetch room document from backend API
    axios.get(`http://localhost:5050/rooms/${room_id}`)
      .then(response => {
        // set room state to room document
        if (response.data === 'Invalid room ID'){
          console.error('Invalid id!');
          return;
        }
        console.log(response.data);
        setRoom(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [room_id]);

  function toggleDays(newValue){
    console.log(newValue);

    // find item in list and remove it if it exists, otherwise add the new item, and ensure that the list is sorted
    const index = dayList.findIndex((d) => newValue.isSame(d, 'day'));
    console.log('index: ' + index);
    if (index !== -1) {
      const newList = [...dayList];
      newList.splice(index, 1);
      setDayList(newList.sort((a, b) => (a.isAfter(b) ? 1 : -1)));
    } else {
      setDayList(prevDayList => [...prevDayList, newValue].sort((a, b) => (a.isAfter(b) ? 1 : -1)));
    }
    
    console.log(dayList);
  }


  const handleClear = () => {
    console.log('Clearing calendar: ');
    console.log(dayList);
    setDayList([]);
  }

  const handleSave = () => {
    console.log('Saving calendar: ');
    console.log(dayList);

    if (room===null || room === undefined){
      console.log('No room to save to!');
      return;
    }
  
    // SAVE SELECTED DAYS TO ROOM DB
    console.log(`updating room ${room_id}`);
    console.log(room);
    let foundUser = false;
    let updatedRoom = { 
      ...room,
      participants: room.participants.map(participant => {
        // console.log(participant.user_id);
        // console.log(dbUser.user_id);
        if (participant.user_id === dbUser.user_id) {
          // Update the selected days of the current user
          foundUser = true;
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

    if (!foundUser){
      const guest = {
        user_id: dbUser.user_id,
        name: dbUser.name,
        selected_days: dayList
      }
      
      const newParticipants = room.participants;
      newParticipants.push(guest);

      updatedRoom = { ...room, participants: newParticipants}

      // add room to user's list 
      const guestRooms = dbUser.rooms;
      guestRooms.push(room_id);
      const updatedUser = { ...dbUser, rooms: guestRooms }

      axios
        .patch(`http://localhost:5050/users/${dbUser.user_id}`, updatedUser)
        .then((response) => {
          console.log(response);

        })
        .catch((error) => {
          console.error(error);
        });
    }


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


  const handleMouseDown = () => {
    // console.log('mouse down');
    setIsMouseDown(true);
  };
  
  const handleMouseUp = () => {
    // console.log('mouse up');
    setIsMouseDown(false);
  };
  return (
    <div className='calendar_page'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {room && (
        <div>
          <h1>{room.title}</h1>
          <p>Room ID: {room._id}</p>
          <p>Host: {room.host_id}</p>
          <p>Participants:</p>
          <ul>
            {room.participants.map(participant => (
              <li key={participant.user_id}>{participant.name}</li>
            ))}
          </ul>
        </div>
      )}
      <h1 style={{userSelect: "none"}}>Select Days:</h1>
      
      <div className='calendar' style={{userSelect: "none"}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            disableHighlightToday
            showDaysOutsideCurrentMonth
            value={null}  // might need to be value={value}?
            onChange={(newValue) => {
                // console.log('onchange triggered!!')
                setValue(newValue);
            }}
            slots={{ day: Day }}
            slotProps={{
              day: {
                selectedDay: value,
                dayList,
                isMouseDown,
                toggleDays,
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {dbUser && 
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          variant="outlined" 
          endIcon={<DeleteIcon />}
          onClick={handleClear}
          disabled={!dayList.length}  
        >
          Clear Calendar
        </Button>
        <Button 
          variant="contained" 
          endIcon={<Save />}
          onClick={handleSave}
          disabled={(stableList === dayList) || (stableList.length === 0 && dayList.length === 0)}
        >
          Save Calendar
        </Button>
        <Button
          variant="outlined"
          endIcon={<Refresh />}
          onClick={handleRestore}
          disabled={!stableList.length || stableList === dayList}
        >
          Restore Calendar
        </Button>  
      </Stack>}
      
      <div className='day_lists' style={{ width: '50%' }}>
        <Stack 
          direction="row"
          justifyContent="center"
          spacing={0}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <CalendarList title="Currently selected days:" items={groupAdjacentDays(dayList)} />
          <CalendarList title="Saved days:" items={groupAdjacentDays(stableList)} />
        </Stack>
      </div>

    </div>
  );
}