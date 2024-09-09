/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	IconButton,
	Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
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
		maxWidth: "1000px",
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
	tableContainer: {
		width: "100%",
		flex: 1,
		overflowY: "auto",
		backgroundColor: "rgba(229, 229, 229, 0.05)",
		borderRadius: theme.spacing(2),
		maxHeight: 400, // Adjust the height as needed
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
	table: {
		minWidth: 650,
	},
	tableHead: {
		backgroundColor: "#2C2C2C", // Ensure this color is fully opaque
		position: "sticky",
		top: 0,
		zIndex: 1000, // Ensure it stays on top of the content
	},
	tableHeadCell: {
		color: "#FFFFFF",
		fontWeight: "bold",
	},
	tableRow: {
		"&:nth-of-type(odd)": {
			backgroundColor: "rgba(255, 255, 255, 0.05)",
		},
		"&:hover": {
			backgroundColor: "rgba(59, 130, 246, 0.1)",
		},
	},
	tableCell: {
		color: "#FFFFFF",
	},
	link: {
		textDecoration: "none",
		color: "inherit",
	},
	editIcon: {
		color: "#10B981",
	},
	deleteIcon: {
		color: "#EF4444",
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "center",
		width: "100%",
		marginTop: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(1),
		backgroundColor: "#3B82F6",
		color: "#FFFFFF",
		"&:hover": {
			backgroundColor: "#2563EB",
		},
	},
	dialogPaper: {
		backgroundColor: "#2C2C2C",
		color: "#FFFFFF",
	},
	dialogTextField: {
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
	dialogSelect: {
		"& .MuiSelect-icon": {
			color: "#FFFFFF",
		},
		"& .MuiSelect-select": {
			color: "#FFFFFF",
		},
	},
}));

/**
 * MissionList component
 *
 * This component displays a list of all missions. It fetches a list of missions
 * and robots from the API when the component mounts, and displays a table with
 * the mission name, description, and robot name. The component also displays
 * buttons for creating a new mission and robot.
 *
 * Each row in the table has action buttons for editing and deleting the
 * mission.
 *
 * When a mission is edited, the component displays a dialog with input fields
 * for the mission name, description, and robot. When the user submits the form,
 * the component sends a PUT request to the API to update the mission.
 *
 * When a mission is deleted, the component displays a confirmation dialog. If
 * the user confirms, the component sends a DELETE request to the API to delete
 * the mission.
 *
 * @returns {React.JSX.Element} The MissionList component
 */
function MissionList() {
	const classes = useStyles();
	const [missions, setMissions] = useState([]);
	const [robots, setRobots] = useState([]);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [currentMission, setCurrentMission] = useState(null);
	const [editedMission, setEditedMission] = useState({
		name: "",
		description: "",
		robot: "",
	});

	useEffect(() => {
		fetchMissions();
		fetchRobots();
	}, []);

	const fetchMissions = () => {
		axios
			.get("http://localhost:8000/api/missions/")
			.then((response) => setMissions(response.data))
			.catch((error) => console.error("Error fetching missions:", error));
	};

	const fetchRobots = () => {
		axios
			.get("http://localhost:8000/api/robots/")
			.then((response) => setRobots(response.data))
			.catch((error) => console.error("Error fetching robots:", error));
	};

	const handleEditClick = (mission) => {
		setCurrentMission(mission);
		setEditedMission({
			name: mission.name,
			description: mission.description,
			robot: mission.robot.id,
		});
		setOpenEditDialog(true);
	};

	const handleDeleteClick = (mission) => {
		setCurrentMission(mission);
		setOpenDeleteDialog(true);
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
		setCurrentMission(null);
		setEditedMission({ name: "", description: "", robot: "" });
	};

	const handleDeleteDialogClose = () => {
		setOpenDeleteDialog(false);
		setCurrentMission(null);
	};

	const handleEditSubmit = () => {
		const updatedMission = {
			...editedMission,
			robot_id: editedMission.robot, // Sending robot ID as 'robot_id'
		};
		axios
			.put(
				`http://localhost:8000/api/missions/${currentMission.id}/`,
				updatedMission
			)
			.then(() => {
				fetchMissions();
				handleEditDialogClose();
			})
			.catch((error) => console.error("Error updating mission:", error));
	};


	const handleDeleteSubmit = () => {
		axios
			.delete(`http://localhost:8000/api/missions/${currentMission.id}/`)
			.then(() => {
				fetchMissions();
				handleDeleteDialogClose();
			})
			.catch((error) => console.error("Error deleting mission:", error));
	};

	return (
		<div className={classes.root}>
			<div className={classes.content}>
				<Typography variant='h2' className={classes.title}>
					Missions
				</Typography>
				<div className={classes.buttonContainer}>
					<Button
						variant='contained'
						component={Link}
						to='/create-mission'
						className={classes.button}>
						Create New Mission
					</Button>
					<Button
						variant='contained'
						component={Link}
						to='/create-robot'
						className={classes.button}>
						Create New Robot
					</Button>
				</div>
				<TableContainer component={Paper} className={classes.tableContainer}>
					<Table className={classes.table} aria-label='missions table'>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell className={classes.tableHeadCell}>Name</TableCell>
								<TableCell className={classes.tableHeadCell}>
									Description
								</TableCell>
								<TableCell className={classes.tableHeadCell}>Robot</TableCell>
								<TableCell className={classes.tableHeadCell}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{missions.map((mission) => (
								<TableRow key={mission.id} className={classes.tableRow}>
									<TableCell
										component='th'
										scope='row'
										className={classes.tableCell}>
										<Link
											to={`/mission/${mission.id}`}
											className={classes.link}>
											{mission.name}
										</Link>
									</TableCell>
									<TableCell className={classes.tableCell}>
										{mission.description}
									</TableCell>
									<TableCell className={classes.tableCell}>
										{mission.robot ? mission.robot.name : "N/A"}
									</TableCell>
									<TableCell>
										<IconButton onClick={() => handleEditClick(mission)}>
											<EditIcon className={classes.editIcon} />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(mission)}>
											<DeleteIcon className={classes.deleteIcon} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>

			<Dialog
				open={openEditDialog}
				onClose={handleEditDialogClose}
				classes={{ paper: classes.dialogPaper }}>
				<DialogTitle>Edit Mission</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please update the details of the mission.
					</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						label='Name'
						type='text'
						fullWidth
						variant='outlined'
						value={editedMission.name}
						onChange={(e) =>
							setEditedMission({ ...editedMission, name: e.target.value })
						}
						className={classes.dialogTextField}
					/>
					<TextField
						margin='dense'
						label='Description'
						type='text'
						fullWidth
						variant='outlined'
						value={editedMission.description}
						onChange={(e) =>
							setEditedMission({
								...editedMission,
								description: e.target.value,
							})
						}
						className={classes.dialogTextField}
					/>
					<FormControl fullWidth variant='outlined' margin='dense'>
						<InputLabel>Robot</InputLabel>
						<Select
							value={editedMission.robot}
							onChange={(e) =>
								setEditedMission({ ...editedMission, robot: e.target.value })
							}
							label='Robot'
							className={classes.dialogSelect}>
							{robots.map((robot) => (
								<MenuItem key={robot.id} value={robot.id}>
									{robot.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditDialogClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={handleEditSubmit} color='primary'>
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openDeleteDialog}
				onClose={handleDeleteDialogClose}
				classes={{ paper: classes.dialogPaper }}>
				<DialogTitle>Delete Mission</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this mission?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={handleDeleteSubmit} color='primary'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default MissionList;
