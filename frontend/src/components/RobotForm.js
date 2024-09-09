/** @format */

import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
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
 * RobotForm component
 *
 * This component displays a form for creating a new robot. It fetches a list
 * of available robots from the API when the component mounts, and displays a
 * select box with the list of robots. The component also displays text fields
 * for the robot name and model name.
 *
 * When the form is submitted, the component posts a new robot to the API and
 * redirects the user to the MissionList page.
 *
 * @returns {React.JSX.Element} The RobotForm component
 */
function RobotForm() {
	const classes = useStyles();
	const [robot, setRobot] = useState({ name: "", model_name: "" });
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post("http://localhost:8000/api/robots/", robot)
			.then((response) => {
				console.log("Robot created:", response.data);
				navigate("/"); // Redirect to MissionList page
			})
			.catch((error) => console.error("Error creating robot:", error));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<Typography variant='h2' className={classes.title}>
					Create New Robot
				</Typography>
				<form onSubmit={handleSubmit} className={classes.form}>
					<TextField
						label='Name'
						value={robot.name}
						onChange={(e) => setRobot({ ...robot, name: e.target.value })}
						fullWidth
						variant='outlined'
						className={classes.input}
					/>
					<TextField
						label='Model Name'
						value={robot.model_name}
						onChange={(e) => setRobot({ ...robot, model_name: e.target.value })}
						fullWidth
						variant='outlined'
						className={classes.input}
					/>
					<Button type='submit' variant='contained' className={classes.button}>
						Create Robot
					</Button>
				</form>
			</div>
		</div>
	);
}

export default RobotForm;
