import {useLocation } from "react-router-dom";


function URLgetChat(str:string):boolean {
    const segments = str.split('/');
    if (segments.length > 2) {

        const lastSegment = segments[2];
        console.log(segments.length);
        
        if (lastSegment.startsWith("chat")) {
            return true
        }
    }
	return false
}

export function IsInAChat(): boolean {
	return (URLgetChat(window.location.pathname));
}


export function DynamicIsInAChat(): boolean {
    return (URLgetChat(useLocation().pathname));
}

export function LeaveChat() {
    const location = window.location;
    if (IsInAChat()) {
        window.location.pathname = location.pathname.substring(0, location.pathname.indexOf('/', location.pathname.indexOf('/') + 1));
    }
}

export function JoinChat() {
    const location = window.location;
    if (!IsInAChat()) {
        var str = location.pathname.split('/')[1];
        str += "/chat";
        window.location.pathname = str;
    }
}

export function KnowMyChannel():string {
    const str = useLocation().pathname;
    const segments = str.split('/');
    if (IsInAChat() && segments.length > 3) {

        const lastSegment = segments[3];
        return lastSegment;
    }
    return '/'
}


export function ChangeChannel(str:string) {
    {
        const location = window.location;
        var next = location.pathname.split('/')[1];
        next += "/chat/";
        next += str;
        window.location.pathname = next;
    }
}