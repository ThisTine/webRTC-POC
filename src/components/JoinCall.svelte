<script lang="ts">
    import {addDoc, collection, doc,getDoc, updateDoc, onSnapshot} from "firebase/firestore";
    import {firestore} from "$lib/firebase/firebase.app";
    import {get} from "svelte/store";
    import {pc} from "$lib/store/pc";
    import {onMount} from "svelte";

    let callId = "";
    const peerConnection = get(pc)
    let status = "waiting";
    let videoRef:any;
    let localStream:any;
    const answerCall = async ()=>{
        const callDoc = doc(collection(firestore,"calls"),callId);
        const answerCandidates = collection(callDoc,"answerCandidates");
        const offerCandidates = collection(callDoc,"offerCandidates");
        peerConnection.onicecandidate = (event)=>{
            event.candidate && addDoc(answerCandidates,event.candidate.toJSON());
        }

        const callData = (await getDoc(callDoc)).data();

        const offerDescription = callData?.offer;
        await peerConnection.setRemoteDescription(offerDescription);

        const answerDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDescription);

        const answer = {
            type:answerDescription.type,
            sdp:answerDescription.sdp
        }

        await updateDoc(callDoc, {answer});

        onSnapshot(offerCandidates, async (snapshot)=>{
            for (const change of snapshot.docChanges()) {
                if(change.type === "added"){
                    let data = change.doc.data();
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data));
                }
            }
        })

        status = "connected";
    }
    $: if(videoRef){
        console.log(localStream,videoRef)
        videoRef.srcObject = localStream;
    }

    onMount(async ()=>{
        localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        localStream.getTracks().forEach((track:any)=>{
            peerConnection.addTrack(track,localStream);
        })

    })
</script>

<div class="bg-white flex-col gap-10 w-full max-w-screen-md flex justify-center items-center p-3 pt-10 rounded-lg" >
    {#if status === "waiting"}
        <h1 class="text-4xl" >Let's JOIN a new call</h1>
        <input bind:value={callId} class="p-5 border-2 border-gray-200 rounded-xl w-full text-center" placeholder="ID HERE"/>
        <button class="p-2 px-10 rounded bg-green-600 text-white text-lg hover:bg-green-700 transition" on:click={answerCall} >Join</button>
    {:else if status === "connected"}
        <video bind:this={videoRef} muted autoplay={true} />
        <h1 class="text-4xl" >Connected</h1>
    {/if}


</div>