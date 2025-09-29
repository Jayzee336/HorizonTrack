function updateClock() {
  const now = new Date();
  
  // Update digital time
  const timeString = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.querySelector('._09-22-30').textContent = timeString;
  
  // Update date
  const dateString = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.querySelector('.march-21-2025').textContent = dateString;
  
  // Update day
  const dayString = now.toLocaleDateString('en-US', { weekday: 'long' });
  document.querySelector('.friday').textContent = dayString;
  
  // Update analog clock hands
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Calculate angles (360 degrees = full circle)
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute adjustment
  const minuteAngle = minutes * 6; // 6 degrees per minute
  const secondAngle = seconds * 6; // 6 degrees per second
  
  // Apply rotations to clock hands
  const hourHand = document.querySelector('.hour-line');
  const minuteHand = document.querySelector('.minute-line');
  const secondHand = document.querySelector('.seconds-line');

  if (hourHand) {
    hourHand.style.transform = `rotate(${hourAngle - 90}deg)`;
  }

  if (minuteHand) {
    minuteHand.style.transform = `rotate(${minuteAngle - 90}deg)`;
  }

  if (secondHand) {
    secondHand.style.transform = `rotate(${secondAngle - 90}deg)`;
  }
}

// Clock functionality - only if on dashboard
if (document.querySelector('._09-22-30')) {
  updateClock();
  setInterval(updateClock, 1000);
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

const monthElement = document.querySelector('.august-2025');
const leftArrow = document.querySelector('.arrow-prev-small-svgrepo-com-1');
const rightArrow = document.querySelector('.arrow-prev-small-svgrepo-com-2');

// Date elements - get all calendar date elements
const dateSelectors = ['._1', '._2', '._3', '._4', '._5', '._6', '._7', '._8', '._9', '._10',
                      '._11', '._12', '._13', '._14', '._15', '._16', '._17', '._18', '._19', '._20',
                      '._21', '._22', '._23', '._24', '._25', '._26', '._27', '._28', '._29', '._30', '._31',
                      '._32', '._33', '._34', '._35', '._36', '._37', '._38', '._39', '._40', '._41', '._42'];
let dateElements = dateSelectors.map(sel => document.querySelector(sel)).filter(el => el);

// Sort by top position, then left position to match grid order
dateElements.sort((a, b) => { 
  const aTop = parseInt(getComputedStyle(a).top);
  const bTop = parseInt(getComputedStyle(b).top);
  if (aTop !== bTop) return aTop - bTop;
  const aLeft = parseInt(getComputedStyle(a).left);
  const bLeft = parseInt(getComputedStyle(b).left);
  return aLeft - bLeft;
});

function renderCalendar(month, year) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth = month === phMonth && year === phYear;
  const todayDate = isCurrentMonth ? phDay : -1;

  // Calculate starting index for Monday-start calendar (Sun last)
  const startingIndex = firstDay === 0 ? 6 : firstDay - 1;

  // Update month/year display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthElement.textContent = `${monthNames[month]} ${year}`;

  // Clear dates
  dateElements.forEach(el => {
    el.textContent = '';
    el.classList.remove('today-highlight', 'prev-month', 'next-month');
  });

  // Fill previous month days from the beginning
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  let prevDay = daysInPrevMonth - (startingIndex - 1);
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
const hideSidebarBtn = document.querySelector('.hide-sidebar');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.dashboard-SBON-light');

if (hideSidebarBtn && sidebar) {
  hideSidebarBtn.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('sidebar-collapsed');
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
});
