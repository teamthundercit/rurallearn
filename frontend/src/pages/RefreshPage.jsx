import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RefreshPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [activity, setActivity] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const activities = [
    {
      id: 'music',
      title: 'Chill with Lo-Fi Music',
      icon: '🎵',
      description: 'Relax with some calming beats',
      component: MusicActivity
    },
    {
      id: 'breathing',
      title: 'Guided Breathing',
      icon: '🧘',
      description: 'Take deep breaths and center yourself',
      component: BreathingActivity
    },
    {
      id: 'game',
      title: 'Quick Brain Game',
      icon: '🎮',
      description: 'Warm up with a fun mini-game',
      component: GameActivity
    },
    {
      id: 'quotes',
      title: 'Motivational Quotes',
      icon: '💭',
      description: 'Get inspired with uplifting messages',
      component: QuotesActivity
    }
  ];

  useEffect(() => {
    // Select random activity
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    setActivity(randomActivity);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const ActivityComponent = activity.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-4xl">{activity.icon}</span>
          </div>
          
          <h1 className="text-4xl font-display font-black text-gradient-animate mb-2">
            Take a Quick Break 🌈
          </h1>
          
          <p className="text-gray-600 text-lg mb-4">
            {activity.description}
          </p>

          {/* Timer */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="text-2xl">⏱️</span>
            <span className="text-2xl font-bold text-primary-600">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-gray-500">remaining</span>
          </div>
        </div>

        {/* Activity Content */}
        <div className="card-gradient p-8 mb-6 animate-scale-in">
          <ActivityComponent />
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          {isComplete ? (
            <button
              onClick={handleContinue}
              className="btn-primary text-lg px-8 py-3"
            >
              Continue to Dashboard →
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="btn-secondary text-lg px-8 py-3"
            >
              Skip & Continue
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${((300 - timeLeft) / 300) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Music Activity Component
const MusicActivity = () => {
  const lofiTracks = [
    { title: 'Peaceful Piano', url: 'https://www.youtube.com/embed/jfKfPfyJRdk' },
    { title: 'Lofi Hip Hop', url: 'https://www.youtube.com/embed/5qap5aO4i9A' },
    { title: 'Study Beats', url: 'https://www.youtube.com/embed/lTRiuFIWV54' }
  ];

  const [selectedTrack] = useState(lofiTracks[Math.floor(Math.random() * lofiTracks.length)]);

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-gradient-animate mb-4">
        🎵 {selectedTrack.title}
      </h3>
      
      <div className="aspect-video rounded-xl overflow-hidden shadow-lg mb-4">
        <iframe
          width="100%"
          height="100%"
          src={`${selectedTrack.url}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <p className="text-gray-600">
        Close your eyes, take deep breaths, and let the music calm your mind
      </p>
    </div>
  );
};

// Breathing Activity Component
const BreathingActivity = () => {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [count, setCount] = useState(4);

  useEffect(() => {
    const phases = {
      inhale: { duration: 4, next: 'hold', text: 'Breathe In' },
      hold: { duration: 4, next: 'exhale', text: 'Hold' },
      exhale: { duration: 4, next: 'inhale', text: 'Breathe Out' }
    };

    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          setPhase(phases[phase].next);
          return phases[phases[phase].next].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-purple-400 to-purple-600';
      case 'exhale': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return '';
    }
  };

  return (
    <div className="text-center py-8">
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getPhaseColor()} rounded-full transition-all duration-1000 ${
            phase === 'inhale' ? 'scale-100' : phase === 'hold' ? 'scale-100' : 'scale-75'
          }`}
          style={{
            boxShadow: '0 0 60px rgba(99, 102, 241, 0.5)'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">
            <div className="text-6xl font-bold mb-2">{count}</div>
            <div className="text-xl font-semibold">{getPhaseText()}</div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-lg">
        Follow the circle and breathe deeply
      </p>
    </div>
  );
};

// Game Activity Component
const GameActivity = () => {
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState('');
  const [options, setOptions] = useState([]);

  const colors = [
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Pink', value: 'bg-pink-500' }
  ];

  useEffect(() => {
    generateRound();
  }, []);

  const generateRound = () => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    setTargetColor(shuffled[0]);
    setOptions(shuffled.slice(0, 4));
  };

  const handleClick = (color) => {
    if (color.name === targetColor.name) {
      setScore(prev => prev + 1);
    }
    generateRound();
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gradient-animate mb-2">
        Color Match Game
      </h3>
      
      <p className="text-gray-600 mb-6">
        Click the <span className="font-bold">{targetColor.name}</span> color!
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((color, index) => (
          <button
            key={index}
            onClick={() => handleClick(color)}
            className={`${color.value} h-24 rounded-xl shadow-lg hover:scale-105 transition-transform`}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 inline-block">
        <span className="text-gray-600">Score: </span>
        <span className="text-2xl font-bold text-primary-600">{score}</span>
      </div>
    </div>
  );
};

// Quotes Activity Component
const QuotesActivity = () => {
  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % quotes.length;
        setCurrentQuote(quotes[next]);
        return next;
      });
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="text-6xl mb-6">💭</div>
      
      <blockquote className="text-2xl font-serif text-gray-800 mb-4 italic">
        "{currentQuote.text}"
      </blockquote>
      
      <p className="text-lg text-gray-600">
        — {currentQuote.author}
      </p>

      <div className="flex justify-center gap-2 mt-6">
        {quotes.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? 'bg-primary-600 w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RefreshPage;
