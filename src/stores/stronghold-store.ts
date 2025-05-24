import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

export type PasswordStorageOption = 'never' | 'session' | 'os-keychain';

interface StrongholdState {
  isInitialized: boolean;
  isUnlocked: boolean;
  error: string | null;
  passwordStorageOption: PasswordStorageOption;
  
  // Actions
  initializeStronghold: (password: string, rememberOption: PasswordStorageOption) => Promise<void>;
  tryAutoUnlock: () => Promise<boolean>;
  checkStrongholdStatus: () => Promise<void>;
  getStoredPasswordOption: () => Promise<PasswordStorageOption>;
  reset: () => void;
}

export const useStrongholdStore = create<StrongholdState>((set, get) => ({
  isInitialized: false,
  isUnlocked: false,
  error: null,
  passwordStorageOption: 'never',

  initializeStronghold: async (password: string, rememberOption: PasswordStorageOption) => {
    try {
      set({ error: null });
      
      // Try to initialize or unlock Stronghold
      const result = await invoke<{ initialized: boolean; unlocked: boolean }>('init_stronghold', { 
        password,
        rememberOption 
      });
      
      set({ 
        isInitialized: result.initialized,
        isUnlocked: result.unlocked,
        passwordStorageOption: rememberOption,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize Stronghold',
        isInitialized: false,
        isUnlocked: false
      });
      throw error;
    }
  },

  tryAutoUnlock: async () => {
    try {
      // Check if we have a stored password in OS keychain
      const result = await invoke<{ success: boolean; storageOption: PasswordStorageOption }>('try_auto_unlock_stronghold');
      
      if (result.success) {
        set({ 
          isInitialized: true,
          isUnlocked: true,
          passwordStorageOption: result.storageOption,
          error: null 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auto-unlock failed:', error);
      return false;
    }
  },

  checkStrongholdStatus: async () => {
    try {
      const status = await invoke<{ initialized: boolean; unlocked: boolean }>('check_stronghold_status');
      set({ 
        isInitialized: status.initialized,
        isUnlocked: status.unlocked 
      });
    } catch (error) {
      console.error('Failed to check Stronghold status:', error);
      set({ 
        isInitialized: false,
        isUnlocked: false 
      });
    }
  },

  getStoredPasswordOption: async () => {
    try {
      const option = await invoke<PasswordStorageOption>('get_password_storage_option');
      set({ passwordStorageOption: option });
      return option;
    } catch (error) {
      console.error('Failed to get password storage option:', error);
      return 'never';
    }
  },

  reset: () => {
    set({
      isInitialized: false,
      isUnlocked: false,
      error: null,
      passwordStorageOption: 'never'
    });
  }
}));
