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

  function exportICS() {
    if (!task.due) return alert("No due date.");
    const start = new Date(task.due);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const format = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kanban Board//EN",
      "BEGIN:VEVENT",
      `UID:${task.id}`,
      `DTSTAMP:${format(new Date())}`,
      `DTSTART:${format(start)}`,
      `DTEND:${format(end)}`,
      `SUMMARY:${task.title}`,
      `DESCRIPTION:${task.desc}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${task.title}.ics`;
    link.click();
  }

  function shareTask() {
    if (navigator.share) {
      navigator.share({
        title: task.title,
        text: `${task.title}\n${task.desc}\nDue: ${task.due || "no due date"}`
      });
    } else alert("Sharing not supported.");
  }
</script>

<article
  draggable="true"
  on:dragstart={(e) => onDragStart(e, task, laneIndex)}
  class="p-3 mb-2 rounded shadow cursor-grab transition bg-white border-l-4 
  {isOverdue ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}"
>
  <h3 class="font-semibold text-black">{task.title}</h3>
  <p class="text-sm text-gray-800">{task.desc}</p>

  {#if task.due}
    <p class="text-xs {isOverdue ? 'text-red-700' : 'text-gray-600'}">Due: {task.due}</p>
  {/if}
  {#if task.points}
    <p class="text-xs text-gray-600">Points: {task.points}</p>
  {/if}
  {#if task.priority}
    <p class="text-xs text-gray-600">Priority: {task.priority}</p>
  {/if}

  <div class="flex justify-between mt-2">
    <button on:click={exportICS} class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Calendar</button>
    <button on:click={shareTask} class="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700">Share</button>
  </div>
</article>
