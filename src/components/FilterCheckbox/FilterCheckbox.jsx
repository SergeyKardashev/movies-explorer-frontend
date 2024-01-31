import React from 'react';
import './FilterCheckbox.css';

function FilterCheckbox(props) {
  const { onChange, isShort } = props;

  return (
    <div className="movies__toggle-wrap">
      <label className="switch" htmlFor="switch">
        <input
          onChange={onChange}
          type="checkbox"
          id="switch"
          checked={isShort}
        />
        <span className="slider round" />
      </label>
      <span className="movies__toggle-label">Короткометражки</span>
    </div>
  );
}

export default FilterCheckbox;
