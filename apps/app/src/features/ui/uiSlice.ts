import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface UiState {
  isLoading: boolean;
  notifications: Notification[];
  isSidebarOpen: boolean;
  modal: {
    isOpen: boolean;
    component: React.ReactNode | null;
    title?: string;
    size?:
      | 'sm'
      | 'md'
      | 'lg'
      | 'xl'
      | '2xl'
      | '3xl'
      | '4xl'
      | '5xl'
      | '6xl'
      | '7xl'
      | 'full';
    onClose?: () => void;
  };
}

const initialState: UiState = {
  isLoading: false,
  notifications: [],
  isSidebarOpen: true,
  modal: {
    isOpen: false,
    component: null,
    size: 'md',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id'>>
    ) => {
      const notification = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openModal: (
      state,
      action: PayloadAction<{
        component: React.ReactNode;
        title?: string;
        size?: UiState['modal']['size'];
        onClose?: () => void;
      }>
    ) => {
      state.modal = {
        isOpen: true,
        component: action.payload.component,
        title: action.payload.title,
        size: action.payload.size || 'md',
        onClose: action.payload.onClose,
      };
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      // Keep the component in the state to allow for smooth transitions
      // We'll clear it after the transition is complete
    },
    clearModal: (state) => {
      state.modal = {
        isOpen: false,
        component: null,
        size: 'md',
      };
    },
  },
});

export const {
  setLoading,
  showNotification,
  removeNotification,
  toggleSidebar,
  openModal,
  closeModal,
  clearModal,
} = uiSlice.actions;

export const selectIsLoading = (state: { ui: UiState }) => state.ui.isLoading;
export const selectNotifications = (state: { ui: UiState }) =>
  state.ui.notifications;
export const selectIsSidebarOpen = (state: { ui: UiState }) =>
  state.ui.isSidebarOpen;
export const selectModal = (state: { ui: UiState }) => state.ui.modal;

export default uiSlice.reducer;
