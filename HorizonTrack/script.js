function updateClock() {
  const now = new Date(); // Get the current time

  // Update digital time in 12-hour format with AM/PM in Philippine time
  const timeElement = document.querySelector('.b3');
  const ampmElement = document.querySelector('.ampm');
  if (timeElement && ampmElement) {
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Manila'
    });
    const [time, ampm] = timeString.split(' ');
    timeElement.textContent = time;
    ampmElement.textContent = ampm;
  }

  // Update date in Philippine time
  const dateElement = document.querySelector('.march-21-2025');
  if (dateElement) {
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Manila'
    });
    dateElement.textContent = dateString;
  }

  // Update day in Philippine time
  const dayElement = document.querySelector('.friday');
  if (dayElement) {
    const dayString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'Asia/Manila'
    });
    dayElement.textContent = dayString;
  }

  // Declare clock hand elements
  const hourHand = document.querySelector('.hour-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const secondHand = document.querySelector('.second-hand');

  // Get current hours, minutes, and seconds for analog clock in Philippine time using Intl.DateTimeFormat
  const phTimeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const phTimeParts = phTimeFormatter.formatToParts(now);
  const hours = parseInt(phTimeParts.find(p => p.type === 'hour').value) % 12; // 0-11
  const minutes = parseInt(phTimeParts.find(p => p.type === 'minute').value);
  const seconds = parseInt(phTimeParts.find(p => p.type === 'second').value);

  // Calculate angles for 12-hour analog clock (360 degrees = full circle, 30 degrees per hour)
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute adjustment (0.5 per minute)
  const minuteAngle = minutes * 6; // 6 degrees per minute
  const secondAngle = seconds * 6; // 6 degrees per second

  // Apply rotations to clock hands
  if (hourHand) {
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
  }

  if (minuteHand) {
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
  }

  if (secondHand) {
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
  }
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call to set the time immediately

// Clock functionality - only if on dashboard
if (document.querySelector('.b3')) {
  updateClock(); // Initial call to set the time immediately
  setInterval(updateClock, 1000); // Update the clock every second
}

// Calendar functionality
const now = new Date();
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});
const dateParts = dateFormatter.formatToParts(now);
const phYear = parseInt(dateParts.find(part => part.type === 'year').value, 10);
const phMonth = parseInt(dateParts.find(part => part.type === 'month').value, 10) - 1; // 0-indexed
const phDay = parseInt(dateParts.find(part => part.type === 'day').value, 10);

let currentMonth = phMonth;
let currentYear = phYear;

const monthElement = document.querySelector('.march-2025') || document.querySelector('.august-2025');
const leftArrow = document.querySelector('.arrow-prev-small-svgrepo-com-1-icon') || document.querySelector('.arrow-prev-small-svgrepo-com-1');
const rightArrow = document.querySelector('.arrow-prev-small-svgrepo-com-2-icon') || document.querySelector('.arrow-prev-small-svgrepo-com-2');

// Date elements - get all calendar date elements
let dateElements = Array.from(document.querySelectorAll('.dates div')).filter(el => el.textContent.trim() !== '' || el.classList.contains('today'));

// Sort by top position, then left position to match grid order
if (dateElements.length > 0) {
  dateElements.sort((a, b) => {
    const aTop = parseInt(getComputedStyle(a).top);
    const bTop = parseInt(getComputedStyle(b).top);
    if (aTop !== bTop) return aTop - bTop;
    const aLeft = parseInt(getComputedStyle(a).left);
    const bLeft = parseInt(getComputedStyle(b).left);
    return aLeft - bLeft;
  });
}

