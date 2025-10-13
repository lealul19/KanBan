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
    if (!task.due) {
      alert("This task has no due date.");
      return;
    }

    const start = new Date(task.due);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//KanbanBoard//EN",
      "BEGIN:VEVENT",
      `UID:${task.id}@kanbanboard`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${task.title}`,
      `DESCRIPTION:${task.desc || ""}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${task.title.replace(/\s+/g, "_")}.ics`;
    link.click();
  }

  function formatDate(date) {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function shareTask() {
    const shareData = {
      title: task.title,
      text: `${task.title}\n${task.desc || ""}\nDue: ${task.due || "no date"}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        console.log("Share canceled or failed");
      });
    } else {
      alert("Sharing not supported in this browser.");
    }
  }
</script>

<article
  draggable="true"
  on:dragstart={(e) => onDragStart(e, task, laneIndex)}
  class="p-3 mb-2 rounded shadow cursor-grab transition 
  bg-white border-l-4 
  {isOverdue ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}"
>
  <h3 class="font-semibold">{task.title}</h3>
  <p class="text-sm text-gray-700">{task.desc}</p>

  {#if task.due}
    <p class="text-xs text-gray-500">
      Due: {task.due} {isOverdue ? "⚠️" : ""}
    </p>
  {/if}
  {#if task.points}
    <p class="text-xs text-gray-500">Story Points: {task.points}</p>
  {/if}
  {#if task.priority}
    <p class="text-xs text-gray-500">Priority: {task.priority}</p>
  {/if}

  <div class="flex justify-between mt-2">
    <button
      on:click={exportICS}
      class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
    >
      Add to Calendar
    </button>

    <button
      on:click={shareTask}
      class="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
    >
      Share
    </button>
  </div>
</article>
