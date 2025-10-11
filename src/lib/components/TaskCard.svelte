<script>
  export let task;

  // prüft, ob Task überfällig ist
  const today = new Date();
  let isOverdue = false;

  if (task.due) {
    const dueDate = new Date(task.due);
    isOverdue = today > dueDate;
  }
</script>

<article
  draggable="true"
  class="p-2 mb-2 rounded shadow cursor-grab hover:bg-gray-50 transition 
    bg-white border-l-4 
    {isOverdue ? 'border-red-500 bg-red-50' : 'border-gray-200'}"
>
  <h3 class="font-semibold">{task.title}</h3>
  <p class="text-sm text-gray-700">{task.desc}</p>
  {#if task.due}
    <p class="text-xs text-gray-500">
      Due: {task.due} {isOverdue ? '⚠️' : ''}
    </p>
  {/if}
  {#if task.points}
    <p class="text-xs text-gray-500">Points: {task.points}</p>
  {/if}
  {#if task.priority}
    <p class="text-xs text-gray-500">Priority: {task.priority}</p>
  {/if}
</article>
