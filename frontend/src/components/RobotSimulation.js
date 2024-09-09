/** @format */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import {
	Typography,
	Paper,
	Grid,
	makeStyles,
} from "@material-ui/core";
import axios from "axios";


const useStyles = makeStyles((theme) => ({
	root: {
		height: "100vh",
		width: "100vw",
		backgroundColor: "#2C2C2C",
		padding: theme.spacing(2),
		boxSizing: "border-box",
		overflow: "hidden",
	},
	paper: {
		padding: theme.spacing(2),
		backgroundColor: "rgba(229, 229, 229, 0.1)",
		color: "#FFFFFF",
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},
	title: {
		marginBottom: theme.spacing(2),
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: "28px",
	},
	simulationArea: {
		width: "100%",
		height: "100%",
		border: "1px solid #3B82F6",
		position: "relative",
		backgroundColor: "#1E1E1E",
		overflow: "hidden",
		borderRadius: theme.spacing(2),
	},
	robot: {
		width: "60px",
		height: "80px",
		position: "absolute",
		transition: "all 0.25s",
	},
	robotBody: {
		width: "60px",
		height: "60px",
		backgroundColor: "#4a4a4a",
		borderRadius: "10px",
		position: "relative",
	},
	robotHead: {
		width: "40px",
		height: "20px",
		backgroundColor: "#6a6a6a",
		borderRadius: "10px 10px 0 0",
		position: "absolute",
		top: "-20px",
		left: "10px",
	},
	robotEye: {
		width: "10px",
		height: "10px",
		backgroundColor: "#FF0000",
		borderRadius: "50%",
		position: "absolute",
		top: "5px",
		animation: "$blink 2s infinite",
	},
	robotLeftEye: {
		left: "5px",
	},
	robotRightEye: {
		right: "5px",
	},
	robotAntenna: {
		width: "2px",
		height: "15px",
		backgroundColor: "#888",
		position: "absolute",
		top: "-15px",
		left: "29px",
	},
	robotWheel: {
		width: "20px",
		height: "20px",
		backgroundColor: "#222",
		borderRadius: "50%",
		position: "absolute",
		bottom: "-10px",
	},
	robotLeftWheel: {
		left: "5px",
	},
	robotRightWheel: {
		right: "5px",
	},
	controllerContainer: {
		display: "flex",
		justifyContent: "center",
		marginTop: "auto",
	},
	joystickContainer: {
		width: "150px",
		height: "150px",
		borderRadius: "50%",
		backgroundColor: "rgba(59, 130, 246, 0.2)",
		display: "grid",
		gridTemplateRows: "repeat(3, 1fr)",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: "5px",
		justifyItems: "center",
		alignItems: "center",
		padding: "10px",
	},
	joystickButton: {
		width: "40px",
		height: "40px",
		borderRadius: "50%",
		backgroundColor: "rgba(59, 130, 246, 0.7)",
		border: "2px solid #3B82F6",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
		transition: "all 0.3s ease",
		color: "#FFFFFF",
		fontWeight: "bold",
		"&:hover": {
			backgroundColor: "#2563EB",
			transform: "scale(1.1)",
		},
		"&:active, &.active": {
			backgroundColor: "#1D4ED8",
			transform: "scale(1)",
		},
	},
	emptySpace: {
		visibility: "hidden",
	},
	"@keyframes blink": {
		"0%, 100%": { opacity: 1 },
		"50%": { opacity: 0 },
	},
	infoContainer: {
		marginBottom: theme.spacing(2),
	},
}));

/**
 * Component that renders a robot simulation with a joystick control.
 *
 * The component fetches the robot data from the backend when mounted and
 * establishes a WebSocket connection to receive updates on the robot's
 * position. It also handles user input from the joystick control and sends
 * the input to the backend to control the robot.
 *
 * @component
 * @example
 * <RobotSimulation />
 */
