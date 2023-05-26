import React from 'react';
import './Calendar.css';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../firebase/authContext';
import UserLists from './UserLists';
import CalendarButtons from './CalendarButtons';
import CalendarTitle from './CalendarTitle';

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'dayIsSelected',
})(({ theme, dayIsSelected, isDragging }) => ({
  ...({
    // boxShadow: `inset 0 0 0 1px #eeeeee`,
  }),
  ...(!dayIsSelected && {
    borderRadius: 0,
    // boxShadow: `inset 0 0 0 1px #eeeeee`,
  }),
  ...(dayIsSelected && !isDragging && {
    borderRadius: 0,
    background: `linear-gradient(to top, ${theme.palette.common.white} 80%, ${theme.palette.primary.main} 80% )`,
    // boxShadow: `inset 0 0 0 1px #eeeeee`,
    // boxShadow: `inset 0 0 0 1px #000000`,
    '&:hover, &:focus': {
      // background: `linear-gradient(to top, #f5f5f5 80%, ${theme.palette.primary.main} 80% )`,
    },
  }),
}));


function Day(props) {
  const { day, selectedDay, dayList, isMouseDown, toggleDays, room, dbUser, ...other } = props;
  const dayIsSelected = dayList.some((d) => day.isSame(d, 'day'));
  
  const colorDay = () => {
    // make a 'color block' for each user taking up 10% of the gradient

    let blocks = [];     
    let colorEnd;

    for (let i = 0; i < room.participants.length; i++){      
      const user = room.participants[i];
      const startPercentage = (10 * (i)) + "%";
      const endPercentage = (10 * (i + 1)) + "%";


      let colorBlock;
      if (dbUser && room && user.user_id === dbUser.user_id) {
        if (dayIsSelected) {
        
          const color = user.color || '#607d8b';  
          colorBlock = `${color} ${startPercentage}, ${color} ${endPercentage}`;
        } else {
          colorBlock = `#FFFFFF ${startPercentage}, #FFFFFF ${endPercentage}`;
        }
      }
      else {
        if (user.selected_days.includes(dayjs(day).format('YYYY-MM-DDT04:00:00.000[Z]'))) {
        
          const color = user.color || '#607d8b';  
          colorBlock = `${color} ${startPercentage}, ${color} ${endPercentage}`;
        } else {
          colorBlock = `#FFFFFF ${startPercentage}, #FFFFFF ${endPercentage}`;
        }
      }

      // colors are aranged top to bottom 
      blocks.push(colorBlock);
      colorEnd = endPercentage;
    }

    if (room.participants.length !== 10){
      const whiteBlock = `#FFFFFF ${colorEnd}`;
      blocks.push(whiteBlock);  
    }
    
    const arrangement = blocks.join(', ');
    const gradient = `linear-gradient(to bottom, ${arrangement} )`;
        
    return gradient;
  }

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
      style={room && { background: colorDay() }}
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
        if (response.data === 'Invalid Room ID'){
          console.error('Invalid Room ID!');
          return;
        }

        if (response.data === 'Not found'){
          console.error('Invalid Room ID');
          return
        }

        console.log(response.data);
        setRoom(response.data);

        // load user's selected days days from 
        if (dbUser) {
          // find user in participants and set user's dayList and stableList to user's selected days
          const currentUser = response.data.participants.find(user => user.user_id === dbUser.user_id);
          if (currentUser) {
            const selectedDays = currentUser.selected_days.map(day => dayjs(day));
            // console.log(selectedDays);
            setDayList(selectedDays);
            setStableList(selectedDays);
          }
        }

        if (!dbUser) {
          console.warn('User not logged in, dayList and stableList = empty');
          setDayList([]);
          setStableList([]);
        }

      })
      .catch(error => {
        console.error(error);
      });
  }, [room_id, dbUser]);

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
      
      {room && 
      <CalendarTitle room={room} />}

      <div className='calendar' style={{userSelect: "none", paddingTop: room ? '0px' : '230px'}}>
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
                room,
                dbUser,
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {dbUser && room &&
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