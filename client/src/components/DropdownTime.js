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
          <MenuItem value={"30"}>1 Month</MenuItem>
          <MenuItem value={"60"}>2 Months</MenuItem>
          <MenuItem value={"90"}>3 Months</MenuItem>
          <MenuItem value={"180"}>6 Months</MenuItem>
          <MenuItem value={"365"}>1 Year</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default Dropdown