import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeamMember } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';
import {
  MessageSquare,
  Send,
  AtSign,
  Link,
  CheckCheck,
  User,
  Filter,
} from 'lucide-react';

export const MessagesModule: React.FC = () => {
  const {
    currentUser,
    messages,
    sendMessage,
    markMessageRead,
    papricaClients,
    urbanoApartments,
    setActiveTab,
    setSelectedPapricaClientId,
    setSelectedUrbanoAptId,
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [selectedMentions, setSelectedMentions] = useState<TeamMember[]>([]);
  const [relatedType, setRelatedType] = useState<'nenhum' | 'paprica' | 'urbano'>('nenhum');
  const [relatedId, setRelatedId] = useState('');
  const [filterMode, setFilterMode] = useState<'todas' | 'minhas_mencoes'>('todas');

  const handleToggleMention = (name: TeamMember) => {
    if (selectedMentions.includes(name)) {
      setSelectedMentions(selectedMentions.filter((m) => m !== name));
    } else {
      setSelectedMentions([...selectedMentions, name]);
      setMessageText((prev) => (prev ? `${prev} @${name} ` : `@${name} `));
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    let relatedObj = undefined;
    if (relatedType === 'paprica' && relatedId) {
      const client = papricaClients.find((c) => c.id === relatedId);
      if (client) {
        relatedObj = {
          type: 'paprica_client' as const,
          id: client.id,
          name: client.name,
        };
      }
    } else if (relatedType === 'urbano' && relatedId) {
      const apt = urbanoApartments.find((a) => a.id === relatedId);
      if (apt) {
        relatedObj = {
          type: 'urbano_apartment' as const,
          id: apt.id,
          name: apt.code,
        };
      }
    }

    sendMessage(messageText, selectedMentions, relatedObj);
    setMessageText('');
    setSelectedMentions([]);
    setRelatedType('nenhum');
    setRelatedId('');
  };

  const filteredMessages = messages.filter((m) => {
    if (filterMode === 'minhas_mencoes') {
      return m.mentions.includes(currentUser);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-900" />
            <h1 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
              Caixa de Mensagens & Alinhamentos da Equipe
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Comunicação interna direta entre André, Nath, Manu e Jade com menções e vínculos a projetos e apartamentos.
          </p>
        </div>

        {/* Filter mode */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('todas')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              filterMode === 'todas'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todas as Mensagens ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('minhas_mencoes')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1 ${
              filterMode === 'minhas_mencoes'
                ? 'bg-red-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <AtSign className="w-3 h-3" /> Onde fui mencionado ({currentUser})
          </button>
        </div>
      </div>

      {/* Main Chat Feed + Composer */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
        {/* Messages List */}
        <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
          {filteredMessages.map((msg) => {
            const senderProfile = TEAM_MEMBERS.find((u) => u.id === msg.sender) || TEAM_MEMBERS[0];
            const isMe = msg.sender === currentUser;

            return (
              <div
                key={msg.id}
                onMouseEnter={() => !msg.isRead && markMessageRead(msg.id)}
                className={`p-4 rounded-lg border transition-colors ${
                  isMe
                    ? 'bg-stone-50/80 border-stone-200 ml-auto max-w-2xl'
                    : 'bg-white border-stone-200 mr-auto max-w-2xl'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: senderProfile.color }}
                    >
                      {senderProfile.avatarInitials}
                    </div>
                    <span className="font-bold text-xs text-stone-900">
                      {msg.sender}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      ({senderProfile.role.split('&')[0]})
                    </span>
                  </div>

                  <span className="text-[10px] text-stone-400">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {new Date(msg.timestamp).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Message Body */}
                <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap select-text">
                  {msg.text}
                </p>

                {/* Vínculo (Related item) */}
                {msg.relatedTo && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Link className="w-3 h-3 text-stone-400" />
                      Vinculado a:{' '}
                      <strong className="text-stone-800 font-medium">
                        {msg.relatedTo.name}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (msg.relatedTo?.type === 'paprica_client') {
                          setActiveTab('paprica');
                          setSelectedPapricaClientId(msg.relatedTo.id);
                        } else if (msg.relatedTo?.type === 'urbano_apartment') {
                          setActiveTab('urbano');
                          setSelectedUrbanoAptId(msg.relatedTo.id);
                        }
                      }}
                      className="text-[11px] text-red-800 hover:text-red-900 font-semibold underline"
                    >
                      Acessar item →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Message Composer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70 rounded-b-lg space-y-3">
          {/* Quick Mention Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-stone-400 flex items-center gap-0.5">
              <AtSign className="w-3 h-3" /> Mencionar:
            </span>
            {TEAM_MEMBERS.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleToggleMention(member.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedMentions.includes(member.id)
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                @{member.name}
              </button>
            ))}
          </div>

          {/* Vínculo selector */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-[11px] text-stone-400 flex items-center gap-0.5">
              <Link className="w-3 h-3" /> Vincular a:
            </span>
            <select
              value={relatedType}
              onChange={(e) => {
                setRelatedType(e.target.value as any);
                setRelatedId('');
              }}
              className="text-[11px] p-1 border border-stone-200 rounded bg-white text-stone-700 outline-none"
            >
              <option value="nenhum">Nenhum (Mensagem Geral)</option>
              <option value="paprica">Cliente Páprica</option>
              <option value="urbano">Apartamento Urbano.s</option>
            </select>

            {relatedType === 'paprica' && (
              <select
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                className="text-[11px] p-1 border border-stone-200 rounded bg-white text-stone-700 outline-none"
              >
                <option value="">Selecione o Cliente...</option>
                {papricaClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            )}

            {relatedType === 'urbano' && (
              <select
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                className="text-[11px] p-1 border border-stone-200 rounded bg-white text-stone-700 outline-none"
              >
                <option value="">Selecione o Apartamento...</option>
                {urbanoApartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.code} ({apt.neighborhood})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder={`Escreva uma mensagem como ${currentUser}... (use @ para mencionar)`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 text-xs p-2.5 border border-stone-200 rounded-md bg-white focus:outline-none focus:border-stone-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
