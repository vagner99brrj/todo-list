const API_URL = 'http://localhost:2000';

// Elementos UI
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const authForm = document.getElementById('auth-form');
const btnRegister = document.getElementById('btn-register');
const authMsg = document.getElementById('auth-msg');
const btnLogout = document.getElementById('btn-logout');

// Elementos App
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const themeToggle = document.getElementById('theme-toggle');
const btnPending = document.getElementById('btn-pending');
const btnCompleted = document.getElementById('btn-completed');

let showingCompleted = false;

// --- 1. FUNÇÃO CENTRAL DE REQUISIÇÃO (MODIFICADA) ---
async function apiFetch(endpoint, options = {}) {
    // Recupera o token salvo
    const token = localStorage.getItem('token');

    // Configura os cabeçalhos padrão
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers // Mantém outros headers se existirem
    };

    // Se tiver token, adiciona no cabeçalho Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: headers
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        // Se der erro 401 (Não autorizado), força o logout
        if (response.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            logout();
            return;
        }

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro na requisição');
        }
        return response;
    } catch (error) {
        // Ignora erro de sessão expirada para não spamar alert
        if (error.message !== 'Sessão expirada. Faça login novamente.') {
            alert(error.message);
        }
        throw error;
    }
}

// --- Funções de Tela ---
function checkLogin() {
    const token = localStorage.getItem('token');
    if (token) {
        showApp();
    } else {
        showLogin();
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
    authMsg.textContent = '';
}

function logout() {
    localStorage.removeItem('token'); // Remove o crachá
    localStorage.removeItem('user');
    showLogin();
}

// --- Autenticação ---
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
        // Usa fetch direto aqui pois o apiFetch exige token (e aqui não temos ainda)
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Erro no login');

        // 2. SALVAR O TOKEN
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email }));
        
        authMsg.textContent = "Login realizado!";
        showApp();

    } catch (err) {
        authMsg.textContent = err.message;
        authMsg.style.color = 'red';
    }
});

btnRegister.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    if(!email || !password) return alert('Preencha email e senha.');

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        alert('Cadastrado! Faça login.');
        authForm.reset();
    } catch (err) {
        alert(err.message);
    }
});

btnLogout.addEventListener('click', logout);

// --- App Lógica (Tarefas) ---
// (O restante permanece igual, pois o apiFetch resolve a autenticação)

async function fetchAndRenderTasks() {
    const endpoint = showingCompleted ? '/tarefas/concluidas' : '/tarefas';
    try {
        const res = await apiFetch(endpoint);
        if(!res) return; // Se falhou (401), para aqui
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
    } catch (e) { console.log(e) }
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = taskInput.value.trim();
    if (!titulo) return;
    await apiFetch('/tarefas', { method: 'POST', body: JSON.stringify({ titulo }) });
    taskInput.value = '';
    fetchAndRenderTasks();
});

taskList.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    const cl = e.target.classList;
    const url = `/tarefas/${id}`;
    
    if (cl.contains('delete') && confirm('Excluir?')) await apiFetch(url, { method: 'DELETE' });
    else if (cl.contains('complete')) await apiFetch(url, { method: 'PATCH', body: JSON.stringify({completa: 1}) });
    else if (cl.contains('reopen')) await apiFetch(url, { method: 'PATCH', body: JSON.stringify({completa: 0}) });
    else if (cl.contains('edit')) {
        const li = e.target.closest('li');
        const old = li.querySelector('.task-title').innerText;
        li.innerHTML = `<input class="edit-input" value="${old}"><div class="actions"><button class="save" data-id="${id}">Salvar</button><button class="cancel">Cancelar</button></div>`;
    }
    else if (cl.contains('save')) {
        const val = e.target.closest('li').querySelector('.edit-input').value;
        if(val) await apiFetch(url, { method: 'PUT', body: JSON.stringify({titulo: val}) });
    }
    else if (cl.contains('cancel')) return fetchAndRenderTasks();
    
    fetchAndRenderTasks();
});

// Filtros & Tema
btnPending.addEventListener('click', () => { showingCompleted=false; btnPending.classList.add('active'); btnCompleted.classList.remove('active'); taskForm.style.display='flex'; fetchAndRenderTasks(); });
btnCompleted.addEventListener('click', () => { showingCompleted=true; btnCompleted.classList.add('active'); btnPending.classList.remove('active'); taskForm.style.display='none'; fetchAndRenderTasks(); });
themeToggle.addEventListener('click', () => { document.body.classList.toggle('dark-theme'); localStorage.setItem('theme', document.body.classList.contains('dark-theme')?'dark':'light'); });
if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark-theme');

// Init
checkLogin(); // Verifica se já tem token salvo ao carregar a página