<script>
    import Lane from "./Lane.svelte";
  
    // vier Spalten definieren
    let lanes = [
      { title: "Backlog", color: "bg-red-200" },
      { title: "Doing", color: "bg-yellow-200" },
      { title: "Review", color: "bg-green-200" },
      { title: "Done", color: "bg-blue-200" }
    ];
  </script>
  
  <main class="p-6 bg-sky-800 min-h-screen text-gray-800">
    <h1 class="text-white text-3xl font-bold mb-6 text-center">Kanban Board</h1>
  
    <!-- Layout mit 4 Spalten -->
    <section class="grid grid-cols-4 gap-4">
      {#each lanes as lane}
        <Lane {lane} />
      {/each}
    </section>
  </main>
  