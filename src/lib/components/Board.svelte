<script>
  import Lane from "./Lane.svelte";
  import TaskDialog from "./TaskDialog.svelte";
  import { onMount } from "svelte";

  // Feste Lanes mit deinen Namen
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

  onMount(() => {
    isBrowser = true;

    // Lade gespeicherte Daten
    const saved = localStorage.getItem("kanbanData");
    if (saved) {
      try { lanes = normalize(JSON.parse(saved)); } 
      catch { console.warn("Error loading data"); }
    }

    // Erlaubnis für Notifications
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    detectLocation();
  });

  // Korrigiere alte Titel (Backlog → To Do, Review → Done)
  function normalize(savedLanes) {
    const map = new Map([
      ["Backlog", "To Do"],
      ["Doing", "Doing"],
      ["Review", "Done"],
      ["Done", "Done"],
      ["Archive", "Archive"],
      ["To Do", "To Do"]
    ]);

    const bucket = { "To Do": [], "Doing": [], "Done": [], "Archive": [] };

    for (const lane of savedLanes || []) {
      const newTitle = map.get(lane.title) || "To Do";
      bucket[newTitle].push(...(lane.tasks || []));
    }

    const ordered = [
      { title: "To Do", color: "bg-red-200", tasks: bucket["To Do"] },
      { title: "Doing", color: "bg-yellow-200", tasks: bucket["Doing"] },
      { title: "Done", color: "bg-green-200", tasks: bucket["Done"] },
      { title: "Archive", color: "bg-blue-200", tasks: bucket["Archive"] }
    ];

    localStorage.setItem("kanbanData", JSON.stringify(ordered));
    return ordered;
  }

  function save() {
    if (isBrowser) localStorage.setItem("kanbanData", JSON.stringify(lanes));
  }

  // Neue Task landet in "To Do"
  function addTask() {
    if (!newTask.title.trim()) return alert("Title required!");
    const task = { ...newTask, id: Date.now(), created: new Date().toISOString() };
    lanes[0].tasks.push(task);
    save();
    newTask = { title: "", desc: "", due: "", points: "", priority: "" };
    showDialog = false;
  }

  // Drag & Drop
  function dragStart(e, task, from) {
    const data = { task, from };
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  function drop(e, toIndex) {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { task, from } = data;

    // Entferne aus alter Lane
    lanes[from].tasks = lanes[from].tasks.filter((t) => t.id !== task.id);

    // In neue Lane hinzufügen
    lanes[toIndex].tasks.push(task);
    save();

    // Wenn in Done -> Notification
    if (lanes[toIndex].title === "Done" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Task Done", { body: task.title });
      }
    }
  }

  function closeDialog() { showDialog = false; }

  // CSV-Export
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

  // GeoAPI
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

  <section class="grid grid-cols-4 gap-4 flex-grow">
    {#each lanes as lane, i}
      <Lane {lane} laneIndex={i} onDrop={drop} onDragStart={dragStart} />
    {/each}
  </section>

  <TaskDialog {showDialog} {newTask} {addTask} {closeDialog} />

  <footer class="text-center text-gray-300 mt-6 text-sm border-t border-gray-600 pt-3">
    Location: {userCountry}  
    • Lea Lulaj – HTL Shkodër 2025
  </footer>
</main>
