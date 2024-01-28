<script>
    const enableVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
    }
</script>

<div class="bg-white flex-col gap-10 w-full max-w-screen-md flex justify-center items-center p-3 rounded-lg" >
    <h1 class="text-4xl" >Please enable video</h1>
    <button on:click={enableVideo} class="p-5 rounded bg-green-600 text-white text-lg hover:bg-green-700 transition" >Enable Video</button>
</div>