<script>
  import { format, isPast, parseISO } from "date-fns";
  import { exportTaskAsICS, shareTask as shareTaskUtil } from "$lib/utils/export.js";

  export let task;
  export let laneIndex;
  export let onDragStart = () => {};

  $: isOverdue = task.due ? isPast(parseISO(task.due)) : false;
  $: dueFormatted = task.due ? format(parseISO(task.due), "dd.MM.yyyy") : "";
  $: createdFormatted = task.created ? format(parseISO(task.created), "dd.MM.yyyy HH:mm") : "";

  function handleExportICS() {
    exportTaskAsICS(task);
  }

  function handleShare() {
    shareTaskUtil(task, dueFormatted);
  }
</script>

<article
  draggable="true"
  on:dragstart={(e) => onDragStart(e, task, laneIndex)}
  class="group relative bg-white rounded-xl p-4 cursor-grab active:cursor-grabbing border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 {isOverdue ? 'ring-2 ring-red-400 ring-offset-2' : ''}"
>
  <!-- Overdue indicator -->
  {#if isOverdue}
    <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
      </svg>
    </div>
  {/if}

  <!-- Header -->
  <div class="flex items-start justify-between gap-3 mb-3">
    <h3 class="font-bold text-slate-900 text-base leading-tight flex-1">{task.title}</h3>
    {#if task.priority}
      <span class="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold {
        task.priority === 'High' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 ring-1 ring-red-200' :
        task.priority === 'Medium' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 ring-1 ring-amber-200' :
        'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 ring-1 ring-emerald-200'
      }">
        <span class="w-1.5 h-1.5 rounded-full {
          task.priority === 'High' ? 'bg-red-500' :
          task.priority === 'Medium' ? 'bg-amber-500' :
          'bg-emerald-500'
        }"></span>
        {task.priority}
      </span>
    {/if}
  </div>

  <!-- Description -->
  {#if task.desc}
    <p class="text-sm text-slate-600 mb-3 line-clamp-2">{task.desc}</p>
  {/if}

  <!-- Metadata -->
  <div class="flex flex-wrap gap-2 mb-3">
    {#if task.due}
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-xs {isOverdue ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-700'}">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span>{dueFormatted}</span>
      </div>
    {/if}
    
    {#if task.points}
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 rounded-lg text-xs text-violet-700 font-medium">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span>{task.points} SP</span>
      </div>
    {/if}
  </div>

  <!-- Actions -->
  <div class="flex gap-2 pt-3 border-t border-slate-100">
    <button 
      on:click={handleExportICS} 
      class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 rounded-lg transition-colors duration-200 text-xs font-medium group/btn"
      title="Export to Calendar"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span class="hidden sm:inline">Calendar</span>
    </button>
    <button 
      on:click={handleShare} 
      class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 rounded-lg transition-colors duration-200 text-xs font-medium group/btn"
      title="Share Task"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
      </svg>
      <span class="hidden sm:inline">Share</span>
    </button>
  </div>

  <!-- Created date tooltip -->
  {#if createdFormatted}
    <div class="mt-2 pt-2 border-t border-slate-100">
      <p class="text-xs text-slate-400">Created: {createdFormatted}</p>
    </div>
  {/if}
</article>
