document.addEventListener("DOMContentLoaded", () => {
  const userKey = "user";

  // Helper to get element by id
  const $ = (id) => document.getElementById(id);

  // Load user from localStorage or redirect if not logged in
  let user = JSON.parse(localStorage.getItem(userKey));
  if (!user) {
    alert("No user found. Redirecting to login...");
    window.location.href = "login.html";
    return;
  }

  // Input references
  const firstNameInput = $("firstName");
  const lastNameInput = $("lastName");
  const dobInput = $("dob");
  const contactInput = $("contact");
  const emailInput = $("email");
  const courseInput = $("course");
  const addressInput = $("address");
  const profilePreview = $("profilePreview");
  const photoUpload = $("photoUpload");
  const photoUrlInput = $("photoUrl");

  // Password inputs
  const currentPassInput = $("currentpass");
  const newPassInput = $("newpass");
  const confirmPassInput = $("confirmpass");

  // Modal and tab elements
  const settingsModal = $("settingsModal");
  const openSettingsBtn = $("openSettings");
  const closeSettingsBtn = $("closeSettings");
  const tabs = document.querySelectorAll(".settings-tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const cancelPasswordBtn = $("cancelPassword");

  // Load user data into form & profile display
  function loadProfileData() {
    firstNameInput.value = user.firstName || "";
    lastNameInput.value = user.lastName || "";
    dobInput.value = user.dob || "";
    contactInput.value = user.contact || "";
    emailInput.value = user.email || "";
    courseInput.value = user.course || "";
    addressInput.value = user.address || "";
    profilePreview.src = user.profilePhoto || "./images/profile-1.jpg";
    photoUrlInput.value = user.profilePhoto || "";

    // Update displayed profile (outside modal)
    $("profileName").textContent = `${user.firstName || ""} ${user.lastName || ""}`;
    $("profileCourse").textContent = user.course || "Not provided";
    $("profileDob").textContent = user.dob || "Not provided";
    $("profileContact").textContent = user.contact || "Not provided";
    $("profileEmail").textContent = user.email || "Not provided";
    $("profileAddress").textContent = user.address || "Not provided";
    $("currentProfilePhoto").src = user.profilePhoto || "./images/profile-1.jpg";
  }

  // Save profile form data back to user object and localStorage
  function saveProfileData() {
    user.firstName = firstNameInput.value.trim();
    user.lastName = lastNameInput.value.trim();
    user.email = emailInput.value.trim().toLowerCase();
    user.dob = dobInput.value;
    user.contact = contactInput.value.trim();
    user.course = courseInput.value;
    user.address = addressInput.value.trim();
    user.profilePhoto = profilePreview.src;

    localStorage.setItem(userKey, JSON.stringify(user));
  }

  // Validate new password
  function validatePassword(current, newPass, confirmPass) {
    if (current !== user.password) {
      alert("Current password is incorrect.");
      return false;
    }
    if (newPass !== confirmPass) {
      alert("New passwords do not match!");
      return false;
    }
    if (newPass.length < 8) {
      alert("Password must be at least 8 characters long!");
      return false;
    }
    const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!pattern.test(newPass)) {
      alert("Password must contain at least one number and one special character!");
      return false;
    }
    return true;
  }

  // Setup tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const tabId = tab.getAttribute("data-tab") + "-tab";
      $(tabId).classList.add("active");
    });
  });

  // Open settings modal
  openSettingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loadProfileData();

    // Reset password inputs
    currentPassInput.value = "";
    newPassInput.value = "";
    confirmPassInput.value = "";

    // Default to profile tab
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    tabs[0].classList.add("active");
    tabContents[0].classList.add("active");

    settingsModal.classList.add("active");
  });

  // Close settings modal
  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove("active");
    }
  });

  // Cancel password button - switch back to profile tab and clear password inputs
  cancelPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newPassInput.value = "";
    confirmPassInput.value = "";
    currentPassInput.value = "";
    document.querySelector('[data-tab="profile"]').click();
  });

  // Profile photo upload and preview
  photoUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        profilePreview.src = event.target.result;
        photoUrlInput.value = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  });

  // Photo URL input updates preview
  photoUrlInput.addEventListener("input", () => {
    const url = photoUrlInput.value.trim();
    profilePreview.src = url || "./images/profile-1.jpg";
  });

  // Profile form submit
  $("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation
    if (!firstNameInput.value.trim() || !lastNameInput.value.trim() || !emailInput.value.trim()) {
      alert("Please fill in all required fields (First Name, Last Name, Email).");
      return;
    }

    saveProfileData();
    alert("Profile updated successfully!");
    settingsModal.classList.remove("active");
    loadProfileData(); // Update displayed profile info outside modal
  });

  // Password form submit
  $("passwordForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const currentPass = currentPassInput.value;
    const newPass = newPassInput.value;
    const confirmPass = confirmPassInput.value;

    if (!validatePassword(currentPass, newPass, confirmPass)) return;

    // Save new password in user object
    user.password = newPass;
    localStorage.setItem(userKey, JSON.stringify(user));
    alert("Password changed successfully!");

    // Clear inputs and switch back to profile tab
    currentPassInput.value = "";
    newPassInput.value = "";
    confirmPassInput.value = "";
    document.querySelector('[data-tab="profile"]').click();
  });

  // Initialize display on page load
  loadProfileData();
});
