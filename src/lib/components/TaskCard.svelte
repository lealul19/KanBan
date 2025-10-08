<script>
    export let task;
    export let onDragStart;
    export let laneIndex;
  </script>
  
  <article
    draggable="true"
    on:dragstart={(e) => onDragStart(e, task, laneIndex)}
    class="bg-white p-2 mb-2 rounded shadow cursor-grab hover:bg-gray-50 transition"
  >
    <h3 class="font-semibold">{task.title}</h3>
    <p class="text-sm text-gray-700">{task.desc}</p>
  </article>
  