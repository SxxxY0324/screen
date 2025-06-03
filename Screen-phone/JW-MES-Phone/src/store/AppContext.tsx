import React, { createContext, useReducer, useContext } from 'react';

// 定义状态类型
type State = {
  userInfo: any;
  isLogin: boolean;
};

// 定义初始状态
const initialState: State = {
  userInfo: null,
  isLogin: false
};

// 定义Action类型
type Action = 
  | { type: 'SET_USER_INFO'; payload: any }
  | { type: 'SET_LOGIN_STATUS'; payload: boolean };

// 创建reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload };
    case 'SET_LOGIN_STATUS':
      return { ...state, isLogin: action.payload };
    default:
      return state;
  }
}

// 创建Context
const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

// 创建Provider组件
export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 创建Hook便于使用Context
export const useAppContext = () => useContext(AppContext);
