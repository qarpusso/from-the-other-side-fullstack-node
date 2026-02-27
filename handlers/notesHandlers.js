import { sendResponse } from '../utils/sendResponse.js'
import { parseJSONBody } from '../utils/parseJSONBody.js'
import { sanitizeInput } from '../utils/sanitizeInput.js'
import { getNotes as loadNotes, saveNotes } from '../utils/fileStorage.js'
import { randomUUID } from 'crypto'

export async function getNotes(res) {
  try {
    const notes = await loadNotes()
    const sorted = notes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    sendResponse(res, 200, 'application/json', JSON.stringify(sorted))
  } catch (err) {
    sendResponse(res, 500, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function createNote(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const sanitizedBody = sanitizeInput(parsedBody)

    const newNote = {
      id: randomUUID(),
      title: sanitizedBody.title,
      content: sanitizedBody.content || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const notes = await loadNotes()
    notes.push(newNote)
    await saveNotes(notes)

    sendResponse(res, 201, 'application/json', JSON.stringify(newNote))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function updateNote(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const sanitizedBody = sanitizeInput(parsedBody)

    let notes = await loadNotes()
    const noteIndex = notes.findIndex(n => n.id === sanitizedBody.id)

    if (noteIndex === -1) {
      sendResponse(res, 404, 'application/json', JSON.stringify({ error: 'Note not found' }))
      return
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      title: sanitizedBody.title,
      content: sanitizedBody.content,
      updated_at: new Date().toISOString()
    }

    await saveNotes(notes)
    sendResponse(res, 200, 'application/json', JSON.stringify(notes[noteIndex]))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function deleteNote(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const { id } = parsedBody

    let notes = await loadNotes()
    notes = notes.filter(n => n.id !== id)
    await saveNotes(notes)

    sendResponse(res, 200, 'application/json', JSON.stringify({ success: true }))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err.message }))
  }
}
