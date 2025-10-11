<script>
  import Lane from "./Lane.svelte";
  import TaskDialog from "./TaskDialog.svelte";
  import { onMount } from "svelte";

  let lanes = [
    { title: "Backlog", color: "bg-red-200", tasks: [] },
    { title: "Doing", color: "bg-yellow-200", tasks: [] },
    { title: "Review", color: "bg-green-200", tasks: [] },
    { title: "Done", color: "bg-blue-200", tasks: [] }
  ];

  let showDialog = false;
  let newTask = { title: "", desc: "", due: "", points: "", priority: "" };
  let isBrowser = false;

  // beim Start: LocalStorage lesen + Notification-Rechte holen
  onMount(() => {
    isBrowser = true;

    const saved = localStorage.getItem("kanbanData");
    if (saved) {
      try {
        lanes = JSON.parse(saved);
      } catch {
        console.warn("Error while loading data");
      }
    }

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  });

  // speichert alle Lanes im localStorage
  function save() {
    if (isBrowser) {
      localStorage.setItem("kanbanData", JSON.stringify(lanes));
    }
  }

  // neue Task hinzufügen → direkt im Backlog
  function addTask() {
    if (!newTask.title.trim()) return alert("Title required!");

    const task = {
      ...newTask,
      id: Date.now(),
      created: new Date().toISOString()
    };

    lanes[0].tasks.push(task);
    save();

    newTask = { title: "", desc: "", due: "", points: "", priority: "" };
    showDialog = false;

    // automatisch scrollen, damit neue Task sichtbar ist
    setTimeout(() => {
      const backlogCol = document.querySelector(".lane-backlog");
      if (backlogCol)
        backlogCol.scrollTo({ top: backlogCol.scrollHeight, behavior: "smooth" });
    }, 100);
  }

  // 🔹 Drag & Drop Funktionen
  function dragStart(e, task, from) {
    const data = { task, from };
    e.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  function drop(e, toIndex) {
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const { task, from } = data;

    lanes[from].tasks = lanes[from].tasks.filter((t) => t.id !== task.id);
    lanes[toIndex].tasks.push(task);
    save();

    // ✅ Notification bei "Done"
    if (lanes[toIndex].title === "Done" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("✅ Task Done", { body: task.title });
      } else {
        Notification.requestPermission();
      }
    }
  }

  function closeDialog() {
    showDialog = false;
  }
</script>

<main class="p-6 bg-sky-800 min-h-screen text-gray-800">
  <h1 class="text-white text-3xl font-bold mb-6 text-center">Kanban Board</h1>

  <!-- Button für neue Task -->
  <div class="flex justify-center mb-4">
    <button
      on:click={() => (showDialog = true)}
      class="bg-white text-sky-700 px-4 py-2 rounded shadow hover:bg-sky-100"
    >
      ➕ New Task
    </button>
  </div>

  <!-- 4 Spalten -->
  <section class="grid grid-cols-4 gap-4">
    {#each lanes as lane, i}
      <Lane {lane} laneIndex={i} onDrop={drop} onDragStart={dragStart} />
    {/each}
  </section>

  <!-- Dialog -->
  <TaskDialog
    {showDialog}
    {newTask}
    {addTask}
    {closeDialog}
  />
</main>
