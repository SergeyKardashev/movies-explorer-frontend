import React from 'react';
import './FilterCheckbox.css';

function FilterCheckbox(props) {
  const { onChange, isShort } = props;
  // const { shortRef } = props;

  return (
    <div className="movies__toggle-wrap">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="switch" htmlFor="switch">
        <input
          onChange={onChange}
          type="checkbox"
          id="switch"
          // ref={shortRef}
          checked={isShort}
        />
        <span className="slider round" />
      </label>
      <span className="movies__toggle-label">Короткометражки</span>
    </div>
  );
}

export default FilterCheckbox;
