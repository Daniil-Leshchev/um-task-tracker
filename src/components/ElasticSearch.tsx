import { useRef, useState } from 'react';

interface ElasticSearchItem {
  id?: string;
  displayText: string;
  name?: string,
  initials?: string,
  color?: string,
  type?: string,
  status?: string,
  completedAt?: string
}

interface ElasticSearchProps<T extends ElasticSearchItem> {
  items: T[];
  backgroundcolor: string;
  placeholder?: string;
  renderItem?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  defaultVisible?: boolean;
  onItemClick?: (item: T) => void; // Добавляем новый пропс
}

export default function ElasticSearch<T extends ElasticSearchItem>({
  items,
  backgroundcolor,
  placeholder = 'Введите имя куратора...',
  renderItem,
  emptyMessage = 'Ничего не найдено',
  defaultVisible = true,
  onItemClick, // Получаем пропс
}: ElasticSearchProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(defaultVisible);

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.trim().toLowerCase();
    return item.displayText.toLowerCase().includes(term);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isListVisible) setIsListVisible(true);
  };

  const handleFocus = () => {
    setIsListVisible(true);
  };

  const handleItemClick = (item: T) => {
    if (onItemClick) {
      onItemClick(item);
      setIsListVisible(false);
      setSearchTerm(item.displayText);
    }
  };

  return (
    <div className={`elastic-search`}>
      <div className="search-input-wrapper">
        <img 
          src="/images/search.svg" 
          alt="Лупа"
          className="search-icon"
        />
        <input
          ref={inputRef}
          className="elastic-search-input"
          style={{ backgroundColor: backgroundcolor }}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>
      {isListVisible && (
        <ul className={`elastic-search-list`}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id || item.displayText}
                className={`elastic-search-item`}
                style={{
                  display: searchTerm && !filteredItems.includes(item) ? 'none' : 'block',
                  cursor: onItemClick ? 'pointer' : 'default'
                }}
                onClick={() => onItemClick && handleItemClick(item)}
              >
                {renderItem ? renderItem(item) : item.displayText}
              </li>
            ))
          ) : (
            <li className="elastic-search-empty">{emptyMessage}</li>
          )}
        </ul>
      )}
    </div>
  );
}