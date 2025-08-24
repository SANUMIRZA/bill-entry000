<script>
  let entries = JSON.parse(localStorage.getItem("entries")) || [];
  let configuredYear = new Date().getFullYear();
  let configuredTrolley = "all";
  let editIndex = -1;

  // Auto-fill today's date
  window.onload = function() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("billDate").value = today;
    renderEntries();
    updateSummaryTable();
  };

  function saveData() {
    localStorage.setItem("entries", JSON.stringify(entries));
  }

  function applyConfig() {
    configuredYear = document.getElementById("configYear").value || new Date().getFullYear();
    configuredTrolley = document.getElementById("configTrolley").value;
    updateSummaryTable();
  }

  function addEntry() {
    let entry = {
      name: document.getElementById("personName").value,
      village: document.getElementById("village").value,
      trolley: document.getElementById("trolley").value,
      colour: document.getElementById("colour").value,
      billNo: document.getElementById("billNo").value,
      date: document.getElementById("billDate").value,
      status: "Pending",
      year: new Date(document.getElementById("billDate").value).getFullYear()
    };
    entries.push(entry);
    saveData();
    clearForm();
    renderEntries();
    updateSummaryTable();
  }

  function editEntry(index) {
    editIndex = index;
    let e = entries[index];
    document.getElementById("personName").value = e.name;
    document.getElementById("village").value = e.village;
    document.getElementById("trolley").value = e.trolley;
    document.getElementById("colour").value = e.colour;
    document.getElementById("billNo").value = e.billNo;
    document.getElementById("billDate").value = e.date;

    document.getElementById("addBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
  }

  function updateEntry() {
    let e = entries[editIndex];
    e.name = document.getElementById("personName").value;
    e.village = document.getElementById("village").value;
    e.trolley = document.getElementById("trolley").value;
    e.colour = document.getElementById("colour").value;
    e.billNo = document.getElementById("billNo").value;
    e.date = document.getElementById("billDate").value;
    e.year = new Date(document.getElementById("billDate").value).getFullYear();

    saveData();
    clearForm();
    document.getElementById("addBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";

    renderEntries();
    updateSummaryTable();
  }

  function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
      entries.splice(index, 1);
      saveData();
      renderEntries();
      updateSummaryTable();
    }
  }

  function clearForm() {
    document.getElementById("personName").value = "";
    document.getElementById("village").value = "";
    document.getElementById("billNo").value = "";
    document.getElementById("billDate").value = new Date().toISOString().split('T')[0];
  }

  function renderEntries() {
    let tbody = document.querySelector("#entriesTable tbody");
    tbody.innerHTML = "";
    let searchText = document.getElementById("searchBox").value?.toLowerCase() || "";

    entries.forEach((e, index) => {
      if (
        e.name.toLowerCase().includes(searchText) ||
        e.village.toLowerCase().includes(searchText) ||
        e.trolley.toLowerCase().includes(searchText) ||
        e.billNo.toLowerCase().includes(searchText)
      ) {
        let row = `<tr>
          <td>${e.name}</td>
          <td>${e.village}</td>
          <td>${e.trolley}</td>
          <td>${e.colour}</td>
          <td>${e.billNo}</td>
          <td>${e.date}</td>
          <td>
            ${e.status === "Completed" 
              ? '<span class="complete">Completed ✔</span><br><button class="btn" onclick="toggleStatus('+index+')">Mark Pending</button>' 
              : '<span class="pending">Pending ✖</span><br><button class="btn" onclick="toggleStatus('+index+')">Mark Completed</button>'}
          </td>
          <td>
            <button class="btn" onclick="editEntry(${index})">✏ Edit</button>
            <button class="btn deleteBtn" onclick="deleteEntry(${index})">🗑 Delete</button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
      }
    });
  }

  function toggleStatus(i) {
    entries[i].status = (entries[i].status === "Completed") ? "Pending" : "Completed";
    saveData();
    renderEntries();
    updateSummaryTable();
  }

  function updateSummaryTable() {
    let tbody = document.querySelector("#summaryTable tbody");
    tbody.innerHTML = "";
    let summary = {};

    entries.forEach(e => {
      if (e.year == configuredYear) {
        if (configuredTrolley === "all" || e.trolley === configuredTrolley) {
          if (!summary[e.trolley]) summary[e.trolley] = {pending:0, completed:0};
          if (e.status === "Completed") summary[e.trolley].completed++;
          else summary[e.trolley].pending++;
        }
      }
    });

    document.getElementById("yearPending").innerText = configuredYear + " Pending";
    document.getElementById("yearCompleted").innerText = configuredYear + " Completed";
    document.getElementById("yearTotal").innerText = configuredYear + " Total";

    if (configuredTrolley === "all") {
      let totalPending = 0, totalCompleted = 0;
      for (let t in summary) {
        totalPending += summary[t].pending;
        totalCompleted += summary[t].completed;
      }
      let row = `<tr>
        <td>All Trolleys</td>
        <td>${totalPending}</td>
        <td>${totalCompleted}</td>
        <td>${totalPending + totalCompleted}</td>
      </tr>`;
      tbody.innerHTML += row;
    } else {
      for (let trolley in summary) {
        let s = summary[trolley];
        let row = `<tr>
          <td>${trolley}</td>
          <td>${s.pending}</td>
          <td>${s.completed}</td>
          <td>${s.pending + s.completed}</td>
        </tr>`;
        tbody.innerHTML += row;
      }
    }
  }
</script>