function renderCalendar(month, year) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const phToday = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
  const isCurrentMonth = month === phToday.getMonth() && year === phToday.getFullYear();
  const todayDate = isCurrentMonth ? phToday.getDate() : -1;

  // Calculate starting index for Sunday-start calendar
  const startingIndex = firstDay; // 0 = Sunday

  // Update month/year display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (monthElement) {
    monthElement.textContent = `${monthNames[month]} ${year}`;
  }

  // Clear dates
  dateElements.forEach(el => {
    el.textContent = '';
    el.classList.remove('today-highlight', 'prev-month', 'next-month');
  });

  // Fill previous month days from the beginning
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  let prevDay = daysInPrevMonth - startingIndex + 1;
  for (let i = 0; i < startingIndex; i++) {
    if (dateElements[i]) {
      dateElements[i].textContent = prevDay;
      dateElements[i].classList.add('prev-month');
      prevDay++;
    }
  }

  // Fill current month days
  let day = 1;
  let dateIndex = startingIndex;
  while (day <= daysInMonth && dateIndex < dateElements.length) {
    if (dateElements[dateIndex]) {
      dateElements[dateIndex].textContent = day;
      if (day === todayDate) {
        dateElements[dateIndex].classList.add('today-highlight');
      }
      day++;
    }
    dateIndex++;
  }

  // Fill next month days
  let nextDay = 1;
  while (dateIndex < dateElements.length) {
    if (dateElements[dateIndex]) {
      dateElements[dateIndex].textContent = nextDay;
      dateElements[dateIndex].classList.add('next-month');
      nextDay++;
    }
    dateIndex++;
  }
}

// Event listeners for arrows
if (leftArrow) {
  leftArrow.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });
}

if (rightArrow) {
  rightArrow.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
}

// Initial render
if (monthElement && dateElements.length > 0) {
  renderCalendar(currentMonth, currentYear);
}

// Sidebar toggle functionality
const hideSidebarBtn = document.querySelector('#hideSidebarIcon');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.dashboard-sbon-light');

