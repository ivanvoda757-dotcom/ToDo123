let tasks = [];

function loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    // Čuva scroll poziciju
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    const completed = tasks.filter(t => t.done).length;
    const total = tasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = progress + '%';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-row">
                <a href="#" onclick="toggleTask(${index})" class="${task.done ? 'done' : 'not-done'}">
                    ${task.done ? '✔' : '✗'}
                </a>
                <button class="edit-button" onclick="editTask(${index})">Edit</button>
                <a href="#" onclick="deleteTask(${index})" class="delete-button">Delete</a>
                <div class="task-main">
                    <div class="task-text">${task.text}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
            </div>
            <form class="edit-form" id="edit-form-${index}" style="display: none;" onsubmit="saveEdit(event, ${index})">
                <textarea name="description" placeholder="Opis zadatka">${task.description}</textarea>
                <button type="submit">Sačuvaj</button>
                <button type="button" onclick="cancelEdit(${index})">Otkaži</button>
            </form>
        `;
        list.appendChild(li);
    });
    
    // Vraća scroll na prethodnu poziciju
    window.scrollTo(0, scrollPosition);
}

function addTask(event) {
    event.preventDefault();
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (text) {
        tasks.push({ text, description: '', done: false });
        saveTasks();
        renderTasks();
        input.value = '';
    }
}

function toggleTask(index) {
    event.preventDefault();
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    event.preventDefault();
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const form = document.getElementById(`edit-form-${index}`);
    form.style.display = 'block';
}

function saveEdit(event, index) {
    event.preventDefault();
    const form = event.target;
    const description = form.description.value;
    tasks[index].description = description;
    saveTasks();
    renderTasks();
}

function cancelEdit(index) {
    const form = document.getElementById(`edit-form-${index}`);
    form.style.display = 'none';
}

document.getElementById('add-form').addEventListener('submit', addTask);

loadTasks();
