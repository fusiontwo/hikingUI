const metrics = [
    {
      userId: 'BZPGGB',
      date: '2024-04-30',
      calories: { total: 111 },
      steps: { total: 2076 },
      duration: { total: 1640000 },
      distance: {
        total: 1.74,
        veryActive: 0.29,
        moderatelyActive: 0.61,
        lightlyActive: 0.84,
        sedentaryActive: 0
      }
    }
  ]

  const subscribeHealthMetrics = async () => {
    const metrics = await MessageQueue.subscribe()
  
    const tableRows = metrics.map((metric) => {
      const tableRow = document.createElement('tr')
  
    //   const userIdColumn = document.createElement('td.user-id')
      const userIdColumn = document.createElement('td')
      userIdColumn.classList.add('userId');
      userIdColumn.innerHTML = metric.userId
  
      const weeklyHKTmColumn = document.createElement('td')
      weeklyHKTmColumn.classList.add('weeklyHkTm');
      weeklyHKTmColumn.innerHTML = metric.calories.total
      
      const weeklyHkDistColumn = document.createElement('td')
      weeklyHkDistColumn.classList.add('weeklyHkDist');
      weeklyHkDistColumn.innerHTML = metric.calories.total

    //   const caloryColumn = document.createElement('td.calories')
      const caloryColumn = document.createElement('td')
      caloryColumn.classList.add('calories');
      caloryColumn.innerHTML = metric.calories.total
  
      tableRow.appendChild(userIdColumn)
      tableRow.appendChild(caloryColumn)
  
      return tableRow
    })
  
    const parent = document.querySelector('table > tbody')
    tableRows.forEach((row) => {
      parent.append(row)
    })
  }
  
  setInterval(subscribeHealthMetrics, 1000)