if (hideSidebarBtn && sidebar) {
  hideSidebarBtn.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-hidden');
    if (mainContent) {
      mainContent.classList.toggle('sidebar-collapsed');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Login functionality - only if on login page
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username && password) {
        const button = document.querySelector('.login-button');
        button.textContent = 'Logging in...';
        button.disabled = true;

        try {
          const response = await fetch('login.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
          });

          const data = await response.json();

          if (data.success) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'dashboard.html';
          } else {
            alert(data.message);
            button.textContent = 'Login';
            button.disabled = false;
          }
        } catch (error) {
          alert('An error occurred. Please try again.');
          button.textContent = 'Login';
          button.disabled = false;
        }
      }
    });

    // Add focus effects for better accessibility
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });

      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
    });
  }

  // Signup functionality - only if on signup page
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username && password) {
        const button = document.querySelector('.login-button');
        button.textContent = 'Signing up...';
        button.disabled = true;

        try {
          const response = await fetch('signup.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
          });

          const data = await response.json();

          if (data.success) {
            alert('Signup successful! Redirecting to login...');
            window.location.href = 'login.html';
          } else {
            alert(data.message);
            button.textContent = 'Sign Up';
            button.disabled = false;
          }
        } catch (error) {
          alert('An error occurred. Please try again.');
          button.textContent = 'Sign Up';
          button.disabled = false;
        }
      }
    });

    // Add focus effects for better accessibility
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });

      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
    });
  }

  // Sidebar navigation functionality
  const dashboardLink = document.querySelector('.dashboard') || document.querySelector('.sb-hover-dsh');
  if (dashboardLink) {
    dashboardLink.addEventListener('click', function() {
      window.location.href = 'dashboard.html';
    });
  }

  const calendarLink = document.querySelector('.calendar') || document.querySelector('.sb-hover-cal');
  if (calendarLink) {
    calendarLink.addEventListener('click', function() {
      window.location.href = 'calendar.html';
    });
  }

  const employeesLink = document.querySelector('.employees') || document.querySelector('.sb-hover-emp');
  if (employeesLink) {
    employeesLink.addEventListener('click', function() {
      window.location.href = 'employees.html';
    });
  }

  const projectsLink = document.querySelector('.projects') || document.querySelector('.sb-hover-prj');
  if (projectsLink) {
    projectsLink.addEventListener('click', function() {
      window.location.href = 'projects.html';
    });
  }

  const attendanceLink = document.querySelector('.attendance') || document.querySelector('.sb-hover-att');
  if (attendanceLink) {
    attendanceLink.addEventListener('click', function() {
      window.location.href = 'attendance.html';
    });
  }

  // Attendance functionality - available on all pages
  const timeInBtn = document.querySelector('.time-in-hover');
  if (timeInBtn) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }
    // Load employees data
    let employees = {};
    fetch('employees.json')
      .then(response => response.json())
      .then(data => {
        employees = data.employees;
        const currentUser = localStorage.getItem('currentUser') || 'Jayce'; // Default to 'Jayce' if not set
        const employee = employees[currentUser];
        if (employee) {
          // Load attendance data from localStorage
          let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

          // Set initial button state based on last entry
          const lastEntry = attendanceData[attendanceData.length - 1];
          const btnTextElement = timeInBtn.querySelector('.attendance-sbon-light-time-in') || timeInBtn.querySelector('.dashboard-sbon-light-time-in') || timeInBtn.querySelector('.calendarmonth-sbon-light-time-in') || timeInBtn.querySelector('.employees-sbon-light-time-in') || timeInBtn.querySelector('.projects-sbon-light-time-in');
          if (lastEntry && lastEntry.status === 'IN') {
            btnTextElement.textContent = 'Time Out';
            btnTextElement.style.whiteSpace = 'nowrap';
          } else {
            btnTextElement.textContent = 'Time In';
            btnTextElement.style.whiteSpace = 'nowrap';
          }

          timeInBtn.addEventListener('click', function() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Manila'
            });
            const dateString = now.toLocaleDateString('en-US', {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'Asia/Manila'
            });

            const lastEntry = attendanceData[attendanceData.length - 1];
            if (lastEntry && lastEntry.status === 'IN') {
              // Time Out
              const newEntry = {
                status: 'OUT',
                time: timeString,
                date: dateString,
                fullName: employee.fullName,
                employeeID: employee.employeeID
              };
              attendanceData.push(newEntry);
            } else {
              // Time In
              const newEntry = {
                status: 'IN',
                time: timeString,
                date: dateString,
                fullName: employee.fullName,
                employeeID: employee.employeeID
              };
              attendanceData.push(newEntry);
            }

            // Save to localStorage
            localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
            // Redirect to attendance.html to view updated live attendance
            window.location.href = 'attendance.html';
          });
        }
      })
      .catch(error => console.error('Error loading employees:', error));
  }

  // Attendance page specific rendering
  if (document.querySelector('.live-attendance')) {
    const currentUser = localStorage.getItem('currentUser') || 'Jayce';
    fetch('employees.json')
      .then(response => response.json())
      .then(data => {
        const employee = data.employees[currentUser];
        if (employee) {
          let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
          renderLiveAttendance(attendanceData, employee);
        }
      })
      .catch(error => console.error('Error loading employees:', error));
  }

  function renderLiveAttendance(attendanceData, currentEmployee) {
    const liveAttendanceDiv = document.querySelector('.live-attendance');
    if (!liveAttendanceDiv) return;

    // Get today's date in the same format as stored
    const now = new Date();
    const today = now.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Manila'
    });

    // Filter attendanceData to only today's entries for the current employee
    const todaysEntries = attendanceData.filter(entry => entry.date === today && entry.fullName === currentEmployee.fullName);

    // Clear existing entries except the header
    const existingEntries = liveAttendanceDiv.querySelectorAll('.gats, .jayceout, .jus, .leb, .ethan, .jaycein');
    existingEntries.forEach(entry => entry.remove());

    // Find the latest IN and OUT entries for the day
    const latestIn = todaysEntries.filter(entry => entry.status === 'IN').pop();
    const latestOut = todaysEntries.filter(entry => entry.status === 'OUT').pop();

    // Create a list of alternating IN and OUT (latest IN first, then latest OUT)
    const entriesToShow = [];
    if (latestIn) entriesToShow.push(latestIn);
    if (latestOut) entriesToShow.push(latestOut);

    // Add the entries to the display
    entriesToShow.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = entry.status === 'IN' ? 'jaycein' : 'jayceout'; // Use existing classes
      entryDiv.innerHTML = `
        <div class="${entry.status === 'IN' ? 'attendance-sbon-light-in' : 'attendance-sbon-light-out'}">${entry.status}</div>
        <div class="${entry.status === 'IN' ? 'attendance-sbon-light-jayce-bruce-nanual-container' : 'jayce-bruce-nanual-container'}">
          <span class="span">${entry.time} ${entry.date}</span>
          <span> - ${entry.fullName} - ${entry.employeeID}</span>
        </div>
        <div class="${entry.status === 'IN' ? 'jaycein-child' : 'jayceout-child'}"></div>
      `;
      liveAttendanceDiv.appendChild(entryDiv);
    });
  }
});
