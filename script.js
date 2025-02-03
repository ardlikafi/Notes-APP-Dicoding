// Custom Element 1: Note Card
class NoteCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'body', 'archived', 'created-at'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('note-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.shadowRoot.querySelector('.note-title').textContent = newValue;
        } else if (name === 'body') {
            this.shadowRoot.querySelector('.note-body').textContent = newValue;
        } else if (name === 'archived') {
            const archivedBadge = this.shadowRoot.querySelector('.archived-badge');
            archivedBadge.style.display = newValue === 'true' ? 'inline' : 'none';
        } else if (name === 'created-at') {
            // Tampilkan langsung ISO string
            this.shadowRoot.querySelector('.created-at').textContent = `Created at: ${newValue}`;
        }
    }
}

// Custom Element 2: App Header
class AppHeader extends HTMLElement {
    static get observedAttributes() {
        return ['title'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('app-header-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.shadowRoot.querySelector('h1').textContent = newValue;
        }
    }
}

// Custom Element 3: Input Error
class InputError extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('input-error-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'message') {
            this.shadowRoot.querySelector('.error-message').textContent = newValue;
        }
    }
}

// Daftarkan semua custom element
customElements.define('note-card', NoteCard);
customElements.define('app-header', AppHeader);
customElements.define('input-error', InputError);

// Data Loading and Display
function displayNotes() {
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';
    notesData.forEach(note => {
        const noteCard = document.createElement('note-card');
        noteCard.setAttribute('title', note.title);
        noteCard.setAttribute('body', note.body);
        noteCard.setAttribute('archived', note.archived);
        noteCard.setAttribute('created-at', note.createdAt);
        noteList.appendChild(noteCard);
    });
}

// Form Handling dan Validation
const addNoteForm = document.getElementById('add-note-form');
const noteTitleInput = document.getElementById('note-title');
const noteBodyInput = document.getElementById('note-body');
const titleError = document.getElementById('title-error');
const bodyError = document.getElementById('body-error');

noteTitleInput.addEventListener('input', () => validateTitle());
noteBodyInput.addEventListener('input', () => validateBody());

function validateTitle() {
    const title = noteTitleInput.value.trim();
    if (!title) {
        titleError.setAttribute('message', 'Title cannot be empty');
        return false;
    }
    titleError.setAttribute('message', '');
    return true;
}

function validateBody() {
    const body = noteBodyInput.value.trim();
    if (!body) {
        bodyError.setAttribute('message', 'Body cannot be empty');
        return false;
    }
    bodyError.setAttribute('message', '');
    return true;
}

addNoteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateTitle() && validateBody()) {
        const newNote = {
            id: `notes-${Math.random().toString(36).substring(2, 15)}`,
            title: noteTitleInput.value,
            body: noteBodyInput.value,
            createdAt: new Date().toISOString(),
            archived: false
        };
        notesData.push(newNote);
        displayNotes();
        noteTitleInput.value = '';
        noteBodyInput.value = '';
    }
});

// Inisialisasi awal
window.addEventListener('DOMContentLoaded', () => {
    displayNotes();
});