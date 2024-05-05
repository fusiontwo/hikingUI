const dummyMetrics = [
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
    },
    {
      userId: 'BZPGGB',
      date: '2024-05-01',
      calories: { total: 242 },
      steps: { total: 4256 },
      duration: { total: 3077000 },
      distance: {
        total: 5.18,
        veryActive: 2.93,
        moderatelyActive: 1.19,
        lightlyActive: 0.98,
        sedentaryActive: 0
      }
    },
    {
      userId: 'kyu',
      date: '2024-05-01',
      calories: { total: 0 },
      steps: { total: 0 },
      duration: { total: 0 },
      distance: {}
    }
  ]
  const dummyPublishFunc = client.publish('hikingMetrics', JSON.stringify(dummyMetrics))
  setInterval(dummyPublishFunc, 5000)