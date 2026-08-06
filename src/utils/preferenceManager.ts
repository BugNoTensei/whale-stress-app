export type ThemeMode = "light" | "dark" | "system";
export type ParticleDensity = "low" | "medium" | "high";
export type Language = "th" | "en";

export interface CustomPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}

export interface UserPreferences {
  theme: ThemeMode;
  particleDensity: ParticleDensity;
  language: Language;
  masterVolume: number;
  musicVolume: number;
  ambientVolume: number;
  focusModeEnabled: boolean;
  breathingGuideEnabled: boolean;
  autoPlayNext: boolean;
  musicCrossfade: boolean;
  favorites: string[];
  recentlyPlayed: string[];
  customPlaylists: CustomPlaylist[];
  listeningTimeTodaySeconds: number;
  songsPlayedCount: number;
  lastPlayedTrackId: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  particleDensity: "medium",
  language: "th",
  masterVolume: 1.0,
  musicVolume: 0.75,
  ambientVolume: 0.5,
  focusModeEnabled: false,
  breathingGuideEnabled: false,
  autoPlayNext: true,
  musicCrossfade: true,
  favorites: [],
  recentlyPlayed: [],
  customPlaylists: [],
  listeningTimeTodaySeconds: 0,
  songsPlayedCount: 0,
  lastPlayedTrackId: "peaceful_piano",
};

const STORAGE_KEY = "whale_app_user_preferences";

class PreferenceManager {
  private prefs: UserPreferences;
  private sessionStartTime: number;

  constructor() {
    this.sessionStartTime = Date.now();
    this.prefs = this.loadPreferences();
    this.applyTheme(this.prefs.theme);
  }

  private loadPreferences(): UserPreferences {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (e) {}
    return { ...DEFAULT_PREFERENCES };
  }

  public getPreferences(): UserPreferences {
    return { ...this.prefs };
  }

  public updatePreferences(partial: Partial<UserPreferences>) {
    this.prefs = { ...this.prefs, ...partial };
    this.save();
    if (partial.theme) {
      this.applyTheme(partial.theme);
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prefs));
    } catch (e) {}
  }

  public applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      // System mode
      const isSysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isSysDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
  }

  public restoreDefaults(): UserPreferences {
    this.prefs = { ...DEFAULT_PREFERENCES };
    this.save();
    this.applyTheme(this.prefs.theme);
    return { ...this.prefs };
  }

  // Playlist Methods
  public createPlaylist(name: string, initialTrackIds: string[] = []): CustomPlaylist {
    const newPlaylist: CustomPlaylist = {
      id: "pl_" + Date.now(),
      name,
      trackIds: initialTrackIds,
      createdAt: Date.now(),
    };
    this.prefs.customPlaylists.push(newPlaylist);
    this.save();
    return newPlaylist;
  }

  public renamePlaylist(id: string, newName: string) {
    const pl = this.prefs.customPlaylists.find(p => p.id === id);
    if (pl) {
      pl.name = newName;
      this.save();
    }
  }

  public deletePlaylist(id: string) {
    this.prefs.customPlaylists = this.prefs.customPlaylists.filter(p => p.id !== id);
    this.save();
  }

  public duplicatePlaylist(id: string) {
    const pl = this.prefs.customPlaylists.find(p => p.id === id);
    if (pl) {
      this.createPlaylist(pl.name + " (Copy)", [...pl.trackIds]);
    }
  }

  // Stats Methods
  public recordSongPlay(trackId: string) {
    this.prefs.songsPlayedCount += 1;
    this.prefs.lastPlayedTrackId = trackId;
    const filtered = this.prefs.recentlyPlayed.filter(id => id !== trackId);
    this.prefs.recentlyPlayed = [trackId, ...filtered].slice(0, 10);
    this.save();
  }

  public addListeningTime(seconds: number) {
    this.prefs.listeningTimeTodaySeconds += seconds;
    this.save();
  }

  public getSessionDurationSeconds(): number {
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }
}

export const preferenceManager = new PreferenceManager();
