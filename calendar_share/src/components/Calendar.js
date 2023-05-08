import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween'
})(({ theme, dayIsBetween }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));


const dayList = [];

function Day(props) {
  const { day, selectedDay, setSelectedDays, ...other } = props;

  if (selectedDay == null) {
    return <PickersDay day={day} {...other} />;
  }

  const dayIsBetween = dayList.some((d) => day.isSame(d, 'day'));
  // console.log('current day: ' + day +', selected day: ' + selectedDay + ', equal = '+dayIsBetween );

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={dayIsBetween ? { px: 2.5, mx: 0 } : {}}
      dayIsBetween={dayIsBetween}
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
  const [value, setValue] = React.useState(dayjs('2022-05-06'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        showDaysOutsideCurrentMonth 
        value={value}
        onChange={(newValue) => {
          setValue(newValue); 
          console.log(newValue); 
          dayList.push(newValue);   
          console.log(dayList);
        }}
        slots={{ day: Day }}
        slotProps={{
          day: {
            selectedDay: value,
          },
        }}
      />
    </LocalizationProvider>
  );
}