<script>
  export let task;
  export let laneIndex;
  export let onDragStart = () => {};

  const today = new Date();
  let isOverdue = false;
  if (task.due) {
    const dueDate = new Date(task.due);
    isOverdue = today > dueDate;
  }
</script>

<article
  draggable="true"
  on:dragstart={(e) => onDragStart(e, task, laneIndex)}
  class="p-3 mb-2 rounded shadow cursor-grab transition 
  bg-white border-l-4 
  {isOverdue ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}"
>
  <!-- Task-Titel jetzt schwarz -->
  <h3 class="font-semibold text-black">{task.title}</h3>

  <!-- Beschreibung dunkler gemacht -->
  <p class="text-sm text-gray-800">{task.desc}</p>

  {#if task.due}
    <p class="text-xs text-gray-600">
      Due: {task.due} {isOverdue ? "⚠️" : ""}
    </p>
  {/if}
  {#if task.points}
    <p class="text-xs text-gray-600">Story Points: {task.points}</p>
  {/if}
  {#if task.priority}
    <p class="text-xs text-gray-600">Priority: {task.priority}</p>
  {/if}
</article>
