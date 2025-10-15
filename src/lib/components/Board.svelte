<script>
  import Lane from "./Lane.svelte";
  import TaskDialog from "./TaskDialog.svelte";
  import { onMount } from "svelte";

  // Vier Spalten mit Farben
  let lanes = [
    { title: "To Do", color: "bg-red-200", tasks: [] },
    { title: "Doing", color: "bg-yellow-200", tasks: [] },
    { title: "Done", color: "bg-green-200", tasks: [] },
    { title: "Archive", color: "bg-blue-200", tasks: [] }
  ];

  let showDialog = false;
  let newTask = { title: "", desc: "", due: "", points: "", priority: "" };
  let isBrowser = false;
  let userCountry = "Detecting location...";

  // Lädt gespeicherte Daten und Location
  onMount(() => {
    isBrowser = true;
    const saved = localStorage.getItem("kanbanData");
    if (saved) {
      try {
        lanes = JSON.parse(saved);
      } catch {
        console.warn("Error loading data");
      }
    }

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    detectLocation();
  });

  // Speichert in localStorage
  function save() {
    if (isBrowser) localStorage.setItem("kanbanData", JSON.stringify(lanes));
  }

  // ✅ Neue Task automatisch in "To Do" anzeigen (reaktiv)
  function addTask() {
    if (!newTask.title.trim()) return alert("Title required!");

    const task = { 
      ...newTask, 
      id: Date.now(), 
      created: new Date().toISOString() 
    };

    // ⚡ Statt push → neues Array für sofortige Reaktivität
    lanes[0].tasks = [...lanes[0].tasks, task];

    save();
    newTask = { title: "", desc: "", due: "", points: "", priority: "" };
    showDialog = false;
  }

  // Drag starten
  function dragStart(e, task, from) {
    const data = { task, from };
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  // Task fallen lassen (Drop)
  function drop(e, toIndex) {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { task, from } = data;

    lanes[from].tasks = lanes[from].tasks.filter((t) => t.id !== task.id);
    lanes[toIndex].tasks = [...lanes[toIndex].tasks, task]; // Reaktiv auch hier

    save();

    // Notification, wenn in Done verschoben
    if (lanes[toIndex].title === "Done" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Task Done", { body: task.title });
      }
    }
  }

  function closeDialog() {
    showDialog = false;
  }

  // Exportiert alle Tasks als CSV-Datei
  function exportCSV() {
    const rows = [["Title","Description","Due","Points","Priority","Lane"]];
    lanes.forEach(lane => {
      lane.tasks.forEach(task => {
        rows.push([
          task.title,
          task.desc || "",
          task.due || "",
          task.points || "",
          task.priority || "",
          lane.title
        ]);
      });
    });
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kanban_tasks.csv";
    link.click();
  }

  // GEO-Standort ermitteln
  async function detectLocation() {
    if (!navigator.geolocation) {
      userCountry = "Geolocation not supported.";
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        userCountry = data.countryName || "Unknown location";
      } catch {
        userCountry = "Location unavailable";
      }
    },
    () => {
      userCountry = "Location unavailable";
    });
  }
</script>

<main class="p-6 bg-gradient-to-br from-sky-800 to-blue-900 min-h-screen text-gray-100 flex flex-col">
  <h1 class="text-4xl font-bold mb-6 text-center tracking-wide">Kanban Board</h1>

  <div class="flex justify-center mb-4 space-x-3">
    <button
      on:click={() => (showDialog = true)}
      class="bg-white text-sky-800 font-semibold px-5 py-2 rounded shadow hover:bg-sky-100 transition"
    >
      + New Task
    </button>

    <button
      on:click={exportCSV}
      class="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition"
    >
      Export CSV
    </button>
  </div>

  <!-- Alle Lanes -->
  <section class="grid grid-cols-4 gap-4 flex-grow">
    {#each lanes as lane, i}
      <Lane {lane} laneIndex={i} onDrop={drop} onDragStart={dragStart} />
    {/each}
  </section>

  <!-- Dialog zum Hinzufügen -->
  <TaskDialog {showDialog} {newTask} {addTask} {closeDialog} />

  <!-- Footer -->
  <footer class="text-center text-gray-300 mt-6 text-sm border-t border-gray-600 pt-3">
    Location: {userCountry}  
    • Lea Lulaj – HTL Shkodër 2025
  </footer>
</main>
