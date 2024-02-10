const getArrayFromLS = (key) => {
  try {
    const rawData = localStorage.getItem(key);
    if (!rawData) {
      return [];
    }
    const parsedData = JSON.parse(rawData);
    // Возвращаю parsedData, если это массив, иначе возвращаю пустой массива
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('Ошибка получения или парсинга данных из ЛС:', error);
    return [];
  }
};

export default getArrayFromLS;
