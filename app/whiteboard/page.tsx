"use client";

import { useState, useRef } from "react";
import { useLore, Board, WhiteboardNote } from "@/context/LoreContext";
import { Map, Plus, Trash2, ArrowLeft, FileText, Move, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NOTE_COLORS = [
  { bg: "bg-amber-950/40 border-amber-700/60 text-amber-200", name: "Âmbar Velho" },
  { bg: "bg-purple-950/40 border-purple-700/60 text-purple-200", name: "Púrpura Arcana" },
  { bg: "bg-emerald-950/40 border-emerald-700/60 text-emerald-200", name: "Verde Veneno" },
  { bg: "bg-red-950/40 border-red-700/60 text-red-200", name: "Sangue Sombrio" },
];

export default function WhiteboardPage() {
  const { boards, addBoard, updateBoardNotes, deleteBoard } = useLore();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  
  // Estados para arrastar notas
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const activeBoard = boards.find((b) => b.id === selectedBoardId);

  function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    addBoard(newBoardName);
    setNewBoardName("");
  }

  function handleAddNote() {
    if (!activeBoard) return;
    const newNote: WhiteboardNote = {
      id: crypto.randomUUID(),
      text: "Nova ideia de lore...",
      x: 100 + Math.random() * 60,
      y: 100 + Math.random() * 60,
      color: NOTE_COLORS[0].bg,
    };
    updateBoardNotes(activeBoard.id, [...activeBoard.notes, newNote]);
  }

  function handleUpdateNoteText(noteId: string, text: string) {
    if (!activeBoard) return;
    const updated = activeBoard.notes.map((n) =>
      n.id === noteId ? { ...n, text } : n
    );
    updateBoardNotes(activeBoard.id, updated);
  }

  function handleUpdateNoteColor(noteId: string, color: string) {
    if (!activeBoard) return;
    const updated = activeBoard.notes.map((n) =>
      n.id === noteId ? { ...n, color } : n
    );
    updateBoardNotes(activeBoard.id, updated);
  }

  function handleDeleteNote(noteId: string) {
    if (!activeBoard) return;
    const updated = activeBoard.notes.filter((n) => n.id !== noteId);
    updateBoardNotes(activeBoard.id, updated);
  }

  // Lógica de Drag and Drop pura no Canvas
  function handleMouseDown(e: React.MouseEvent, note: WhiteboardNote) {
    setDraggingNoteId(note.id);
    dragOffset.current = {
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!draggingNoteId || !activeBoard || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    // Limita as coordenadas dentro da área visível do canvas
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;

    const updated = activeBoard.notes.map((n) =>
      n.id === draggingNoteId ? { ...n, x: newX, y: newY } : n
    );
    updateBoardNotes(activeBoard.id, updated);
  }

  function handleMouseUp() {
    setDraggingNoteId(null);
  }

  // --- TELA DE LISTAGEM DE QUADROS ---
  if (!activeBoard) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-zinc-800 pb-4 flex items-center gap-3">
          <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-900/50">
            <Map className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Pergaminhos de Brainstorm</h1>
            <p className="text-sm text-zinc-400">Crie quadros infinitos para mapear suas ideias antes de virarem crônicas escritas.</p>
          </div>
        </div>

        {/* Form para novo Quadro */}
        <form onSubmit={handleCreateBoard} className="flex gap-3 max-w-md bg-zinc-900/20 border border-zinc-800/80 p-4 rounded-xl">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Nome do quadro (Ex: Teias de Hookeri)"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-colors"
            required
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs h-9 cursor-pointer">
            <Plus className="h-4 w-4" /> Forjar Quadro
          </Button>
        </form>

        {/* Lista de Quadros */}
        {boards.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
            Nenhum quadro de ideias nomeado neste ciclo. Comece criando um acima!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="group bg-zinc-900/30 border border-zinc-800/80 hover:border-purple-900/40 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200"
              >
                <div 
                  onClick={() => setSelectedBoardId(board.id)}
                  className="cursor-pointer space-y-1"
                >
                  <h3 className="font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500/80" /> {board.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {board.notes.length} notas de rascunho espalhadas
                  </p>
                </div>
                
                <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                  <span>Criado: {board.createdAt}</span>
                  <button 
                    onClick={() => deleteBoard(board.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-zinc-900 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- CANVAS DO MIRO INTERATIVO ---
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      {/* Topbar do Canvas */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedBoardId(null)}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              {activeBoard.name} 
              <span className="text-xs font-normal text-zinc-500 font-mono bg-zinc-900 px-2 py-0.5 border border-zinc-800/80 rounded">Canvas</span>
            </h2>
            <p className="text-xs text-zinc-400">Clique nas notas para editar o texto, escolha a cor ou arraste-as pela tela.</p>
          </div>
        </div>

        <Button onClick={handleAddNote} className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs cursor-pointer">
          <Plus className="h-4 w-4" /> Nova Nota Macabra
        </Button>
      </div>

      {/* Área do Canvas Infinito */}
      <div
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 w-full bg-zinc-950 rounded-xl border border-zinc-800/80 relative overflow-hidden bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px]"
      >
        {activeBoard.notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs text-center p-4">
            O pergaminho está em branco. Clique em "Nova Nota Macabra" para materializar ideias.
          </div>
        )}

        {activeBoard.notes.map((note) => (
          <div
            key={note.id}
            style={{
              position: "absolute",
              left: `${note.x}px`,
              top: `${note.y}px`,
              width: "220px",
            }}
            className={`rounded-xl border p-4 p-3 shadow-xl flex flex-col space-y-2 backdrop-blur-sm transition-shadow group/note ${note.color} ${
              draggingNoteId === note.id ? "shadow-purple-900/20 ring-1 ring-purple-500" : ""
            }`}
          >
            {/* Header da Nota para arrastar */}
            <div 
              onMouseDown={(e) => handleMouseDown(e, note)}
              className="flex items-center justify-between border-b border-zinc-800/40 pb-1 cursor-move text-zinc-500 group-hover/note:text-zinc-400 select-none"
            >
              <Move className="h-3 w-3" />
              <div className="flex gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                {NOTE_COLORS.map((col) => (
                  <button
                    key={col.bg}
                    onClick={() => handleUpdateNoteColor(note.id, col.bg)}
                    className={`h-2.5 w-2.5 rounded-full border border-zinc-900/60 ${col.bg.split(" ")[0]} cursor-pointer`}
                    title={col.name}
                  />
                ))}
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-zinc-600 hover:text-red-400 ml-1 p-0.5 rounded cursor-pointer"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* Input de escrita livre */}
            <textarea
              value={note.text}
              onChange={(e) => handleUpdateNoteText(note.id, e.target.value)}
              className="w-full bg-transparent border-none text-xs leading-relaxed resize-none focus:outline-none min-h-[80px] h-auto text-zinc-200"
              placeholder="Digite sua ideia..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}