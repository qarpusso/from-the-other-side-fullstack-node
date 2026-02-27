let habits = []
let habitLogs = []

async function loadHabits() {
  try {
    const response = await fetch('/api/habits')
    habits = await response.json()
    renderHabits()
  } catch (err) {
    console.error('Error loading habits:', err)
  }
}

async function loadHabitHistory() {
  try {
    const response = await fetch('/api/habits/log')
    habitLogs = await response.json()
    renderHistory()
  } catch (err) {
    console.error('Error loading habit history:', err)
  }
}

function renderHabits() {
  const container = document.getElementById('habitsList')

  if (habits.length === 0) {
    container.innerHTML = '<p style="color: #ccc; text-align: center;">No habits yet. Add one above!</p>'
    return
  }

  let habitsHTML = ''
  habits.forEach(habit => {
    habitsHTML += `
      <div class="habit-item">
        <div class="habit-info">
          <h3>${habit.name}</h3>
          <p>${habit.description || ''} - ${habit.frequency}</p>
        </div>
        <div class="habit-actions">
          <button class="check-btn" onclick="checkOffHabit('${habit.id}', '${habit.name}')">Check Off</button>
          <button class="delete-habit-btn" onclick="deleteHabit('${habit.id}')">Delete</button>
        </div>
      </div>
    `
  })

  container.innerHTML = habitsHTML
}

function renderHistory() {
  const container = document.getElementById('habitHistory')

  if (habitLogs.length === 0) {
    container.innerHTML = '<p style="color: #ccc; text-align: center;">No activity yet. Start tracking!</p>'
    return
  }

  let historyHTML = ''
  habitLogs.slice(0, 10).forEach(log => {
    const date = new Date(log.completed_at).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    historyHTML += `
      <div class="history-item">
        <strong>${log.habits?.name || 'Unknown'}</strong> completed on ${date}
        ${log.notes ? `<br><em>${log.notes}</em>` : ''}
      </div>
    `
  })

  container.innerHTML = historyHTML
}

window.checkOffHabit = async function(habitId, habitName) {
  const notes = prompt(`Add notes for "${habitName}" (optional):`)

  try {
    const response = await fetch('/api/habits/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        habit_id: habitId,
        notes: notes || ''
      })
    })

    if (response.ok) {
      await loadHabitHistory()
    }
  } catch (err) {
    console.error('Error checking off habit:', err)
    alert('Failed to log habit. Please try again.')
  }
}

window.deleteHabit = async function(habitId) {
  if (!confirm('Are you sure you want to delete this habit?')) {
    return
  }

  try {
    const response = await fetch('/api/habits/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: habitId })
    })

    if (response.ok) {
      await loadHabits()
      await loadHabitHistory()
    }
  } catch (err) {
    console.error('Error deleting habit:', err)
    alert('Failed to delete habit. Please try again.')
  }
}

document.getElementById('habitForm').addEventListener('submit', async function(e) {
  e.preventDefault()

  const name = document.getElementById('habitName').value
  const description = document.getElementById('habitDescription').value
  const frequency = document.getElementById('habitFrequency').value

  try {
    const response = await fetch('/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        frequency
      })
    })

    if (response.ok) {
      document.getElementById('habitForm').reset()
      await loadHabits()
    }
  } catch (err) {
    console.error('Error creating habit:', err)
    alert('Failed to create habit. Please try again.')
  }
})

loadHabits()
loadHabitHistory()
