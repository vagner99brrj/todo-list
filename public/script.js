const API_URL = 'http://localhost:2000/tarefas';
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');


async function apiFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            
            throw new Error(`Erro HTTP: Status ${response.status}`);
        }
        
        return response;
    } catch (error) {
        console.error('Falha na requisição:', error);
        alert(`Erro na comunicação com a API: ${error.message}`);
        throw error; 
    }
}

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Função para aplicar o tema salvo
function applyTheme() {
    
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
}

// Evento para alternar o tema ao clicar no botão
themeToggle.addEventListener('click', () => {
    // Alterna a classe no <body>
    body.classList.toggle('dark-theme'); 
    
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

applyTheme();

// Função para buscar e renderizar tarefas (READ - GET)
async function fetchAndRenderTasks() {
    try {
        const response = await apiFetch(API_URL);
        const tasks = await response.json();
        
        taskList.innerHTML = ''; 

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="task-title">${task.titulo}</span>
                <div class="actions">
                    <button class="complete" data-id="${task.id}">Concluir</button>
                    <button class="edit" data-id="${task.id}">Editar</button>
                    <button class="delete" data-id="${task.id}">Excluir</button>
                </div>
            `;
            taskList.appendChild(li);
        });

    } catch (error) {
        
        taskList.innerHTML = '<li>Erro ao carregar as tarefas. Consulte o console.</li>';
    }
}


// Criação de nova tarefa (CREATE - POST)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = taskInput.value.trim();
    if (!titulo) return alert('O título da tarefa não pode estar vazio.');

    try {
        await apiFetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo })
        });

        taskInput.value = ''; 
        fetchAndRenderTasks(); 
    } catch (error) {
    
    }
});


// Manipulação (DELETE, PATCH, PUT)
taskList.addEventListener('click', async (event) => {
    const target = event.target;
    const taskId = target.dataset.id;
    const updateURL = `${API_URL}/${taskId}`;

    if (!taskId) return; 

    try {
        if (target.classList.contains('delete')) {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                await apiFetch(updateURL, { method: 'DELETE' });
                
            } else {
                return;
            }
        } 
        
        else if (target.classList.contains('complete')) {
            await apiFetch(updateURL, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completa: 1 })
            });
        } 
        
        else if (target.classList.contains('edit')) {
            const li = target.closest('li');
            const originalTitle = li.querySelector('.task-title').textContent;

            li.innerHTML = `
                <input type="text" class="edit-input" value="${originalTitle}">
                <div class="actions">
                    <button class="save" data-id="${taskId}">Salvar</button>
                    <button class="cancel">Cancelar</button>
                </div>
            `;
            return; 
        } 
        
        else if (target.classList.contains('save')) {
            const li = target.closest('li');
            const novoTitulo = li.querySelector('.edit-input').value.trim();

            if (!novoTitulo) return alert('O título não pode estar vazio.');

            await apiFetch(updateURL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: novoTitulo })
            });
        } 
        
        else if (target.classList.contains('cancel')) {
        
        } else {
            return; 
        }
        
       
        fetchAndRenderTasks();

    } catch (error) {
    
    }
});


fetchAndRenderTasks();