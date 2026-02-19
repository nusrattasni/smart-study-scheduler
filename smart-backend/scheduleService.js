// Inside services/scheduleService.js (Focusing on the changes)

// --- Configuration & Helpers ---

// 💡 Default Available Time Slots (In 24-hour format and minutes from midnight)
// This is a simplification. In a real app, this would come from a User model setting.
const DEFAULT_AVAILABILITY = {
    // Example: Mon - Fri: 9:00 AM to 12:00 PM (180 mins) AND 6:00 PM to 9:00 PM (180 mins)
    // Sat - Sun: 10:00 AM to 4:00 PM (360 mins)
    'Mon': [{ start: 9 * 60, end: 12 * 60 }, { start: 18 * 60, end: 21 * 60 }],
    'Tue': [{ start: 9 * 60, end: 12 * 60 }, { start: 18 * 60, end: 21 * 60 }],
    'Wed': [{ start: 9 * 60, end: 12 * 60 }, { start: 18 * 60, end: 21 * 60 }],
    'Thu': [{ start: 9 * 60, end: 12 * 60 }, { start: 18 * 60, end: 21 * 60 }],
    'Fri': [{ start: 9 * 60, end: 12 * 60 }, { start: 18 * 60, end: 21 * 60 }],
    'Sat': [{ start: 10 * 60, end: 16 * 60 }],
    'Sun': [{ start: 10 * 60, end: 16 * 60 }],
};

// Helper to convert minutes (from midnight) to HH:MM format
const formatMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
};


// --- CORE SCHEDULING ALGORITHM (MODIFIED) ---

export const generateScheduleForUser = async (userId) => {
    // ... (Steps 1, 2, 3, 4 remain largely the same: fetching tasks, sorting) ...
    
    // 4. Initialize Weekly Schedule and Available Time
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let dailyCapacityRemaining = {}; // Total capacity in minutes
    let dailyCurrentTime = {};      // Tracks the NEXT available start time for a slot
    let generatedSchedule = [];
    
    // Initialize both capacity and the first available start time for each day/slot
    for (const day of days) {
        dailyCapacityRemaining[day] = DEFAULT_AVAILABILITY[day].map(slot => slot.end - slot.start);
        dailyCurrentTime[day] = DEFAULT_AVAILABILITY[day].map(slot => slot.start);
    }
    
    // 5. Distribute Tasks Across the Week (The "Smart" part)
    for (const task of tasks) {
        let workLeft = task.duration; 

        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
            if (workLeft <= 0) break;
            
            const day = days[dayIndex];
            const slots = DEFAULT_AVAILABILITY[day];

            // Iterate through the available slots of the current day
            for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
                if (workLeft <= 0) break;
                
                const slotCapacity = slots[slotIndex].end - dailyCurrentTime[day][slotIndex];
                
                // Calculate the session time: limited by Work Left, Slot Capacity, Preferred Block Size
                let sessionTime = Math.min(
                    workLeft, 
                    slotCapacity, 
                    sessionMins 
                );

                if (sessionTime > 15) { 
                    const startTimeMinutes = dailyCurrentTime[day][slotIndex];
                    
                    // Add the study block to the schedule
                    generatedSchedule.push({
                        taskId: task._id,
                        day: day,
                        subject: task.subject,
                        duration: sessionTime,
                        // 💡 NEW: Calculate the formatted start time
                        startTime: formatMinutesToTime(startTimeMinutes), 
                    });

                    // Update remaining work and capacity
                    workLeft -= sessionTime;
                    dailyCurrentTime[day][slotIndex] += sessionTime; // Move the start time forward
                }
            }
        }
        
        // ... (Console warning for spillover remains) ...
    }

    return generatedSchedule;
};