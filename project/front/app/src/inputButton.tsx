import { useState } from "react";

export function ButtonInputToggle({ button, input, onInputSubmit }: { button: React.ReactNode, input: React.ReactNode, onInputSubmit: (value: string) => void }) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    setShowInput(true);
  }

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.length > 0) {
      setShowInput(false);
      setInputValue('');
      onInputSubmit(inputValue);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const alphaNumRegex = /^[a-zA-Z0-9]*$/;
    if (alphaNumRegex.test(event.target.value)) {
        setInputValue(event.target.value);
    }
  }

  return (
    <>
      {showInput ? (
        input
      ) : (
        <button onClick={handleButtonClick}>{button}</button>
      )}
      {showInput && input}
    </>
  );
}