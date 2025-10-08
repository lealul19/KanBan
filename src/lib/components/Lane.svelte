<script>
    import TaskCard from "./TaskCard.svelte";
    export let lane;
  </script>
  
  <div class="rounded-lg p-3 {lane.color} min-h-[400px]">
    <h2 class="text-lg font-semibold text-center mb-2">{lane.title}</h2>
  
    {#if lane.tasks.length === 0}
      <p class="text-sm text-center text-gray-500">No tasks yet</p>
    {:else}
      {#each lane.tasks as task (task.id)}
        <TaskCard {task} />
      {/each}
    {/if}
  </div>
  