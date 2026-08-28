import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ArrowRight } from 'lucide-react';

type QuestionType = 'text' | 'textarea' | 'single-select' | 'multi-select';

interface Question {
  id: string;
  section: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: string[];
  maxSelect?: number;
  placeholder?: string;
}

const questions: Question[] = [
  // [기본 정보]
  { id: 'q1', section: '기본 정보', title: '1. 이름을 알려주세요.', type: 'text', placeholder: '홍길동' },
  { id: 'q2', section: '기본 정보', title: '2. 나이를 알려주세요.', type: 'text', placeholder: '23' },
  { id: 'q3', section: '기본 정보', title: '3. 학교 / 학과 / 학년을 알려주세요.', subtitle: '휴학생이라면 함께 작성해주세요.', type: 'text', placeholder: '한국대 / 경영학과 / 3학년' },
  { id: 'q4', section: '기본 정보', title: '4. 연락 가능한 전화번호를 남겨주세요.', type: 'text', placeholder: '010-1234-5678' },
  { id: 'q5', section: '기본 정보', title: '5. 현재 거주 지역 또는 주로 활동하는 지역을 알려주세요.', subtitle: '예: 마포구 / 홍대·신촌 부근', type: 'text', placeholder: '서대문구 신촌동' },
  
  // [공부 & 목표]
  { id: 'q6', section: '공부 & 목표', title: '6. 현재 준비 중이거나 이번 학기에 공부하고 싶은 분야를 선택해주세요.', subtitle: '여러 개 선택 가능해요.', type: 'multi-select', options: ['자격증', '어학 (토익/오픽/JLPT 등)', '전공 공부', '취업/직무 공부', '공무원·각종 시험', '기타 자기계발 공부'] },
  { id: 'q7', section: '공부 & 목표', title: '7. 구체적으로 어떤 공부를 할 예정인가요?', subtitle: '예: 컴활 1급 / 토익 900점 / ADsP / 전공 시험 준비 등', type: 'text', placeholder: '컴활 1급 실기 준비' },
  { id: 'q8', section: '공부 & 목표', title: '8. 이번 학기가 끝나기 전에 이루고 싶은 목표를 하나 적어주세요.', subtitle: '크고 거창한 목표가 아니어도 괜찮습니다!', type: 'textarea', placeholder: '매주 3번 이상 스터디 참여해서 컴활 1급 따기' },
  { id: 'q9', section: '공부 & 목표', title: '9. 평소 공부할 때 나와 가장 가까운 유형은 무엇인가요?', type: 'single-select', options: ['계획부터 꼼꼼하게 세우는 편', '일단 시작하고 보는 편', '마감이 가까워져야 집중력이 올라가는 편', '혼자 하면 자꾸 미루게 되는 편', '주변에 공부하는 사람이 있으면 잘하는 편', '아직 나만의 공부 루틴을 찾는 중'] },
  { id: 'q10', section: '공부 & 목표', title: '10. Complete에 들어오면 가장 얻어가고 싶은 것은 무엇인가요?', subtitle: '최대 2개 선택 가능해요.', type: 'multi-select', maxSelect: 2, options: ['꾸준한 공부 습관', '자격증/시험 합격', '공부할 수 있는 환경', '서로 자극받을 수 있는 스터디원', '공부 정보 및 팁 공유', '새로운 대학생들과의 교류', '학기 동안 하나의 목표 완성하기'] },
  
  // [활동 가능 일정]
  { id: 'q11', section: '활동 가능 일정', title: '11. 대면 정기 스터디 참여가 가능한 요일을 모두 선택해주세요.', type: 'multi-select', options: ['월', '화', '수', '목', '금', '토', '일'] },
  { id: 'q12', section: '활동 가능 일정', title: '12. 참여하기 편한 시간대를 모두 선택해주세요.', type: 'multi-select', options: ['평일 오전', '평일 오후', '평일 18~20시', '평일 20시 이후', '주말 오전', '주말 오후', '주말 저녁'] },
  { id: 'q13', section: '활동 가능 일정', title: '13. 온라인 줌 스터디에도 참여할 의향이 있나요?', type: 'single-select', options: ['적극적으로 참여하고 싶어요', '일정이 맞으면 참여하고 싶어요', '대면 스터디 위주로 참여하고 싶어요'] },
  
  // [마지막 질문]
  { id: 'q14', section: '마지막 질문', title: '14. Complete에 지원하게 된 이유와 이번 학기 활동에 대한 각오를 자유롭게 작성해주세요.', subtitle: '“혼자 하면 자꾸 미뤄서 같이 공부하고 싶어요!”처럼 편하게 작성해주셔도 좋습니다.', type: 'textarea', placeholder: '여기에 작성해주세요...' },
];

