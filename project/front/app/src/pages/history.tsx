import './css/history.css'
import React, {useEffect, useState} from 'react';
import ErrorToken, {setErrorLocalStorage} from '../components/IfError';
import {useNavigate, useParams} from 'react-router-dom';
import {cookies} from '../App'
import {useDispatch} from 'react-redux';
import {openModal} from '../redux/modal/modalSlice';
import axios from 'axios';
import { User } from './chat';

interface Game {
	finished: string;
	id: string;
	score1: number;
	score2: number;
	user1: User;
	user2: User;
}

const OneScoreBlock = ({ game, playerId }: { game: Game, playerId: string }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [leftImage, setLeftImage] = useState<string>('');
	const [rightImage, setRightImage] = useState<string>('');

	const [leftUser, setLeftUser] = useState<User>(game.user1);
	const [leftScore, setLeftScore] = useState<number>(game.score1);

	const [rightUser, setRightUser] = useState<User>(game.user2);
	const [rightScore, setRightScore] = useState<number>(game.score2);

	const [userWinner, setUserWinner] = useState<number>(1);

	
	const [messageWinner, setMessageWinner] = useState<string>('');

	useEffect(() => {
		console.log('try it')
		if (game.score2 > game.score1) {
			setUserWinner(2);
		}
		if (playerId == localStorage.getItem('id')) {
			if (game.user2.id == '' + localStorage.getItem('id')) {
				setLeftUser(game.user2);
				setLeftScore(game.score2)
				setRightUser(game.user1);
				setRightScore(game.score1);
				if (userWinner == 2) {
					setMessageWinner('You won');
				}
				else {
					setMessageWinner('You loose');
				}
			}
			else {
				if (userWinner == 1) {
					setMessageWinner('You won');
				}
				else {
					setMessageWinner('You loose');
				}
			}
		}
		else {
			if (game.user2.id == playerId) {
				setLeftUser(game.user2);
				setLeftScore(game.score2)
				setRightUser(game.user1);
				setRightScore(game.score1);
				if (userWinner == 2) {
					setMessageWinner(game.user2.username + ' won');
				}
				else {
					setMessageWinner(game.user2.username + ' loose');
				}
			}
			else {
				if (userWinner == 1) {
					setMessageWinner(game.user1.username + ' won');
				}
				else {
					setMessageWinner(game.user1.username + ' loose');
				}
			}
		}
	}, []);

	useEffect(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/user/image/' + playerId, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setLeftImage(data);
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
				return;
			});
		let image;
		if (game.user1.id == playerId) {
			image = game.user2.id;
		}
		else {
			image = game.user1.id;
		}
		axios.get(process.env.REACT_APP_IP + ':3000/user/image/' + image, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setRightImage(data);
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
				return;
			});
	}, [leftUser, rightUser, navigate]);

	if (messageWinner == '') {
		return null;
	}

	return (
		<div className='score-block'>
			<h3 className='status'>{messageWinner}</h3>
			<div className='history-score'>
				<div className='player'>
					<img className='image' src={leftImage} onClick={() => dispatch(openModal(leftUser.id))}
						title={leftUser.username}></img>
					<p>{leftScore}</p>
				</div>
				<p>against</p>
				<div className='player'>
					<img className='image' src={rightImage} onClick={() => dispatch(openModal(rightUser.id))}
						title={rightUser.username}></img>
					<p>{rightScore}</p>
				</div>
			</div>
		</div>
	);
};

const ListBlockScore = ({ userId, username }: { userId: string, username: string }) => {
	const [listGame, setListGame] = useState<Array<Game>>([]);

	const navigate = useNavigate();
	useEffect(() => {
		console.log(process.env.REACT_APP_IP + ':3000/game/history/' + userId);
		axios.get(process.env.REACT_APP_IP + ':3000/game/history/' + userId, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				console.log('here response histo');
				console.log(response);
				setListGame(response.data);
			})
			.catch((error) => {
				console.error(error);
				setErrorLocalStorage(error.response.status);
				navigate('/Error');
			})
	}, []);

	if (listGame == null || listGame.length == 0) {
		if (userId == '' + localStorage.getItem('id')) {
			return (<p className='no-game-played'>{"You don't have played a game yet!"}</p>);
		}
		else {
			return (<p className='no-game-played'>{ username + " has never yet played a game"}</p>);
		}
	}

	return (
		<div className='score-board'>
			{
				listGame.map((itemGame) => (
					itemGame.finished == 'FINISHED' ? (
						<div key={itemGame.id}>
							<OneScoreBlock
								game={itemGame}
								playerId={userId}
							/>
						</div>
					) : (
						<div key={itemGame.id}></div>
					)))
			}
		</div>
	);
}

const History = () => {
	const navigate = useNavigate();
	const [id, setId] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const test = useParams();

		const fetchDataUser = () => {
			const url = window.location.href;
			let index = 0;
			let count = 0;
			while (url.charAt(index)) {
				if (url.charAt(index) == '/') {
					count++;
				}
				index++;
				if (count == 4) {
					break ;
				}
			}
			if (count < 4) {
				navigate('/home')
			}
			const param = url.substring(index);
			if (param.length > 0 ) {
				axios.get(process.env.REACT_APP_IP + ':3000/user/id/' + param, {
					headers: {
						Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
					},
				})
					.then((response) => {
						console.log(response);
						setId(response.data.id);
						setUsername(response.data.username);
					})
					.catch((error) => {
						if (error.response.status == 401 || error.response.status == 500) {
							setErrorLocalStorage('Error ' + error.response.status);
							console.error(error);
							navigate('/Error');
						}
						else (
							navigate('/home')
						)
					});
			}
			else {
				navigate('/home');
			}
		};

	useEffect(() => {
		fetchDataUser();

		return () => {
			fetchDataUser();
		};
	}, [window.location.href, navigate, test]);

	if (id == '') {
		return (null);
	}
	return (
		<div className='page-history'>
			<ErrorToken/>
			<header className='history-title'>
				<div>
					{'Historique'}
				</div>
			</header>
			<div className='scrollBlock'>
				<ListBlockScore userId={id} username={username} />
			</div>
		</div>
	);
}

export default History;
