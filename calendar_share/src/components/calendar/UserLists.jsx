import { Box, Collapse, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import CalendarList from "./CalendarLists";
import { CalendarMonth, ExpandLess, ExpandMore, UnfoldLess, UnfoldMore } from "@mui/icons-material";

function UserList({ user, expanded }) {
  const [open, setOpen] = useState(expanded);

  useEffect(() => {
    setOpen(expanded);
  }, [expanded]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItemButton onClick={handleClick} >
        <ListItemIcon>
          <CalendarMonth sx={{color: user.color}}/>
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
  const [expanded, setExpanded] = useState(false);

  const handleCollapse = () => {
    setExpanded(false);
  };

  const handleExpand = () => {
    setExpanded(true);
  };

  const subHeader = (
    <React.Fragment>
      <Stack direction='row' justifyContent='center' ml={5}>
        <ListSubheader component="div" id="nested-list-subheader">
          Users: {users.length}/12
        </ListSubheader>
        {expanded ? (
          // <Tooltip title="Collapse" placement="right" >
            <IconButton onClick={handleCollapse} sx={{width: '35px', height: '35px', alignSelf: 'center'}} >
              <UnfoldLess />
            </IconButton>
          // </Tooltip>
        ) : (
          // <Tooltip title="Expand" placement="right" >
            <IconButton onClick={handleExpand} sx={{width: '35px', height: '35px', alignSelf: 'center'}} >
              <UnfoldMore />
            </IconButton>
          // </Tooltip>
        )}            
      </Stack>
    </React.Fragment>
  );



  return (
    <Box
      sx={{
        width: '55%',
        maxWidth: '660px',
        justifyContent: 'center',
        textAlign: 'center'
      }}    
    >
      <List subheader={subHeader} >
        {users.map((user) => (
          <UserList 
            key={`${user.name}'s list`}
            user={user}
            expanded={expanded}
          />
        ))}
      </List>
    </Box>
  );
}
