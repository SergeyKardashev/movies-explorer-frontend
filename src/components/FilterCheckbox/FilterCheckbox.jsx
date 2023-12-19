import React from 'react';
import './FilterCheckbox.css';

function FilterCheckbox(props) {
  const { isShortRef } = props;

  return (
    <div className="movies__toggle-wrap">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="switch" htmlFor="switch">
        <input type="checkbox" id="switch" ref={isShortRef} defaultChecked={JSON.parse(localStorage.getItem('isShort'))} />
        <span className="slider round" />
      </label>
      <span className="movies__toggle-label">Короткометражки</span>
    </div>
  );
}

export default FilterCheckbox;
