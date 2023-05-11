import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

export default function CalendarList({ title, items }) {
    // console.log(items);
    return (
    <List style={{ flex: 1 }}>
      <ListItem>
        <ListItemText primary={title} style={{ textAlign: 'center' }}/>
      </ListItem>
      <Divider />
      {items.length ? (
        items.map((item, index) => (
          <React.Fragment key={item}>
            <ListItem>
              <ListItemText primary={item} style={{ textAlign: 'center' }}/>
            </ListItem>
            {index < items.length - 1 && <Divider />}
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="None" style={{ textAlign: 'center' }}/>
        </ListItem>
      )}
    </List>
  );
}
