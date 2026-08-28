import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface ApplicationData {
  id: string;
  q1?: string; // 이름
  q2?: string; // 나이
  q3?: string; // 학교/학과/학년
  q4?: string; // 연락처
  q5?: string; // 지하철역
  q6?: string[]; // 준비 중인 분야
  q7?: string; // 구체적 공부
  q8?: string; // 목표
  q9?: string; // 공부 유형
  q10?: string[]; // 얻고 싶은 것
  q11?: string[]; // 대면 가능 요일
  q12?: string[]; // 대면 가능 시간
  q13?: string; // 온라인 참여 의향
  q14?: string; // 지원 이유/각오
  createdAt?: any;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '00347') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
      setPasswordInput('');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchApplications = async () => {
      try {
        const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as ApplicationData[];
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-complete-dark flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 shadow-2xl text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold text-white mb-6">관리자 로그인</h2>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-complete-dark border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-complete-green mb-6 text-center tracking-widest text-lg"
            autoFocus
          />
          <button type="submit" className="w-full bg-complete-green text-black font-bold py-3 rounded-xl hover:bg-[#8ee000] transition-colors">
            입장하기
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-complete-dark text-white flex items-center justify-center">
        <p className="text-2xl text-complete-green font-bold">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-complete-dark p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-black text-complete-green">관리자 페이지 - 지원서 목록</h1>
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-gray-800 font-bold">
            총 지원자: <span className="text-complete-green">{applications.length}</span>명
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-10 text-center text-gray-400">
            아직 제출된 지원서가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-complete-green/50 transition-colors shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">{app.q1 || '이름 없음'}</h2>
                  <span className="text-sm bg-complete-green/10 text-complete-green px-3 py-1 rounded-full font-medium">
                    {app.q2 ? `${app.q2}세` : '-'}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-300">
                  <p><strong className="text-gray-500">연락처:</strong> {app.q4}</p>
                  <p><strong className="text-gray-500">학교/학과:</strong> {app.q3}</p>
                  <p><strong className="text-gray-500">주요 역:</strong> {app.q5}</p>
                  
                  <div className="pt-2 border-t border-gray-800">
                    <strong className="text-gray-500 block mb-1">관심 분야:</strong>
                    <div className="flex flex-wrap gap-1">
                      {app.q6?.map(item => (
                        <span key={item} className="bg-gray-800 px-2 py-0.5 rounded text-xs">{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <strong className="text-gray-500 block mb-1">목표:</strong>
                    <p className="line-clamp-2">{app.q8}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-800">
                    <strong className="text-gray-500 block mb-1">가능 요일/시간:</strong>
                    <p>{app.q11?.join(', ')} / {app.q12?.join(', ')}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-800">
                    <strong className="text-gray-500 block mb-1">지원 동기:</strong>
                    <p className="line-clamp-3 italic text-gray-400">"{app.q14}"</p>
                  </div>
                  
                  {app.createdAt && (
                    <div className="pt-4 text-xs text-gray-600 text-right">
                      제출일: {new Date(app.createdAt.seconds * 1000).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
