import React from 'react';
import './Calendar.css';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Box, Button, Typography } from '@mui/material';
import { ContentCopy, } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../firebase/authContext';
import UserLists from './UserLists';
import CalendarButtons from './CalendarButtons';

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


export default function Calendar() {
  const { room_id } = useParams();
  const { dbUser, setDbUser } = useAuth();
  const [value, setValue] = React.useState(dayjs('2023-05-06'));
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [dayList, setDayList] = React.useState([]);
  const [stableList, setStableList] = React.useState([]);
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
    // console.log(newValue);

    // find item in list and remove it if it exists, otherwise add the new item, and ensure that the list is sorted
    const index = dayList.findIndex((d) => newValue.isSame(d, 'day'));
    // console.log('index: ' + index);
    if (index !== -1) {
      const newList = [...dayList];
      newList.splice(index, 1);
      setDayList(newList.sort((a, b) => (a.isAfter(b) ? 1 : -1)));
    } else {
      setDayList(prevDayList => [...prevDayList, newValue].sort((a, b) => (a.isAfter(b) ? 1 : -1)));
    }
    
    // console.log(dayList);
  }


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
        <div className='calendar_title'>
          <Typography variant='h3' component='h1' align="center">
            {room.title}
          </Typography>
          <Box textAlign='center'>
            <Button variant='text' size='large' endIcon={<ContentCopy fontSize='small' />} >
              Room ID: {room._id}
            </Button>
          </Box>


        </div>
      )}
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
        <CalendarButtons 
          dayList={dayList} 
          setDayList={setDayList} 
          stableList={stableList} 
          setStableList={setStableList} 
          room_id={room_id}  
          room={room}
          setRoom={setRoom} 
          dbUser={dbUser}
          setDbUser={setDbUser}
        /> 
      }
      
      {room && 
      <UserLists className='user_lists' users={room.participants}/>}

    </div>
  );
}