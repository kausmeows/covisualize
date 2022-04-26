import React, { useState, useEffect } from "react";
import { Chart, ArcElement } from "chart.js";
import { Grid, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { width } from "@mui/system";

Chart.register(ArcElement);

export default function SentimentChart(props) {
  const [sentimentData, setSentimentData] = useState([0, 0, 0, 0]);
  useEffect(() => {
	  console.log(sentimentData);
  }, [sentimentData])
  useEffect(() => {
    axios
      .get(
        `https://aam05onrm7.execute-api.us-east-1.amazonaws.com/default/covLamb?table_name=Twitter`
      )
      .then((res) => {
        const parsedData = JSON.parse(res.data.body).Items;
		const newSentimentData = parsedData.reduce((prevArray, currentItem) => {
			switch (currentItem.sentiment) {
				case "POSITIVE":
				  prevArray[0]++;
				  return prevArray;
				case "NEUTRAL":
					prevArray[1]++;
					return prevArray;
				case "NEGATIVE":
					prevArray[2]++;
					return prevArray;
				case "MIXED":
					prevArray[3]++;
					return prevArray;
				default:
					return prevArray;
			  }
		}, [0,0,0,0])
		setSentimentData(newSentimentData);
      });
  }, []);
  const data = {
    labels: ["Positive", "Neutral", "Negative", "Mixed"],
    datasets: [
      {
        label: "Twitter Dataset",
        data: sentimentData,
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 99, 132)",
          "rgb(25, 8, 132)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item lg={12}>
        <Box sx={{ boxShadow: 3, width: "100%" }}>
			<Box>
          <h2 style={{ color: "black" }}>Sentiments</h2>
          <Pie data={data} height={400} width={400} />
		  	</Box>
        </Box>
      </Grid>
    </Grid>
  );
}
