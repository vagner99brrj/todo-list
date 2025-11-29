const API_URL = 'http://localhost:2000';
// Elementos de Auth
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const authForm = document.getElementById('auth-form');
const btnRegister = document.getElementById('btn-register');
const authMsg = document.getElementById('auth-msg');
const btnLogout = document.getElementById('btn-logout');

// Elementos do App
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const themeToggle = document.getElementById('theme-toggle');
const btnPending = document.getElementById('btn-pending');
const btnCompleted = document.getElementById('btn-completed');

let showingCompleted = false;

// --- Helpers ---
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro na requisição');
        }
        return response;
    } catch (error) {
        alert(error.message);
        throw error;
    }
}

function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    fetchAndRenderTasks();
}

function showLogin() {
    appContainer.style.display = 'none';
    authContainer.style.display = 'block';
    authForm.reset();
}

// --- Autenticação ---
authForm.addEventListener('submit', async (e) => { // LOGIN
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        const res = await apiFetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        // Aqui poderíamos salvar um token no futuro.
        // Por enquanto, apenas liberamos o acesso.
        authMsg.textContent = "Login realizado!";
        showApp();
    } catch (err) {
        authMsg.textContent = err.message;
    }
});

btnRegister.addEventListener('click', async () => { // CADASTRO
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    if(!email || !password) return alert('Preencha email e senha para cadastrar.');

    try {
        await apiFetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        alert('Usuário cadastrado! Agora faça login.');
    } catch (err) {}
});

btnLogout.addEventListener('click', showLogin);

// --- App Lógica (Tarefas) ---
async function fetchAndRenderTasks() {
    const endpoint = showingCompleted ? '/tarefas/concluidas' : '/tarefas';
    try {
        const res = await apiFetch(endpoint);
        const tasks = await res.json();
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            const btns = showingCompleted 
                ? `<button class="reopen" data-id="${task.id}">Reabrir</button><button class="delete" data-id="${task.id}">Excluir</button>`
                : `<button class="complete" data-id="${task.id}">Concluir</button><button class="edit" data-id="${task.id}">Editar</button><button class="delete" data-id="${task.id}">Excluir</button>`;
            
            li.innerHTML = `<span class="task-title ${showingCompleted ? 'done-text' : ''}">${task.titulo}</span><div class="actions">${btns}</div>`;
            taskList.appendChild(li);
        });
    } catch (e) {}
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = taskInput.value.trim();
    if (!titulo) return;
    await apiFetch('/tarefas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ titulo }) });
    taskInput.value = '';
    fetchAndRenderTasks();
});

taskList.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    const cl = e.target.classList;
    
    if (cl.contains('delete') && confirm('Excluir?')) await apiFetch(`/tarefas/${id}`, { method: 'DELETE' });
    else if (cl.contains('complete')) await apiFetch(`/tarefas/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({completa: 1}) });
    else if (cl.contains('reopen')) await apiFetch(`/tarefas/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({completa: 0}) });
    else if (cl.contains('edit')) {
        const li = e.target.closest('li');
        const old = li.querySelector('.task-title').innerText;
        li.innerHTML = `<input class="edit-input" value="${old}"><div class="actions"><button class="save" data-id="${id}">Salvar</button><button class="cancel">Cancelar</button></div>`;
    }
    else if (cl.contains('save')) {
        const val = e.target.closest('li').querySelector('.edit-input').value;
        if(val) await apiFetch(`/tarefas/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({titulo: val}) });
    }
    else if (cl.contains('cancel')) return fetchAndRenderTasks();
    
    fetchAndRenderTasks();
});

// Filtros
btnPending.addEventListener('click', () => { showingCompleted=false; btnPending.classList.add('active'); btnCompleted.classList.remove('active'); taskForm.style.display='flex'; fetchAndRenderTasks(); });
btnCompleted.addEventListener('click', () => { showingCompleted=true; btnCompleted.classList.add('active'); btnPending.classList.remove('active'); taskForm.style.display='none'; fetchAndRenderTasks(); });

// Tema
themeToggle.addEventListener('click', () => { document.body.classList.toggle('dark-theme'); localStorage.setItem('theme', document.body.classList.contains('dark-theme')?'dark':'light'); });
if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark-theme');