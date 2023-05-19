import {useLocation} from "react-router-dom";


function URLgetChat(str:string):boolean {
    const segments = str.split('/');
    if (segments.length > 2) {

        const lastSegment = segments[2];
        
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
        return location.pathname.substring(0, location.pathname.indexOf('/', location.pathname.indexOf('/') + 1));
    }
    return location
}

export function JoinChat() {
    const location = window.location;
    if (!IsInAChat()) {
        let str = location.pathname.split('/')[1];
        str += "/chat";
        //const history = useNavigate();
        //history('/chat/');
        return (str);
    }
    return location.pathname;
}

export function KnowMyChannel():string {
    const str = window.location.pathname;
    const segments = str.split('/');
    if (IsInAChat() && segments.length > 3) {

        const lastSegment = segments[3];
        return lastSegment;
    }
    return 'General'
}


export function ChangeChannel(str:string) {
    
        const location = window.location;
        let next = location.pathname.split('/')[1];
        next += "/chat/";
        next += str;
        return next
    
}