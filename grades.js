function addCourse() {
    let courseContainer = document.getElementById("course-list");
    let courseEntry = document.createElement("div");
    courseEntry.classList.add("course-entry");
    courseEntry.innerHTML = `
        <input type="text" placeholder="Course Name" required>
        <input type="number" placeholder="Prelim Grade" min="0" max="100" required>
        <input type="number" placeholder="Midterm Grade" min="0" max="100" required>
        <input type="number" placeholder="Final Grade" min="0" max="100" required>
        <button class="remove-btn" onclick="removeCourse(this)">Remove</button>
    `;
    courseContainer.appendChild(courseEntry);
}

function removeCourse(button) {
    button.parentElement.remove();
}

function saveCourses() {
    let courses = [];
    document.querySelectorAll(".course-entry").forEach(entry => {
        let inputs = entry.getElementsByTagName("input");
        let prelim = parseFloat(inputs[1].value) || 0;
        let midterm = parseFloat(inputs[2].value) || 0;
        let final = parseFloat(inputs[3].value) || 0;
        let percentage = Math.round((prelim + midterm + final) / 3);

        let course = {
            name: inputs[0].value,
            prelim,
            midterm,
            final,
            percentage
        };
        courses.push(course);
    });
    localStorage.setItem("courses", JSON.stringify(courses));
    displaySavedCourses();
    alert("Courses saved successfully!");
}

function displaySavedCourses() {
    let savedCoursesContainer = document.getElementById("saved-courses-container");
    let savedCoursesDiv = document.getElementById("saved-courses");
    savedCoursesDiv.innerHTML = "";
    
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.forEach((course, index) => {
        let courseDiv = document.createElement("div");
        courseDiv.classList.add("saved-course");
        courseDiv.innerHTML = `
            <input type="text" value="${course.name}" onchange="updateCourse(${index}, 'name', this.value)">
            <input type="number" value="${course.prelim}" min="0" max="100" onchange="updateCourse(${index}, 'prelim', this.value)">
            <input type="number" value="${course.midterm}" min="0" max="100" onchange="updateCourse(${index}, 'midterm', this.value)">
            <input type="number" value="${course.final}" min="0" max="100" onchange="updateCourse(${index}, 'final', this.value)">
            <button class="update-btn" onclick="saveUpdatedCourses()">Update</button>
            <button class="remove-btn" onclick="deleteCourse(${index})">Remove</button>
        `;
        savedCoursesDiv.appendChild(courseDiv);
    });
    savedCoursesContainer.style.display = courses.length > 0 ? "block" : "none";
}

function deleteCourse(index) {
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses.splice(index, 1);
    localStorage.setItem("courses", JSON.stringify(courses));
    displaySavedCourses();
}

function updateCourse(index, field, value) {
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    courses[index][field] = value;
    localStorage.setItem("courses", JSON.stringify(courses));
}

function saveUpdatedCourses() {
    let courses = [];
    document.querySelectorAll(".saved-course").forEach(entry => {
        let inputs = entry.getElementsByTagName("input");
        let course = {
            name: inputs[0].value,
            prelim: inputs[1].value,
            midterm: inputs[2].value,
            final: inputs[3].value
        };
        courses.push(course);
    });
    localStorage.setItem("courses", JSON.stringify(courses));
    displaySavedCourses();
    alert("Courses updated successfully!");
}

// Display saved courses on page load
window.onload = displaySavedCourses;
