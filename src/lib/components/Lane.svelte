<script>
  import TaskCard from "./TaskCard.svelte";
  export let lane;
  export let laneIndex;
  export let onDrop;
  export let onDragStart;

  // Summe der Story Points berechnen
  $: totalPoints = lane.tasks.reduce(
    (sum, t) => sum + (parseInt(t.points) || 0),
    0
  );
</script>

<div
  class="lane-{lane.title.toLowerCase()} rounded-lg p-3 {lane.color} min-h-[400px] max-h-[80vh] overflow-y-auto"
  on:dragover|preventDefault
  on:drop={(e) => onDrop(e, laneIndex)}
>
  <h2 class="text-lg font-semibold text-center mb-2">{lane.title}</h2>

  <!-- Anzeige der Story Points -->
  <p class="text-sm text-center mb-3 text-gray-700">
    Total Points: <span class="font-bold">{totalPoints}</span>
  </p>

  {#if lane.tasks.length === 0}
    <p class="text-sm text-center text-gray-500">No tasks yet</p>
  {:else}
    {#each lane.tasks as task (task.id)}
      <TaskCard {task} {laneIndex} {onDragStart} />
    {/each}
  {/if}
</div>
