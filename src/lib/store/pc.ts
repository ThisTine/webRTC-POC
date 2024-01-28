import { readonly, writable} from "svelte/store";

export const stunServers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const peerConnection = writable(new RTCPeerConnection(stunServers))
export const pc = readonly(peerConnection)