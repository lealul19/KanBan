<script>
  export let showDialog;
  export let newTask;
  export let addTask;
  export let closeDialog;
</script>

{#if showDialog}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto"
    on:click={closeDialog}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div on:click|stopPropagation class="w-full max-w-md my-8">
      <dialog 
        open 
        class="relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden border border-white/20"
        style="box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.05);"
      >
        <!-- Close Button -->
        <button 
          type="button"
          on:click={closeDialog}
          class="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Dialog Content -->
        <form on:submit|preventDefault={addTask} class="p-8">
          <!-- Header -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-900 mb-1">New Task</h2>
            <p class="text-sm text-slate-500">Fill in the details to create a new task</p>
          </div>

          <div class="space-y-4">
            <!-- Title Field -->
            <div>
              <label for="task-title" class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Task Title <span class="text-red-500">*</span>
              </label>
              <input 
                id="task-title"
                class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all" 
                placeholder="e.g. Design homepage mockup" 
                bind:value={newTask.title} 
                required 
              />
            </div>

            <!-- Description Field -->
            <div>
              <label for="task-description" class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Description
              </label>
              <textarea 
                id="task-description"
                class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none" 
                placeholder="Add any additional details..." 
                rows="2"
                bind:value={newTask.desc}
              ></textarea>
            </div>

            <!-- Two Column Grid -->
            <div class="grid grid-cols-2 gap-3">
              <!-- Due Date -->
              <div>
                <label for="task-due" class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Due Date
                </label>
                <input 
                  id="task-due"
                  type="date" 
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all" 
                  bind:value={newTask.due} 
                />
              </div>

              <!-- Story Points -->
              <div>
                <label for="task-points" class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Story Points
                </label>
                <input 
                  id="task-points"
                  type="number" 
                  class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all" 
                  placeholder="0" 
                  min="0" 
                  bind:value={newTask.points} 
                />
              </div>
            </div>

            <!-- Priority Selector -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Priority Level
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  on:click={() => newTask.priority = 'Low'}
                  class="px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm {newTask.priority === 'Low' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}"
                >
                  Low
                </button>
                <button
                  type="button"
                  on:click={() => newTask.priority = 'Medium'}
                  class="px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm {newTask.priority === 'Medium' ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}"
                >
                  Medium
                </button>
                <button
                  type="button"
                  on:click={() => newTask.priority = 'High'}
                  class="px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm {newTask.priority === 'High' ? 'bg-red-50 border-red-400 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}"
                >
                  High
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 mt-6">
            <button 
              type="button" 
              on:click={closeDialog} 
              class="flex-1 px-4 py-2.5 text-slate-700 font-medium bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 shadow-sm hover:shadow transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </dialog>
    </div>
  </div>
{/if}
