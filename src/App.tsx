import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

type QuestionType = 'text' | 'textarea' | 'single-select' | 'multi-select' | 'station-search';

interface Question {
  id: string;
  section?: string;
  title: string | ((answers: Record<string, any>) => string);
  subtitle?: string;
  type: QuestionType;
  options?: string[];
  maxSelect?: number;
  placeholder?: string;
  subQuestion?: Question;
}

const questions: Question[] = [
  // [기본 정보]
  { id: 'q1', section: '기본 정보', title: '1. 이름을 알려주세요.', type: 'text', placeholder: '홍길동' },
  { id: 'q2', section: '기본 정보', title: (ans) => `2. 반가워요, ${ans.q1 || '지원자'}님! 나이를 알려주세요.`, type: 'text', placeholder: '23' },
  { id: 'q3', section: '기본 정보', title: '3. 학교 / 학과 / 학년을 알려주세요.', subtitle: '휴학생이라면 함께 작성해주세요.', type: 'text', placeholder: '한국대 / 경영학과 / 3학년' },
  { id: 'q4', section: '기본 정보', title: '4. 연락 가능한 전화번호를 남겨주세요.', type: 'text', placeholder: '010-1234-5678' },
  { id: 'q5', section: '기본 정보', title: '5. 주로 활동하는 지하철역을 선택해주세요.', subtitle: '모임 장소 선정을 위해 사용됩니다.', type: 'station-search' },
  
  // [공부 & 목표]
  { id: 'q6', section: '공부 & 목표', title: '6. 현재 준비 중이거나 이번 학기에 공부하고 싶은 분야를 선택해주세요.', subtitle: '여러 개 선택 가능해요.', type: 'multi-select', options: ['자격증', '어학 (토익/오픽/JLPT 등)', '전공 공부', '취업/직무 공부', '공무원·각종 시험', '기타 자기계발 공부'] },
  { id: 'q7', section: '공부 & 목표', title: '7. 구체적으로 어떤 공부를 할 예정인가요?', subtitle: '예: 컴활 1급 / 토익 900점 / ADsP / 전공 시험 준비 등', type: 'text', placeholder: '컴활 1급 실기 준비' },
  { id: 'q8', section: '공부 & 목표', title: '8. 이번 학기가 끝나기 전에 이루고 싶은 목표를 하나 적어주세요.', subtitle: '크고 거창한 목표가 아니어도 괜찮습니다!', type: 'textarea', placeholder: '매주 3번 이상 스터디 참여해서 컴활 1급 따기' },
  { id: 'q9', section: '공부 & 목표', title: '9. 평소 공부할 때 나와 가장 가까운 유형은 무엇인가요?', type: 'single-select', options: ['계획부터 꼼꼼하게 세우는 편', '일단 시작하고 보는 편', '마감이 가까워져야 집중력이 올라가는 편', '혼자 하면 자꾸 미루게 되는 편', '주변에 공부하는 사람이 있으면 잘하는 편', '아직 나만의 공부 루틴을 찾는 중'] },
  { id: 'q10', section: '공부 & 목표', title: '10. Complete에 들어오면 가장 얻어가고 싶은 것은 무엇인가요?', subtitle: '최대 2개 선택 가능해요.', type: 'multi-select', maxSelect: 2, options: ['꾸준한 공부 습관', '자격증/시험 합격', '공부할 수 있는 환경', '서로 자극받을 수 있는 스터디원', '공부 정보 및 팁 공유', '새로운 대학생들과의 교류', '학기 동안 하나의 목표 완성하기'] },
  
  // [활동 가능 일정]
  { 
    id: 'q11', 
    section: '활동 가능 일정', 
    title: '11. 대면 정기 스터디 참여가 가능한 요일을 모두 선택해주세요.', 
    type: 'multi-select', 
    options: ['월', '화', '수', '목', '금', '토', '일'],
    subQuestion: {
      id: 'q12',
      title: '참여하기 편한 시간대를 모두 선택해주세요.',
      subtitle: '해당 요일의 선호 시간대를 골라주세요.',
      type: 'multi-select',
      options: ['평일 오전', '평일 오후', '평일 18~20시', '평일 20시 이후', '주말 오전', '주말 오후', '주말 저녁']
    }
  },
  { id: 'q13', section: '활동 가능 일정', title: '12. 온라인 줌 스터디에도 참여할 의향이 있나요?', type: 'single-select', options: ['적극적으로 참여하고 싶어요', '일정이 맞으면 참여하고 싶어요', '대면 스터디 위주로 참여하고 싶어요'] },
  
  // [마지막 질문]
  { id: 'q14', section: '마지막 질문', title: (ans) => `13. 마지막으로, ${ans.q1 || '지원자'}님이 Complete에 지원하게 된 이유와 각오를 들려주세요!`, subtitle: '“혼자 하면 자꾸 미뤄서 같이 공부하고 싶어요!”처럼 편하게 작성해주셔도 좋습니다.', type: 'textarea', placeholder: '여기에 작성해주세요...' },
];

