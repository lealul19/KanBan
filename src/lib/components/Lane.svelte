<script>
  import TaskCard from "./TaskCard.svelte";

  export let lane;
  export let laneIndex;
  export let onDrop = () => {};
  export let onDragStart = () => {};

  $: totalPoints = lane.tasks.reduce((sum, t) => {
    const value = Number(t.points);
    return sum + (isNaN(value) ? 0 : Math.max(0, value));
  }, 0);

  $: taskCount = lane.tasks.length;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="rounded-2xl bg-gradient-to-br {lane.color} border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
  on:dragover|preventDefault
  on:drop={(e) => onDrop(e, laneIndex)}
>
  <!-- Lane Header -->
  <div class="bg-white/80 backdrop-blur-md p-4 border-b border-slate-200/60">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">{lane.icon}</span>
      <h2 class="text-lg font-bold text-slate-800">
        {lane.title}
      </h2>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
        <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <span class="text-sm font-semibold text-slate-700">{taskCount}</span>
      </div>
      
      <div class="flex items-center gap-2 px-3 py-1.5 bg-violet-100 rounded-lg">
        <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span class="text-sm font-semibold text-violet-700">{totalPoints} SP</span>
      </div>
    </div>
  </div>

  <!-- Tasks Container -->
  <div class="p-4 min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto space-y-3">
    {#if lane.tasks.length === 0}
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-20 h-20 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">No tasks yet</p>
        <p class="text-xs text-slate-500">Drag tasks here to get started</p>
      </div>
    {:else}
      {#each lane.tasks as task (task.id)}
        <TaskCard {task} {laneIndex} {onDragStart} />
      {/each}
    {/if}
  </div>
</div>
