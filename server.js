import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { getHabits, createHabit, deleteHabit, getHabitLogs, logHabit } from './handlers/habitsHandlers.js'
import { getNotes, createNote, updateNote, deleteNote } from './handlers/notesHandlers.js'

const PORT = 8000

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {

    if (req.url === '/api/habits') {
        if (req.method === 'GET') {
            return await getHabits(res)
        } else if (req.method === 'POST') {
            return await createHabit(req, res)
        }
    }

    else if (req.url === '/api/habits/delete') {
        if (req.method === 'POST') {
            return await deleteHabit(req, res)
        }
    }

    else if (req.url === '/api/habits/log') {
        if (req.method === 'GET') {
            return await getHabitLogs(res)
        } else if (req.method === 'POST') {
            return await logHabit(req, res)
        }
    }

    else if (req.url === '/api/notes') {
        if (req.method === 'GET') {
            return await getNotes(res)
        } else if (req.method === 'POST') {
            return await createNote(req, res)
        }
    }

    else if (req.url === '/api/notes/update') {
        if (req.method === 'POST') {
            return await updateNote(req, res)
        }
    }

    else if (req.url === '/api/notes/delete') {
        if (req.method === 'POST') {
            return await deleteNote(req, res)
        }
    }

    else if (!req.url.startsWith('/api')) {
        return await serveStatic(req, res, __dirname)
    }
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))
