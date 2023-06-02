import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightGreen, orange, pink, red, yellow } from "@mui/material/colors";
import { Brush, Colorize, ExpandLess, ExpandMore, FormatColorReset, WaterDrop } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useAuth } from "../firebase/authContext";
import axios from "axios";
import dayjs from 'dayjs';
import CalendarTitle from "./CalendarTitle";
import UserLists from "./UserLists";
import CalendarButtons from "./CalendarButtons";


export const palette = [

    // Base Colors
    {name: 'Black', color: grey[900]}, 
    {name: 'Grey', color: grey[600]}, 
    {name: 'Brown', color: brown[700]},
    {name: 'Red', color: red['A700']}, 
    {name: 'Orange', color: orange[700]}, 
    {name: 'Yellow', color: yellow[600]},
    {name: 'Green', color: green[800]},
    {name: 'Blue', color: blue[500]}, 
    {name: 'Indigo', color: indigo[700]},
    {name: 'Purple', color: deepPurple[500]}, 

    // Pastel Colors
    {name: 'Lavender', color: deepPurple[200]}, 
    {name: 'Matcha', color: lightGreen[200]},
    {name: 'Banana', color: yellow[100]},
    {name: 'Peach', color: deepOrange['A100']}, 
    {name: 'Rose', color: pink[200]}, 

    // Neon Colors
    {name: 'Pink', color: pink['A200']},
    {name: 'Cyan', color: cyan['A400']},
    {name: 'Lime', color: lightGreen['A200']}, 

];


function ColorList({setColor}) {
    return (
        <List sx={{textAlign: 'center'}}>
            {palette.map(colorElement => 
                <ListItemButton key={colorElement.name}
                    onClick={() => setColor(colorElement) }
                    sx={{ 
                        bgcolor: colorElement.color,
                    }}  
                >

                    <ListItemIcon>
                        {colorElement.name === 'Black' ? (
                            <Brush sx={{color: '#fafafa'}}/>
                        ) : (
                            <Brush sx={{color: '#212121'}}/>
                        ) }
                    </ListItemIcon>

                    {colorElement.name === 'Black' ? (
                        <ListItemText primary={colorElement.name} sx={{color:"#fafafa"}}/>
                    ) : (
                        <ListItemText primary={colorElement.name}/>
                    ) }

                </ListItemButton>    
            )}

            <ListItemButton 
                onClick={() => setColor(null) }
            >
                <ListItemIcon>
                    <FormatColorReset sx={{color: '#212121'}}/>
                </ListItemIcon>
                <ListItemText primary={'No Color'} />
            </ListItemButton>
        </List>
    );
}



function ColorPicker() {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState(null);

    const handleClick = () => {
        setOpen(!open);
      };    

    return (
        <List>
            
            <ListItemButton onClick ={handleClick} >
                <ListItemIcon>
                    {color ? <WaterDrop sx={{color: color}}/> : <Colorize sx={{color: '#212121'}}/>}
                </ListItemIcon>
                <ListItemText primary={'Change Color'} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>            

            <Collapse in={open} timeout="auto" unmountOnExit>
                <ColorList setColor={setColor} />
            </Collapse>

        </List>
    );
}

export default function CalendarPage(){
    const { room_id } = useParams();    
    const { dbUser, setDbUser } = useAuth();
    const [room, setRoom] = useState(null);
    const [dayList, setDayList] = useState([]);
    const [stableList, setStableList] = useState([]);
    const [highlighted, setHighlighted] = useState([]);


    useEffect(() => {
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


    useEffect(() => {
        if (!room || !dbUser) {
          return;
        }
    
        const chooseColor = () => {
            const usedColors = room.participants.map(participant => participant.color);
            const availableColors = palette.filter(color => !usedColors.includes(color));
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            return availableColors[randomIndex].color;
        };

        console.log('Retrieving user data for room:', room_id);
    
        // Check if the user is already in the room
        const currentUser = room.participants.find((user) => user.user_id === dbUser.user_id);
    
        if (currentUser) {
          const selectedDays = currentUser.selected_days.map((day) => dayjs(day));
          setDayList(selectedDays);
          setStableList(selectedDays);
        } else {
          console.log('User is not in the room, adding to the room...');
          const guest = {
            user_id: dbUser.user_id,
            name: dbUser.name,
            selected_days: [],
            color: chooseColor(),
          };
    
          const updatedRoom = {
            ...room,
            participants: [...room.participants, guest],
          };
    
          axios
            .patch(`http://localhost:5050/rooms/${room_id}`, updatedRoom)
            .then((response) => {
              console.log(response);
              setRoom(updatedRoom);
    
              // Add room to user's list
              const guestRooms = dbUser.rooms;
              guestRooms.push(room_id);
              const updatedUser = { ...dbUser, rooms: guestRooms };
    
              axios
                .patch(`http://localhost:5050/users/${dbUser.user_id}`, updatedUser)
                .then((response) => {
                  console.log(response);
                  setDbUser(updatedUser);
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, [room, dbUser]);

    useEffect(() => {
        if (!room) {
            
            return;
        }

        // if (highlighted.length){
        //     console.log('Highlighted users already created');
        //     return;
        // }

        const highlightedUsers = room.participants.map(user => {
            return { 
                user_id: user.user_id, 
                name: user.name, 
                color: user.color,
                highlighted: true
            };
        });        
        setHighlighted(highlightedUsers);

        // console.log(highlightedUsers);

    }, [room])


    return (
        <Box
            sx={{
                pl: '250px',

                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'flex-start',    
            }}
        >   
            <Box
                sx={{
                    pt: '150px',
                    minWidth: '12%',

                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    flexShrink: 1,
                }}
            >
                {dbUser && room && <ColorPicker />}        
            </Box>

            <Box
                sx={{
                    pt: '70px',
                
                    display: 'flex',
                    flexDirection: 'column',

                    // flexGrow: 1,
                }}
            >
                {room && <CalendarTitle room={room} />}
                
                <Calendar 
                    room={room}
                    setRoom={setRoom}
                    room_id={room_id}
                    dbUser={dbUser}
                    setDbUser={setDbUser}
                    dayList={dayList}
                    setDayList={setDayList}
                    stableList={stableList}
                    setStableList={setStableList}
                    highlighted={highlighted}
                />
                
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
                        palette={palette}
                    /> 
                }
                
                

            </Box>
            <Box
                sx={{
                    pt: '150px',

                    width: '55%',
                    maxWidth: '660px',
                    justifySelf: 'flex-start',
                    justifyContent: 'flex-start',
                    alignContent: 'flex-start',
                    alignSelf: 'flex-start',                        

                }}    
            >
                {room && <UserLists className='user_lists' users={room.participants} highlighted={highlighted} setHighlighted={setHighlighted}  />}
            </Box>
        </Box>
    );
}