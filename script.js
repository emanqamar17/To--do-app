// -------- GET ELEMENTS --------
const addTaskBtn = document.getElementById("add-task");
const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const taskDue = document.getElementById("task-due");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");
const searchBar = document.getElementById("search-bar");
const filterSelect = document.getElementById("filter");

let tasks = [];

// -------- LOCALSTORAGE --------
function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// -------- RENDER TASKS --------
function renderTasks() {
  const searchText = searchBar.value.toLowerCase();
  const filterValue = filterSelect.value;

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    // SEARCH & FILTER LOGIC
    const matchesSearch = task.title.toLowerCase().includes(searchText) || task.desc.toLowerCase().includes(searchText);
    const matchesFilter = filterValue === "all" ||
                          (filterValue === "completed" && task.completed) ||
                          (filterValue === "pending" && !task.completed);
    if (!matchesSearch || !matchesFilter) return;

    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-header">
        <strong>${task.title}</strong>
        <div class="task-actions">
          <button class="complete">${task.completed ? "Undo" : "Complete"}</button>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </div>
      <p>${task.desc || "No description"}</p>
      <small><strong>Due Date:</strong> ${task.due.replace("T", " ")}</small>
    `;

    // COMPLETE BUTTON
    li.querySelector(".complete").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // DELETE BUTTON
    li.querySelector(".delete").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    // EDIT BUTTON
    li.querySelector(".edit").addEventListener("click", () => {
      const newTitle = prompt("Edit title:", task.title);
      const newDesc = prompt("Edit description:", task.desc);
      const newDue = prompt("Edit due date (YYYY-MM-DDTHH:MM):", task.due);

      if (newTitle) task.title = newTitle;
      if (newDesc) task.desc = newDesc;
      if (newDue) task.due = newDue;

      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

// -------- ADD TASK BUTTON --------
addTaskBtn.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  if (!title) {
    alert("Please enter a task title!");
    return;
  }

  const newTask = {
    title: title,
    desc: taskDesc.value.trim(),
    due: taskDue.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // CLEAR INPUTS
  taskTitle.value = "";
  taskDesc.value = "";
  taskDue.value = "";
});

// -------- THEME TOGGLE --------
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("dark") ? "Light Theme" : "Dark Theme";
});

// -------- SEARCH --------
searchBar.addEventListener("input", () => {
  renderTasks();
});

// -------- FILTER --------
filterSelect.addEventListener("change", () => {
  renderTasks();
});

// -------- INITIAL LOAD --------
loadTasks();
