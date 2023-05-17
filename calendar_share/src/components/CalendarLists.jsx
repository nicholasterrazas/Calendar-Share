import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import dayjs from 'dayjs';


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

export default function CalendarList({ title, items }) {

  return (
    <List style={{ flex: 1 }}>
      
      {title && 
      <div className='list_title'>
        <ListItem>
          <ListItemText 
            primary={title} 
            // style={{ textAlign: 'center' }}
            sx={{ pl: 7 }}
          />
        </ListItem>
        <Divider />
      </div>}
      {items.length ? (
        groupAdjacentDays(items).map((item, index) => (
          <React.Fragment key={item}>
            <ListItem>
              <ListItemText 
                primary={item} 
                // style={{ textAlign: 'center' }}
                sx={{ pl: 7 }}
              />
            </ListItem>
            {/* {index < groupAdjacentDays(items).length - 1 && <Divider />} */}
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText 
            primary="Empty" 
            // style={{ textAlign: 'center' }}
            sx={{ pl: 7 }}  
          />
        </ListItem>
      )}
    </List>
  );
}
