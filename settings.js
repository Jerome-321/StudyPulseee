
        // Settings Modal Logic
        function loadProfileData() {
            const firstName = localStorage.getItem('user_firstname') || 'First';
            const lastName = localStorage.getItem('user_lastname') || 'Last';
            const email = localStorage.getItem('user_email') || 'unknown@gmail.com';
            const dob = localStorage.getItem('user_dob') || '';
            const contact = localStorage.getItem('user_contact') || '';
            const course = localStorage.getItem('user_course') || '';
            const address = localStorage.getItem('user_address') || '';
            const profilePhoto = localStorage.getItem('user_profile_photo') || './images/profile-1.jpg';

            document.getElementById('firstName').value = firstName;
            document.getElementById('lastName').value = lastName;
            document.getElementById('email').value = email;
            document.getElementById('dob').value = dob;
            document.getElementById('contact').value = contact;
            document.getElementById('course').value = course;
            document.getElementById('address').value = address;
            document.getElementById('profilePreview').src = profilePhoto;
        }

        document.getElementById('openSettings').addEventListener('click', function(e) {
            e.preventDefault();
            loadProfileData();
            document.getElementById('settingsModal').classList.add('active');
        });
        document.getElementById('closeSettings').addEventListener('click', function() {
            document.getElementById('settingsModal').classList.remove('active');
        });
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + '-tab').classList.add('active');
            });
        });
        document.getElementById('photoUpload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('profilePreview').src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        document.getElementById('photoUrl').addEventListener('change', function() {
            const url = this.value.trim();
            if (url) {
                document.getElementById('profilePreview').src = url;
            }
        });
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const dob = document.getElementById('dob').value;
            const contact = document.getElementById('contact').value;
            const course = document.getElementById('course').value;
            const address = document.getElementById('address').value;
            const profilePhoto = document.getElementById('profilePreview').src;

            localStorage.setItem('user_firstname', firstName);
            localStorage.setItem('user_lastname', lastName);
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_dob', dob);
            localStorage.setItem('user_contact', contact);
            localStorage.setItem('user_course', course);
            localStorage.setItem('user_address', address);
            localStorage.setItem('user_profile_photo', profilePhoto);

            alert('Profile updated successfully!');
        });
        document.getElementById('passwordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPass = document.getElementById('currentpass').value;
            const newPass = document.getElementById('newpass').value;
            const confirmPass = document.getElementById('confirmpass').value;
            if (newPass !== confirmPass) {
                alert("New passwords don't match!");
                return;
            }
            if (newPass.length < 8) {
                alert("Password must be at least 8 characters long!");
                return;
            }
            alert('Password changed successfully!');
            this.reset();
        });
        window.addEventListener('click', function(event) {
            if (event.target === document.getElementById('settingsModal')) {
                document.getElementById('settingsModal').classList.remove('active');
            }
        });

    src="timeTable.js";
     src="app.js"

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('customTimetableForm');
    const tbody = document.querySelector('#timetable tbody');

    // Load timetable from server on page load
    fetch('save_timetable.php?action=get')
        .then(response => response.json())
        .then(data => {
            renderTimetable(data);
        });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const time = document.getElementById('inputTime').value;
        const room = document.getElementById('inputRoom').value;
        const course = document.getElementById('inputCourse').value;
        const type = document.getElementById('inputType').value;

        // Send to server
        fetch('save_timetable.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ time, room, course, type })
        })
        .then(response => response.json())
        .then(data => {
            renderTimetable(data);
            form.reset();
        });
    });

    function renderTimetable(entries) {
    const tbody = document.querySelector('#timetable tbody');
    tbody.innerHTML = '';
    if (entries && entries.length > 0) {
        document.getElementById('timetable').style.display = 'block'; // SHOW timetable
        entries.forEach((entry, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entry.time}</td>
                <td>${entry.room}</td>
                <td>${entry.course}</td>
                <td>${entry.type}</td>
                <td><button onclick="removeEntry(${idx})" style="color:red; border:none; background:none; cursor:pointer;">Remove</button></td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        document.getElementById('timetable').style.display = 'none'; // HIDE timetable if empty
    }
}
    // Remove entry
    window.removeEntry = function(idx) {
        fetch('save_timetable.php?action=remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idx })
        })
        .then(response => response.json())
        .then(data => {
            renderTimetable(data);
        }
        );
    };
    });