const seoulStations = [
  '강남역', '역삼역', '선릉역', '삼성역', '잠실역', '홍대입구역', '신촌역', '이대역', '합정역', 
  '건대입구역', '성수역', '왕십리역', '서울대입구역', '신림역', '사당역', '혜화역', '안암역', 
  '회기역', '노원역', '영등포역', '여의도역', '종로3가역', '을지로입구역', '명동역', '서울역', '용산역', '고속터미널역', '교대역', '신도림역', '당산역'
];

const StationSearch = ({ handleSelect }: { handleSelect: (s: string) => void }) => {
  const [query, setQuery] = useState('');
  
  const filtered = query.trim().length > 0 
    ? seoulStations.filter(s => s.includes(query))
    : [];

  return (
    <div className="w-full relative">
      <div className="relative group">
        <div className="absolute left-0 top-3.5 text-gray-400 text-2xl">🔍</div>
        <input
          type="text"
          autoFocus
          placeholder="예: 강남역, 홍대입구역"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent border-b-2 border-gray-700 text-3xl py-3 pl-12 pr-1 focus:outline-none focus:border-complete-green transition-colors text-white placeholder-gray-700"
        />
      </div>
      
      {query.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl p-2 shadow-2xl z-50 max-h-[250px] overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map(station => (
              <button
                key={station}
                onClick={() => handleSelect(station)}
                className="w-full text-left px-5 py-4 hover:bg-gray-800 rounded-xl transition-colors text-xl font-medium"
              >
                {station}
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-gray-500">
              "{query}" 역을 추천 목록에서 찾을 수 없습니다.<br/>
              <button 
                onClick={() => handleSelect(query + (query.endsWith('역') ? '' : '역'))}
                className="block mt-4 px-6 py-3 bg-gray-800 rounded-xl text-white hover:bg-gray-700 transition-colors font-bold"
              >
                '{query}{query.endsWith('역') ? '' : '역'}' (으)로 직접 입력하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && started && !isCompleted && isAnswered()) {
        const currentQ = questions[currentStep];
        if (currentQ.type !== 'textarea') {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, started, isCompleted, answers]);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      triggerConfetti();
      console.log('Submitted Answers:', answers);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ['#A3FF00', '#ffffff', '#333333'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswer = (qId: string, val: any) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleMultiSelect = (qId: string, option: string, maxSelect?: number) => {
    const currentAnswers = answers[qId] || [];
    if (currentAnswers.includes(option)) {
      handleAnswer(qId, currentAnswers.filter((item: string) => item !== option));
    } else {
      if (maxSelect && currentAnswers.length >= maxSelect) return;
      handleAnswer(qId, [...currentAnswers, option]);
    }
  };

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  const checkAns = (q: Question) => {
    const ans = answers[q.id];
    if (q.type === 'text' || q.type === 'textarea' || q.type === 'station-search') return !!ans && ans.trim().length > 0;
    if (q.type === 'single-select') return !!ans;
    if (q.type === 'multi-select') return ans && ans.length > 0;
    return false;
  }

  const isAnswered = () => {
    if (!currentQ) return false;
    const mainAnswered = checkAns(currentQ);
    if (mainAnswered && currentQ.subQuestion) {
      return checkAns(currentQ.subQuestion);
    }
    return mainAnswered;
  };

  const getTitle = (q: Question) => {
    if (typeof q.title === 'function') {
      return q.title(answers);
    }
    return q.title;
  };

  const BackgroundDecorations = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[10%] left-[10%] text-complete-green opacity-30 text-5xl md:text-7xl">★</motion.div>
      <motion.div animate={{ y: [0, 40, 0], x: [0, 20, 0], rotate: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }} className="absolute bottom-[20%] right-[10%] text-complete-green opacity-30 text-6xl md:text-8xl">✏️</motion.div>
      <motion.div animate={{ x: [0, 50, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute top-[30%] right-[15%] opacity-20 text-5xl">✈️</motion.div>
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-[15%] left-[20%] text-complete-green text-5xl">✅</motion.div>
    </div>
  );

  const renderInput = (q: Question) => {
    return (
      <div className="mt-6">
        {q.type === 'text' && (
          <div className="relative group">
            <input
              type="text"
              autoFocus
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-700 text-3xl py-3 px-1 focus:outline-none focus:border-complete-green transition-colors text-white placeholder-gray-700"
            />
            <div className="absolute right-0 bottom-4 text-complete-green opacity-0 group-focus-within:opacity-100 transition-opacity">
              <span className="text-sm font-bold bg-complete-green/20 px-2 py-1 rounded">Enter ↵</span>
            </div>
          </div>
        )}

        {q.type === 'station-search' && (
          <div className="relative mt-4">
            {answers[q.id] ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-4 px-6 py-4 bg-complete-green text-black rounded-full font-bold text-2xl shadow-[0_0_20px_rgba(163,255,0,0.4)]"
              >
                📍 {answers[q.id]}
                <button 
                  onClick={() => handleAnswer(q.id, '')}
                  className="ml-2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </motion.div>
            ) : (
              <StationSearch handleSelect={(station) => {
                handleAnswer(q.id, station);
                setTimeout(handleNext, 400);
              }} />
            )}
          </div>
        )}

        {q.type === 'textarea' && (
          <textarea
            autoFocus
            placeholder={q.placeholder}
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            className="w-full bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl p-5 text-xl min-h-[200px] focus:outline-none focus:border-complete-green transition-colors resize-none shadow-inner"
          />
        )}

        {q.type === 'single-select' && (
          <div className="flex flex-col gap-3">
            {q.options?.map((opt) => {
              const isSelected = answers[q.id] === opt;
              return (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  key={opt}
                  onClick={() => { 
                    handleAnswer(q.id, opt); 
                    if (!q.subQuestion) setTimeout(handleNext, 400); 
                  }}
                  className={`text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between
                    ${isSelected ? 'border-complete-green bg-complete-green/10 shadow-[0_0_15px_rgba(163,255,0,0.15)]' : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-600'}
                  `}
                >
                  <span className={`text-xl font-semibold ${isSelected ? 'text-complete-green' : 'text-gray-200'}`}>{opt}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <Check className="w-6 h-6 text-complete-green" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        )}

        {q.type === 'multi-select' && (
          <div className="flex flex-wrap gap-3">
            {q.options?.map((opt) => {
              const currentAnswers = answers[q.id] || [];
              const isSelected = currentAnswers.includes(opt);
              const isMaxReached = Boolean(q.maxSelect && !isSelected && currentAnswers.length >= q.maxSelect);
              
              return (
                <motion.button
                  whileHover={!isMaxReached ? { scale: 1.05 } : {}}
                  whileTap={!isMaxReached ? { scale: 0.95 } : {}}
                  key={opt}
                  disabled={isMaxReached}
                  onClick={() => handleMultiSelect(q.id, opt, q.maxSelect)}
                  className={`text-left px-6 py-4 rounded-2xl border-2 transition-all font-semibold text-lg
                    ${isSelected 
                      ? 'border-complete-green bg-complete-green text-black shadow-[0_0_15px_rgba(163,255,0,0.3)]' 
                      : 'border-gray-800 bg-[#1a1a1a] text-gray-300 hover:border-gray-600'}
                    ${isMaxReached ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    );
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-complete-dark relative overflow-hidden">
        <BackgroundDecorations />
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #A3FF00 0%, transparent 50%)' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="z-10 text-center max-w-md w-full relative"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block px-5 py-1.5 rounded-full border border-complete-green/40 text-complete-green text-sm font-bold mb-6 cursor-default shadow-[0_0_15px_rgba(163,255,0,0.2)] bg-complete-green/5"
          >
            대학생 연합 자격증 스터디
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-black mb-2 tracking-tighter"
            style={{ textShadow: '0 0 30px rgba(163,255,0,0.4)' }}
          >
            COMPLETE
          </motion.h1>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-10 text-complete-green italic"
          >
            2기 모집
          </motion.h2>
          
          <motion.div 
            initial={{ rotate: -2, y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="bg-[#1a1a1a] rounded-3xl p-8 mb-10 text-left border-2 border-complete-green/20 shadow-[0_0_30px_rgba(163,255,0,0.1)] relative"
          >
             <div className="absolute -top-5 -right-4 text-4xl transform rotate-12">📝</div>
             <div className="absolute -bottom-4 -left-4 text-4xl transform -rotate-12">📌</div>
             <p className="text-gray-200 leading-relaxed text-center font-bold text-lg">
               함께라서 더 완벽하게!<br/>
               Complete와 함께 이번 학기<br/>
               <span className="text-complete-green text-xl inline-block mt-1">목표를 달성해봐요</span> ✨
             </p>
          </motion.div>

          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, backgroundColor: '#8ee000' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="w-full bg-complete-green text-black font-black text-2xl py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(163,255,0,0.4)] hover:shadow-[0_0_40px_rgba(163,255,0,0.6)]"
          >
            지원서 작성하기 
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-complete-dark">
        <BackgroundDecorations />
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.6 }}
          className="text-center z-10"
        >
          <div className="w-24 h-24 bg-complete-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(163,255,0,0.5)]">
            <Check className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-4xl font-black mb-4">지원이 완료되었습니다!</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {answers.q1}님, Complete 2기에 지원해주셔서 감사합니다.<br/>
            좋은 결과로 곧 다시 뵙겠습니다! 💚
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-complete-dark relative">
      <BackgroundDecorations />
      
      <header className="px-6 py-4 sticky top-0 bg-complete-dark/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto w-full">
          <span className="font-black text-xl tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-complete-green" /> COMPLETE
          </span>
          <span className="text-sm px-3 py-1 bg-white/10 rounded-full text-gray-300 font-medium">
            {currentQ.section}
          </span>
        </div>
        <div className="w-full max-w-2xl mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-400 to-complete-green shadow-[0_0_10px_rgba(163,255,0,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-2xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
            className="w-full pb-20"
          >
            {/* 메인 질문 */}
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug break-keep">
              {getTitle(currentQ)}
            </h2>
            {currentQ.subtitle && (
              <p className="text-gray-400 mb-2 font-medium text-lg">{currentQ.subtitle}</p>
            )}
            
            {renderInput(currentQ)}

            {/* 서브 질문 (메인 질문에 답을 했을 때만 표시) */}
            <AnimatePresence>
              {currentQ.subQuestion && checkAns(currentQ) && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                  className="mt-16 pt-8 border-t border-gray-800"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-2 leading-snug break-keep text-complete-green">
                    {getTitle(currentQ.subQuestion)}
                  </h3>
                  {currentQ.subQuestion.subtitle && (
                    <p className="text-gray-400 mb-2 font-medium">{currentQ.subQuestion.subtitle}</p>
                  )}
                  {renderInput(currentQ.subQuestion)}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 py-6 flex justify-between items-center max-w-2xl mx-auto w-full z-50 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-complete-dark to-transparent pt-10">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`p-4 rounded-full transition-all ${currentStep === 0 ? 'opacity-0 cursor-default' : 'bg-[#1a1a1a] hover:bg-gray-800 text-white border border-white/10 shadow-lg'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <motion.button 
          whileHover={isAnswered() ? { scale: 1.05 } : {}}
          whileTap={isAnswered() ? { scale: 0.95 } : {}}
          onClick={handleNext}
          disabled={!isAnswered()}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xl transition-all duration-300
            ${isAnswered() 
              ? 'bg-complete-green text-black hover:bg-[#8ee000] shadow-[0_0_20px_rgba(163,255,0,0.4)]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-lg'
            }
          `}
        >
          {currentStep === questions.length - 1 ? '제출하기' : '다음으로'} 
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </footer>
    </div>
  );
}

export default App;
