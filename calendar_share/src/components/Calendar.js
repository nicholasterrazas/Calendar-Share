import * as React from 'react';
import { DateCalendar,LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Calendar() {

        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar />
            </LocalizationProvider>            
        );
}