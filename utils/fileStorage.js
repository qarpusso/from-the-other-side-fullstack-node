import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../data')

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (err) {
    console.error('Error creating data directory:', err)
  }
}

async function readFile(filename) {
  try {
    const filePath = path.join(dataDir, filename)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    return null
  }
}

async function writeFile(filename, data) {
  try {
    await ensureDataDir()
    const filePath = path.join(dataDir, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Error writing file:', err)
    return false
  }
}

export async function getHabits() {
  const data = await readFile('habits.json')
  return data || []
}

export async function saveHabits(habits) {
  return await writeFile('habits.json', habits)
}

export async function getHabitLogs() {
  const data = await readFile('habitLogs.json')
  return data || []
}

export async function saveHabitLogs(logs) {
  return await writeFile('habitLogs.json', logs)
}

export async function getNotes() {
  const data = await readFile('notes.json')
  return data || []
}

export async function saveNotes(notes) {
  return await writeFile('notes.json', notes)
}
