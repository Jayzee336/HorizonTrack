function showTime(){
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var session = "AM";

    if(hr == 0){
        hr = 12;
    }
    if(hr > 12){
        hr = hr - 12;
        session = "PM";
    }

    hr = (hr < 10) ? "0" + hr : hr;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;

    var time = hr + ":" + min + ":" + sec + " " + session;
    const timeElement = document.querySelector('.b3') || document.querySelector('.b');
    const ampmElement = document.querySelector('.ampm');
    if (timeElement && ampmElement) {
        const [timePart, ampm] = time.split(' ');
        timeElement.textContent = timePart;
        ampmElement.textContent = ampm;
    }

    const dateElement = document.querySelector('.march-21-2025') || document.querySelector('.august-21-2025');
    if (dateElement) {
        const dateString = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Manila'
        });
        dateElement.textContent = dateString;
    }

    // Update day
    const dayElement = document.querySelector('.friday') || document.querySelector('.saturday');
    if (dayElement) {
        const dayString = date.toLocaleDateString('en-US', {
            weekday: 'long',
            timeZone: 'Asia/Manila'
        });
        dayElement.textContent = dayString;
    }

    // Analog clock hands - use Philippine time for consistency
    const phTimeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });
    const phTimeParts = phTimeFormatter.formatToParts(date);
    const phHr = parseInt(phTimeParts.find(p => p.type === 'hour').value);
    const phMin = parseInt(phTimeParts.find(p => p.type === 'minute').value);
    const phSec = parseInt(phTimeParts.find(p => p.type === 'second').value);
    const phHr12 = phHr % 12;

    const hourHand = document.querySelector('.hour-hand') || document.querySelector('.hour-line-icon');
    const minuteHand = document.querySelector('.minute-hand') || document.querySelector('.minute-line-icon');
    const secondHand = document.querySelector('.second-hand') || document.querySelector('.seconds-line-icon');

    // Calculate angles
    const hourAngle = (phHr12 * 30) + (phMin * 0.5) - 90;
    const minuteAngle = phMin * 6 - 90;
    const secondAngle = phSec * 6 - 90;

    if (hourHand) {
        hourHand.style.transform = `rotate(${hourAngle}deg)`;
    }

    if (minuteHand) {
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    }

    if (secondHand) {
        secondHand.style.transform = `rotate(${secondAngle}deg)`;
    }

    setTimeout(showTime,1000);
}

