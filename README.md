# ⏱️ Timesheet Tracker

![Status](https://img.shields.io/badge/Status-Active-green?style=for-the-badge)
![Built With](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20Firebase-blue?style=for-the-badge)

---

## Overview

**Timesheet Tracker** is a full-stack application designed to help companies **track employee work hours efficiently**. Users can start a timer for their work, pause or resume as needed, and stop the timer at the end of the day. Each action requires a **message**, similar to a commit message, describing the activity — for example, `"Coffee break"` when pausing or `"Done for the day: completed feature X"` when stopping.

All user activities are **authenticated and stored in Firebase**, and the timer persists locally so refreshing the page does not reset the work log. This ensures **accurate and continuous tracking** of work hours.

---

## Key Features

- ⏱️ **Start, Pause, Resume, Stop timer** for work sessions  
- 📝 **Action messages** for each timer event (pause, resume, stop)   
- 🔐 **User authentication** via Firebase  
- ☁️ **Data storage in Firebase** for secure and scalable logging  
- 📊 **Track all work hours** with timestamps and messages  

---

## How It Works

1. User **logs in** using Firebase Authentication.  
2. User starts the **work timer**.  
3. On **pausing**, **resuming**, or **stopping** the timer, the user is prompted to enter a **message describing the action**.  
4. All actions are **recorded locally** and synced with **Firebase**.  
5. If the page is refreshed, the **timer state is restored** and activity continues to be tracked.  

---

## Tech Stack

- **Frontend:** React  
- **Backend:** Node.js 
- **Database:** Firebase Firestore  
- **Authentication:** Firebase Auth  

---