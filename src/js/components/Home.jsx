import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Home() {

	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [show, setShow] = useState(null);

	const getTasks = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/iroman14", {
				method: "GET",
			});
			const data = await response.json();
			setTasks(data.todos || []);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getTasks();
	}, []);

	const addTask = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/todos/iroman14", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					label: newTask,
					is_done: false,
				}),
			}
			);
			const data = await response.json();
			setTasks([...tasks, data]);
			setNewTask("");
		} catch (error) {
			console.log(error);
		}
	};

	const removeTask = async (id) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE",
			});
			setTasks(tasks.filter(task => task.id !== id));
		} catch (error) {
			console.log(error);
		}
	};

	const removeallTasks = async () => {
		try {
			await Promise.all(
				tasks.map(task =>
					fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, { method: "DELETE" })
				)
			);
			setTasks([]);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="Container">
			<h1>To Do List</h1>
			<ul>
				<li>
					<input
						type="text"
						placeholder="Deseas agregar alguna tarea?"
						onChange={(note) => setNewTask(note.target.value)}
						value={newTask}
						onKeyDown={(note) => {
							if (note.key === "Enter") addTask();
						}}
						className="form-control">
					</input>
				</li>
				{tasks.length === 0 ? (
					<li> No hay tareas pendientes, añadir tareas nuevas </li>
				) : (
					tasks.map((note) => (
						<li key={note.id} onMouseEnter={() => setShow(note.id)} onMouseLeave={() => setShow(null)} className="d-flex justify-content-between align-items-center">
							{note.label}
							{show === note.id && (<button onClick={() => removeTask(note.id)} className="btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>)}
						</li>
					)
					))}
			</ul>
			<button onClick={addTask} className="btn btn-dark"> Añadir Nota </button>
			<button onClick={removeallTasks} className="btn btn-danger">Eliminar Todas</button>
			<div className="Counter">{tasks.length} tasks</div>
		</div>
	)
}

export default Home;