<script>
  import TaskCard from "./TaskCard.svelte";
  export let lane;
  export let laneIndex;
  export let onDrop = () => {};
  export let onDragStart = () => {};

  $: totalPoints = lane.tasks.reduce(
    (sum, t) => sum + (parseInt(t.points) || 0),
    0
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="rounded-lg p-3 {lane.color} min-h-[400px] max-h-[80vh] overflow-y-auto"
  on:dragover|preventDefault
  on:drop={(e) => onDrop(e, laneIndex)}
>
  <!-- Titel jetzt schwarz -->
  <h2 class="text-lg font-bold text-center mb-2 text-black">{lane.title}</h2>

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