function App() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      console.log('Submitted Answers:', answers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: val }));
  };

  const handleMultiSelect = (option: string, maxSelect?: number) => {
    const qId = questions[currentStep].id;
    const currentAnswers = answers[qId] || [];
    
    if (currentAnswers.includes(option)) {
      handleAnswer(currentAnswers.filter((item: string) => item !== option));
    } else {
      if (maxSelect && currentAnswers.length >= maxSelect) return;
      handleAnswer([...currentAnswers, option]);
    }
  };

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  const isAnswered = () => {
    const ans = answers[currentQ.id];
    if (currentQ.type === 'text' || currentQ.type === 'textarea') return !!ans && ans.trim().length > 0;
    if (currentQ.type === 'single-select') return !!ans;
    if (currentQ.type === 'multi-select') return ans && ans.length > 0;
    return false;
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-complete-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #A3FF00 0%, transparent 50%)' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 text-center max-w-md w-full"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-complete-green/30 text-complete-green text-sm font-semibold mb-6">
            대학생 연합 자격증 스터디
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">COMPLETE</h1>
          <h2 className="text-3xl font-bold mb-8 text-complete-green italic">2기 모집</h2>
          
          <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 text-left border border-white/10 shadow-2xl relative">
             <div className="absolute -top-3 -right-3 text-3xl">📝</div>
             <p className="text-gray-300 leading-relaxed text-center font-medium">
               함께라서 더 완벽하게!<br/>
               Complete와 함께 이번 학기<br/>
               목표를 달성해봐요 ✨
             </p>
          </div>

          <button 
            onClick={() => setStarted(true)}
            className="w-full bg-complete-green text-black font-bold text-lg py-4 rounded-xl hover:bg-[#8ee000] transition-colors flex items-center justify-center gap-2 group"
          >
            지원서 작성하기 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-complete-dark">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-complete-green rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold mb-4">지원이 완료되었습니다!</h2>
          <p className="text-gray-400">Complete 2기에 지원해주셔서 감사합니다.<br/>결과는 개별 안내해 드릴 예정입니다.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-complete-dark">
      {/* Header & Progress */}
      <header className="px-6 py-4 sticky top-0 bg-complete-dark/90 backdrop-blur-sm z-50">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-xl tracking-tight">COMPLETE</span>
          <span className="text-sm text-gray-400 font-medium">{currentQ.section}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-complete-green"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Question Area */}
      <main className="flex-1 flex flex-col justify-center px-6 py-8 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
              {currentQ.title}
            </h2>
            {currentQ.subtitle && (
              <p className="text-gray-400 mb-8 font-medium">{currentQ.subtitle}</p>
            )}

            <div className="mt-8">
              {currentQ.type === 'text' && (
                <input
                  type="text"
                  autoFocus
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && isAnswered()) handleNext() }}
                  className="w-full bg-transparent border-b-2 border-gray-700 text-2xl py-2 px-1 focus:outline-none focus:border-complete-green transition-colors text-white placeholder-gray-600"
                />
              )}

              {currentQ.type === 'textarea' && (
                <textarea
                  autoFocus
                  placeholder={currentQ.placeholder}
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 text-lg min-h-[150px] focus:outline-none focus:border-complete-green transition-colors resize-none"
                />
              )}

              {currentQ.type === 'single-select' && (
                <div className="flex flex-col gap-3">
                  {currentQ.options?.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => { handleAnswer(opt); setTimeout(handleNext, 300); }}
                        className={`text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between
                          ${isSelected ? 'border-complete-green bg-complete-green/10' : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-600'}
                        `}
                      >
                        <span className={`text-lg font-medium ${isSelected ? 'text-complete-green' : 'text-gray-200'}`}>{opt}</span>
                        {isSelected && <Check className="w-5 h-5 text-complete-green" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {currentQ.type === 'multi-select' && (
                <div className="flex flex-wrap gap-3">
                  {currentQ.options?.map((opt) => {
                    const currentAnswers = answers[currentQ.id] || [];
                    const isSelected = currentAnswers.includes(opt);
                    const isMaxReached = currentQ.maxSelect && !isSelected && currentAnswers.length >= currentQ.maxSelect;
                    
                    return (
                      <button
                        key={opt}
                        disabled={isMaxReached}
                        onClick={() => handleMultiSelect(opt, currentQ.maxSelect)}
                        className={`text-left px-5 py-3 rounded-xl border-2 transition-all font-medium text-lg
                          ${isSelected 
                            ? 'border-complete-green bg-complete-green/10 text-complete-green' 
                            : 'border-gray-800 bg-[#1a1a1a] text-gray-300 hover:border-gray-600'}
                          ${isMaxReached ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Nav */}
      <footer className="p-6 flex justify-between items-center bg-complete-dark/90 backdrop-blur-sm">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`p-3 rounded-full transition-colors ${currentStep === 0 ? 'opacity-30 cursor-not-allowed text-gray-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={handleNext}
          disabled={!isAnswered()}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all
            ${isAnswered() 
              ? 'bg-complete-green text-black hover:bg-[#8ee000] shadow-[0_0_15px_rgba(163,255,0,0.4)]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {currentStep === questions.length - 1 ? '제출하기' : '다음으로'} 
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}

export default App;
