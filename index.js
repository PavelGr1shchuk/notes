const MOCK_NOTES = [{
    id: 1,
    title: 'Работа с формами',
    content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
    color: 'green',
    isFavorite: false,
}, ]

const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}

const statuses = {
    SUCCESS: 'success',
    ERROR: 'error',
}

const successMessage = `<img src="/assets/images/Vector.svg" alt="succcess">
                        <p>Заметка добавлена</p>`

const deleteMessage = `<p>Заметка удалена</p>`

const titleErrorMessage = `<img src="/assets/images/Vector-4.svg" alt="error">
                        <p>Максимальная длина заголовка - 50 символов</p>`

const descErrorMessage = `<img src="/assets/images/Vector-4.svg" alt="error">
                        <p>Максимальная длина описания - 500 символов</p>`

const requiredMessage = `<p>Заполните все поля</p>`

let selectedColor;

const model = {
    notes: [],
    showFavorites: false,
    addNote(title, description, color = 'yellow') {
        if (title.length > 50) {
            view.renderPopup(statuses.ERROR, titleErrorMessage)
            view.renderForm(title, description)
            return 
        }
        if (description.length > 500) {
            view.renderPopup(statuses.ERROR, descErrorMessage)
            view.renderForm(title, description)
            return 
        }
        if (title === "" || description === "") {
            view.renderPopup(statuses.ERROR, requiredMessage)
            view.renderForm(title, description)
            return 
        }
    

        const id = Math.random()
        const newNote = {
            id,
            title,
            description,
            color
        }
        this.notes.unshift(newNote)
        view.renderNotes(this.notes, this.showFavorites)
        view.renderPopup(statuses.SUCCESS, successMessage)
        view.renderForm("", "")
    },
    deleteNotes(id) {
        this.notes = this.notes.filter((note) => note.id !== id)
        view.renderNotes(this.notes)
        view.renderPopup(statuses.SUCCESS, deleteMessage)
    },
    addToFavorites(id) {
        const note = this.notes.find(item => item.id === id)
        note.isFavorite = !note.isFavorite;
        const noteindex = this.notes.findIndex(item => item.id === id)
        this.notes[noteindex] = note;
        view.renderNotes(this.notes)
    },
    filterFavorites(showFavorites) {
        this.showFavorites = showFavorites;
        view.renderNotes(this.notes, showFavorites);
    }
}

const form = document.querySelector('.form')
const inputTitle = document.querySelector('.input-title')
const inputDescription = document.querySelector('.input-description')
const radioButtons = document.querySelector('.radio-list')
const favoritesFilter = document.getElementById("favorites-filter")

const view = {
    init() {
        this.renderNotes(model.notes)
    },
    renderNotes(notes, showFavorites) {
        const list = document.querySelector(".notes-list")
        const count = document.querySelector(".notes-count")
        let visibleNotes = showFavorites ? notes.filter(item => item.isFavorite) : notes;
        let notesHTML = ''


        for (const note of visibleNotes) {
            notesHTML += `
            <li id="${note.id}" class="note ${note.color}">
              <b class="note-title">${note.title}</b>
              <p class="note-description">${note.description}</p>
               <button class="favorites-button" type="button"><img src="${note.isFavorite ? "assets/images/heart-active.png" : "assets/images/heart-inactive.png"}" alt="favorites"></button>
              <button class="delete-button" type="button"><img src="assets/images/trash.png" alt="delete"></button>
            </li>
          `
        }

        list.innerHTML = notesHTML
        count.textContent = notes.length

        if (!notes.length) {
            list.innerHTML = "<p class='empty-message'>У вас ещё нет ни одной заметки. Заполните поля выше и создайте свою первую заметку!</p>"
        }
    },
    renderPopup(className, innerHTML) {
        const messageBox = document.querySelector(".message-box")
        messageBox.classList.add(className)
        messageBox.innerHTML = innerHTML

        setTimeout(() => {
            messageBox.classList.remove(className)
            messageBox.innerHTML = "";
        }, 3000)
    },
    renderForm(title, description) {
        const firsRadioButton = document.querySelector(".yellow")
      inputTitle.value = title
      inputDescription.value = description
    if (title === "" || description === "") {
        firsRadioButton.checked = true
    }
    }
}


form.addEventListener("submit", function (event) {
    event.preventDefault()
    const title = inputTitle.value
    const description = inputDescription.value
    controller.addNote(title, description, selectedColor)
})

const list = document.querySelector(".notes-list")
list.addEventListener('click', function (e) {
    if (e.target.parentNode.className === 'delete-button') {
        controller.deleteNotes(+e.target.parentNode.parentNode.id)
    };
    if (e.target.parentNode.className === "favorites-button") {
        controller.addToFavorites(+e.target.parentNode.parentNode.id)
    };
})

favoritesFilter.addEventListener("click", function (e) {
    controller.filterFavorites(e.target.checked)
})


radioButtons.addEventListener('click', function (e) {
   selectedColor = e.target.value;
})







const controller = {
    addNote(title, description, color) {
        model.addNote(title, description, color)
    },
    deleteNotes(id) {
        model.deleteNotes(id)
    },
    addToFavorites(id) {
        model.addToFavorites(id)
    },
    filterFavorites(showFavorites) {
        model.filterFavorites(showFavorites)
    }
}

function init() {
    view.init()
}

init()