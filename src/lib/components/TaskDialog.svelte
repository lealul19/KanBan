<script>
  export let showDialog;
  export let newTask;
  export let addTask;
  export let closeDialog;
</script>

{#if showDialog}
  <dialog
    open
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
  >
    <form
      class="bg-white p-6 rounded-lg w-[300px]"
      on:submit|preventDefault={addTask}
    >
      <h2 class="text-lg font-semibold mb-2">New Task</h2>

      <input
        class="w-full border p-1 mb-2"
        placeholder="Title"
        bind:value={newTask.title}
        required
      />
      <textarea
        class="w-full border p-1 mb-2"
        placeholder="Description"
        bind:value={newTask.desc}
      ></textarea>
      <input
        type="date"
        class="w-full border p-1 mb-2"
        bind:value={newTask.due}
      />
      <input
        type="number"
        class="w-full border p-1 mb-2"
        placeholder="Story Points"
        bind:value={newTask.points}
      />
      <select class="w-full border p-1 mb-2" bind:value={newTask.priority}>
        <option value="">Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <div class="flex justify-end space-x-2">
        <button type="button" on:click={closeDialog} class="text-gray-500">
          Cancel
        </button>
        <button type="submit" class="bg-sky-700 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>
    </form>
  </dialog>
{/if}
