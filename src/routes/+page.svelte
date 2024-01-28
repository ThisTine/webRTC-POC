<script lang="ts">
    import CreateCall from "../components/CreateCall.svelte";
    import EnableVideo from "../components/EnableVideo.svelte";
    import {firestore} from "$lib/firebase/firebase.app";
    import {collection, doc, addDoc, setDoc, onSnapshot} from 'firebase/firestore';
    import {pc, stunServers} from "$lib/store/pc";
    import {get} from "svelte/store";
    import CallVideos from "../components/CallVideos.svelte";
    import {callId} from "$lib/store/callId";
    import {onMount} from "svelte";
    let isCameraAllowed = false;
    if(typeof window !== 'undefined') {
        navigator.permissions.query({name: "camera"} as any).then(function(result) {
            isCameraAllowed = result.state === 'granted';
            result.onchange = function() {
                isCameraAllowed = result.state === 'granted';
            }
        });
    }

    let peerConnection = get(pc)


    let cId: string|null = null;
    callId.subscribe((id)=>{
        cId = id as string;
    })

    const callDoc = doc(collection(firestore, 'calls'))
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');
    console.log('pc', peerConnection)
    peerConnection.onicecandidate = (event) => {
        console.log('icecandidate event: ', event);
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            peerConnection.setRemoteDescription(answerDescription);
        }
    });

    onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                peerConnection.addIceCandidate(candidate);
            }
        });
    });

    onMount(async ()=>{
        let localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });
    })
    const onCreateCall = async () => {
        callId.set(callDoc.id)

        const offerDescription = await peerConnection.createOffer();

        await peerConnection.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await setDoc(callDoc, { offer });

    }


</script>

<main class="min-h-screen w-screen bg-gradient-to-r from-cyan-500 flex justify-center items-center to-blue-500">
    {#if isCameraAllowed}

        {#if cId}
            <CallVideos/>
        {:else }
            <CreateCall onClick={()=>onCreateCall()} />
            {/if}
    {:else}
        <EnableVideo/>
    {/if}
</main>