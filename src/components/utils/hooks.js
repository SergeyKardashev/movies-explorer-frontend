import { useState, useEffect } from 'react';

// проверяет содержит ли переменная что-то годное
function isDefined(storedValue) {
  // Возвращает true если аргумент не пуст И если он не undefined.
  return storedValue !== null && storedValue !== 'undefined';
}

export function useLocalStorageState(key, initialValue) {
  // 1я часть восстанавливает состояние при монтировании и перемонтировании
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    // если в ЛС годное значение, то возвращаю его в стейт.
    // Иначе возвращаю изначальное из аргумента в стейт.
    return isDefined(storedValue) ? JSON.parse(storedValue) : initialValue;
    // Т.к. в ЛС всё хранится в строках, нужно парсить всё, что из него беру
    // Чтобы нестроковые типы не оставались строковыми после получения из ЛС
  });

  // 2я часть дублирует стейт в ЛС
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  // 3я часть - возвращаем стейт и функцию его обновления.
  // 🟡 непонятная часть.
  return [state, setState];
}

// customHook - это заглушка чтобы линтер не ругался на экспорт.
// Если не будет второго хука, то заменить нынешний экспорт на дефолтный.
export function customHook(param) {
  return param;
}
