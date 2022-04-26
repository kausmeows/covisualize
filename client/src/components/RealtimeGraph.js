import React from "react";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { Grid, Box } from "@mui/material";
Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function RealtimeGraph(props) {

	const data = {
		labels: props.labels,
		datasets: [
			{
				label: "Realtime Cases",
				data: props.dataval,
				fill: true,
				backgroundColor: "rgba(75,192,192,0.2)",
				borderColor: "rgba(75,192,192,1)",
				yAxisID: 'cases'
			},
			{
				label: "Realtime Deaths",
				data: props.deathval,
				fill: true,
				backgroundColor: "rgba(75,192,192,0.2)",
				borderColor: "rgba(170,0,0,1)",
				yAxisID: 'deaths'
			}
		],
		}
		const options = {
			scales: {
				deaths: {
					position: 'right',
					grid: {
						drawOnChartArea: false,
					}
				}
			}
		}

	return (
		<Grid
			container
			direction="column"
			justifyContent="center"
			alignItems="center"
		>
			<Grid item lg={5}>
      <Box sx={{ boxShadow: 3 }}>
					<h1 style={{color:"black"}}>Timeline</h1>
					<Line data={data} height={500} width={1000} options={options} />
				</Box>
			</Grid>
		</Grid>
	);
}
