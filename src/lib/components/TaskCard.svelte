<script>
    export let task;
  </script>
  
  <article class="bg-white p-2 mb-2 rounded shadow hover:bg-gray-50 transition">
    <h3 class="font-semibold">{task.title}</h3>
    <p class="text-sm text-gray-700">{task.desc}</p>
  </article>
  