// Clock functionality - on dashboard or attendance pages
if (document.querySelector('.b3') || document.querySelector('.b')) {
  showTime(); // Initial call to set the time immediately
  setInterval(showTime, 1000); // Update the clock every second
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
let dateElements = Array.from(document.querySelectorAll('.cells div'));

function renderCalendar(month, year) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const phToday = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
  const isCurrentMonth = month === phToday.getMonth() && year === phToday.getFullYear();
  const todayDate = isCurrentMonth ? phToday.getDate() : -1;

  // Calculate starting index for Sunday-start calendar (number of blank days before 1st)
  const startingIndex = firstDay; // 0 = Sunday (0 blanks), 1 = Monday (1 blank), etc.

  // Update month/year display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (monthElement) {
    monthElement.textContent = `${monthNames[month]} ${year}`;
  }

  // Clear dates
  dateElements.forEach(el => {
    el.textContent = '';
    el.style.color = '';
    el.classList.remove('prev-month', 'next-month');
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
        dateElements[dateIndex].style.color = '#0cc0df';
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
  // Update sidebar profile based on logged-in user
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    fetch('employees.json')
      .then(response => response.json())
      .then(data => {
        const employee = data.employees[currentUser];
        if (employee) {
          const firstName = employee.firstName;
          const lastName = employee.lastName;

          const firstNameElement = document.querySelector('.profile-first-name');
          const lastNameElement = document.querySelector('.profile-last-name');

          // Determine font size based on both names
          const fontSize = (firstName.length > 10 || lastName.length > 10) ? '18px' : '24px';

          if (firstNameElement) {
            firstNameElement.textContent = firstName;
            firstNameElement.style.fontSize = fontSize;
          }

          if (lastNameElement) {
            lastNameElement.textContent = lastName;
            lastNameElement.style.fontSize = fontSize;
          }

          const imgElement = document.querySelector('.lebron-icon, .icon');
          if (imgElement) {
            imgElement.src = `${currentUser}.png`;
            imgElement.onerror = function() {
              this.src = 'profile.png';
            };
          }
        }
      })
      .catch(error => console.error('Error loading employees:', error));
  }

  // Update active projects count on dashboard
  const activeProjectsCounter = document.querySelector('.counter1 .b');
  if (activeProjectsCounter) {
    fetch('projects.json?t=' + Date.now())
      .then(response => response.json())
      .then(projects => {
        const activeProjects = projects.filter(project => project.status === 'Active').length;
        activeProjectsCounter.textContent = activeProjects;

        // Generate notifications
        generateNotifications(projects);
      })
      .catch(error => {
        console.error('Error loading projects:', error);
        activeProjectsCounter.textContent = '0'; // Default to 0 if error
      });
  }

  // Function to generate notifications
  function generateNotifications(projects) {
    const notificationContainer = document.querySelector('.notification-container') || document.querySelector('.your-department-manager').parentElement;
    if (!notificationContainer) return;

    let notifications = [];

    // Check for newly created projects from localStorage
    const newNotifications = JSON.parse(localStorage.getItem('newNotifications')) || [];
    newNotifications.forEach(notif => {
      notifications.push(notif);
    });
    // Clear after displaying
    localStorage.removeItem('newNotifications');

    // Check for newly created projects (within last 24 hours) - fallback if not in localStorage
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    projects.forEach(project => {
      if (now - project.id < oneDay && !notifications.some(n => n.message.includes(project.name) && n.message.includes('created'))) {
        notifications.push({
          message: `New project created: ${project.name}`,
          sender: 'System',
          time: 'Just now'
        });
      }
    });

    // Check for projects due soon (within 3 days)
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    projects.forEach(project => {
      if (project.dueDate && project.dueDate !== 'Not set') {
        try {
          let dateStr = project.dueDate;
          if (dateStr.includes('T') && dateStr.split('T')[1].split(':').length === 2) {
            dateStr += ':00';
          }
          const dueDate = new Date(dateStr);
          if (!isNaN(dueDate.getTime()) && dueDate - now < threeDays && dueDate > now) {
            notifications.push({
              message: `Project "${project.name}" is due soon`,
              sender: 'System',
              time: 'Recent'
            });
          }
        } catch (e) {
          // Ignore invalid dates
        }
      }
    });

    // Check for removed projects from localStorage
    const removedNotifications = JSON.parse(localStorage.getItem('removedNotifications')) || [];
    removedNotifications.forEach(notif => {
      notifications.push(notif);
    });
    // Clear after displaying
    localStorage.removeItem('removedNotifications');

    // Clear the container completely
    notificationContainer.innerHTML = '';

    // Set the base structure
    notificationContainer.innerHTML = `
      <div class="notifications-child"></div>
      <div class="dashboard-sbon-light-notifications">Notifications</div>
    `;

    // Create scrollable wrapper
    const notificationsWrapper = document.createElement('div');
    notificationsWrapper.className = 'notifications-wrapper';
    notificationsWrapper.style.position = 'absolute';
    notificationsWrapper.style.top = '88px';
    notificationsWrapper.style.left = '22px';
    notificationsWrapper.style.width = '100%';
    notificationsWrapper.style.maxHeight = '400px';
    notificationsWrapper.style.overflowY = 'auto';
    notificationsWrapper.style.overflowX = 'hidden';
    notificationContainer.appendChild(notificationsWrapper);

    // Display notifications
    if (notifications.length === 0) {
      // Default notification
      const itemDiv = document.createElement('div');
      itemDiv.className = 'notifications-item';
      itemDiv.style.position = 'relative';
      itemDiv.style.borderRadius = '20px';
      itemDiv.style.backgroundColor = '#efefef';
      itemDiv.style.width = '100%';
      itemDiv.style.height = '91px';
      itemDiv.style.marginBottom = '10px';
      itemDiv.innerHTML = `
        <div class="your-department-manager">No new notifications</div>
        <div class="system">System</div>
        <div class="hours-ago"></div>
      `;
      notificationsWrapper.appendChild(itemDiv);
    } else {
      // Display only the latest notification
      const latestNotif = notifications[notifications.length - 1];
      const itemDiv = document.createElement('div');
      itemDiv.className = 'notifications-item';
      itemDiv.style.position = 'relative';
      itemDiv.style.borderRadius = '20px';
      itemDiv.style.backgroundColor = '#efefef';
      itemDiv.style.width = '100%';
      itemDiv.style.height = '91px';
      itemDiv.style.marginBottom = '10px';
      itemDiv.innerHTML = `
        <div class="your-department-manager">${latestNotif.message}</div>
        <div class="system">${latestNotif.sender}</div>
        <div class="hours-ago">${latestNotif.time}</div>
      `;
      notificationsWrapper.appendChild(itemDiv);
    }
  }

  // Update due tasks count on dashboard
  const dueTasksCounter = document.querySelector('.counter2 .b');
  if (dueTasksCounter) {
    fetch('projects.json?t=' + Date.now())
      .then(response => response.json())
      .then(projects => {
        const dueTasks = projects.reduce((total, project) => {
          if (Array.isArray(project.tasks)) {
            return total + project.tasks.filter(task => !task.completed).length;
          }
          return total;
        }, 0);
        dueTasksCounter.textContent = dueTasks;
      })
      .catch(error => {
        console.error('Error loading projects:', error);
        dueTasksCounter.textContent = '0'; // Default to 0 if error
      });
  }

  // Populate Task List on dashboard
  const taskListUl = document.querySelector('.design-update ul');
  if (taskListUl) {
    fetch('projects.json?t=' + Date.now())
      .then(response => response.json())
      .then(projects => {
        let taskItems = [];
        projects.forEach(project => {
          if (Array.isArray(project.tasks)) {
            project.tasks.forEach(task => {
              if (typeof task === 'object' && task.name) {
                taskItems.push(`<li>${task.name} (${project.name})</li>`);
              } else if (typeof task === 'string') {
                taskItems.push(`<li>${task} (${project.name})</li>`);
              }
            });
          }
        });
        if (taskItems.length > 0) {
          taskListUl.innerHTML = taskItems.join('');
        } else {
          taskListUl.innerHTML = '<li>No tasks available</li>';
        }
      })
      .catch(error => {
        console.error('Error loading projects for task list:', error);
        taskListUl.innerHTML = '<li>Error loading tasks</li>';
      });
  }

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
                fullName: `${employee.firstName} ${employee.lastName}`,
                employeeID: employee.employeeID
              };
              attendanceData.push(newEntry);
            } else {
              // Time In
              const newEntry = {
                status: 'IN',
                time: timeString,
                date: dateString,
                fullName: `${employee.firstName} ${employee.lastName}`,
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

  // Create Project functionality - only if on projects page
  const createProjectBtn = document.querySelector('.create-project');
  const modal = document.getElementById('createProjectModal');
  const closeBtn = document.querySelector('.close');

  if (createProjectBtn && modal) {
    // Open modal when button is clicked
    createProjectBtn.addEventListener('click', function() {
      modal.style.display = 'block';
    });

    // Close modal when close button is clicked
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }

    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Remove Project functionality - only if on projects page
  const removeProjectBtn = document.querySelector('.remove-project');
  const removeModal = document.getElementById('removeProjectModal');

  if (removeProjectBtn && removeModal) {
    // Open modal when button is clicked
    removeProjectBtn.addEventListener('click', function() {
      // Load projects and populate the remove list
      fetch('projects.json?t=' + Date.now())
        .then(response => response.json())
        .then(projects => {
          const removeProjectsList = document.getElementById('removeProjectsList');
          removeProjectsList.innerHTML = '';
          projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'form-group';
            projectItem.innerHTML = `
              <label>
                <input type="checkbox" value="${project.id}" class="project-checkbox">
                ${project.name}
              </label>
            `;
            removeProjectsList.appendChild(projectItem);
          });
          removeModal.style.display = 'block';
        })
        .catch(error => console.error('Error loading projects:', error));
    });

    // Close modal when close button is clicked
    const removeCloseBtn = removeModal.querySelector('.remove-project-close');
    if (removeCloseBtn) {
      removeCloseBtn.addEventListener('click', function() {
        removeModal.style.display = 'none';
      });
    }

    // Close modal when clicking outside of modal content
    window.addEventListener('click', function(event) {
      if (event.target === removeModal) {
        removeModal.style.display = 'none';
      }
    });



    // Handle remove selected projects
    const removeSelectedBtn = document.getElementById('removeSelectedBtn');
    if (removeSelectedBtn) {
      removeSelectedBtn.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.project-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));

        if (selectedIds.length === 0) {
          alert('Please select at least one project to remove.');
          return;
        }

        // Load current projects
        fetch('projects.json?t=' + Date.now())
          .then(response => response.json())
          .then(projects => {
            // Filter out selected projects
            const updatedProjects = projects.filter(project => !selectedIds.includes(project.id));

            // Save updated projects
            fetch('save_projects.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ projects: updatedProjects })
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                // Add notifications for removed projects
                const removedNotifications = JSON.parse(localStorage.getItem('removedNotifications')) || [];
                selectedIds.forEach(id => {
                  const removedProject = projects.find(p => p.id === id);
                  if (removedProject) {
                    removedNotifications.push({
                      message: `Project "${removedProject.name}" has been removed`,
                      sender: 'System',
                      time: 'Just now'
                    });
                  }
                });
                localStorage.setItem('removedNotifications', JSON.stringify(removedNotifications));

                removeModal.style.display = 'none';
                renderProjects();
                alert('Selected projects removed successfully!');
              } else {
                console.error('Failed to save projects:', data.message);
                alert('Failed to remove projects.');
              }
            })
            .catch(error => {
              console.error('Error saving projects:', error);
              alert('Error removing projects.');
            });
          })
          .catch(error => console.error('Error loading projects:', error));
      });
    }

    // Handle form submission
    const createProjectForm = document.getElementById('createProjectForm');
    if (createProjectForm) {
      createProjectForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const projectName = document.getElementById('projectName').value.trim();
        const projectDescription = document.getElementById('projectDescription').value.trim();
        const projectDueDate = document.getElementById('projectDueDate').value;

        if (projectName) {
          // Collect tasks from dynamic inputs
          const taskInputs = document.querySelectorAll('.task-input');
          const tasks = Array.from(taskInputs).map(input => input.value.trim()).filter(task => task).map(task => ({ name: task, completed: false }));

          // Load existing projects from projects.json
          fetch('projects.json?t=' + Date.now())
            .then(response => response.json())
            .then(projects => {
              const newProject = {
                id: Date.now(),
                name: projectName,
                description: projectDescription,
                tasks: tasks,
                progress: tasks.length > 0 ? '0%' : 'N/A',
                dueDate: projectDueDate || 'Not set',
                status: 'Active'
              };
              projects.push(newProject);

              // Save to JSON file via PHP
              fetch('save_projects.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projects: projects })
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  // Add notification for new project
                  const newNotifications = JSON.parse(localStorage.getItem('newNotifications')) || [];
                  newNotifications.push({
                    message: `New project "${projectName}" has been created`,
                    sender: 'System',
                    time: 'Just now'
                  });
                  localStorage.setItem('newNotifications', JSON.stringify(newNotifications));

                  // Close modal and reset form
                  modal.style.display = 'none';
                  createProjectForm.reset();
                  // Reset tasks to initial state
                  const tasksContainer = document.getElementById('tasksContainer');
                  tasksContainer.innerHTML = '<div class="task-item"><input type="text" class="task-input" placeholder="Enter task 1"><button type="button" class="remove-task-btn">&times;</button></div>';
                  updateAddTaskButton();

                  // Render the new project in the list
                  renderProjects();

                  alert('Project created successfully!');
                } else {
                  console.error('Failed to save to JSON:', data.message);
                  alert('Failed to save project to server.');
                }
              })
              .catch(error => {
                console.error('Error saving to JSON:', error);
                alert('Error saving project.');
              });
            })
            .catch(error => {
              console.error('Error loading projects:', error);
              alert('Error loading projects.');
            });
        } else {
          alert('Project name is required!');
        }
      });
    }

    // Function to update add task button state
    function updateAddTaskButton() {
      const taskItems = document.querySelectorAll('.task-item');
      const addTaskBtn = document.getElementById('addTaskBtn');
      if (addTaskBtn) {
        if (taskItems.length >= 7) {
          addTaskBtn.style.display = 'none';
        } else {
          addTaskBtn.style.display = 'inline-block';
        }
      }
    }

    // Add task functionality
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', function() {
        const tasksContainer = document.getElementById('tasksContainer');
        const taskItems = tasksContainer.querySelectorAll('.task-item');
        if (taskItems.length < 7) {
          const taskNumber = taskItems.length + 1;
          const newTaskItem = document.createElement('div');
          newTaskItem.className = 'task-item';
          newTaskItem.innerHTML = `
            <input type="text" class="task-input" placeholder="Enter task ${taskNumber}">
            <button type="button" class="remove-task-btn">&times;</button>
          `;
          tasksContainer.appendChild(newTaskItem);
          updateAddTaskButton();
        }
      });
    }

    // Remove task functionality
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-task-btn')) {
        const taskItem = e.target.parentElement;
        const tasksContainer = document.getElementById('tasksContainer');
        const taskItems = tasksContainer.querySelectorAll('.task-item');
        if (taskItems.length > 1) {
          taskItem.remove();
          updateAddTaskButton();
          // Update placeholders
          const remainingItems = tasksContainer.querySelectorAll('.task-item');
          remainingItems.forEach((item, index) => {
            const input = item.querySelector('.task-input');
            input.placeholder = `Enter task ${index + 1}`;
          });
        }
      }
    });

  // Initial update of add task button
    updateAddTaskButton();
  }

  // Function to render projects list
  function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;

    // Remove static placeholder elements
    const staticNo = document.querySelector('.square .div');
    const staticName = document.querySelector('.square .projects-sbon-light-div');
    const staticView = document.querySelector('.square .view');
    if (staticNo) staticNo.remove();
    if (staticName) staticName.remove();
    if (staticView) staticView.remove();

    // Clear existing projects
    projectsList.innerHTML = '';

    // Load projects from projects.json
    fetch('projects.json?t=' + Date.now())
      .then(response => response.json())
      .then(projects => {
        // Normalize tasks for each project
        projects.forEach(project => {
          if (!Array.isArray(project.tasks)) {
            project.tasks = [];
          } else {
            project.tasks = project.tasks.map(task => {
              if (typeof task === 'string') {
                return { name: task, completed: false };
              } else if (typeof task === 'object' && task.name) {
                return task;
              } else {
                return { name: 'Unknown', completed: false };
              }
            });
          }
        });

        // Render each project
        projects.forEach((project, index) => {
          // Calculate progress
          const completedTasks = project.tasks.filter(task => task.completed).length;
          const totalTasks = project.tasks.length;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) + '%' : 'N/A';

          const projectRow = document.createElement('div');
          projectRow.className = 'project-row';

          // Format due date
          let formattedDueDate = 'Not set';
          if (project.dueDate && project.dueDate !== 'Not set') {
            try {
              // Ensure the date string has seconds for proper parsing
              let dateStr = project.dueDate;
              if (dateStr.includes('T') && dateStr.split('T')[1].split(':').length === 2) {
                dateStr += ':00';
              }
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                const datePart = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                formattedDueDate = `${datePart}<br>${timePart}`;
              } else {
                formattedDueDate = project.dueDate; // fallback to raw if parsing fails
              }
            } catch (e) {
              formattedDueDate = project.dueDate; // fallback
            }
          }

          projectRow.innerHTML = `
            <div class="project-no">${index + 1}</div>
            <div class="project-name">${project.name}</div>
            <div class="project-tasks">${project.tasks.map(task => task.name).join(', ')}</div>
            <div class="project-progress">${progress}</div>
            <div class="project-due-date">${formattedDueDate}</div>
            <div class="project-actions">
              <img src="view.png" alt="View Project" class="view-project-img" data-project-id="${project.id}" style="cursor: pointer;">
            </div>
          `;

          projectsList.appendChild(projectRow);
        });
      })
      .catch(error => console.error('Error loading projects:', error));
  }

  // View Project functionality
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-project-btn') || e.target.classList.contains('view-project-img')) {
      const projectId = parseInt(e.target.getAttribute('data-project-id'));
      fetch('projects.json', { cache: 'no-cache' })
        .then(response => response.json())
        .then(projects => {
          const project = projects.find(p => p.id === projectId);
          if (project) {
            // Create view project modal
            const viewModal = document.createElement('div');
            viewModal.id = 'viewProjectModal';
            viewModal.className = 'modal view-project-modal';
            viewModal.innerHTML = `
              <div class="modal-content view-project-content">
                <span class="close view-project-close">&times;</span>
                <div class="view-project-header">
                  <h2 class="view-project-title">${project.name}</h2>
                <div class="view-project-meta">
                  <div class="view-project-meta-item">
                    <span class="view-project-meta-label">Due Date</span>
                    <span class="view-project-meta-value">${project.dueDate && project.dueDate !== 'Not set' ? (() => {
                      try {
                        let dateStr = project.dueDate;
                        if (dateStr.includes('T') && dateStr.split('T')[1].split(':').length === 2) {
                          dateStr += ':00';
                        }
                        const date = new Date(dateStr);
                        if (!isNaN(date.getTime())) {
                          const datePart = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                          const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                          return `${datePart}<br>${timePart}`;
                        } else {
                          return project.dueDate;
                        }
                      } catch (e) {
                        return project.dueDate;
                      }
                    })() : 'Not set'}</span>
                  </div>
                  <div class="view-project-meta-item">
                    <span class="view-project-meta-label">Progress:</span>
                    <span class="view-project-meta-value">${project.progress}</span>
                  </div>
                </div>
                </div>
                <div class="view-project-description">
                  <h3 class="view-project-section-title">Description</h3>
                  <p class="view-project-description-text">${project.description || 'No description provided.'}</p>
                </div>
                <div class="view-project-tasks">
                  <h3 class="view-project-section-title">Tasks</h3>
                  <ul id="taskList" class="view-project-task-list">
                    ${project.tasks.map((task, index) => `
                      <li class="view-project-task-item ${task.completed ? 'completed' : ''}">
                        <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} class="view-project-task-checkbox">
                        <label for="task-${index}" class="view-project-task-label">${task.name}</label>
                      </li>
                    `).join('')}
                  </ul>
                </div>
                <button id="saveTasksBtn" class="view-project-save-btn">Save Changes</button>
              </div>
            `;
            document.body.appendChild(viewModal);
            viewModal.style.display = 'block';

            // Close modal functionality
            const closeBtn = viewModal.querySelector('.close');
            closeBtn.addEventListener('click', function() {
              viewModal.remove();
            });

            window.addEventListener('click', function(event) {
              if (event.target === viewModal) {
                viewModal.remove();
              }
            });

            // Save tasks functionality
            const saveBtn = viewModal.querySelector('#saveTasksBtn');
            saveBtn.addEventListener('click', function() {
              const checkboxes = viewModal.querySelectorAll('#taskList input[type="checkbox"]');
              checkboxes.forEach((checkbox, index) => {
                project.tasks[index].completed = checkbox.checked;
              });
              // Save updated projects back to JSON
              fetch('save_projects.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projects: projects })
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  renderProjects();
                  viewModal.remove();
                  alert('Tasks updated successfully!');
                } else {
                  console.error('Failed to save tasks:', data.message);
                  alert('Failed to save tasks.');
                }
              })
              .catch(error => {
                console.error('Error saving tasks:', error);
                alert('Error saving tasks.');
              });
            });
          }
        })
        .catch(error => console.error('Error loading projects:', error));
    }
  });

  // Initial render of projects if on projects page
  if (document.getElementById('projectsList')) {
    renderProjects();
  }
});

  // Function to render employees list
  function renderEmployees(filter = '') {
    const employeesList = document.getElementById('employeesList');
    if (!employeesList) return;

    // Remove static placeholder elements
    const staticViewIcons = document.querySelectorAll('.square .view-employee-icon, .square .employees-sbon-light-view-employee-icon, .square .view-employee-icon2, .square .view-employee-icon3, .square .view-employee-icon4, .square .view-employee-icon5, .square .view-employee-icon6, .square .view-employee-icon7, .square .view-employee-icon8');
    staticViewIcons.forEach(icon => icon.remove());

    // Clear existing employees
    employeesList.innerHTML = '';

    // Load employees from employees.json
    fetch('employees.json?t=' + Date.now())
      .then(response => response.json())
      .then(data => {
        let employees = Object.values(data.employees); // Convert object to array for easier iteration

        // Filter employees based on search input
        if (filter) {
          const lowerFilter = filter.toLowerCase();
          employees = employees.filter(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            const id = employee.employeeID.toLowerCase();
            const position = (employee.position || '').toLowerCase();
            const department = (employee.department || '').toLowerCase();
            const contactPhone = (employee.contactPhone || '').toLowerCase();
            const contactEmail = (employee.contactEmail || '').toLowerCase();

            return fullName.includes(lowerFilter) ||
                   id.includes(lowerFilter) ||
                   position.includes(lowerFilter) ||
                   department.includes(lowerFilter) ||
                   contactPhone.includes(lowerFilter) ||
                   contactEmail.includes(lowerFilter);
          });
        }

        employees.forEach((employee, index) => {
          const employeeRow = document.createElement('div');
          employeeRow.className = 'employee-row'; // Use a new class for dynamic rows

          // Assuming contact and email are stored directly in the employee object
          const contactPhone = employee.contactPhone || 'N/A';
          const contactEmail = employee.contactEmail || 'N/A';
          const department = employee.department || 'N/A';
          const position = employee.position || 'N/A';

          employeeRow.innerHTML = `
            <div class="employee-id">${employee.employeeID}</div>
            <div class="employee-name">${employee.firstName} ${employee.lastName}</div>
            <div class="employee-position">${position}</div>
            <div class="employee-department">${department}</div>
            <div class="employee-contact">
              <div>${contactPhone}</div>
              <div class="employee-email">${contactEmail}</div>
            </div>
            <div class="employee-view">
              <img src="view.png" alt="View Employee" class="view-employee-img" data-employee-id="${employee.employeeID}" style="cursor: pointer;">
            </div>
          `;
          employeesList.appendChild(employeeRow);
        });
      })
      .catch(error => console.error('Error loading employees:', error));
  }

  // Add Employee functionality - only if on employees page
  const addEmployeeBtn = document.querySelector('.add-employee');
  const addEmployeeModal = document.getElementById('addEmployeeModal');
  const addEmployeeCloseBtn = addEmployeeModal ? addEmployeeModal.querySelector('.close') : null;

  if (addEmployeeBtn && addEmployeeModal) {
    addEmployeeBtn.addEventListener('click', function() {
      addEmployeeModal.style.display = 'block';
    });

    if (addEmployeeCloseBtn) {
      addEmployeeCloseBtn.addEventListener('click', function() {
        addEmployeeModal.style.display = 'none';
      });
    }

    window.addEventListener('click', function(event) {
      if (event.target === addEmployeeModal) {
        addEmployeeModal.style.display = 'none';
      }
    });

    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (addEmployeeForm) {
      addEmployeeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const employeeID = document.getElementById('employeeID').value.trim();
        const employeeFirstName = document.getElementById('employeeFirstName').value.trim();
        const employeeLastName = document.getElementById('employeeLastName').value.trim();
        const employeePosition = document.getElementById('employeePosition').value.trim();
        const employeeDepartment = document.getElementById('employeeDepartment').value.trim();
        const employeeContactPhone = document.getElementById('employeeContactPhone').value.trim();
        const employeeContactEmail = document.getElementById('employeeContactEmail').value.trim();

        if (employeeID && employeeFirstName && employeeLastName && employeePosition && employeeDepartment) {
          fetch('employees.json?t=' + Date.now())
            .then(response => response.json())
            .then(data => {
              const employees = data.employees;

              // Check if employee ID already exists
              const idExists = Object.values(employees).some(emp => emp.employeeID === employeeID);
              if (idExists) {
                alert('Employee with this ID already exists!');
                return;
              }

              // Use last name as key for now, similar to existing structure
              const newEmployeeKey = employeeLastName;
              employees[newEmployeeKey] = {
                firstName: employeeFirstName,
                lastName: employeeLastName,
                employeeID: employeeID,
                position: employeePosition,
                department: employeeDepartment,
                contactPhone: employeeContactPhone,
                contactEmail: employeeContactEmail
              };

              fetch('save_employees.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employees: employees })
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  addEmployeeModal.style.display = 'none';
                  addEmployeeForm.reset();
                  renderEmployees(); // Re-render the employee list
                  alert('Employee added successfully!');
                } else {
                  console.error('Failed to save employee:', data.message);
                  alert('Failed to add employee.');
                }
              })
              .catch(error => {
                console.error('Error saving employee:', error);
                alert('Error adding employee.');
              });
            })
            .catch(error => {
              console.error('Error loading employees:', error);
              alert('Error loading employees.');
            });
        } else {
          alert('Please fill in all required fields (ID, Name, Position, Department)!');
        }
      });
    }
  }

  // Remove Employee functionality - only if on employees page
  const removeEmployeeBtn = document.querySelector('.remove-employee');
  const removeEmployeeModal = document.getElementById('removeEmployeeModal');

  if (removeEmployeeBtn && removeEmployeeModal) {
    removeEmployeeBtn.addEventListener('click', function() {
      fetch('employees.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
          const employees = data.employees;
          const removeEmployeesList = document.getElementById('removeEmployeesList');
          removeEmployeesList.innerHTML = '';

          Object.keys(employees).forEach(key => {
            const employee = employees[key];
            const employeeItem = document.createElement('div');
            employeeItem.className = 'form-group';
            employeeItem.innerHTML = `
              <label>
                <input type="checkbox" value="${employee.employeeID}" data-employee-key="${key}" class="employee-checkbox">
                ${employee.firstName} ${employee.lastName} (${employee.employeeID})
              </label>
            `;
            removeEmployeesList.appendChild(employeeItem);
          });
          removeEmployeeModal.style.display = 'block';
        })
        .catch(error => console.error('Error loading employees:', error));
    });

    const removeEmployeeCloseBtn = removeEmployeeModal.querySelector('.remove-employee-close');
    if (removeEmployeeCloseBtn) {
      removeEmployeeCloseBtn.addEventListener('click', function() {
        removeEmployeeModal.style.display = 'none';
      });
    }

    window.addEventListener('click', function(event) {
      if (event.target === removeEmployeeModal) {
        removeEmployeeModal.style.display = 'none';
      }
    });

    const removeSelectedEmployeesBtn = document.getElementById('removeSelectedEmployeesBtn');
    if (removeSelectedEmployeesBtn) {
      removeSelectedEmployeesBtn.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.employee-checkbox:checked');
        const selectedEmployeeKeys = Array.from(selectedCheckboxes).map(cb => cb.getAttribute('data-employee-key'));

        if (selectedEmployeeKeys.length === 0) {
          alert('Please select at least one employee to remove.');
          return;
        }

        fetch('employees.json?t=' + Date.now())
          .then(response => response.json())
          .then(data => {
            const employees = data.employees;
            selectedEmployeeKeys.forEach(key => {
              delete employees[key];
            });

            fetch('save_employees.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ employees: employees })
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                removeEmployeeModal.style.display = 'none';
                renderEmployees(); // Re-render the employee list
                alert('Selected employees removed successfully!');
              } else {
                console.error('Failed to save employees:', data.message);
                alert('Failed to remove employees.');
              }
            })
            .catch(error => {
              console.error('Error saving employees:', error);
              alert('Error removing employees.');
            });
          })
          .catch(error => console.error('Error loading employees:', error));
      });
    }
  }

  // View Employee functionality (dynamic rows)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-employee-img')) {
      const employeeID = e.target.getAttribute('data-employee-id');
      fetch('employees.json', { cache: 'no-cache' })
        .then(response => response.json())
        .then(data => {
          const employee = Object.values(data.employees).find(emp => emp.employeeID === employeeID);
          if (employee) {
            const viewModal = document.createElement('div');
            viewModal.id = 'viewEmployeeModal';
            viewModal.className = 'modal';
            viewModal.innerHTML = `
              <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Employee Details</h2>
                <p><strong>ID:</strong> ${employee.employeeID}</p>
                <p><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</p>
                <p><strong>Position:</strong> ${employee.position || 'N/A'}</p>
                <p><strong>Department:</strong> ${employee.department || 'N/A'}</p>
                <p><strong>Contact (Phone):</strong> ${employee.contactPhone || 'N/A'}</p>
                <p><strong>Contact (Email):</strong> ${employee.contactEmail || 'N/A'}</p>
              </div>
            `;
            document.body.appendChild(viewModal);
            viewModal.style.display = 'block';

            const closeBtn = viewModal.querySelector('.close');
            closeBtn.addEventListener('click', function() {
              viewModal.remove();
            });

            window.addEventListener('click', function(event) {
              if (event.target === viewModal) {
                viewModal.remove();
              }
            });
          }
        })
        .catch(error => console.error('Error loading employee details:', error));
    }
  });

  // Initial render of employees if on employees page
  if (document.getElementById('employeesList')) {
    renderEmployees();

    // Add search functionality
    const searchInput = document.getElementById('searchEmployeeInput');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const filter = this.value.trim();
        renderEmployees(filter);
      });
    }
  }

  // Live Attendance display on attendance page
  if (document.querySelector('.live-attendance')) {
    // Load attendance data from localStorage
    const attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

    // Get today's date in MM/DD/YYYY format (matching the format used in time in/out)
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Manila'
    });

    // Filter attendance data for today
    const todaysAttendance = attendanceData.filter(entry => entry.date === dateString);

    // Get the live attendance container
    const liveAttendanceDiv = document.querySelector('.live-attendance');

    // Remove any static placeholder entries
    const staticEntries = liveAttendanceDiv.querySelectorAll('.gats, .jus, .leb, .ethan');
    staticEntries.forEach(el => el.remove());

    // Create a scrollable container for entries
    const container = document.createElement('div');
    container.className = 'attendance-entries-container';
    liveAttendanceDiv.appendChild(container);

    if (todaysAttendance.length === 0) {
      // No attendance entries for today
      const noEntriesDiv = document.createElement('div');
      noEntriesDiv.style.textAlign = 'center';
      noEntriesDiv.style.padding = '50px';
      noEntriesDiv.style.fontSize = '18px';
      noEntriesDiv.style.color = '#666';
      noEntriesDiv.textContent = 'No attendance records for today.';
      container.appendChild(noEntriesDiv);
    } else {
      // Sort entries by time descending (most recent first)
      todaysAttendance.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)).reverse();

      // Create entries
      todaysAttendance.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'attendance-entry';

        entryDiv.innerHTML = `
          <div class="${entry.status === 'IN' ? 'jaycein' : 'jayceout'}">
            <div class="${entry.status === 'IN' ? 'attendance-sbon-light-in' : 'attendance-sbon-light-out'}">${entry.status}</div>
            <div class="attendance-sbon-light-jayce-bruce-nanual-container">
              <span class="span">${entry.fullName}</span> ${entry.time}
            </div>
            <div class="${entry.status === 'IN' ? 'jaycein-child' : 'jayceout-child'}"></div>
          </div>
        `;

        container.appendChild(entryDiv);
      });
    }
  }
