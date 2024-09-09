/** @format */

import React, { useState, useEffect } from "react";
import {
	TextField,
	Button,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
		maxWidth: "600px",
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
	form: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	input: {
		marginBottom: theme.spacing(2),
		width: "100%",
		"& .MuiInputBase-input": {
			color: "#FFFFFF",
		},
		"& .MuiInputLabel-root": {
			color: "#FFFFFF",
		},
		"& .MuiOutlinedInput-root": {
			"& fieldset": {
				borderColor: "rgba(255, 255, 255, 0.23)",
			},
			"&:hover fieldset": {
				borderColor: "rgba(255, 255, 255, 0.5)",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#3B82F6",
			},
		},
	},
	select: {
		"& .MuiSelect-icon": {
			color: "#FFFFFF",
		},
		"& .MuiSelect-select": {
			"&:focus": {
				backgroundColor: "transparent",
			},
		},
	},
	menuPaper: {
		backgroundColor: "#3A3A3A",
	},
	menuItem: {
		color: "#FFFFFF",
		"&:hover": {
			backgroundColor: "rgba(59, 130, 246, 0.1)",
		},
		"&.Mui-selected": {
			backgroundColor: "rgba(59, 130, 246, 0.2)",
			"&:hover": {
				backgroundColor: "rgba(59, 130, 246, 0.3)",
			},
		},
	},
	button: {
		marginTop: theme.spacing(2),
		backgroundColor: "#3B82F6",
		color: "#FFFFFF",
		padding: theme.spacing(1, 3),
		"&:hover": {
			backgroundColor: "#2563EB",
		},
	},
}));

/**
 * MissionForm component
 *
 * This component displays a form for creating a new mission. It fetches a list
 * of available robots from the API when the component mounts, and displays a
 * select box with the list of robots. The component also displays text fields
 * for the mission name and description.
 *
 * When the form is submitted, the component posts a new mission to the API and
 * redirects the user to the MissionList page.
 *
 * @returns {React.JSX.Element} The MissionForm component
 */
function MissionForm() {
	const classes = useStyles();
	const [mission, setMission] = useState({
		name: "",
		description: "",
		robot_id: "",
	});
	const [robots, setRobots] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/robots/")
			.then((response) => setRobots(response.data))
			.catch((error) => console.error("Error fetching robots:", error));
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post("http://localhost:8000/api/missions/", mission)
			.then((response) => {
				console.log("Mission created:", response.data);
				navigate("/"); // Redirect to MissionList page
			})
			.catch((error) => console.error("Error creating mission:", error));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<Typography variant='h2' className={classes.title}>
					Create New Mission
				</Typography>
				<form onSubmit={handleSubmit} className={classes.form}>
					<TextField
						label='Mission Name'
						value={mission.name}
						onChange={(e) => setMission({ ...mission, name: e.target.value })}
						fullWidth
						variant='outlined'
						className={classes.input}
					/>
					<TextField
						label='Mission Description'
						value={mission.description}
						onChange={(e) =>
							setMission({ ...mission, description: e.target.value })
						}
						fullWidth
						multiline
						rows={4}
						variant='outlined'
						className={classes.input}
					/>
					<FormControl variant='outlined' fullWidth className={classes.input}>
						<InputLabel id='robot-select-label'>Select a Robot</InputLabel>
						<Select
							labelId='robot-select-label'
							value={mission.robot_id}
							onChange={(e) =>
								setMission({ ...mission, robot_id: e.target.value })
							}
							label='Select a Robot'
							className={classes.select}
							MenuProps={{
								classes: { paper: classes.menuPaper },
								anchorOrigin: {
									vertical: "bottom",
									horizontal: "left",
								},
								transformOrigin: {
									vertical: "top",
									horizontal: "left",
								},
								getContentAnchorEl: null,
							}}>
							<MenuItem value='' disabled className={classes.menuItem}>
								Select a Robot
							</MenuItem>
							{robots.map((robot) => (
								<MenuItem
									key={robot.id}
									value={robot.id}
									className={classes.menuItem}>
									{robot.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button type='submit' variant='contained' className={classes.button}>
						Create Mission
					</Button>
				</form>
			</div>
		</div>
	);
}

export default MissionForm;
