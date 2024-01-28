<script lang="ts">
    export let onClick:()=> Promise<void> ;
    let isLoading = false;
    let click = ()=> {
        isLoading = true;
        onClick().finally(()=> isLoading = false);
    }
</script>

<div class="bg-white flex-col gap-10 w-full max-w-screen-md flex justify-center items-center p-3 rounded-lg" >
    <h1 class="text-4xl" >Let's create a new call</h1>
    <button class="p-5 rounded bg-green-600 text-white text-lg hover:bg-green-700 transition disabled:bg-gray-400"
            disabled={isLoading} on:click={click} >Create Call</button>
    <div class="flex justify-center flex-col items-center">
        <p>or</p>
        <a class="text-blue-600 underline hover:text-blue-950" href="join">Join a new video</a>
    </div>
</div>