// Get HTML elements

const taskInput = document.getElementById("taskInput");
const descriptionInput = document.getElementById("descriptionInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const searchInput = document.getElementById("searchInput");

const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const completedList = document.getElementById("completedList");

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const completedCount = document.getElementById("completedCount");


// Get tasks from Local Storage

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];


// Save tasks

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}


// Display tasks

function displayTasks(searchText = "") {

    todoList.innerHTML = "";
    progressList.innerHTML = "";
    completedList.innerHTML = "";

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
    );

    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.classList.add("task-card");

        taskCard.setAttribute("draggable", "true");

        taskCard.dataset.id = task.id;

        taskCard.innerHTML = `
            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <div class="task-footer">

                <span class="status">
                    ${getStatusName(task.status)}
                </span>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        // Delete button

        const deleteBtn = taskCard.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });


        // Drag Start

        taskCard.addEventListener("dragstart", () => {

            taskCard.classList.add("dragging");

        });


        // Drag End

        taskCard.addEventListener("dragend", () => {

            taskCard.classList.remove("dragging");

        });


        // Put task in correct column

        if (task.status === "todo") {

            todoList.appendChild(taskCard);

        } else if (task.status === "progress") {

            progressList.appendChild(taskCard);

        } else {

            completedList.appendChild(taskCard);

        }

    });


    updateCounts();
}


// Get status name

function getStatusName(status) {

    if (status === "todo") {
        return "To Do";
    }

    if (status === "progress") {
        return "In Progress";
    }

    return "Completed";
}


// Add new task

addTaskBtn.addEventListener("click", () => {

    const title = taskInput.value.trim();

    const description = descriptionInput.value.trim();


    if (title === "") {

        alert("Please enter a task title.");

        return;
    }


    const newTask = {

        id: Date.now(),

        title: title,

        description: description || "No description",

        status: "todo"

    };


    tasks.push(newTask);


    saveTasks();

    displayTasks();


    taskInput.value = "";

    descriptionInput.value = "";

});


// Delete task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();

}


// Search tasks

searchInput.addEventListener("input", () => {

    displayTasks(searchInput.value);

});


// Drag & Drop

const columns = document.querySelectorAll(".column");


columns.forEach(column => {

    column.addEventListener("dragover", event => {

        event.preventDefault();

        column.classList.add("drag-over");

    });


    column.addEventListener("dragleave", () => {

        column.classList.remove("drag-over");

    });


    column.addEventListener("drop", event => {

        event.preventDefault();

        column.classList.remove("drag-over");


        const draggedTask =
            document.querySelector(".dragging");


        if (!draggedTask) {
            return;
        }


        const taskId =
            Number(draggedTask.dataset.id);


        const newStatus =
            column.dataset.status;


        const task =
            tasks.find(task => task.id === taskId);


        if (task) {

            task.status = newStatus;

            saveTasks();

            displayTasks(searchInput.value);

        }

    });

});


// Update task counters

function updateCounts() {

    const todoTasks =
        tasks.filter(task => task.status === "todo");

    const progressTasks =
        tasks.filter(task => task.status === "progress");

    const completedTasks =
        tasks.filter(task => task.status === "completed");


    todoCount.textContent = todoTasks.length;

    progressCount.textContent = progressTasks.length;

    completedCount.textContent = completedTasks.length;

}


// Initial display

displayTasks();