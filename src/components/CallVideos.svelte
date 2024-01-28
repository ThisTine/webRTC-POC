<script lang="ts">
    import {callId} from "$lib/store/callId";
    import {pc as peerConnection} from "$lib/store/pc";
    import {get} from "svelte/store";
    let remoteStream = new MediaStream();
    let videoRef:HTMLVideoElement;
    let cid:null|string = null;
    $:if(videoRef){
        videoRef.srcObject = remoteStream;
    }
    callId.subscribe((v)=>cid=v as string);
    let pc = get(peerConnection);
    pc.ontrack = (ev)=>{
        console.log(ev)
       ev.streams[0].getTracks().forEach((track)=>{
           remoteStream.addTrack(track);
       });
    }
</script>

<div class=" py-5 bg-white w-full max-w-screen-md flex flex-col items-center" >
    <video class="w-full" bind:this={videoRef} autoplay />
    <h1 class="text-lg font-bold" >Please share this call id to your friends</h1>
    <h2>{cid}</h2>
</div>