import React, { createContext, useState, useContext, useEffect } from 'react';

const QuoteContext = createContext();

export const useQuote = () => useContext(QuoteContext);

const DEFAULT_STATE = {
  project: {
    quantity: '',
    weight: '',
    hasBOM: '',
  },
  cart: []
};

export const QuoteProvider = ({ children }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState({
    enrichedCart: [],
    unitPrice: 0,
    totalPrice: 0,
    setupCost: 0,
    workCost: 0,
    packingCost: 0
  });

  const setProject = (key, value) => {
    setState(prev => ({
      ...prev,
      project: { ...prev.project, [key]: value }
    }));
  };

  const addToCart = (item) => {
    setState(prev => ({
      ...prev,
      cart: [...prev.cart, { ...item, id: Date.now().toString() + Math.random().toString() }]
    }));
  };

  const removeFromCart = (id) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.id !== id)
    }));
  };

  // 파생 상태(Derived State)로 실시간 계산을 비동기 API 통신으로 변경
  const { project, cart } = state;
  const { quantity, weight, hasBOM } = project;
  
  useEffect(() => {
    // 필수값이 없으면 계산 시도 안 함
    if (quantity === '' || weight === '' || hasBOM === '') return;

    const fetchQuote = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project, cart })
        });
        
        if (response.ok) {
          const data = await response.json();
          setQuoteResult(data);
        } else {
          console.error('견적 계산 실패');
        }
      } catch (error) {
        console.error('API 통신 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 디바운싱(Debouncing) 효과를 주어 잦은 호출 방지
    const timer = setTimeout(() => {
      fetchQuote();
    }, 300); // 0.3초 딜레이

    return () => clearTimeout(timer);
  }, [quantity, weight, hasBOM, cart]); // 의존성 배열에 project 속성들과 cart 등록

  return (
    <QuoteContext.Provider value={{ state, quoteResult, setProject, addToCart, removeFromCart, isLoading }}>
      {children}
    </QuoteContext.Provider>
  );
};
