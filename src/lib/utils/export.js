/**
 * Export utilities for Kanban board
 * Handles ICS, CSV, and sharing functionality
 */

/**
 * Formats a date for ICS file format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Exports a single task as an ICS calendar file
 * @param {Object} task - The task to export
 */
export function exportTaskAsICS(task) {
  if (!task.due) {
    alert("No due date set for this task.");
    return;
  }

  const start = new Date(task.due);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kanban Board//EN",
    "BEGIN:VEVENT",
    `UID:${task.id}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${task.title}`,
    `DESCRIPTION:${task.desc || ""}`,
    task.priority ? `PRIORITY:${task.priority === "High" ? "1" : task.priority === "Medium" ? "5" : "9"}` : "",
    "END:VEVENT",
    "END:VCALENDAR"
  ]
    .filter(Boolean)
    .join("\n");

  downloadFile(ics, `${task.title.replace(/\s+/g, "_")}.ics`, "text/calendar;charset=utf-8;");
}

/**
 * Exports all tasks from all lanes as CSV
 * @param {Array} lanes - Array of lane objects containing tasks
 */
export function exportAllTasksAsCSV(lanes) {
  const headers = ["Title", "Description", "Created", "Due Date", "Story Points", "Priority", "Lane"];
  const rows = [headers];

  lanes.forEach((lane) => {
    lane.tasks.forEach((task) => {
      rows.push([
        task.title || "",
        task.desc || "",
        task.created || "",
        task.due || "",
        task.points || "",
        task.priority || "",
        lane.title || ""
      ]);
    });
  });

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

  downloadFile(csv, "kanban_tasks.csv", "text/csv;charset=utf-8;");
}

/**
 * Shares a task using the Web Share API
 * @param {Object} task - The task to share
 * @param {string} dueFormatted - Formatted due date string
 */
export async function shareTask(task, dueFormatted = "") {
  if (!navigator.share) {
    alert("Sharing is not supported on this device.");
    return;
  }

  try {
    await navigator.share({
      title: task.title,
      text: `${task.title}\n\n${task.desc || "No description"}\n\nDue: ${dueFormatted || "No due date"}\nPriority: ${task.priority || "None"}\nStory Points: ${task.points || "Not set"}`,
    });
  } catch (error) {
    // User cancelled sharing or error occurred
    if (error.name !== "AbortError") {
      console.error("Error sharing:", error);
    }
  }
}

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

