import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, BookOpen, BarChart3, CheckCircle2, Circle, ChevronDown, ChevronUp, Clock, BookMarked, Trophy, Save, RotateCcw, Archive, Cloud, Loader2, User, History, ArrowLeft, AlertTriangle, CalendarDays, List, ChevronLeft, ChevronRight, CalendarRange, FileText, ClipboardCopy } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCWraijTFWxx8aHHic8ERSPZoMC2P0Cl64",
  authDomain: "plano-de-estudos-pcpa.firebaseapp.com",
  projectId: "plano-de-estudos-pcpa",
  storageBucket: "plano-de-estudos-pcpa.firebasestorage.app",
  messagingSenderId: "681484989295",
  appId: "1:681484989295:web:b83008bf2d6b391d30ae9a"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DADOS DO EDITAL ---
const editalData = [
  {
    id: 'd_penal',
    name: 'Direito Penal',
    topics: [
      { id: 'dp_1', title: '1. Princípios constitucionais' },
      { id: 'dp_2', title: '2. Lei penal no tempo e espaço' },
      { id: 'dp_3', title: '3. Teoria do crime' },
      { id: 'dp_4', title: '4. Concurso de pessoas' },
      { id: 'dp_5', title: '5. Penas e medidas' },
      { id: 'dp_6', title: '6. Crimes contra a pessoa' },
      { id: 'dp_7', title: '7. Crimes contra o patrimônio' },
      { id: 'dp_8', title: '8. Crimes contra a dignidade sexual' },
      { id: 'dp_9', title: '9. Crimes contra a fé pública' },
      { id: 'dp_10', title: '10. Crimes contra a adm. pública' }
    ]
  },
  {
    id: 'd_proc_penal',
    name: 'Processo Penal',
    topics: [
      { id: 'dpp_1', title: '1. Princípios do Processo Penal' },
      { id: 'dpp_2', title: '2. Inquérito Policial' },
      { id: 'dpp_3', title: '3. Ação Penal' },
      { id: 'dpp_4', title: '4. Prisão em flagrante' },
      { id: 'dpp_5', title: '5. Prisão preventiva/temporária' },
      { id: 'dpp_6', title: '6. Das provas' },
      { id: 'dpp_7', title: '7. Sujeitos do processo' }
    ]
  },
  {
    id: 'd_admin',
    name: 'Direito Administrativo',
    topics: [
      { id: 'da_1', title: '1. Organização administrativa' },
      { id: 'da_2', title: '2. Ato administrativo' },
      { id: 'da_3', title: '3. Agente público (Leis 022 e 5810)' },
      { id: 'da_4', title: '4. Poderes administrativos' },
      { id: 'da_5', title: '5. Licitações e Contratos' },
      { id: 'da_6', title: '6. Controle da administração' },
      { id: 'da_7', title: '7. Responsabilidade civil do Estado' }
    ]
  },
  {
    id: 'd_const',
    name: 'Direito Constitucional',
    topics: [
      { id: 'dc_1', title: '1. Direitos fundamentais' },
      { id: 'dc_2', title: '2. Direitos sociais e políticos' },
      { id: 'dc_3', title: '3. Organização do Estado' },
      { id: 'dc_4', title: '4. Administração Pública' },
      { id: 'dc_5', title: '5. Defesa do Estado e Segurança' }
    ]
  },
  {
    id: 'arquivologia',
    name: 'Arquivologia',
    topics: [
      { id: 'arq_1', title: '1. Conceitos fundamentais' },
      { id: 'arq_2', title: '2. Gestão de documentos' },
      { id: 'arq_3', title: '3. Ciclo vital dos documentos' },
      { id: 'arq_4', title: '4. Classificação e avaliação' },
      { id: 'arq_5', title: '5. Preservação e restauração' }
    ]
  },
  {
    id: 'estatistica',
    name: 'Estatística',
    topics: [
      { id: 'est_1', title: '1. População e amostra' },
      { id: 'est_2', title: '2. Gráficos e tabelas' },
      { id: 'est_3', title: '3. Medidas de tendência central' },
      { id: 'est_4', title: '4. Medidas de dispersão' },
      { id: 'est_5', title: '5. Probabilidade' }
    ]
  },
  {
    id: 'informatica',
    name: 'Informática',
    topics: [
      { id: 'inf_1', title: '1. Fundamentos de computação' },
      { id: 'inf_2', title: '2. Redes e Segurança' },
      { id: 'inf_3', title: '3. Internet, Navegadores, Email' },
      { id: 'inf_4', title: '4. SO (Windows e Linux)' },
      { id: 'inf_5', title: '5. Office e LibreOffice' },
      { id: 'inf_6', title: '6. Teoria da informação' }
    ]
  },
  {
    id: 'leg_esp',
    name: 'Legislação Especial',
    topics: [
      { id: 'leg_1', title: '1. Lei de Drogas' },
      { id: 'leg_2', title: '2. Lei Maria da Penha' },
      { id: 'leg_3', title: '3. Estatuto do Desarmamento' },
      { id: 'leg_4', title: '4. Crimes Hediondos' },
      { id: 'leg_5', title: '5. Abuso de Autoridade/Tortura' },
      { id: 'leg_6', title: '6. ECA (Crimes)' }
    ]
  },
  {
    id: 'portugues',
    name: 'Língua Portuguesa',
    topics: [
      { id: 'pt_1', title: '1. Compreensão de textos' },
      { id: 'pt_2', title: '2. Ortografia e Acentuação' },
      { id: 'pt_3', title: '3. Morfologia' },
      { id: 'pt_4', title: '4. Sintaxe' },
      { id: 'pt_5', title: '5. Pontuação e Concordância' }
    ]
  },
  {
    id: 'raciocinio',
    name: 'Raciocínio Lógico',
    topics: [
      { id: 'rl_1', title: '1. Estruturas e Lógica' },
      { id: 'rl_2', title: '2. Lógica proposicional' },
      { id: 'rl_3', title: '3. Equivalências e Negações' },
      { id: 'rl_4', title: '4. Operações com conjuntos' }
    ]
  },
  {
    id: 'para',
    name: 'Estado do Pará',
    topics: [
      { id: 'pa_1', title: '1. História do Pará' },
      { id: 'pa_2', title: '2. Geografia (Relevo, clima)' },
      { id: 'pa_3', title: '3. Economia e sociedade' }
    ]
  }
];

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const SLOTS_POR_DIA = 8;

