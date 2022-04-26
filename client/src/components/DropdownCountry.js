import React, { useState, useEffect } from 'react';
import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material'

const Dropdown = (props) => {
  const [val, setVal] = useState(props.val);
  useEffect(() => {
    // console.log(val);
    // props.datafetch(val);
  });

  const handleChange = (event) => {
    setVal(event.target.value);
    props.update(event.target.value);
  };
  return (
    <Box sx={{ minWidth: 150, width: '5rem', margin: '1rem', display: 'inline-block'}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.name}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={val}
          label={props.name}
          onChange={handleChange}
        >
          <MenuItem value={"Australia"}>Australia</MenuItem>
          <MenuItem value={"Canada"}>Canada</MenuItem>
          <MenuItem value={"India"}>India</MenuItem>
          <MenuItem value={"UK"}>UK</MenuItem>
          <MenuItem value={"USA"}>USA</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default Dropdown