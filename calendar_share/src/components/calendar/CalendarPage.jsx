import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import { Box } from "@mui/material";
import { blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightGreen, orange, pink, red, yellow } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { useAuth } from "../firebase/authContext";
import axios from "axios";
import dayjs from 'dayjs';
import CalendarTitle from "./CalendarTitle";
import UserLists from "./UserLists";
import CalendarButtons from "./CalendarButtons";
import ParticipantDetails from "./RoomProfile";


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



export default function CalendarPage(){
    const { room_id } = useParams();    
    const { dbUser, setDbUser } = useAuth();
    const [room, setRoom] = useState(null);
    const [dayList, setDayList] = useState([]);
    const [stableList, setStableList] = useState([]);
    const [highlighted, setHighlighted] = useState([]);

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

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


        })
        .catch(error => {
        console.error(error);
        });
    }, [room_id]);


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
        (!isMobile) ? (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >   
                <Box
                    pt='150px'
                    width='24%'
                    boxShadow={1}
                >
                    {dbUser && room && room.participants.some(user => user.user_id === dbUser.user_id) &&
                        <ParticipantDetails 
                            room={room} 
                            setRoom={setRoom}
                            dbUser={dbUser}
                            setDbUser={setDbUser}
                        />
                    }        
                </Box>

                <Box
                    pt='70px'
                    width='50%'
                    boxShadow={1}
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
                    pt='150px'
                    width='26%'
                    boxShadow={1}
                >
                    {room && 
                        <UserLists 
                            className='user_lists' 
                            users={room.participants} 
                            highlighted={highlighted} 
                            setHighlighted={setHighlighted}  
                        />}
                </Box>
            </Box>
        ) : (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >   
                <Box
                    pt='70px'
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
                    pt={2}
                >
                    {room && 
                        <UserLists 
                            className='user_lists' 
                            users={room.participants} 
                            highlighted={highlighted} 
                            setHighlighted={setHighlighted}  
                        />}
                </Box>
            </Box>
        )
    );
}