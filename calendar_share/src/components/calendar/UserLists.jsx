import { Avatar, Collapse, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import CalendarList from "./CalendarLists";
import { EventAvailable, EventBusy, ExpandLess, ExpandMore, UnfoldLess, UnfoldMore } from "@mui/icons-material";

function UserList({ user, expanded, highlighted, setHighlighted }) {
  const [open, setOpen] = useState(expanded);
  const [highlightedCalendar, setHighlightedCalendar] = useState(true);

  useEffect(() => {
    setOpen(expanded);
  }, [expanded]);

  const handleClick = () => {
    setOpen(!open);
  };

  const toggleHighlight = () => {
    // remove this user from the highlighted list

    const newHighlighted = highlighted.map(highlightedUser => {
      if (highlightedUser.user_id === user.user_id){
        const oldHighlight = highlightedUser.highlighted;
        return {...highlightedUser, highlighted: !oldHighlight};
      }
      else{
        return highlightedUser;
      }
    });

    // console.log(newHighlighted);
    setHighlighted(newHighlighted);
    setHighlightedCalendar(!highlightedCalendar);
  };

  return (
    <div>
      <ListItem 
        sx={{mt: '0px', mb: '0px', pt: '0px', pb: '0px'}}
      >
        {highlightedCalendar ? (
          <IconButton onClick={toggleHighlight}>
            <Avatar sx={{bgcolor: user.color}}>
              <EventAvailable/>
            </Avatar>
          </IconButton>
        ) : (
          <IconButton onClick={toggleHighlight}>
            <Avatar >
              <EventBusy  />
            </Avatar>
          </IconButton>
        )}

        <ListItemButton onClick={handleClick} >
          <ListItemText primary={`${user.name}`} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      
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



export default function UserLists({ users, highlighted, setHighlighted }) {
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
    <List subheader={subHeader} >
      {users.map((user) => (
        <UserList 
          key={`${user.name}'s list`}
          user={user}
          expanded={expanded}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
        />
      ))}
    </List>
  );
}
