import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Music2,
  Heart,
  Plus,
  Trash2,
  Copy,
  Clock,
  Sparkles,
  X,
  Play,
} from "lucide-react";
import { MusicTrack, TRACKS, MusicCategory } from "./RelaxationMusicScreen";
import { preferenceManager } from "../../utils/preferenceManager";
import { EmptyState } from "../ui/EmptyState";

interface MusicLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: MusicTrack) => void;
  currentTrackId: string;
  onToast: (msg: string, icon?: string) => void;
}

const CATEGORIES: { id: "all" | MusicCategory | "lo-fi"; label: string; icon: string }[] = [
  { id: "all",       label: "ทั้งหมด", icon: "🎵" },
  { id: "mountain",  label: "Piano",   icon: "🎹" },
  { id: "ocean",     label: "Ocean",   icon: "🌊" },
  { id: "forest",    label: "Nature",  icon: "🌿" },
  { id: "rain",      label: "Rain",    icon: "🌧️" },
  { id: "waterfall", label: "Lo-fi",   icon: "🎧" },
];

export const MusicLibraryModal: React.FC<MusicLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTrack,
  currentTrackId,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"alphabetical" | "favorites" | "recent">("alphabetical");
  const [activeTab, setActiveTab] = useState<"library" | "playlists" | "recommended">("library");

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const prefs = preferenceManager.getPreferences();

  // Track filtering
  let filtered = TRACKS.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "all" ? true : t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Sorting
  if (sortBy === "alphabetical") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "favorites") {
    filtered.sort((a, b) => (prefs.favorites.includes(b.id) ? 1 : 0) - (prefs.favorites.includes(a.id) ? 1 : 0));
  } else if (sortBy === "recent") {
    filtered.sort((a, b) => prefs.recentlyPlayed.indexOf(a.id) - prefs.recentlyPlayed.indexOf(b.id));
  }

  // Count per category
  const getCount = (catId: string) => {
    if (catId === "all") return TRACKS.length;
    return TRACKS.filter(t => t.category === catId).length;
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    preferenceManager.createPlaylist(newPlaylistName.trim());
    setNewPlaylistName("");
    setShowCreatePlaylist(false);
    onToast("สร้างเพลย์ลิสต์ใหม่เรียบร้อย 🎵", "✨");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 select-none"
        >
          <motion.div
            initial={{ scale: 0.92, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="bg-[#182238]/95 border border-white/20 rounded-3xl w-full max-w-2xl h-130 shadow-2xl flex flex-col overflow-hidden text-white relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Music2 className="text-sky-400 w-5 h-5" />
                <h2 className="text-lg font-bold">คลังเพลงผ่อนคลาย (Music Library)</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Tabs */}
            <div className="flex items-center justify-between px-6 py-2 bg-black/20 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("library")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${activeTab === "library" ? "bg-sky-500 text-white" : "text-white/60 hover:text-white"}`}
                >
                  📚 คลังเพลงทั้งหมด
                </button>
                <button
                  onClick={() => setActiveTab("playlists")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${activeTab === "playlists" ? "bg-sky-500 text-white" : "text-white/60 hover:text-white"}`}
                >
                  📋 เพลย์ลิสต์ ({prefs.customPlaylists.length})
                </button>
                <button
                  onClick={() => setActiveTab("recommended")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${activeTab === "recommended" ? "bg-sky-500 text-white" : "text-white/60 hover:text-white"}`}
                >
                  ✨ แนะนำสำหรับคุณ
                </button>
              </div>

              {/* Sort drop down */}
              {activeTab === "library" && (
                <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                  <span>เรียงตาม:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white/10 text-white rounded-lg px-2 py-1 outline-none text-xs border border-white/15"
                  >
                    <option value="alphabetical" className="bg-slate-800">ชื่อ ก-ฮ</option>
                    <option value="favorites" className="bg-slate-800">รายการโปรด</option>
                    <option value="recent" className="bg-slate-800">เพิ่งเล่นล่าสุด</option>
                  </select>
                </div>
              )}
            </div>

            {/* TAB CONTENT: LIBRARY */}
            {activeTab === "library" && (
              <div className="flex-1 flex flex-col min-h-0 p-5 gap-3">
                {/* Search & Categories */}
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 text-white/40 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อเพลง หรือหมวดหมู่..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-sky-400 transition"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full shrink-0 border transition flex items-center gap-1 ${selectedCategory === cat.id ? "bg-white/25 border-white/40 text-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/15"}`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        <span className="opacity-60 text-[9px]">({getCount(cat.id)})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track Cards Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2.5 pr-1" style={{ scrollbarWidth: "none" }}>
                  {filtered.length === 0 ? (
                    <div className="col-span-2 py-6">
                      <EmptyState
                        icon="🔍"
                        title="ไม่พบเพลงที่ค้นหา"
                        description="ลองค้นหาด้วยคำหรือเลือกหมวดหมู่อื่นดูนะครับ"
                        actionLabel="ล้างคำค้นหา"
                        onAction={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                      />
                    </div>
                  ) : (
                    filtered.map(track => {
                      const isSelected = track.id === currentTrackId;
                      const isFav = prefs.favorites.includes(track.id);

                      return (
                        <motion.div
                          key={track.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSelectTrack(track);
                            onClose();
                          }}
                          className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${isSelected ? "bg-sky-500/25 border-sky-400" : "bg-white/5 border-white/10 hover:bg-white/15"}`}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                            style={{ backgroundColor: track.color + "55" }}
                          >
                            <Play size={16} fill="currentColor" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate text-white">{track.title}</div>
                            <div className="text-[10px] text-white/60 truncate">{track.subtitle}</div>
                          </div>
                          {isFav && <Heart size={14} className="fill-pink-400 text-pink-400 shrink-0" />}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PLAYLISTS */}
            {activeTab === "playlists" && (
              <div className="flex-1 flex flex-col min-h-0 p-5 gap-3">
                <div className="flex justify-between items-center shrink-0">
                  <span className="text-xs font-semibold text-white/70">รายการเพลย์ลิสต์ส่วนตัว</span>
                  <button
                    onClick={() => setShowCreatePlaylist(true)}
                    className="flex items-center gap-1 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
                  >
                    <Plus size={14} /> สร้างเพลย์ลิสต์
                  </button>
                </div>

                {showCreatePlaylist && (
                  <div className="flex gap-2 bg-black/30 p-3 rounded-2xl border border-white/15 shrink-0">
                    <input
                      type="text"
                      placeholder="ตั้งชื่อเพลย์ลิสต์..."
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                    <button
                      onClick={handleCreatePlaylist}
                      className="bg-sky-500 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                    >
                      ตกลง
                    </button>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: "none" }}>
                  {prefs.customPlaylists.length === 0 ? (
                    <div className="text-center text-white/50 text-xs py-10">ยังไม่มีเพลย์ลิสต์ กดปุ่มสร้างเพลย์ลิสต์ได้เลย 🎵</div>
                  ) : (
                    prefs.customPlaylists.map(pl => (
                      <div key={pl.id} className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold">{pl.name}</div>
                          <div className="text-[10px] text-white/50">{pl.trackIds.length} เพลง</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => preferenceManager.duplicatePlaylist(pl.id)} className="text-white/60 hover:text-white">
                            <Copy size={14} />
                          </button>
                          <button onClick={() => preferenceManager.deletePlaylist(pl.id)} className="text-red-400/80 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: RECOMMENDED */}
            {activeTab === "recommended" && (
              <div className="flex-1 flex flex-col min-h-0 p-5 gap-3">
                <div className="text-xs font-bold text-sky-300 flex items-center gap-1">
                  <Sparkles size={14} /> แนะนำสำหรับการผ่อนคลายในเวลานี้
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: "none" }}>
                  {TRACKS.slice(0, 4).map(track => (
                    <div
                      key={track.id}
                      onClick={() => { onSelectTrack(track); onClose(); }}
                      className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-500/30 flex items-center justify-center text-sky-300 font-bold">
                        <Clock size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{track.title}</div>
                        <div className="text-[10px] text-white/60">ช่วยปรับคลื่นสมองให้ผ่อนคลาย ลื่นไหล</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
