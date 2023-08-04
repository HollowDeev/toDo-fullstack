const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input-task')

//!API
const fetchTasks = async () => {
  const response = await fetch('http://localhost:3333/tasks')

  const tasks = await response.json()
  return tasks
}

const addTask = async (e) => {
    e.preventDefault()
    
    const task = { title: inputTask.value }

    await fetch('http://localhost:3333/tasks', {
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },

        body: JSON.stringify(task)
    })

    inputTask.value = ''
    loadTasks()
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'delete'
    })

    loadTasks()
}

const updateTask = async ({ id, title, status }) => {

    await fetch(`http://localhost:3333/tasks/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status })
    })

    loadTasks()
}

const formatDate = (dateUTC) => {
    const options = {
        dateStyle: 'long',
        timeStyle: 'short'
    }

    const date = new Date(dateUTC)
    .toLocaleString('pt-br', options)

    return date
}

const createElement = (element, valorText = '', valorHTML = '') => {

    const tag = document.createElement(element)

    if(valorText){
        tag.innerText = valorText
    }

    if(valorHTML){
        tag.innerHTML = valorHTML
    }

    return tag
}

const createSelect = (valor) => {
    const options = `
    <option value="pendente">Pendente</option>
    <option value="em andamento">Em Andamento</option>
    <option value="concluido">Concluído</option>
    `
    const select = createElement('select', '', options)

    select.value = valor

    return select
}

const createTask = (task) => {

    const { id, title, created_at, status } = task

    const tr = createElement('tr')
    const tdTitle = createElement('td', title)
    const tdCreatedAt = createElement('td', formatDate(created_at))
    const tdStatus = createElement('td')
    const tdActions = createElement('td')

    const select = createSelect(status)
    select.addEventListener('change', ({ target }) => {
      updateTask({ ...task, status: target.value})
    })

    const editButton = createElement('button', '', '<i class="ph-fill ph-pencil-line">')
    editButton.classList.add('btn-action')
    editButton.addEventListener('click', () => {
        tdTitle.innerText = ''
        tdTitle.appendChild(editForm)
    })

    const deleteButton = createElement('button', '', '<i class="ph-fill ph-trash"></i>')
    deleteButton.classList.add('btn-action')
    deleteButton.addEventListener('click', () => {
      deleteTask(id)
    })

    const editForm = createElement('form')
    const editInput = createElement('input')
    editInput.value = title

    editForm.appendChild(editInput)

    editForm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        updateTask({ id, title: editInput.value, status })
    })

    tdStatus.appendChild(select)

    tdActions.appendChild(editButton)
    tdActions.appendChild(deleteButton)

    tr.appendChild(tdTitle)
    tr.appendChild(tdCreatedAt)
    tr.appendChild(tdStatus)
    tr.appendChild(tdActions)

    return tr
}

const loadTasks = async() => {
  
    const tasks = await fetchTasks()

    tbody.innerHTML = ''

    tasks.forEach(task => {
        const tr = createTask(task)
        tbody.appendChild(tr)
    });
    
}

loadTasks()

addForm.addEventListener('submit', addTask)