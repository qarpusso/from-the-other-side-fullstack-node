import { sendResponse } from '../utils/sendResponse.js'
import { parseJSONBody } from '../utils/parseJSONBody.js'
import { sanitizeInput } from '../utils/sanitizeInput.js'
import { getHabits as loadHabits, saveHabits, getHabitLogs as loadHabitLogs, saveHabitLogs } from '../utils/fileStorage.js'
import { randomUUID } from 'crypto'

export async function getHabits(res) {
  try {
    const habits = await loadHabits()
    sendResponse(res, 200, 'application/json', JSON.stringify(habits))
  } catch (err) {
    sendResponse(res, 500, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function createHabit(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const sanitizedBody = sanitizeInput(parsedBody)

    const newHabit = {
      id: randomUUID(),
      name: sanitizedBody.name,
      description: sanitizedBody.description || '',
      frequency: sanitizedBody.frequency || 'daily',
      created_at: new Date().toISOString()
    }

    const habits = await loadHabits()
    habits.push(newHabit)
    await saveHabits(habits)

    sendResponse(res, 201, 'application/json', JSON.stringify(newHabit))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function deleteHabit(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const { id } = parsedBody

    let habits = await loadHabits()
    habits = habits.filter(h => h.id !== id)
    await saveHabits(habits)

    let logs = await loadHabitLogs()
    logs = logs.filter(l => l.habit_id !== id)
    await saveHabitLogs(logs)

    sendResponse(res, 200, 'application/json', JSON.stringify({ success: true }))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function getHabitLogs(res) {
  try {
    const logs = await loadHabitLogs()
    const habits = await loadHabits()

    const logsWithHabits = logs.map(log => {
      const habit = habits.find(h => h.id === log.habit_id)
      return {
        ...log,
        habits: habit ? { name: habit.name, frequency: habit.frequency } : null
      }
    })

    sendResponse(res, 200, 'application/json', JSON.stringify(logsWithHabits))
  } catch (err) {
    sendResponse(res, 500, 'application/json', JSON.stringify({ error: err.message }))
  }
}

export async function logHabit(req, res) {
  try {
    const parsedBody = await parseJSONBody(req)
    const sanitizedBody = sanitizeInput(parsedBody)

    const newLog = {
      id: randomUUID(),
      habit_id: sanitizedBody.habit_id,
      completed_at: new Date().toISOString(),
      notes: sanitizedBody.notes || ''
    }

    const logs = await loadHabitLogs()
    logs.push(newLog)
    await saveHabitLogs(logs)

    sendResponse(res, 201, 'application/json', JSON.stringify(newLog))
  } catch (err) {
    sendResponse(res, 400, 'application/json', JSON.stringify({ error: err.message }))
  }
}
