
document.addEventListener("DOMContentLoaded", () => {
  const userKey = "user";
  let user = JSON.parse(localStorage.getItem(userKey));

  if (!user) {
    alert("No user found. Redirecting to login...");
    window.location.href = "login.html";
    return;
  }

  const $ = (id) => document.getElementById(id);

  const updateProfileDisplay = (data) => {
    $("profileName").textContent = `${data.firstName || ""} ${data.lastName || ""}`;
    $("profileCourse").textContent = data.course || "Not provided";
    $("profileDob").textContent = data.dob || "Not provided";
    $("profileContact").textContent = data.contact || "Not provided";
    $("profileEmail").textContent = data.email || "Not provided";
    $("profileAddress").textContent = data.address || "Not provided";
    $("currentProfilePhoto").src = data.profilePhoto || "./images/profile-1.jpg";
  };

  const fillSettingsForm = (data) => {
    $("firstName").value = data.firstName || "";
    $("lastName").value = data.lastName || "";
    $("email").value = data.email || "";
    $("dob").value = data.dob || "";
    $("contact").value = data.contact || "";
    $("course").value = data.course || "";
    $("address").value = data.address || "";
    $("profilePreview").src = data.profilePhoto || "./images/profile-1.jpg";
    $("photoUrl").value = data.profilePhoto || "";
  };

  updateProfileDisplay(user);
  fillSettingsForm(user);

  $("photoUrl").addEventListener("input", () => {
    $("profilePreview").src = $("photoUrl").value || "./images/profile-1.jpg";
  });

  $("photoUpload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        $("profilePreview").src = event.target.result;
        $("photoUrl").value = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  $("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    user = {
      ...user,
      firstName: $("firstName").value,
      lastName: $("lastName").value,
      email: $("email").value.toLowerCase(),
      dob: $("dob").value,
      contact: $("contact").value,
      course: $("course").value,
      address: $("address").value,
      profilePhoto: $("photoUrl").value || "./images/profile-1.jpg",
    };
    localStorage.setItem(userKey, JSON.stringify(user));
    updateProfileDisplay(user);
    alert("Profile updated successfully!");
    $("settingsModal").style.display = "none";
  });

  $("openSettings").addEventListener("click", () => {
    $("settingsModal").style.display = "flex";
  });

  $("closeSettings").addEventListener("click", () => {
    $("settingsModal").style.display = "none";
  });
});
