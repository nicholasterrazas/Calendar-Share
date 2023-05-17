import { Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import React, { useState } from "react";
import CalendarList from "./CalendarLists";
import { CalendarMonth, ExpandLess, ExpandMore } from "@mui/icons-material";

function UserList({ user }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItemButton 
        onClick={handleClick} 
        
      >
        <ListItemIcon>
          <CalendarMonth />
        </ListItemIcon>
        <ListItemText primary={`${user.name}`} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <List>
          
          <CalendarList
            key={user.name}
            // title={`${user.name}'s Days`}
            items={user.selected_days}
          />
        </List>
        <Divider />
      </Collapse>
    </div>
  );
}



export default function UserLists({ users }) {


  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Users: {users.length}/12
        </ListSubheader>
      } 
      sx={{
        width: '55%',
        maxWidth: '660px',
        justifyContent: 'center',
        textAlign: 'center'
      }}    
    >
      
      {users.map((user) => (
        <UserList 
          key={`${user.name}'s list`}
          user={user} 
        />
      ))}
    </List>
  );
}
