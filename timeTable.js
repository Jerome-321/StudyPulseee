const calendar = document.getElementById("calendar");
    const sidebar = document.getElementById("sidebar");
    const entryTable = document.getElementById("entryTable");
    const entryForm = document.getElementById("entryForm");
    const monthLabel = document.getElementById("monthLabel");
    const selectedDateElem = document.getElementById("selectedDate");
    const gwaDisplay = document.getElementById("gwaDisplay");
    let currentDate = new Date();
    let selectedDay = null;
    const scheduleData = JSON.parse(localStorage.getItem("timetable")) || {};

    function saveData() {
      localStorage.setItem("timetable", JSON.stringify(scheduleData));
    }

    function calculateGWA() {
      let total = 0, count = 0;
      for (const date in scheduleData) {
        scheduleData[date].forEach(entry => {
          const grade = parseFloat(entry.grade);
          if (!isNaN(grade)) {
            total += grade;
            count++;
          }
        });
      }
      if (count === 0) {
        gwaDisplay.textContent = "GWA: N/A";
        gwaDisplay.style.backgroundColor = "transparent";
        return;
      }
      const gwa = total / count;
      let bgColor = gwa <= 1.75 ? 'var(--gwa-good)' : gwa <= 2.5 ? 'var(--gwa-average)' : 'var(--gwa-poor)';
      gwaDisplay.textContent = `GWA: ${gwa.toFixed(2)}`;
      gwaDisplay.style.backgroundColor = bgColor;
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
        const date = new Date(year, month, i - startDay + 1);
        cell.className = "day";
        if (i < startDay || i >= startDay + daysInMonth) {
          cell.classList.add("outside");
          calendar.appendChild(cell);
          continue;
        }

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

        cell.addEventListener("click", () => openSidebar(date));
        calendar.appendChild(cell);
      }
      calculateGWA();
    }

    function openSidebar(date) {
      selectedDay = date.toDateString();
      selectedDateElem.textContent = selectedDay;
      sidebar.classList.add("active");
      renderTable();
    }

    function closeSidebar() {
      sidebar.classList.remove("active");
    }

    function timesOverlap(a, b) {
      const toMinutes = t => {
        const [h, m] = t.match(/\d+/g).map(Number);
        return t.includes("PM") && h !== 12 ? h * 60 + m + 720 : h * 60 + m;
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

function openSidebarForDate(dayElement, dateString) {
  // Show sidebar
  sidebar.classList.add('active');
  document.getElementById('selectedDate').textContent = dateString;
  
  // Position sidebar to right of clicked day
  const rect = dayElement.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();

  // Calculate position: top aligned to day, left to the right of day box
  sidebar.style.top = (rect.top - bodyRect.top) + 'px';
  sidebar.style.left = (rect.right - bodyRect.left + 10) + 'px'; // 10px gap

  // Optionally reset form or load entries for that date
  document.getElementById('entryForm').reset();
}

function closeSidebar() {
  sidebar.classList.remove('active');
  sidebar.style.top = '';
  sidebar.style.left = '';
}
document.querySelectorAll('.day').forEach(day => {
  day.addEventListener('click', () => {
    const dateString = day.getAttribute('data-date'); // your code must add this attribute per day
    openSidebarForDate(day, dateString);
  });
});
