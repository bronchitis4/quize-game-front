const BuzzButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      `w-full bg-red-600 hover:bg-red-500 disabled:bg-[#3a3a3a] disabled:cursor-not-allowed text-white rounded-full py-4 text-3xl font-bold transition-all duration-300 shadow-2xl ` +
      (disabled ? 'opacity-60' : '')
    }
  >
    !
  </button>
);

export default BuzzButton;
