import React from 'react';
import './MoreBtn.css';

function MoreBtn(props) {
  const { onShowMore } = props;
  return (
    <div className="more-section">
      <button
        type="button"
        onClick={onShowMore}
        className="more-section__more-btn"
      >
        Ещё
      </button>
    </div>

  );
}

export default MoreBtn;
