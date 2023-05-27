import React, { useState } from "react";
import Calendar from "./Calendar";
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { blue, brown, cyan, deepOrange, deepPurple, green, grey, indigo, lightGreen, orange, pink, red, yellow } from "@mui/material/colors";
import { Brush, ExpandLess, ExpandMore, FormatColorReset, Palette } from "@mui/icons-material";

const palette = [

    // Base Colors
    {name: 'Black', color: grey[900]}, 
    {name: 'Grey', color: grey[600]}, 
    {name: 'Brown', color: brown[700]},
    {name: 'Red', color: red[800]}, 
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
    {name: 'Pink', color: pink[400]},
    {name: 'Cyan', color: cyan['A400']},
    {name: 'Lime', color: lightGreen['A200']}, 

];


function ColorList({setColor}) {
    return (
        <List>
            {palette.map(colorElement => 
                <ListItemButton 
                    onClick={() => setColor(colorElement) }
                    sx={{ 
                            bgcolor: colorElement.color 
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
    const [open, setOpen] = useState(true);
    const [color, setColor] = useState(null);

    const handleClick = () => {
        setOpen(!open);
      };    

    return (
        <List sx={{pt: '130px'}} >
            
            <ListItemButton dense onClick ={handleClick} >
                <ListItemIcon>
                    {color && <Palette sx={{color: color}}/>}
                </ListItemIcon>
                <ListItemText primary={'Choose Color'} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>            

            <Collapse in={open} timeout="auto" unmountOnExit>
                <ColorList setColor={setColor} />
            </Collapse>

        </List>
    );
}

export default function CalendarPage(){

    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
        >   
            <Box
                justifyContent='flex-start'
                alignContent='center'
                sx={{
                    pl: '250px',
                    flexShrink: 1,
                }}
            >
                <ColorPicker />        
            </Box>         

            <Box
                justifyContent='flex-end'
                alignContent='center'
                width='100%'
                sx={{
                    flexGrow: 1
                }}
            >
                <Calendar />
            </Box>
        </Box>
    );
}