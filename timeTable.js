const calendar = document.getElementById("calendar");
const sidebar = document.getElementById("sidebar");
const entryTable = document.getElementById("entryTable");
const entryForm = document.getElementById("entryForm");
const monthLabel = document.getElementById("monthLabel");
const selectedDateElem = document.getElementById("selectedDate");

let currentDate = new Date();
let selectedDay = null;
const scheduleData = JSON.parse(localStorage.getItem("timetable")) || {};

function saveData() {
  localStorage.setItem("timetable", JSON.stringify(scheduleData));
}

function renderCalendar() {
  calendar.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  monthLabel.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;
  const totalCells = startDay + daysInMonth;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "day";
    if (i < startDay || i >= startDay + daysInMonth) {
      cell.classList.add("outside");
      calendar.appendChild(cell);
      continue;
    }

    const date = new Date(year, month, i - startDay + 1);
    cell.setAttribute('data-date', date.toDateString());
    cell.innerHTML = `<strong>${date.getDate()}</strong>`;

    const key = date.toDateString();
    if (scheduleData[key]) {
      scheduleData[key].forEach((e) => {
        const div = document.createElement("div");
        div.className = "entry";
        div.innerHTML = `${e.time} - ${e.subject}`;
        cell.appendChild(div);
      });
    }

    cell.addEventListener("click", () => openSidebar(cell, date));
    calendar.appendChild(cell);
  }
  calculateGWA(); // Assuming this exists elsewhere
}

function openSidebar(dayElement, date) {
  selectedDay = date.toDateString();
  selectedDateElem.textContent = selectedDay;
  sidebar.classList.add("active");

  // Position sidebar to the right of clicked day cell
  const rect = dayElement.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();

  sidebar.style.top = (rect.top - bodyRect.top) + "px";
  sidebar.style.left = (rect.right - bodyRect.left + 10) + "px"; // 10px gap

  entryForm.reset();
  renderTable();
}

function closeSidebar() {
  sidebar.classList.remove("active");
  sidebar.style.top = "";
  sidebar.style.left = "";
}

function timesOverlap(a, b) {
  const toMinutes = t => {
    const [h, m] = t.match(/\d+/g).map(Number);
    let minutes = h * 60 + m;
    if (t.includes("PM") && h !== 12) minutes += 720;
    if (t.includes("AM") && h === 12) minutes -= 720; // Handle 12AM edge case
    return minutes;
  };
  const [startA, endA] = a.split("-").map(t => toMinutes(t.trim()));
  const [startB, endB] = b.split("-").map(t => toMinutes(t.trim()));
  return startA < endB && startB < endA;
}

function renderTable() {
  entryTable.innerHTML = "";
  const entries = scheduleData[selectedDay] || [];

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    ["subject", "time", "type", "grade"].forEach((field) => {
      const cell = document.createElement("td");
      let input;
      if (field === "type") {
        input = document.createElement("select");
        ["Lecture", "Laboratory"].forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.text = opt;
          if (entry[field] === opt) option.selected = true;
          input.appendChild(option);
        });
      } else {
        input = document.createElement("input");
        input.type = field === "grade" ? "number" : "text";
        input.value = entry[field] || "";
      }

      input.addEventListener("blur", () => {
        entry[field] = input.value;
        saveData();
        renderCalendar();
      });

      cell.appendChild(input);
      row.appendChild(cell);
    });

    const actionsCell = document.createElement("td");
    actionsCell.className = "actions";

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.onclick = () => {
      saveData();
      renderCalendar();
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      entries.splice(index, 1);
      saveData();
      renderTable();
      renderCalendar();
    };

    actionsCell.appendChild(updateBtn);
    actionsCell.appendChild(delBtn);
    row.appendChild(actionsCell);

    entryTable.appendChild(row);
  });
}

entryForm.onsubmit = (e) => {
  e.preventDefault();
  const subject = document.getElementById("subject").value.trim();
  const time = document.getElementById("time").value.trim();
  const type = document.getElementById("type").value;

  if (!selectedDay) {
    alert("Please select a date on the calendar first.");
    return;
  }

  const newEntry = { subject, time, type, grade: "" };
  const entries = scheduleData[selectedDay] || [];

  // Duplicate check
  if (entries.some(e => e.subject === subject && e.time === time)) {
    alert("Duplicate entry for the same subject and time.");
    return;
  }

  // Time conflict check
  if (entries.some(e => timesOverlap(e.time, time))) {
    alert("Time conflict with existing entry.");
    return;
  }

  entries.push(newEntry);
  scheduleData[selectedDay] = entries;
  saveData();
  entryForm.reset();
  renderTable();
  renderCalendar();
};

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  renderCalendar();
}

renderCalendar();

