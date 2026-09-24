export const STORAGE_KEY = 'neuroguard-session';

export const defaultSession = {
  profile: {},
  symptoms: [],
  eyeAnalysis: {},
  reaction: {},
  memory: {},
  attention: {},
  result: null,
};

export function loadSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...defaultSession };
  } catch (error) {
    return { ...defaultSession };
  }
}

export function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
