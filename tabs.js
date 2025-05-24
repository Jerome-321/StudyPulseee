document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const tabs = document.querySelectorAll(".settings-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      tabContents.forEach(tc => {
        tc.classList.remove("active");
        if (tc.id === tab.dataset.tab + "-tab") {
          tc.classList.add("active");
        }
      });
    });
  });
});