function RobotSimulation() {
	const { id } = useParams();
	const classes = useStyles();
	const [robot, setRobot] = useState(null);
	const [socket, setSocket] = useState(null);
	const [activeButtons, setActiveButtons] = useState({
		up: false,
		down: false,
		left: false,
		right: false,
	});
	const moveIntervalRef = useRef(null);

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/robots/${id}/`)
			.then((response) => setRobot(response.data))
			.catch((error) => console.error("Error fetching robot:", error));

		const ws = new WebSocket(`ws://localhost:8000/ws/robot/${id}/`);
		setSocket(ws);

		return () => {
			if (ws) ws.close();
		};
	}, [id]);

	useEffect(() => {
		if (socket) {
			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.direction) {
					setRobot((prevRobot) => {
						const step = 20;
						let newX = prevRobot.pose_x;
						let newY = prevRobot.pose_y;

						switch (data.direction) {
							case "up":
								newY = Math.min(newY + step, 540 - 36);
								break;
							case "down":
								newY = Math.max(newY - step, -10);
								break;
							case "left":
								newX = Math.max(newX - step, 0);
								break;
							case "right":
								newX = Math.min(newX + step, 900);
								break;
							default:
								break;
						}

						return { ...prevRobot, pose_x: newX, pose_y: newY };
					});
				}
			};
		}
	}, [socket]);

	const moveRobot = useCallback(
		(direction) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ direction }));
			}
		},
		[socket]
	);

	const handleButtonPress = (direction) => {
		setActiveButtons((prev) => ({ ...prev, [direction]: true }));
		moveRobot(direction);
		moveIntervalRef.current = setInterval(() => {
			moveRobot(direction);
		}, 250);
	};

	const handleButtonRelease = (direction) => {
		setActiveButtons((prev) => ({ ...prev, [direction]: false }));
		if (moveIntervalRef.current) {
			clearInterval(moveIntervalRef.current);
			moveIntervalRef.current = null;
		}
	};

	useEffect(() => {
		const handleKeyDown = (event) => {
			let direction;
			switch (event.key.toLowerCase()) {
				case "arrowup":
				case "w":
					direction = "up";
					break;
				case "arrowdown":
				case "s":
					direction = "down";
					break;
				case "arrowleft":
				case "a":
					direction = "left";
					break;
				case "arrowright":
				case "d":
					direction = "right";
					break;
				default:
					return;
			}
			if (!activeButtons[direction]) {
				handleButtonPress(direction);
			}
		};

		const handleKeyUp = (event) => {
			let direction;
			switch (event.key.toLowerCase()) {
				case "arrowup":
				case "w":
					direction = "up";
					break;
				case "arrowdown":
				case "s":
					direction = "down";
					break;
				case "arrowleft":
				case "a":
					direction = "left";
					break;
				case "arrowright":
				case "d":
					direction = "right";
					break;
				default:
					return;
			}
			handleButtonRelease(direction);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [activeButtons, moveRobot]);

	if (!robot)
		return <Typography className={classes.title}>Loading...</Typography>;

	return (
			<div className={classes.root}>
					<Grid container spacing={3} style={{ height: "100%" }}>
						<Grid item xs={8} style={{ height: "100%" }}>
							<Paper className={classes.paper}>
								<div className={classes.simulationArea}>
									<div
										className={classes.robot}
										style={{
											left: `${robot.pose_x}px`,
											bottom: `${robot.pose_y}px`,
										}}>
										<div className={classes.robotBody}>
											<div className={classes.robotHead}>
												<div
													className={`${classes.robotEye} ${classes.robotLeftEye}`}></div>
												<div
													className={`${classes.robotEye} ${classes.robotRightEye}`}></div>
											</div>
											<div className={classes.robotAntenna}></div>
											<div
												className={`${classes.robotWheel} ${classes.robotLeftWheel}`}></div>
											<div
												className={`${classes.robotWheel} ${classes.robotRightWheel}`}></div>
										</div>
									</div>
								</div>
							</Paper>
						</Grid>
						<Grid item xs={4} style={{ height: "100%" }}>
							<Paper className={classes.paper}>
								<div className={classes.infoContainer}>
									<Typography variant='h4' className={classes.title}>
										Robot Simulation
									</Typography>
									<Typography variant='h6'>Robot Name: {robot.name}</Typography>
									<Typography variant='h6'>
										Model: {robot.model_name}
									</Typography>
								</div>
								<div className={classes.controllerContainer}>
									<div className={classes.joystickContainer}>
										<div className={classes.emptySpace}></div>
										<div
											className={`${classes.joystickButton} ${
												activeButtons.up ? "active" : ""
											}`}
											onMouseDown={() => handleButtonPress("up")}
											onMouseUp={() => handleButtonRelease("up")}
											onMouseLeave={() => handleButtonRelease("up")}>
											↑
										</div>
										<div className={classes.emptySpace}></div>

										<div
											className={`${classes.joystickButton} ${
												activeButtons.left ? "active" : ""
											}`}
											onMouseDown={() => handleButtonPress("left")}
											onMouseUp={() => handleButtonRelease("left")}
											onMouseLeave={() => handleButtonRelease("left")}>
											←
										</div>
										<div className={classes.emptySpace}></div>
										<div
											className={`${classes.joystickButton} ${
												activeButtons.right ? "active" : ""
											}`}
											onMouseDown={() => handleButtonPress("right")}
											onMouseUp={() => handleButtonRelease("right")}
											onMouseLeave={() => handleButtonRelease("right")}>
											→
										</div>

										<div className={classes.emptySpace}></div>
										<div
											className={`${classes.joystickButton} ${
												activeButtons.down ? "active" : ""
											}`}
											onMouseDown={() => handleButtonPress("down")}
											onMouseUp={() => handleButtonRelease("down")}
											onMouseLeave={() => handleButtonRelease("down")}>
											↓
										</div>
										<div className={classes.emptySpace}></div>
									</div>
								</div>
							</Paper>
						</Grid>
					</Grid>
			</div>
	);
}

export default RobotSimulation;