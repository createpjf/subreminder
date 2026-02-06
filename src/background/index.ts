chrome.runtime.onInstalled.addListener(() => {
  console.log('SubReminder installed')

  chrome.alarms.create('daily-billing-check', {
    periodInMinutes: 1440,
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-billing-check') {
    console.log('Daily billing check alarm fired')
  }
})
