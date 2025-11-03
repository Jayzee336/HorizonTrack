function updateClock() {
  const now = new Date(); // Get the current time

  // Update digital time in 12-hour format with AM/PM in Philippine time
  const timeElement = document.querySelector('.b3') || document.querySelector('.b');
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
  const dateElement = document.querySelector('.march-21-2025') || document.querySelector('.august-21-2025');
  if (dateElement) {
    const dateString = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Manila'
    });
    dateElement.textContent = dateString;
  }

  // Update day in Philippine time (for dashboard and attendance pages)
  const dayElement = document.querySelector('.friday') || document.querySelector('.saturday');
  if (dayElement) {
    const dayString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      timeZone: 'Asia/Manila'
    });
    dayElement.textContent = dayString;
  }

  // Declare clock hand elements (support both dashboard and attendance page classes)
  const hourHand = document.querySelector('.hour-hand') || document.querySelector('.hour-line-icon');
  const minuteHand = document.querySelector('.minute-hand') || document.querySelector('.minute-line-icon');
  const secondHand = document.querySelector('.second-hand') || document.querySelector('.seconds-line-icon');

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
  const hourAngle = (hours * 30) + (minutes * 0.5) - 90; // 30 degrees per hour + minute adjustment (0.5 per minute), adjusted for 12 o'clock at top
  const minuteAngle = minutes * 6 - 90; // 6 degrees per minute, adjusted for 12 o'clock at top
  const secondAngle = seconds * 6 - 90; // 6 degrees per second, adjusted for 12 o'clock at top

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

// Clock functionality - on dashboard or attendance pages
if (document.querySelector('.b3') || document.querySelector('.b')) {
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
let dateElements = Array.from(document.querySelectorAll('.dates div'));

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
        dateElements[dateIndex].style.color = 'red';
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

          // Load existing projects from localStorage or initialize empty array
          let projects = JSON.parse(localStorage.getItem('projects')) || [];
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
          localStorage.setItem('projects', JSON.stringify(projects));

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

          projectRow.innerHTML = `
            <div class="project-no">${index + 1}</div>
            <div class="project-name">${project.name}</div>
            <div class="project-tasks">${project.tasks.map(task => task.name).join(', ')}</div>
            <div class="project-progress">${progress}</div>
            <div class="project-due-date">${project.dueDate || 'Not set'}</div>
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
                      <span class="view-project-meta-label">Due Date:</span>
                      <span class="view-project-meta-value">${project.dueDate || 'Not set'}</span>
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

  // View Employee functionality - only if on employees page
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG' && e.target.src.includes('view.png')) {
      const employeeRow = e.target.closest('.th-employee, .employees-sbon-light-th-employee, .th-employee2, .th-employee3, .th-employee4, .th-employee5, .rd-employee, .nd-employee, .st-employee');
      if (employeeRow) {
        const name = employeeRow.querySelector('.mhike-santos').textContent;
        const id = employeeRow.querySelector('.employees-sbon-light-div').textContent;
        const position = employeeRow.querySelector('.intern').textContent;
        const department = employeeRow.querySelector('.finance, .marketing, .hr, .gatan, .employees-sbon-light-marketing, .employees-sbon-light-gatan') ? employeeRow.querySelector('.finance, .marketing, .hr, .gatan, .employees-sbon-light-marketing, .employees-sbon-light-gatan').textContent : 'N/A';
        const contact = employeeRow.querySelector('.div').textContent;
        const email = employeeRow.querySelector('.mhikesantosgabgmailcom').textContent;

        // Create view employee modal
        const viewModal = document.createElement('div');
        viewModal.id = 'viewEmployeeModal';
        viewModal.className = 'modal';
        viewModal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Employee Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Position:</strong> ${position}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Email:</strong> ${email}</p>
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
      }
    }
  });

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
