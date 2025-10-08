<script>
    import Lane from "./Lane.svelte";
  
    let lanes = [
      { title: "Backlog", color: "bg-red-200", tasks: [
        { id: 1, title: "Setup Project", desc: "Create folders and base files" },
        { id: 2, title: "Add Lanes", desc: "Build 4 columns for board" }
      ]},
      { title: "Doing", color: "bg-yellow-200", tasks: [] },
      { title: "Review", color: "bg-green-200", tasks: [] },
      { title: "Done", color: "bg-blue-200", tasks: [] }
    ];
  
    function dragStart(e, task, from) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ task, from }));
    }
  
    function drop(e, toIndex) {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { task, from } = data;
  
      // aus alter Lane entfernen
      lanes[from].tasks = lanes[from].tasks.filter((t) => t.id !== task.id);
  
      // in neue Lane hinzufügen
      lanes[toIndex].tasks.push(task);
    }
  </script>
  
  <main class="p-6 bg-sky-800 min-h-screen text-gray-800">
    <h1 class="text-white text-3xl font-bold mb-6 text-center">Kanban Board</h1>
  
    <section class="grid grid-cols-4 gap-4">
      {#each lanes as lane, i}
        <Lane {lane} laneIndex={i} onDrop={drop} onDragStart={dragStart} />
      {/each}
    </section>
  </main>
  