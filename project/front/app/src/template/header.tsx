import './template.css'
import {Link, useNavigate} from 'react-router-dom';
import React from 'react';
import {useDispatch} from 'react-redux';
import {openModal} from '../redux/modal/modalSlice';
import SocketSingleton from '../socket';

// const cookies = new Cookies();

const Head = () => {
	const id = localStorage.getItem('id');
	const navigate = useNavigate();
	
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	socket.on('message_code', (data: any) => {
		console.log(data);
	});
	
	// const [id, setId] = useState<string | null>(null);
	// useEffect(() => {
	// 	axios.get(process.env.REACT_APP_IP + ':3000/user/id', {
	// 		headers: {
	// 			Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
	// 		},
	// 	})
	// 		.then((response) => {
	// 			console.log(response.data.id);
	// 			setId(response.data.id);
	// 			localStorage.setItem('id', response.data.id);
	// 		})
	// 		.catch((error) => {
	// 			setErrorLocalStorage('Error ' + error.response.status);
	// 			console.error(error);
	// 			navigate('/Error');
	// 		});
	// }, [navigate]);

	const dispatch = useDispatch();

	const handleOpenModal = (id: string | null) => {
		dispatch(openModal(id));
	};

	const handleChat = () => {
		navigate('/chat');
		window.location.reload();
	};

	const handleHisto = () => {
		navigate('/history/' + id);
		window.location.reload();
	};

	return (
		<div className='navbar'>
			<div className='navbar__link'>
				<Link to='/home' className='transcendance-link'>
					Transcendence
				</Link>
			</div>
			<div>
				<button onClick={() => handleChat()} className='navbar__link'>
					Chat
				</button>
				<Link to="/begingame" className="navbar__link">
					Game
				</Link>
				<button onClick={() => handleHisto()} className='navbar__link'>
					History
				</button>
				<button onClick={() => handleOpenModal(id)} className='navbar__link'>
					Profil
				</button>
			</div>
		</div>
	);
}

export default Head