const getMonthWeeks = (year, month) => {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  let curr = new Date(firstDay);
  
  const day = curr.getDay();
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
  curr.setDate(diff);

  let weekNum = 1;
  for (let i = 0; i < 6; i++) {
    const weekStart = new Date(curr);
    const weekEnd = new Date(curr);
    weekEnd.setDate(weekEnd.getDate() + 6);

    if (weekStart.getMonth() === month || weekEnd.getMonth() === month) {
      weeks.push({
        id: `${year}-${month}-W${weekNum}`,
        year,
        month,
        weekNum,
        start: new Date(weekStart),
        end: new Date(weekEnd),
        label: `${weekStart.getDate().toString().padStart(2,'0')}/${(weekStart.getMonth()+1).toString().padStart(2,'0')} a ${weekEnd.getDate().toString().padStart(2,'0')}/${(weekEnd.getMonth()+1).toString().padStart(2,'0')}`
      });
      weekNum++;
    }
    curr.setDate(curr.getDate() + 7);
  }
  return weeks;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('agenda'); 
  const [activeProfile, setActiveProfile] = useState('Melk');

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const [currentWeekName, setCurrentWeekName] = useState('Minha Semana');
  const [currentWeekInfo, setCurrentWeekInfo] = useState(null); 
  const [currentSchedule, setCurrentSchedule] = useState({});
  const [weeklyTemplate, setWeeklyTemplate] = useState({}); // NOVO ESTADO: Modelo Semanal
  const [savedWeeks, setSavedWeeks] = useState([]);
  const [topicStatuses, setTopicStatuses] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [pdfLinks, setPdfLinks] = useState({});

  const [toast, setToast] = useState(null);
  const [isConfirmingFinishWeek, setIsConfirmingFinishWeek] = useState(false);
  const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false);
  
  const [navYear, setNavYear] = useState(new Date().getFullYear());
  const [navMonth, setNavMonth] = useState(new Date().getMonth());

  const [historyViewMode, setHistoryViewMode] = useState('list');
  const [viewingHistoryWeek, setViewingHistoryWeek] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirmar', isDestructive: false
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const openConfirmModal = (title, message, onConfirm, confirmText = 'Confirmar', isDestructive = false) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, confirmText, isDestructive });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsConfirmingFinishWeek(false);
    setIsWeekSelectorOpen(false);
  };

  useEffect(() => {
    signInAnonymously(auth).catch(e => console.log("Auth opcional falhou:", e));
  }, []);

  useEffect(() => {
    setIsLoadingData(true);
    setConnectionError(null);

    const docRef = doc(db, 'dados_planejador', activeProfile);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentWeekName(data.currentWeekName || 'Minha Semana');
        setCurrentWeekInfo(data.currentWeekInfo || null);
        setCurrentSchedule(data.currentSchedule || {});
        setWeeklyTemplate(data.weeklyTemplate || {}); // Carrega o modelo
        setSavedWeeks(data.savedWeeks || []);
        setPdfLinks(data.pdfLinks || {});
        
        let loadedStatuses = data.topicStatuses || {};
        if (data.completedTopics && Object.keys(loadedStatuses).length === 0) {
          data.completedTopics.forEach(id => { loadedStatuses[id] = 'concluido'; });
        }
        setTopicStatuses(loadedStatuses);
      } else {
        setCurrentWeekName('Minha Semana');
        setCurrentWeekInfo(null);
        setCurrentSchedule({});
        setWeeklyTemplate({});
        setSavedWeeks([]);
        setTopicStatuses({});
        setPdfLinks({});
      }
      setIsLoadingData(false);
    }, (err) => {
      console.error("Erro ao carregar dados do Firestore", err);
      setConnectionError(`Erro no Banco de Dados: ${err.message}.`);
      setIsLoadingData(false);
    });

    return () => unsubscribe();
  }, [activeProfile]);

  const syncToCloud = async (dataToUpdate) => {
    setIsSyncing(true);
    try {
      const docRef = doc(db, 'dados_planejador', activeProfile);
      await setDoc(docRef, dataToUpdate, { merge: true });
      setIsSyncing(false);
      return true;
    } catch (e) {
      console.error("Erro a sincronizar", e);
      showToast(`Erro ao salvar: ${e.message}`, "error");
      setIsSyncing(false);
      return false;
    }
  };

  const handleWeekNameBlur = () => { syncToCloud({ currentWeekName }); };

  const selectWeekRange = (weekObj) => {
    setCurrentWeekInfo(weekObj);
    setIsWeekSelectorOpen(false);
    syncToCloud({ currentWeekInfo: weekObj });
  };

  const updateSchedule = (day, slotIndex, field, value) => {
    const key = `${day}-${slotIndex}`;
    const newSchedule = { ...currentSchedule };
    const slotData = newSchedule[key] || { subjectId: '', topicId: '', notes: '', status: '' };
    const newData = { ...slotData, [field]: value };
    
    if (field === 'subjectId') { newData.topicId = ''; newData.status = ''; }
    if (field === 'topicId') { newData.status = ''; }
    
    newSchedule[key] = newData;
    setCurrentSchedule(newSchedule);
    syncToCloud({ currentSchedule: newSchedule });
  };

  const triggerSaveProgress = async () => {
    const success = await syncToCloud({ currentSchedule, currentWeekName, currentWeekInfo });
    if(success) showToast('Progresso salvo com sucesso em todos os dispositivos!');
  };

  // NOVA FUNÇÃO: Salvar o modelo semanal
  const triggerSaveTemplate = async () => {
    const newTemplate = {};
    Object.keys(currentSchedule).forEach(key => {
      if (currentSchedule[key].subjectId) {
        newTemplate[key] = currentSchedule[key].subjectId; // Salva apenas a disciplina daquele bloco
      }
    });
    setWeeklyTemplate(newTemplate);
    const success = await syncToCloud({ weeklyTemplate: newTemplate });
    if(success) showToast('Modelo semanal salvo! As próximas semanas usarão estas disciplinas como padrão.');
  };

  // NOVA FUNÇÃO: Gerar nova agenda baseada no modelo
  const generateScheduleFromTemplate = () => {
    const nextSchedule = {};
    Object.keys(weeklyTemplate).forEach(key => {
      nextSchedule[key] = {
        subjectId: weeklyTemplate[key],
        topicId: '', // Limpa o assunto
        notes: '',   // Limpa as notas
        status: ''   // Limpa o status
      };
    });
    return nextSchedule;
  };

  const triggerFinishWeek = () => {
    if (!currentWeekInfo) {
      showToast('Por favor, selecione qual é a semana do calendário antes de finalizar.', 'error');
      setIsWeekSelectorOpen(true);
      return;
    }
    setIsConfirmingFinishWeek(true);
  };

  const cancelFinishWeek = () => setIsConfirmingFinishWeek(false);

  const confirmFinishWeek = () => {
    const newStatuses = { ...topicStatuses };
    let updatedCount = 0;

    Object.values(currentSchedule).forEach(slot => {
      if (slot.topicId && slot.status) {
        if (newStatuses[slot.topicId] !== slot.status) {
          newStatuses[slot.topicId] = slot.status;
          updatedCount++;
        }
      }
    });
    
    const newSavedWeek = {
      id: currentWeekInfo ? currentWeekInfo.id : Date.now(),
      name: currentWeekName,
      weekInfo: currentWeekInfo,
      schedule: currentSchedule,
      dateSaved: new Date().toLocaleDateString()
    };
    
    const filteredWeeks = savedWeeks.filter(w => w.id !== newSavedWeek.id);
    const newSavedWeeks = [newSavedWeek, ...filteredWeeks];

    // Aqui puxamos o modelo em vez de limpar tudo ({})
    const nextSchedule = generateScheduleFromTemplate();

    setTopicStatuses(newStatuses);
    setSavedWeeks(newSavedWeeks);
    setCurrentSchedule(nextSchedule);
    setCurrentWeekInfo(null);
    setCurrentWeekName('Nova Semana');
    setIsConfirmingFinishWeek(false);

    syncToCloud({
      topicStatuses: newStatuses,
      savedWeeks: newSavedWeeks,
      currentSchedule: nextSchedule,
      currentWeekInfo: null,
      currentWeekName: 'Nova Semana'
    });

    showToast(`Semana finalizada! O seu modelo de disciplinas foi recarregado.`);
  };

  const triggerResetWeek = () => {
    openConfirmModal(
      'Limpar a Grade Atual?',
      'Isso irá apagar os assuntos preenchidos nesta semana e restaurar as disciplinas do seu modelo salvo. Tem certeza?',
      () => {
        // Puxamos o modelo em vez de limpar tudo ({})
        const nextSchedule = generateScheduleFromTemplate();
        setCurrentSchedule(nextSchedule);
        setCurrentWeekInfo(null);
        setCurrentWeekName('Minha Semana');
        syncToCloud({ currentSchedule: nextSchedule, currentWeekInfo: null, currentWeekName: 'Minha Semana' });
        showToast('Agenda limpa e restaurada para o modelo padrão.');
      },
      'Sim, limpar',
      true
    );
  };

  const updateTopicStatus = (topicId, newStatus) => {
    const newStatuses = { ...topicStatuses };
    if (newStatus) newStatuses[topicId] = newStatus;
    else delete newStatuses[topicId];
    setTopicStatuses(newStatuses);
    syncToCloud({ topicStatuses: newStatuses });
  };

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  const progressStats = useMemo(() => {
    let totalTopics = 0;
    let totalCompleted = 0;
    const bySubject = {};

    editalData.forEach(subject => {
      const subjectTotal = subject.topics.length;
      const subjectCompleted = subject.topics.filter(t => 
        topicStatuses[t.id] === 'concluido' || topicStatuses[t.id] === 'revisando'
      ).length;
      
      totalTopics += subjectTotal;
      totalCompleted += subjectCompleted;
      
      bySubject[subject.id] = {
        name: subject.name,
        total: subjectTotal,
        completed: subjectCompleted,
        percentage: subjectTotal === 0 ? 0 : Math.round((subjectCompleted / subjectTotal) * 100)
      };
    });

    const overallPercentage = totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100);
    return { totalTopics, totalCompleted, overallPercentage, bySubject };
  }, [topicStatuses]);

  const getTopicAndSubjectName = (subjectId, topicId) => {
    const subject = editalData.find(s => s.id === subjectId);
    if (!subject) return { subjectName: 'Desconhecido', topicName: '' };
    const topic = subject.topics.find(t => t.id === topicId);
    return { subjectName: subject.name, topicName: topic ? topic.title : 'Assunto não selecionado' };
  };

  const groupScheduleBySubject = (schedule) => {
    const grouped = {};
    Object.values(schedule).forEach(slot => {
      if (slot.subjectId) {
        if (!grouped[slot.subjectId]) grouped[slot.subjectId] = [];
        grouped[slot.subjectId].push(slot);
      }
    });
    return grouped;
  };

  if (connectionError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-2xl max-w-lg text-center shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Falha de Conexão com o Firebase</h2>
          <p className="text-sm mb-6 leading-relaxed">{connectionError}</p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingData && !currentWeekName && !currentWeekInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="font-medium">A sincronizar globalmente o perfil de {activeProfile}...</p>
      </div>
    );
  }

  const isJhully = activeProfile === 'Jhully';
  const headerBgClass = isJhully ? 'bg-pink-200 text-pink-900' : 'bg-slate-900 text-white';
  const iconColorClass = isJhully ? 'text-pink-600' : 'text-blue-400';
  const subtitleColorClass = isJhully ? 'text-pink-700' : 'text-slate-400';
  const syncTextColorClass = isJhully ? 'text-pink-600' : 'text-blue-300';
  const syncedTextColorClass = isJhully ? 'text-emerald-600' : 'text-green-400';
  const progressBgClass = isJhully ? 'bg-pink-100 border-pink-300' : 'bg-slate-800 border-slate-700';
  const progressLabelClass = isJhully ? 'text-pink-600' : 'text-slate-400';
  const progressValueClass = isJhully ? 'text-pink-800' : 'text-blue-400';
  const progressTrackClass = isJhully ? 'bg-pink-300' : 'bg-slate-700';
  const progressFillClass = isJhully ? 'bg-pink-500' : 'bg-blue-500';
  const tabActiveClass = isJhully ? 'bg-white text-pink-900' : 'bg-white text-slate-900';
  const tabInactiveClass = isJhully ? 'text-pink-700 hover:bg-pink-300/50' : 'text-slate-300 hover:bg-slate-800';

  const weeksToDisplay = getMonthWeeks(navYear, navMonth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 relative">
      
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-6 text-white flex items-center gap-3 ${confirmModal.isDestructive ? 'bg-red-600' : (isJhully ? 'bg-pink-500' : 'bg-blue-600')}`}>
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-bold">{confirmModal.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-lg">{confirmModal.message}</p>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={closeConfirmModal} className="px-5 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button onClick={() => { confirmModal.onConfirm(); closeConfirmModal(); }} className={`px-5 py-2.5 rounded-lg font-bold text-white transition-colors ${confirmModal.isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                  {confirmModal.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-5 ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <header className={`${headerBgClass} shadow-md transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <BookMarked className={`w-8 h-8 ${iconColorClass}`} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PCPA Escrivão</h1>
              <div className={`flex items-center gap-2 text-sm ${subtitleColorClass}`}>
                Painel de Estudos - {activeProfile}
                <span>•</span>
                {isSyncing ? (
                  <span className={`flex items-center gap-1 ${syncTextColorClass}`}><Loader2 className="w-3 h-3 animate-spin" /> Guardando...</span>
                ) : (
                  <span className={`flex items-center gap-1 ${syncedTextColorClass}`}><Cloud className="w-3 h-3" /> Sincronizado</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/10">
              <button
                onClick={() => { setActiveProfile('Melk'); handleTabChange('agenda'); setViewingHistoryWeek(null); }}
                className={`flex items-center gap-1 px-5 py-1.5 rounded-full font-bold text-sm transition-all shadow-sm ${activeProfile === 'Melk' ? 'bg-blue-600 text-white ring-2 ring-white scale-105 z-10' : 'bg-blue-900/40 text-blue-100 hover:bg-blue-800'}`}
              >
                <User className="w-4 h-4" /> Melk
              </button>
              <button
                onClick={() => { setActiveProfile('Jhully'); handleTabChange('agenda'); setViewingHistoryWeek(null); }}
                className={`flex items-center gap-1 px-5 py-1.5 rounded-full font-bold text-sm transition-all shadow-sm ${activeProfile === 'Jhully' ? 'bg-pink-400 text-white ring-2 ring-white scale-105 z-10' : 'bg-pink-100/30 text-pink-700 hover:bg-pink-200/50'}`}
              >
                <User className="w-4 h-4" /> Jhully
              </button>
            </div>

            <div className={`hidden lg:flex items-center gap-4 px-4 py-2 rounded-lg border ${progressBgClass}`}>
              <div className="text-right">
                <p className={`text-xs uppercase tracking-wider font-bold ${progressLabelClass}`}>Progresso Edital</p>
                <p className={`font-bold text-lg ${progressValueClass}`}>{progressStats.overallPercentage}%</p>
              </div>
              <div className={`w-24 h-2 rounded-full overflow-hidden ${progressTrackClass}`}>
                <div className={`h-full transition-all duration-1000 ${progressFillClass}`} style={{ width: `${progressStats.overallPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 flex gap-1 mt-2 overflow-x-auto">
          <button onClick={() => { handleTabChange('agenda'); setViewingHistoryWeek(null); }} className={`flex items-center gap-2 px-5 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'agenda' ? tabActiveClass : tabInactiveClass}`}>
            <Calendar className="w-5 h-5" /> Agenda de {activeProfile}
          </button>
          <button onClick={() => { handleTabChange('historico'); setViewingHistoryWeek(null); }} className={`flex items-center gap-2 px-5 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'historico' ? tabActiveClass : tabInactiveClass}`}>
            <History className="w-5 h-5" /> Histórico
          </button>
          <button onClick={() => handleTabChange('edital')} className={`flex items-center gap-2 px-5 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'edital' ? tabActiveClass : tabInactiveClass}`}>
            <BookOpen className="w-5 h-5" /> Controle do Edital
          </button>
          <button onClick={() => handleTabChange('pdfs')} className={`flex items-center gap-2 px-5 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'pdfs' ? tabActiveClass : tabInactiveClass}`}>
            <FileText className="w-5 h-5" /> PDFs
          </button>
          <button onClick={() => handleTabChange('progresso')} className={`flex items-center gap-2 px-5 py-3 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'progresso' ? tabActiveClass : tabInactiveClass}`}>
            <BarChart3 className="w-5 h-5" /> Painel de Progresso
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* --- ABA: AGENDA --- */}
        {activeTab === 'agenda' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              
              <div className="flex-1 w-full lg:w-auto relative">
                <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsWeekSelectorOpen(!isWeekSelectorOpen)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors border-2 ${
                        currentWeekInfo 
                          ? (isJhully ? 'bg-pink-100 text-pink-800 border-pink-300' : 'bg-blue-100 text-blue-800 border-blue-300')
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <CalendarRange className="w-5 h-5" />
                      {currentWeekInfo ? `Semana ${currentWeekInfo.weekNum} de ${MESES[currentWeekInfo.month]} (${currentWeekInfo.label})` : 'Selecionar Semana do Calendário'}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button>
                  </div>

                  <input 
                    type="text" 
                    value={currentWeekName}
                    onChange={(e) => setCurrentWeekName(e.target.value)}
                    onBlur={handleWeekNameBlur}
                    placeholder="Deixe uma anotação ou nome (ex: Revisão Geral)..."
                    className="w-full lg:w-96 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors"
                  />

                  {isWeekSelectorOpen && (
                    <div className="absolute top-12 left-0 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
                        <button onClick={() => {
                          if (navMonth === 0) { setNavMonth(11); setNavYear(navYear - 1); }
                          else setNavMonth(navMonth - 1);
                        }} className="p-1 hover:bg-slate-700 rounded"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="font-bold">{MESES[navMonth]} {navYear}</span>
                        <button onClick={() => {
                          if (navMonth === 11) { setNavMonth(0); setNavYear(navYear + 1); }
                          else setNavMonth(navMonth + 1);
                        }} className="p-1 hover:bg-slate-700 rounded"><ChevronRight className="w-5 h-5" /></button>
                      </div>
                      <div className="p-2 space-y-1 bg-slate-50">
                        {weeksToDisplay.map(week => {
                          const isSelected = currentWeekInfo?.id === week.id;
                          return (
                            <button
                              key={week.id}
                              onClick={() => selectWeekRange(week)}
                              className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors border ${
                                isSelected 
                                  ? (isJhully ? 'bg-pink-100 border-pink-300 text-pink-900' : 'bg-blue-100 border-blue-300 text-blue-900') 
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div>
                                <div className="font-bold text-sm">Semana {week.weekNum}</div>
                                <div className="text-xs opacity-80">{week.label}</div>
                              </div>
                              {isSelected && <CheckCircle2 className="w-5 h-5" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 flex-wrap">
                
                {/* NOVO BOTÃO: Salvar Modelo */}
                <button 
                  onClick={triggerSaveTemplate}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  title="Salva as disciplinas atuais como o modelo padrão para as próximas semanas"
                >
                  <ClipboardCopy className="w-5 h-5" /> Salvar modelo
                </button>

                <button 
                  onClick={triggerSaveProgress}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border-2 ${isJhully ? 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
                >
                  <Save className="w-5 h-5" /> Salvar progresso
                </button>

                <div className="flex flex-col w-full sm:w-auto gap-1.5 relative">
                  <button 
                    onClick={triggerFinishWeek}
                    disabled={isConfirmingFinishWeek}
                    className={`w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm ${
                      isConfirmingFinishWeek ? 'bg-slate-400 cursor-default' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Archive className="w-5 h-5" /> Finalizar Semana
                  </button>
                  
                  {isConfirmingFinishWeek && (
                    <div className="absolute top-full mt-2 right-0 flex gap-2 w-full sm:w-[260px] animate-in fade-in slide-in-from-top-1 z-20">
                      <button onClick={cancelFinishWeek} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[11px] py-2 rounded font-bold shadow-md transition-colors border border-red-700">
                        Cancelar
                      </button>
                      <button onClick={confirmFinishWeek} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] py-2 rounded font-bold shadow-md transition-colors border border-emerald-700">
                        Confirmar Finalização
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={triggerResetWeek}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 px-4 py-2.5 rounded-lg font-medium transition-colors border border-slate-200 h-full"
                  title="Apagar a grade e restaurar para o modelo padrão"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto mb-8 relative z-0">
              <table className="w-full text-left border-collapse table-fixed min-w-[1000px] lg:min-w-0">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] md:text-xs font-bold tracking-wider">
                    <th className="p-2 md:p-3 border-b border-slate-200 w-12 md:w-16 text-center sticky left-0 bg-slate-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Horário</th>
                    {DIAS_SEMANA.map(dia => (
                      <th key={dia} className="p-2 md:p-3 border-b border-slate-200 w-[14%] text-center">{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: SLOTS_POR_DIA }).map((_, slotIndex) => (
                    <tr key={slotIndex} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 md:p-3 font-bold text-slate-400 text-center text-xs md:text-sm bg-slate-50/80 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-slate-100">
                        {slotIndex + 1}º
                      </td>
                      {DIAS_SEMANA.map(dia => {
                        const key = `${dia}-${slotIndex}`;
                        const slotData = currentSchedule[key] || { subjectId: '', topicId: '', notes: '', status: '' };
                        const subjectObj = editalData.find(s => s.id === slotData.subjectId);
                        
                        return (
                          <td key={dia} className="p-1 md:p-1.5 align-top">
                            <div className={`flex flex-col gap-1.5 p-1.5 rounded-lg border-2 transition-colors h-full ${slotData.subjectId ? 'bg-blue-50/30 border-blue-100' : 'bg-transparent border-transparent hover:border-slate-100'}`}>
                              
                              <div className="flex gap-1 items-center">
                                <select
                                  value={slotData.subjectId}
                                  onChange={(e) => updateSchedule(dia, slotIndex, 'subjectId', e.target.value)}
                                  className={`w-full p-1 text-[10px] md:text-xs rounded border focus:ring-0 focus:outline-none transition-colors ${
                                    slotData.subjectId ? 'bg-white border-blue-300 text-blue-900 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'
                                  }`}
                                >
                                  <option value="">+ Disciplina</option>
                                  {editalData.map(subj => (
                                    <option key={subj.id} value={subj.id}>{subj.name}</option>
                                  ))}
                                </select>
                                
                                {pdfLinks[slotData.subjectId] && pdfLinks[slotData.subjectId].trim() !== "" && (
                                  <a 
                                    href={pdfLinks[slotData.subjectId]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    title={`Abrir PDF de ${subjectObj?.name}`}
                                    className="p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded border border-red-200 flex items-center justify-center transition-colors shrink-0"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>

                              {subjectObj && (
                                <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <select
                                    value={slotData.topicId}
                                    onChange={(e) => updateSchedule(dia, slotIndex, 'topicId', e.target.value)}
                                    className="w-full p-1 text-[9px] md:text-[10px] rounded border border-emerald-200 bg-emerald-50 text-emerald-900 focus:outline-none focus:border-emerald-400 shadow-sm"
                                  >
                                    <option value="">Assunto...</option>
                                    {subjectObj.topics.map(topic => (
                                      <option key={topic.id} value={topic.id}>{topic.title}</option>
                                    ))}
                                  </select>

                                  <textarea 
                                    rows="1"
                                    value={slotData.notes}
                                    onChange={(e) => updateSchedule(dia, slotIndex, 'notes', e.target.value)}
                                    placeholder="Obs..."
                                    className="w-full p-1 text-[10px] rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-300 resize-none shadow-sm"
                                  />

                                  <div className="flex flex-col gap-0.5 mt-0.5">
                                    <button onClick={() => updateSchedule(dia, slotIndex, 'status', 'estudando')} className={`w-full text-[9px] py-1 rounded transition-colors leading-tight truncate px-1 ${slotData.status === 'estudando' ? 'bg-yellow-400 text-yellow-900 font-bold shadow-inner' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>Estudando</button>
                                    <button onClick={() => updateSchedule(dia, slotIndex, 'status', 'concluido')} className={`w-full text-[9px] py-1 rounded transition-colors leading-tight truncate px-1 ${slotData.status === 'concluido' ? 'bg-blue-400 text-blue-900 font-bold shadow-inner' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>Concluído</button>
                                    <button onClick={() => updateSchedule(dia, slotIndex, 'status', 'revisando')} className={`w-full text-[9px] py-1 rounded transition-colors leading-tight truncate px-1 ${slotData.status === 'revisando' ? 'bg-emerald-400 text-emerald-900 font-bold shadow-inner' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>Revisando</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* --- ABA: HISTÓRICO DE SEMANAS --- */}
        {activeTab === 'historico' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><History className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Histórico de Estudos</h2>
                  <p className="text-slate-500 text-sm mt-1">Veja exatamente o que estudou em cada semana.</p>
                </div>
              </div>
              
              <div className="flex items-center bg-slate-200 p-1 rounded-lg">
                <button onClick={() => setHistoryViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all ${historyViewMode === 'list' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>
                  <List className="w-4 h-4" /> Lista Empilhada
                </button>
                <button onClick={() => setHistoryViewMode('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-all ${historyViewMode === 'calendar' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>
                  <CalendarDays className="w-4 h-4" /> Visão Mensal
                </button>
              </div>
            </div>

            {savedWeeks.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm mt-8">
                <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum histórico encontrado</h3>
                <p className="text-slate-500 max-w-md mx-auto">Você ainda não finalizou nenhuma semana de estudos. Quando terminar sua agenda, clique em "Finalizar Semana" e ela aparecerá aqui.</p>
              </div>
            ) : (
              <>
                {historyViewMode === 'list' && (
                  <div className="space-y-6">
                    {savedWeeks.map(week => {
                      const groupedData = groupScheduleBySubject(week.schedule);
                      const hasContent = Object.keys(groupedData).length > 0;
                      
                      return (
                        <div key={week.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                          <div className="bg-slate-50 border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Archive className="w-5 h-5 text-indigo-500" />
                                {week.name}
                              </h3>
                              <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                {week.weekInfo ? (
                                  <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                    Semana {week.weekInfo.weekNum} de {MESES[week.weekInfo.month]} ({week.weekInfo.label})
                                  </span>
                                ) : (
                                  <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Semana sem data</span>
                                )}
                                <span className="text-xs">Finalizado em: {week.dateSaved}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-5">
                            {!hasContent ? (
                              <p className="text-slate-400 italic text-sm">Nenhum assunto foi registrado nesta semana.</p>
                            ) : (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                                {Object.entries(groupedData).map(([subjectId, slots]) => {
                                  const subjectObj = editalData.find(s => s.id === subjectId);
                                  if (!subjectObj) return null;
                                  
                                  const uniqueTopics = [];
                                  const seenTopics = new Set();
                                  
                                  slots.forEach(slot => {
                                    if (slot.topicId && !seenTopics.has(slot.topicId)) {
                                      seenTopics.add(slot.topicId);
                                      const topicObj = subjectObj.topics.find(t => t.id === slot.topicId);
                                      if (topicObj) uniqueTopics.push({...topicObj, status: slot.status, notes: slot.notes});
                                    }
                                  });

                                  if (uniqueTopics.length === 0) return null;

                                  return (
                                    <div key={subjectId} className="border border-slate-100 rounded-lg bg-slate-50 p-4">
                                      <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">{subjectObj.name}</h4>
                                      <ul className="space-y-3">
                                        {uniqueTopics.map((topic, idx) => {
                                          let badge = null;
                                          if (topic.status === 'estudando') badge = <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0">Estudando</span>;
                                          else if (topic.status === 'concluido') badge = <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0">Concluído</span>;
                                          else if (topic.status === 'revisando') badge = <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase shrink-0">Revisando</span>;

                                          return (
                                            <li key={idx} className="flex flex-col gap-1 bg-white p-2.5 rounded border border-slate-100 shadow-sm">
                                              <div className="flex justify-between items-start gap-2">
                                                <span className="text-sm font-medium text-slate-700">{topic.title}</span>
                                                {badge}
                                              </div>
                                              {topic.notes && <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-1.5 rounded">Obs: {topic.notes}</p>}
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {historyViewMode === 'calendar' && (
                  <div className="animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex items-center justify-between max-w-md mx-auto">
                      <button onClick={() => {
                        if (navMonth === 0) { setNavMonth(11); setNavYear(navYear - 1); }
                        else setNavMonth(navMonth - 1);
                      }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ChevronLeft className="w-6 h-6" /></button>
                      
                      <div className="text-xl font-bold text-indigo-900">{MESES[navMonth]} {navYear}</div>
                      
                      <button onClick={() => {
                        if (navMonth === 11) { setNavMonth(0); setNavYear(navYear + 1); }
                        else setNavMonth(navMonth + 1);
                      }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ChevronRight className="w-6 h-6" /></button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 text-center text-sm text-slate-500">
                        Clique nas semanas destacadas para ver os detalhes do que foi estudado.
                      </div>
                      <div className="grid grid-cols-1 divide-y divide-slate-100">
                        {weeksToDisplay.map(week => {
                          const savedWeekData = savedWeeks.find(w => w.id === week.id);
                          const isStudied = !!savedWeekData;
                          const isExpanded = viewingHistoryWeek?.id === week.id;

                          return (
                            <div key={week.id} className="flex flex-col">
                              <button 
                                onClick={() => isStudied && setViewingHistoryWeek(isExpanded ? null : savedWeekData)}
                                className={`p-4 flex items-center justify-between text-left transition-colors ${
                                  isStudied 
                                    ? (isExpanded ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'bg-white hover:bg-indigo-50/50 border-l-4 border-indigo-300') 
                                    : 'bg-slate-50 opacity-60 border-l-4 border-transparent cursor-default'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h4 className={`font-bold text-lg ${isStudied ? 'text-indigo-900' : 'text-slate-500'}`}>Semana {week.weekNum}</h4>
                                    {isStudied && <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Estudada</span>}
                                  </div>
                                  <p className="text-sm text-slate-500">{week.label}</p>
                                </div>
                                {isStudied && (
                                  <div className="text-indigo-400">
                                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                  </div>
                                )}
                              </button>

                              {isExpanded && isStudied && (
                                <div className="bg-white p-6 border-t border-indigo-100 animate-in slide-in-from-top-2">
                                  <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <BookMarked className="w-4 h-4 text-indigo-500" /> Resumo: {savedWeekData.name}
                                  </h5>
                                  
                                  {Object.keys(groupScheduleBySubject(savedWeekData.schedule)).length === 0 ? (
                                    <p className="text-sm italic text-slate-500">Nenhum conteúdo registrado nos blocos.</p>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {Object.entries(groupScheduleBySubject(savedWeekData.schedule)).map(([subjectId, slots]) => {
                                        const subjectObj = editalData.find(s => s.id === subjectId);
                                        if (!subjectObj) return null;
                                        
                                        const uniqueTopics = [];
                                        const seenTopics = new Set();
                                        slots.forEach(slot => {
                                          if (slot.topicId && !seenTopics.has(slot.topicId)) {
                                            seenTopics.add(slot.topicId);
                                            const topicObj = subjectObj.topics.find(t => t.id === slot.topicId);
                                            if (topicObj) uniqueTopics.push({...topicObj, status: slot.status});
                                          }
                                        });
                                        if(uniqueTopics.length === 0) return null;

                                        return (
                                          <div key={subjectId} className="border border-slate-200 rounded-lg p-3">
                                            <h6 className="font-bold text-sm text-slate-700 mb-2 border-b pb-1">{subjectObj.name}</h6>
                                            <ul className="space-y-1.5">
                                              {uniqueTopics.map((topic, i) => (
                                                <li key={i} className="flex items-center justify-between gap-2 text-xs">
                                                  <span className="text-slate-600 truncate">{topic.title}</span>
                                                  {topic.status === 'estudando' && <span className="bg-yellow-100 text-yellow-800 px-1.5 rounded font-bold uppercase text-[8px]">Estudando</span>}
                                                  {topic.status === 'concluido' && <span className="bg-blue-100 text-blue-800 px-1.5 rounded font-bold uppercase text-[8px]">Concluído</span>}
                                                  {topic.status === 'revisando' && <span className="bg-emerald-100 text-emerald-800 px-1.5 rounded font-bold uppercase text-[8px]">Revisando</span>}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* --- ABA: EDITAL (ASSUNTOS) --- */}
        {activeTab === 'edital' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Controle de Assuntos</h2>
                <p className="text-slate-500 text-sm mt-1">Status automático baseado nas semanas finalizadas, ou você pode alterar manualmente.</p>
              </div>
            </div>

            <div className="space-y-4">
              {editalData.map(subject => {
                const isExpanded = expandedSubjects[subject.id];
                const subjectProgress = progressStats.bySubject[subject.id];
                const isCompleted = subjectProgress.percentage === 100;

                return (
                  <div key={subject.id} className={`bg-white rounded-xl border transition-all ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-200 shadow-sm'}`}>
                    <button onClick={() => toggleSubject(subject.id)} className="w-full flex items-center justify-between p-5 text-left focus:outline-none">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <BookOpen className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${isCompleted ? 'text-green-800' : 'text-slate-800'}`}>{subject.name}</h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{subjectProgress.completed} de {subjectProgress.total} tópicos (concluídos/revisados) ({subjectProgress.percentage}%)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <div className="hidden sm:block w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${subjectProgress.percentage}%` }} />
                        </div>
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {subject.topics.map(topic => {
                            const status = topicStatuses[topic.id];
                            const isDoneOrReviewing = status === 'concluido' || status === 'revisando';
                            
                            let badge = null;
                            if (status === 'estudando') badge = <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded font-bold ml-auto whitespace-nowrap">Estudando</span>;
                            else if (status === 'concluido') badge = <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-bold ml-auto whitespace-nowrap">Concluído, falta revisar</span>;
                            else if (status === 'revisando') badge = <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold ml-auto whitespace-nowrap">Revisando</span>;

                            return (
                              <div key={topic.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors border border-transparent ${isDoneOrReviewing ? 'bg-slate-50 hover:bg-slate-100' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
                                <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                                  {status === 'estudando' && <Circle className="w-5 h-5 text-yellow-500 fill-yellow-100" />}
                                  {status === 'concluido' && <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />}
                                  {status === 'revisando' && <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />}
                                  {!status && <Circle className="w-5 h-5 text-slate-300" />}
                                  
                                  <select 
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    value={status || ''}
                                    onChange={(e) => updateTopicStatus(topic.id, e.target.value)}
                                    title="Alterar status do assunto"
                                  >
                                    <option value="">Não iniciado</option>
                                    <option value="estudando">Estudando</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="revisando">Revisando</option>
                                  </select>
                                </div>
                                <span className={`text-sm flex-1 ${isDoneOrReviewing ? 'text-slate-500 line-through' : 'text-slate-800 font-medium'}`}>{topic.title}</span>
                                {badge}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* --- ABA: PDFs e Materiais --- */}
        {activeTab === 'pdfs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Materiais e PDFs</h2>
                <p className="text-slate-500 text-sm mt-1">Cole os links do Google Drive (ou outros) para acessar as apostilas diretamente na sua Agenda.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {editalData.map(subject => (
                  <div key={subject.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 md:w-1/3">
                      <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FileText className="w-5 h-5"/></div>
                      <span className="font-bold text-slate-700">{subject.name}</span>
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="url"
                        placeholder="Cole o link aqui (ex: https://drive.google.com/...)"
                        value={pdfLinks[subject.id] || ''}
                        onChange={(e) => setPdfLinks(prev => ({...prev, [subject.id]: e.target.value}))}
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 bg-white"
                      />
                      <button
                        onClick={async () => {
                          const success = await syncToCloud({ pdfLinks: pdfLinks });
                          if(success) showToast(`Link de ${subject.name} salvo com sucesso!`);
                        }}
                        className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-lg text-sm transition-colors whitespace-nowrap shadow-sm"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- ABA: PROGRESSO --- */}
        {activeTab === 'progresso' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Trophy className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Progresso Geral</p>
                  <p className="text-3xl font-bold text-slate-800">{progressStats.overallPercentage}%</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-full"><CheckCircle2 className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Assuntos Avançados</p>
                  <p className="text-3xl font-bold text-slate-800">{progressStats.totalCompleted}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-slate-100 text-slate-600 rounded-full"><BookOpen className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tópicos Restantes</p>
                  <p className="text-3xl font-bold text-slate-800">{progressStats.totalTopics - progressStats.totalCompleted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho por Disciplina (Concluídos e Revisados)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {editalData.map(subject => {
                  const stat = progressStats.bySubject[subject.id];
                  return (
                    <div key={subject.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700">{stat.name}</span>
                        <span className="font-bold text-slate-600">{stat.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${stat.percentage === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1 text-right">{stat.completed} / {stat.total} assuntos</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}