import desktopMinWidth from '../constants/desktopMinWidth';
import tabletMinWidth from '../constants/tabletMinWidth';

// return в каждом условии для краткости
const getDeviceType = (clientWidth) => {
  if (clientWidth >= desktopMinWidth) {
    return 'desktop';
  }
  if ((clientWidth >= tabletMinWidth) && (clientWidth < desktopMinWidth)) {
    return 'tablet';
  }
  return 'phone';
};

export default getDeviceType;
