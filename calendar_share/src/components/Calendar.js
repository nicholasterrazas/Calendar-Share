import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import { Refresh, Save } from '@mui/icons-material';

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'dayIsSelected',
})(({ theme, dayIsSelected, isDragging }) => ({
  ...(dayIsSelected && !isDragging && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
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
    return <PickersDay day={day} {...other} />;
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
      sx={dayIsSelected ? { px: 2.5, mx: 0 } : {}}
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
  const [value, setValue] = React.useState(dayjs('2023-05-06'));
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [dayList, setDayList] = React.useState([]);
  const [stableList, setStableList] = React.useState([])

  function toggleDays(newValue){
    console.log(newValue);

    // find item in list and remove it if it exists 
    const index = dayList.findIndex((d) => newValue.isSame(d, 'day'));
    console.log('index: ' + index);
    if (index !== -1) {
      const newList = [...dayList];
      newList.splice(index, 1);
      setDayList(newList);
    } else {
      setDayList([...dayList, newValue]);
    }
    
    console.log(dayList);
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
    <div className='calendar_page'>
      <h1>Select Days:</h1>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='calendar'
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
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
        </div>
      </LocalizationProvider>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button 
          variant="outlined" 
          endIcon={<DeleteIcon />}
          onClick={() => {
            console.log('Clearing calendar: ');
            console.log(dayList);
            setDayList([]);
          }}
          disabled={!dayList.length}  
        >
          Clear Calendar
        </Button>
        <Button 
          variant="contained" 
          endIcon={<Save />}
          onClick={() => {
            console.log('Saving calendar: ');
            console.log(dayList);
            setStableList(dayList);
          }}
        >
          Save Calendar
        </Button>
        <Button
          variant="outlined"
          endIcon={<Refresh />}
          onClick={() => {
            console.log('Restoring calendar: ');
            console.log(stableList);
            setDayList(stableList);
          }}
          disabled={!stableList.length}
        >
          Restore Calendar
        </Button>

        
        
        
        
      </Stack>
      
      <p>Currently selected days: {dayList.length ? dayList.sort((a, b) => (a.isAfter(b) ? 1 : -1)).map(day => day.format('YYYY-MM-DD')).join(', ') : 'None'}</p>

      <p>Saved days: {stableList.length ? stableList.sort((a, b) => (a.isAfter(b) ? 1 : -1)).map(day => day.format("MM/DD/YYYY")).join(", ") : 'No saved days'}</p>



    </div>
  );
}