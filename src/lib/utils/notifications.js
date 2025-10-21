
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}


export function showTaskNotification(task, lane, options = {}) {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported");
    return;
  }

  if (Notification.permission !== "granted") {
    console.warn("Notification permission not granted");
    return;
  }

  // Build notification body with task details
  const bodyParts = [];
  
  // Add task title (bold in some browsers)
  if (task.title) {
    bodyParts.push(task.title);
  }

  // Add description if available
  if (task.desc) {
    bodyParts.push(`📝 ${task.desc.substring(0, 100)}${task.desc.length > 100 ? "..." : ""}`);
  }

  // Add priority
  if (task.priority) {
    const priorityEmoji = {
      High: "🔴",
      Medium: "🟡",
      Low: "🟢"
    }[task.priority] || "⚡";
    bodyParts.push(`${priorityEmoji} Priority: ${task.priority}`);
  }

  // Add story points
  if (task.points) {
    bodyParts.push(`🎯 Story Points: ${task.points}`);
  }

  // Add due date
  if (task.due) {
    bodyParts.push(`📅 Due: ${task.due}`);
  }

  const notificationBody = bodyParts.join("\n");

  // Determine notification title based on lane
  const titles = {
    Done: "✅ Task Completed!",
    Do: "📋 Task Added to Backlog",
    Doing: "🚀 Task In Progress",
    Archiv: "📦 Task Archived"
  };

  const title = titles[lane] || `Task Moved to ${lane}`;

  try {
    new Notification(title, {
      body: notificationBody,
      icon: options.icon || "/icons/icon-192.png",
      badge: options.badge || "/icons/icon-192.png",
      tag: `task-${task.id}`, // Prevents duplicate notifications
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
      timestamp: Date.now(),
      ...options
    });
  } catch (error) {
    console.error("Failed to show notification:", error);
  }
}


export function showSimpleNotification(title, message, options = {}) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  try {
    new Notification(title, {
      body: message,
      icon: options.icon || "/icons/icon-192.png",
      ...options
    });
  } catch (error) {
    console.error("Failed to show notification:", error);
  }
}


export function areNotificationsAvailable() {
  return "Notification" in window && Notification.permission === "granted";
}

