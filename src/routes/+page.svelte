<script>
    let name = "Lea";
    let count = 0;
  
    function add() {
      count += 1;
    }
  
    function reset() {
      count = 0;
    }
  </script>
  
  <main style="text-align:center; margin-top:80px; font-family:sans-serif;">
    <h1 style="color:#2563eb;">Hello {name}!</h1>
    <p>This is your first Svelte page </p>
  
    <h2 style="margin-top:40px;">Count: {count}</h2>
    <button on:click={add} style="padding:8px 16px; margin:6px; border:none; background:#2563eb; color:white; border-radius:6px; cursor:pointer;">
      ➕ Add
    </button>
    <button on:click={reset} style="padding:8px 16px; margin:6px; border:none; background:#e11d48; color:white; border-radius:6px; cursor:pointer;">
       Reset
    </button>
  </main>
  