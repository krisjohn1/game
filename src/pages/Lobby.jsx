import React from 'react';
import { Link } from 'react-router-dom';
import { Dices, Rocket, Cherry } from 'lucide-react';

export default function Lobby() {
  const games = [
    {
      id: 'slot',
      name: 'Sweet Bonanza',
      path: '/slot',
      icon: <Cherry className="w-12 h-12 text-pink-400 mb-4" />,
      color: 'from-pink-500 to-rose-500',
      description: 'Spin to win big with tumbling reels and multipliers!'
    },
    {
      id: 'crash',
      name: 'Rocket Crash',
      path: '/crash',
      icon: <Rocket className="w-12 h-12 text-blue-400 mb-4" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Cash out before the rocket crashes to multiply your bet.'
    },
    {
      id: 'dice',
      name: 'Dice Roll',
      path: '/dice',
      icon: <Dices className="w-12 h-12 text-purple-400 mb-4" />,
      color: 'from-purple-500 to-indigo-500',
      description: 'Set your chance and roll the dice for instant wins.'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Choose Your Game
        </h1>
        <p className="text-gray-400 text-lg">Play responsibly and aim for the stars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {games.map(game => (
          <Link 
            key={game.id} 
            to={game.path}
            className="group relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all overflow-hidden flex flex-col items-center text-center shadow-xl hover:shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
              {game.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {game.description}
            </p>

            <div className={`mt-6 px-6 py-2 rounded-full bg-gradient-to-r ${game.color} opacity-0 group-hover:opacity-100 transition-all font-bold text-white shadow-lg`}>
              PLAY NOW
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
