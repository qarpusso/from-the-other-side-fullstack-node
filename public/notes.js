let notes = []
let currentNote = null

async function loadNotes() {
  try {
    const response = await fetch('/api/notes')
    notes = await response.json()
    renderNotesList()
  } catch (err) {
    console.error('Error loading notes:', err)
  }
}

function renderNotesList() {
  const container = document.getElementById('notesList')

  if (notes.length === 0) {
    container.innerHTML = '<p style="color: #ccc; font-size: 0.85rem; text-align: center;">No notes yet</p>'
    return
  }

  let notesHTML = ''
  notes.forEach(note => {
    const date = new Date(note.updated_at).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    })

    const isActive = currentNote && currentNote.id === note.id ? 'active' : ''

    notesHTML += `
      <div class="note-item ${isActive}" onclick="selectNote('${note.id}')">
        <h4>${note.title || 'Untitled'}</h4>
        <p>${date}</p>
      </div>
    `
  })

  container.innerHTML = notesHTML
}

window.selectNote = function(noteId) {
  const note = notes.find(n => n.id === noteId)
  if (note) {
    currentNote = note
    showEditor()
    document.getElementById('noteTitle').value = note.title
    document.getElementById('noteContent').value = note.content
    renderNotesList()
    updatePreview()
  }
}

function showEditor() {
  document.getElementById('emptyState').style.display = 'none'
  document.getElementById('editorArea').style.display = 'block'
  closePreview()
}

function hideEditor() {
  document.getElementById('emptyState').style.display = 'flex'
  document.getElementById('editorArea').style.display = 'none'
  currentNote = null
  renderNotesList()
}

function togglePreview() {
  const overlay = document.getElementById('previewOverlay')
  const isVisible = overlay.classList.contains('active')
  
  if (!isVisible) {
    updatePreview()
    overlay.classList.add('active')
  } else {
    overlay.classList.remove('active')
  }
}

function closePreview() {
  document.getElementById('previewOverlay').classList.remove('active')
}

function updatePreview() {
  const title = document.getElementById('noteTitle').value
  const content = document.getElementById('noteContent').value
  document.getElementById('previewTitle').textContent = title || 'Untitled Note'
  document.getElementById('markdownPreview').innerHTML = parseMarkdown(content)
}

function parseMarkdown(text) {
  if (!text) return '<p style="color: var(--text-muted)">Empty note...</p>'
  
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')

  return `<p>${html}</p>`
}

document.getElementById('previewBtn').addEventListener('click', togglePreview)
document.getElementById('closePreviewBtn').addEventListener('click', closePreview)

document.getElementById('newNoteBtn').addEventListener('click', async function() {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'New Note',
        content: ''
      })
    })

    if (response.ok) {
      const newNote = await response.json()
      await loadNotes()
      selectNote(newNote.id)
    }
  } catch (err) {
    console.error('Error creating note:', err)
    alert('Failed to create note. Please try again.')
  }
})

document.getElementById('saveNoteBtn').addEventListener('click', async function() {
  if (!currentNote) return

  const title = document.getElementById('noteTitle').value
  const content = document.getElementById('noteContent').value

  try {
    const response = await fetch('/api/notes/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: currentNote.id,
        title: title || 'Untitled',
        content
      })
    })

    if (response.ok) {
      await loadNotes()
      const updatedNote = notes.find(n => n.id === currentNote.id)
      if (updatedNote) {
        currentNote = updatedNote
      }
      alert('Note saved successfully!')
    }
  } catch (err) {
    console.error('Error saving note:', err)
    alert('Failed to save note. Please try again.')
  }
})

document.getElementById('deleteNoteBtn').addEventListener('click', async function() {
  if (!currentNote) return

  if (!confirm('Are you sure you want to delete this note?')) {
    return
  }

  try {
    const response = await fetch('/api/notes/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: currentNote.id })
    })

    if (response.ok) {
      await loadNotes()
      hideEditor()
    }
  } catch (err) {
    console.error('Error deleting note:', err)
    alert('Failed to delete note. Please try again.')
  }
})

document.getElementById('cancelEditBtn').addEventListener('click', function() {
  hideEditor()
})

// document.getElementById('noteContent').addEventListener('input', updatePreview)

loadNotes()
