/** @format */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Button, makeStyles } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
	root: {
		height: "100vh",
		width: "100vw",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "fixed",
		top: 0,
		left: 0,
		overflow: "hidden",
		backgroundColor: "#2C2C2C",
		margin: 0,
		padding: 0,
	},
	content: {
		position: "relative",
		zIndex: 2,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		width: "90%",
		maxWidth: "800px",
		height: "90%",
		padding: theme.spacing(3),
		backgroundColor: "rgba(229, 229, 229, 0.1)",
		borderRadius: theme.spacing(2),
		color: "#FFFFFF",
		boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)",
	},
	title: {
		marginBottom: theme.spacing(2),
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: "28px",
	},
	detailContainer: {
		width: "100%",
		flex: 1,
		overflowY: "auto",
		backgroundColor: "rgba(229, 229, 229, 0.05)",
		borderRadius: theme.spacing(2),
		padding: theme.spacing(2),
		"&::-webkit-scrollbar": {
			width: "0.4em",
		},
		"&::-webkit-scrollbar-track": {
			boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
			webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: "rgba(0,0,0,.1)",
			outline: "1px solid slategrey",
		},
	},
	detailItem: {
		marginBottom: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(1),
		backgroundColor: "#3B82F6",
		color: "#FFFFFF",
		"&:hover": {
			backgroundColor: "#2563EB",
		},
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "center",
		width: "100%",
		marginTop: theme.spacing(2),
	},
}));

/**
 * MissionDetail component
 *
 * This component displays the details of a single mission. It fetches the
 * mission details from the API when the component mounts, and displays a
 * loading message until the data is available.
 *
 * The component displays the mission name, description, and associated robot
 * details. It also provides a button to simulate the associated robot.
 *
 * @param {string} id The ID of the mission to display
 * @returns {React.JSX.Element} The MissionDetail component
 */
function MissionDetail() {
	const classes = useStyles();
	const { id } = useParams();
	const [mission, setMission] = useState(null);

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/missions/${id}/`)
			.then((response) => setMission(response.data))
			.catch((error) =>
				console.error("Error fetching mission details:", error)
			);
	}, [id]);

	if (!mission) return <Typography>Loading...</Typography>;

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<Typography variant='h2' className={classes.title}>
					Mission Details
				</Typography>
				<div className={classes.detailContainer}>
					<Typography variant='h6' className={classes.detailItem}>
						Name: {mission.name}
					</Typography>
					<Typography variant='body1' className={classes.detailItem}>
						Description: {mission.description}
					</Typography>
					<Typography variant='h6' className={classes.detailItem}>
						Associated Robot:
					</Typography>
					<Typography variant='body1' className={classes.detailItem}>
						Name: {mission.robot.name}
					</Typography>
					<Typography variant='body1' className={classes.detailItem}>
						Model: {mission.robot.model_name}
					</Typography>
				</div>
				<div className={classes.buttonContainer}>
					<Button
						variant='contained'
						component={Link}
						to={`/robot-simulation/${mission.robot.id}`}
						className={classes.button}>
						Simulate Robot
					</Button>
				</div>
			</div>
		</div>
	);
}

export default MissionDetail;
