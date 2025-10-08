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
  </script>
  
  <main class="p-6 bg-sky-800 min-h-screen text-gray-800">
    <h1 class="text-white text-3xl font-bold mb-6 text-center">Kanban Board</h1>
  
    <section class="grid grid-cols-4 gap-4">
      {#each lanes as lane, i}
        <Lane {lane} />
      {/each}
    </section>
  </main>
  