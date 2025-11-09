import { motion } from 'framer-motion';
import { useState } from 'react';

const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      const offset = 80;
      const elementPosition = productsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const questions = [
    {
      question: "What's your ideal snacking moment?",
      options: ['Morning boost', 'Afternoon pick-me-up', 'Evening relaxation', 'Anytime munchies']
    },
    {
      question: "How do you like your flavors?",
      options: ['Sweet & subtle', 'Spicy & bold', 'Savory & salty', 'Natural & pure']
    },
    {
      question: "What matters most to you?",
      options: ['High protein', 'Low calories', 'Organic ingredients', 'Unique taste']
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  const getPersonality = () => {
    const personalities = [
      { name: 'The Health Warrior', icon: '💪', product: 'Plain Roasted' },
      { name: 'The Spice Lover', icon: '🌶️', product: 'Chili Garlic' },
      { name: 'The Sweet Tooth', icon: '🍯', product: 'Caramel Crunch' },
      { name: 'The Classic Snacker', icon: '🧂', product: 'Himalayan Salt' }
    ];
    return personalities[answers.length % personalities.length];
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Which Foxnut Are You?</h2>
            <p className="text-body">
              Take our fun personality quiz to discover your perfect foxnut match!
            </p>
          </div>

          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-body mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#EDEDED' }}>
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                      backgroundColor: '#F9C74F'
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="heading-3 mb-8 text-center">
                {questions[currentQuestion].question}
              </h3>

              {/* Options */}
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 rounded-xl border-2 transition-all duration-300 
                             text-left font-medium hover:shadow-lg focus:outline-none 
                             focus:ring-2 focus:ring-[#74B72E] focus:ring-offset-2"
                    style={{ 
                      borderColor: '#EDEDED',
                      backgroundColor: '#FAFFF7',
                      color: '#2F2F2F'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#74B72E';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(116, 183, 46, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#EDEDED';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                  >
                    <span className="mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center bg-subscribe-gradient"
            >
              <div className="text-7xl mb-6">{getPersonality().icon}</div>
              <h3 className="heading-2 text-white mb-4">You're {getPersonality().name}!</h3>
              <p className="text-xl mb-6 text-white opacity-90">
                Your perfect match: <strong>{getPersonality().product}</strong> Foxnuts
              </p>
              
              {/* Circular Progress Chart */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="25.12"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">90%</div>
                  <div className="text-sm">Match!</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-white rounded-full font-semibold transition-colors 
                           focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  style={{ color: '#2F2F2F' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFFF7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  aria-label="Retake personality quiz"
                >
                  Retake Quiz
                </button>
                <button 
                  onClick={scrollToProducts}
                  className="btn-primary px-8 py-3 rounded-full font-semibold 
                           focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  aria-label="Shop for your recommended foxnuts"
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default QuizSection;
