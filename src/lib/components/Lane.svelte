<script>
    import TaskCard from "./TaskCard.svelte";
    export let lane;
    export let laneIndex;
    export let onDrop;
    export let onDragStart;
  </script>
  
  <div
    class="rounded-lg p-3 {lane.color} min-h-[400px]"
    on:dragover|preventDefault
    on:drop={(e) => onDrop(e, laneIndex)}
  >
    <h2 class="text-lg font-semibold text-center mb-2">{lane.title}</h2>
  
    {#if lane.tasks.length === 0}
      <p class="text-sm text-center text-gray-500">No tasks yet</p>
    {:else}
      {#each lane.tasks as task (task.id)}
        <TaskCard {task} {laneIndex} {onDragStart} />
      {/each}
    {/if}
  </div>
  