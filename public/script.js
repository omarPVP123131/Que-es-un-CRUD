const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: taskText })
        })
        .then(response => response.json())
        .then(task => {
            taskInput.value = "";
            renderTask(task);
        })
        .catch(error => console.error(error));
    }
}

function renderTask(task) {
    const existingTaskItem = document.querySelector(`li[data-id="${task.id}"]`);
    if (existingTaskItem) {
        existingTaskItem.querySelector("span").textContent = task.text;
    } else {
        const listItem = document.createElement("li");
        listItem.dataset.id = task.id;
        listItem.innerHTML = `
            <span>${task.text}</span>
            <button onclick="editTask(${task.id})">Editar</button>
            <button onclick="deleteTask(${task.id})">Eliminar</button>
        `;
        taskList.appendChild(listItem);
    }
}



function editTask(taskId) {
    const newTaskText = prompt("Editar tarea:", "");
    if (newTaskText !== null) {
        fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: newTaskText })
        })
        .then(() => {
            loadTasks(); // Recargar la lista de tareas después de editar
        })
        .catch(error => console.error(error));
    }
}
function loadTasks() {
    fetch("/api/tasks")
        .then(response => response.json())
        .then(tasks => {
            // Limpiar la lista antes de renderizar las tareas
            taskList.innerHTML = "";
            tasks.forEach(task => renderTask(task));
        })
        .catch(error => console.error(error));
}


function deleteTask(taskId) {
    fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
    })
    .then(() => {
        const listItem = document.querySelector(`li[data-id="${taskId}"]`);
        listItem.remove();
    })
    .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", loadTasks);
