<script>
  import Lane from "./Lane.svelte";
  import TaskDialog from "./TaskDialog.svelte";
  import { exportAllTasksAsCSV } from "$lib/utils/export.js";
  import { detectUserCountry } from "$lib/utils/geolocation.js";
  import { requestNotificationPermission, showTaskNotification } from "$lib/utils/notifications.js";
  import { onMount } from "svelte";

  // Vier Spalten: Do, Doing, Done, Archiv
  let lanes = [
    { title: "Do", color: "from-violet-50 to-fuchsia-50", icon: "⚡", tasks: [] },
    { title: "Doing", color: "from-cyan-50 to-blue-50", icon: "🚀", tasks: [] },
    { title: "Done", color: "from-emerald-50 to-teal-50", icon: "✓", tasks: [] },
    { title: "Archiv", color: "from-slate-50 to-zinc-50", icon: "📦", tasks: [] }
  ];

  let showDialog = false;
  let newTask = { title: "", desc: "", due: "", points: "", priority: "" };
  let isBrowser = false;
  let userCountry = "Detecting location...";

  onMount(async () => {
    isBrowser = true;
    
    // Load saved data from localStorage
    const saved = localStorage.getItem("kanbanData");
    if (saved) {
      try {
        lanes = JSON.parse(saved);
      } catch (error) {
        console.warn("Failed to load saved data:", error);
      }
    }

    // Request notification permission
    await requestNotificationPermission();

    // Detect user location
    userCountry = await detectUserCountry();
  });

  function save() {
    if (isBrowser) {
      localStorage.setItem("kanbanData", JSON.stringify(lanes));
    }
  }

  function addTask() {
    if (!newTask.title.trim()) {
      alert("Title is required!");
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      desc: newTask.desc,
      due: newTask.due,
      points: newTask.points,
      priority: newTask.priority,
      created: new Date().toISOString()
    };

    lanes[0].tasks = [...lanes[0].tasks, task];
    save();
    
    newTask = { title: "", desc: "", due: "", points: "", priority: "" };
    showDialog = false;
  }

  function dragStart(e, task, from) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ task, from }));
    e.dataTransfer.effectAllowed = "move";
  }

  function drop(e, toIndex) {
    e.preventDefault();
    
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { task, from } = data;

    if (from === toIndex) return;

    lanes[from].tasks = lanes[from].tasks.filter((t) => t.id !== task.id);
    lanes[toIndex].tasks = [...lanes[toIndex].tasks, task];
    save();

    // Show notification when task moved to Done
    if (lanes[toIndex].title === "Done") {
      showTaskNotification(task, lanes[toIndex].title);
    }
  }

  function closeDialog() {
    showDialog = false;
    newTask = { title: "", desc: "", due: "", points: "", priority: "" };
  }

  function handleExportCSV() {
    exportAllTasksAsCSV(lanes);
  }
</script>

<main class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
  <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Header -->
    <header class="mb-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
            Kanban Board
          </h1>
          <p class="mt-2 text-slate-600 font-medium">Streamline your workflow with elegance</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            on:click={() => (showDialog = true)}
            class="group relative px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Task
            </span>
          </button>
          
          <button
            on:click={handleExportCSV}
            class="px-5 py-3 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Lanes Grid -->
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {#each lanes as lane, i}
        <Lane {lane} laneIndex={i} onDrop={drop} onDragStart={dragStart} />
      {/each}
    </section>

    <!-- Dialog -->
    <TaskDialog {showDialog} {newTask} {addTask} {closeDialog} />

    <!-- Footer -->
    <footer class="mt-12 pt-8 border-t border-slate-200">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span class="font-medium">{userCountry}</span>
        </div>
        
        <div class="text-center">
          <p class="font-medium text-slate-700">Designed by <span class="text-violet-600">Lea Lulaj</span></p>
          <p class="text-xs text-slate-500 mt-0.5">HTL Shkodër • 2025</p>
        </div>
        
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
            PWA Enabled
          </span>
        </div>
      </div>
    </footer>
  </div>
</main>
